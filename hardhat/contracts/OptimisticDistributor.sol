// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity ^0.8.0;
import "hardhat/console.sol";
import "@uma/core/contracts/common/implementation/AncillaryData.sol";
import "@uma/core/contracts/common/implementation/Lockable.sol";
import "@uma/core/contracts/common/implementation/MultiCaller.sol";
import "@uma/core/contracts/common/implementation/Testable.sol";
import "@uma/core/contracts/common/interfaces/AddressWhitelistInterface.sol";
import "@uma/core/contracts/oracle/implementation/Constants.sol";
import "@uma/core/contracts/oracle/interfaces/FinderInterface.sol";
import "@uma/core/contracts/oracle/interfaces/IdentifierWhitelistInterface.sol";
import "@uma/core/contracts/oracle/interfaces/OptimisticOracleInterface.sol";
import "@uma/core/contracts/oracle/interfaces/StoreInterface.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/token/ERC777/ERC777.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import { SuperToken } from "@superfluid-finance/ethereum-contracts/contracts/superfluid/SuperToken.sol";
/**
 * @title  OptimisticDistributor contract.
 * @notice Allows admins to distribute rewards through MerkleDistributor contract secured by UMA Optimistic Oracle.
 */
contract OptimisticDistributor is Initializable,  MultiCaller {
    using SafeERC20 for IERC20;
    using Counters for Counters.Counter;
 
    /********************************************
     *  OPTIMISTIC DISTRIBUTOR DATA STRUCTURES  *
     ********************************************/

    // Enum controlling acceptance of distribution payout proposals and their execution.
    enum DistributionProposed {
        None, // New proposal can be submitted (either there have been no proposals or the prior one was disputed).
        Pending, // Proposal is not yet resolved.
        Accepted // Proposal has been confirmed through Optimistic Oracle and rewards transferred to MerkleDistributor.
    }

    // Represents reward posted by a admin.
    struct Reward {
        DistributionProposed distributionProposed;
        address admin;
        address rewardToken;
        uint256 rewardAmount;
        uint256 interval;
        uint256 earliestProposalTimestamp;
        uint256 optimisticOracleLivenessTime;
        bytes32 priceIdentifier;
        bytes customAncillaryData;
    }

    // Represents proposed rewards distribution.
    struct Proposal {
        uint256 pcrIndex;
        uint256 proposalId;
        uint256 timestamp;
    }

    /********************************************
     *      STATE VARIABLES AND CONSTANTS       *
     ********************************************/

    // Reserve for bytes appended to ancillary data (e.g. OracleSpoke) when resolving price from non-mainnet chains.
    // This also covers appending pcrIndex by this contract.
    uint256 public constant ANCILLARY_BYTES_RESERVE = 512;

    // Restrict Optimistic Oracle liveness to between 10 minutes and 100 years.
    uint256 public constant MINIMUM_LIVENESS = 1 minutes;
    uint256 public constant MAXIMUM_LIVENESS = 5200 weeks;


    // Ancillary data length limit can be synced and stored in the contract.
    uint256 public ancillaryBytesLimit;

    // Rewards are stored in dynamic array.
    Reward public reward;

    //
    uint256 pcrIndex;
    //
    address pcrTokenAdress;

    
     Counters.Counter public _proposalId;
    
    Proposal public proposal;

    // Immutable variables provided at deployment.
    FinderInterface public finder;
    address public rewardToken; // This cannot be declared immutable as bondToken needs to be checked against whitelist.


    // Interface parameters that can be synced and stored in the contract.
    StoreInterface public store;
    OptimisticOracleInterface public optimisticOracle;

    /********************************************
     *                  EVENTS                  *
     ********************************************/

    event RewardCreated(
        address indexed admin,
        address rewardToken,
        uint256 indexed pcrIndex,
        uint256 rewardAmount,
        uint256 interval,
        uint256 earliestProposalTimestamp,
        uint256 optimisticOracleLivenessTime,
        bytes32 indexed priceIdentifier,
        bytes customAncillaryData
    );
    event RewardDeposit(uint256 indexed pcrIndex, uint256 depositAmount);
    event ProposalCreated(
        address indexed admin,
        address rewardToken,
        uint256 indexed pcrIndex,
        uint256 proposalTimestamp,
        uint256 rewardAmount,
        uint256 indexed proposalId
    );
    event RewardDistributed(
        address indexed admin,
        address rewardToken,
        uint256 indexed pcrIndex,
        uint256 rewardAmount,
        uint256 indexed proposalId
    );
    event ProposalRejected(uint256 indexed pcrIndex, uint256 indexed proposalId);

    /**
     * @notice Constructor.

     */
    constructor(
    ) {

    }
    /**
     * @notice INITILIZER.
     * @param _pcrIndex ERC20 token that the bond is paid in.
     * @param _pcrTokenAdress PcrTokenAddress
     * @param _finder Finder to look up UMA contract addresses.
     * @param _rewardToken ERC20 token that the rewards will be paid in.
     * @param rewardAmount Maximum reward amount that the admin is posting for distribution.
     * @param interval Starting timestamp when proposals for distribution can be made.
     * @param priceIdentifier Identifier that should be passed to the Optimistic Oracle on proposed distribution.
     * @param customAncillaryData Custom ancillary data that should be sent to the Optimistic Oracle on proposed
     * distribution.
     * @param optimisticOracleLivenessTime Liveness period in seconds during which proposed distribution can be
     * disputed through Optimistic Oracle.

     */
    function initialize (
        FinderInterface _finder,
        uint256 _pcrIndex,
        address _pcrTokenAdress,
        address _rewardToken,
        uint256 rewardAmount,
        uint256 interval,
        uint256 optimisticOracleLivenessTime,
        bytes32 priceIdentifier,
        bytes calldata customAncillaryData
    ) external initializer{
        finder = _finder;
        rewardToken = _rewardToken;
        pcrIndex = _pcrIndex;
        pcrTokenAdress = _pcrTokenAdress;
        syncUmaEcosystemParams();
        _createReward(rewardAmount,interval, optimisticOracleLivenessTime, priceIdentifier,customAncillaryData);
    }


    /********************************************
     *            FUNDING FUNCTIONS             *
     ********************************************/

    /**
     * @notice Allows any caller to create a Reward struct and deposit tokens that are linked to these rewards.
     * @dev The caller must approve this contract to transfer `rewardAmount` amount of `rewardToken`.
     * @param rewardAmount Maximum reward amount that the admin is posting for distribution.
     * @param interval Starting timestamp when proposals for distribution can be made.
     * @param priceIdentifier Identifier that should be passed to the Optimistic Oracle on proposed distribution.
     * @param customAncillaryData Custom ancillary data that should be sent to the Optimistic Oracle on proposed
     * distribution.
     * @param optimisticOracleLivenessTime Liveness period in seconds during which proposed distribution can be
     * disputed through Optimistic Oracle.
     */
    function _createReward(
        uint256 rewardAmount,
        uint256 interval,
        uint256 optimisticOracleLivenessTime,
        bytes32 priceIdentifier,
        bytes calldata customAncillaryData
    ) internal {
        require(_getIdentifierWhitelist().isIdentifierSupported(priceIdentifier), "Identifier not registered");
        require(_ancillaryDataWithinLimits(customAncillaryData), "Ancillary data too long");
        require(optimisticOracleLivenessTime >= MINIMUM_LIVENESS, "OO liveness too small");
        require(optimisticOracleLivenessTime < MAXIMUM_LIVENESS, "OO liveness too large");

        // Pull maximum rewards from the admin.
       // rewardToken.safeTransferFrom(msg.sender, address(this), rewardAmount);

        uint256 earliestProposalTimestamp = block.timestamp + interval;

        // Store funded reward and log created reward.
        reward = Reward({
                distributionProposed: DistributionProposed.None,
                admin: msg.sender,
                rewardToken: rewardToken,
                rewardAmount: rewardAmount,
                interval:interval,
                earliestProposalTimestamp: earliestProposalTimestamp,
                optimisticOracleLivenessTime: optimisticOracleLivenessTime,
                priceIdentifier: priceIdentifier,
                customAncillaryData: customAncillaryData
            });
  
        emit RewardCreated(
            reward.admin,
            reward.rewardToken,
            pcrIndex,
            reward.rewardAmount,
            interval,
            reward.earliestProposalTimestamp,
            reward.optimisticOracleLivenessTime,
            reward.priceIdentifier,
            reward.customAncillaryData
        );
    }

    /**
     * @notice Allows anyone to deposit additional rewards for distribution before `earliestProposalTimestamp`.
     * @dev The caller must approve this contract to transfer `additionalRewardAmount` amount of `rewardToken`.
     * @param depositAmount Additional reward amount that the admin is posting for distribution.
     */
    function depositReward(uint256 depositAmount) external  {
 
     
        // Pull additional rewards from the admin.
        IERC20(reward.rewardToken).safeTransferFrom(msg.sender, address(this), depositAmount);

        // Update rewardAmount and log new amount.
        emit RewardDeposit(pcrIndex, depositAmount);
    }

    /********************************************
     *          DISTRIBUTION FUNCTIONS          *
     ********************************************/

    /**
     * @notice Allows any caller to propose distribution for funded reward starting from `earliestProposalTimestamp`.
     * Only one undisputed proposal at a time is allowed.
     * @dev The caller must approve this contract to transfer `optimisticOracleProposerBond` + final fee amount
     * of `bondToken`.
     */
    function proposeDistribution() external  {

        uint256 timestamp = block.timestamp;
        require(timestamp >= reward.earliestProposalTimestamp, "Cannot propose in funding period");
        require(reward.distributionProposed == DistributionProposed.None, "New proposals blocked");

        // Flag reward as proposed so that any subsequent proposals are blocked till dispute.
        reward.distributionProposed = DistributionProposed.Pending;

        // Append pcrIndex to ancillary data.
        bytes memory ancillaryData = _appendpcrIndex(reward.customAncillaryData);

        // Generate hash for proposalId.
       _proposalId.increment();
        uint256 id = _proposalId.current();

        // Request price from Optimistic Oracle.
        optimisticOracle.requestPrice(reward.priceIdentifier, timestamp, ancillaryData, IERC20(0x489Bf230d4Ab5c2083556E394a28276C22c3B580), 0);

        // Set proposal liveness and bond and calculate total bond amount.
        optimisticOracle.setCustomLiveness(
            reward.priceIdentifier,
            timestamp,
            ancillaryData,
            reward.optimisticOracleLivenessTime
        );
  

        // Propose canonical value representing "True"; i.e. the proposed distribution is valid.
        optimisticOracle.proposePriceFor(
            msg.sender,
            address(this),
            reward.priceIdentifier,
            timestamp,
            ancillaryData,
            int256(1e18)
        );

        // Store and log proposed distribution.
        proposal  = Proposal({
            pcrIndex: pcrIndex,
            proposalId:id,
            timestamp: timestamp
        });
        emit ProposalCreated(
            reward.admin,
            reward.rewardToken,
            pcrIndex,
            timestamp,
            reward.rewardAmount,
            id
        );
    }

    /**
     * @notice Allows any caller to execute distribution that has been validated by the Optimistic Oracle.
     * @dev Calling this for unresolved proposals will revert.
     */
    function executeDistribution() external  {
        // All valid proposals should have non-zero proposal timestamp.
      
        require(proposal.timestamp != 0, "Invalid proposalId");

        // Only one validated proposal per reward can be executed for distribution.
        require(reward.distributionProposed != DistributionProposed.Accepted, "Reward already distributed");

        // Append reward index to ancillary data.
        bytes memory ancillaryData = _appendpcrIndex(reward.customAncillaryData);

        // Get resolved price. Reverts if the request is not settled or settleable.
        int256 resolvedPrice =
            optimisticOracle.settleAndGetPrice(reward.priceIdentifier, proposal.timestamp, ancillaryData);

        // Transfer rewards to MerkleDistributor for accepted proposal and flag distributionProposed Accepted.
        // This does not revert on rejected proposals so that disputer could receive back its bond and winning
        // in the same transaction when settleAndGetPrice is called above.
        if (resolvedPrice == 1e18) {
            reward.distributionProposed = DistributionProposed.Accepted;
            SuperToken(rewardToken).approve(pcrTokenAdress, reward.rewardAmount);
            SuperToken(rewardToken).send(pcrTokenAdress, reward.rewardAmount,'0x');
           
        
           //// reward.rewardToken.safeApprove(address(merkleDistributor), reward.rewardAmount);
          //// 
            emit RewardDistributed(
                reward.admin,
                reward.rewardToken,
                proposal.pcrIndex,
                reward.rewardAmount,
                proposal.proposalId
            );
             console.log('approved');
        }
        // ProposalRejected can be emitted multiple times whenever someone tries to execute the same rejected proposal.
        else { 
            console.log('rejected');
            emit ProposalRejected(proposal.pcrIndex, proposal.proposalId); 
            }
    }

    /********************************************
     *          MAINTENANCE FUNCTIONS           *
     ********************************************/


    /**
     * @notice Updates the address stored in this contract for the OptimisticOracle and the Store to the latest
     * versions set in the Finder. Also pull finalFee from Store contract.
     * @dev There is no risk of leaving this function public for anyone to call as in all cases we want the addresses
     * in this contract to map to the latest version in the Finder and store the latest final fee.
     */
    function syncUmaEcosystemParams() public  {
        store = _getStore();
        optimisticOracle = _getOptimisticOracle();
        ancillaryBytesLimit = optimisticOracle.ancillaryBytesLimit();
    }

    /********************************************
     *            CALLBACK FUNCTIONS            *
     ********************************************/

    /**
     * @notice Unblocks new distribution proposals when there is a dispute posted on OptimisticOracle.
     * @dev Only accessable as callback through OptimisticOracle on disputes.
     * @param identifier Price identifier from original proposal.
     * @param timestamp Timestamp when distribution proposal was posted.
     * @param ancillaryData Ancillary data of the price being requested (includes stamped pcrIndex).
     * @param refund Refund received (not used in this contract).
     */
    function priceDisputed(
        bytes32 identifier,
        uint256 timestamp,
        bytes memory ancillaryData,
        uint256 refund
    ) external  {
        require(msg.sender == address(optimisticOracle), "Not authorized");

        // Identify the proposed distribution from callback parameters.
        bytes32 proposalId = _getProposalId(identifier, timestamp, ancillaryData);

        // Flag the associated reward unblocked for new distribution proposals unless rewards already distributed.
        if (reward.distributionProposed != DistributionProposed.Accepted)
            reward.distributionProposed = DistributionProposed.None;
    }

    /********************************************
     *            INTERNAL FUNCTIONS            *
     ********************************************/

    function _getStore() internal view returns (StoreInterface) {
        return StoreInterface(finder.getImplementationAddress(OracleInterfaces.Store));
    }

    function _getOptimisticOracle() internal view returns (OptimisticOracleInterface) {
        return OptimisticOracleInterface(finder.getImplementationAddress(OracleInterfaces.OptimisticOracle));
    }

    function _getIdentifierWhitelist() internal view returns (IdentifierWhitelistInterface) {
        return IdentifierWhitelistInterface(finder.getImplementationAddress(OracleInterfaces.IdentifierWhitelist));
    }

    function _getCollateralWhitelist() internal view returns (AddressWhitelistInterface) {
        return AddressWhitelistInterface(finder.getImplementationAddress(OracleInterfaces.CollateralWhitelist));
    }

    function _appendpcrIndex(bytes memory customAncillaryData)
        internal
        view
        returns (bytes memory)
    {
        return AncillaryData.appendKeyValueUint(customAncillaryData, "PcrIndex", pcrIndex);
    }

    function _ancillaryDataWithinLimits(bytes memory customAncillaryData) internal view returns (bool) {
        // Since pcrIndex has variable length as string, it is not appended here and is assumed
        // to be included in ANCILLARY_BYTES_RESERVE.
        return
            optimisticOracle.stampAncillaryData(customAncillaryData, address(this)).length + ANCILLARY_BYTES_RESERVE <=
            ancillaryBytesLimit;
    }

    function _getProposalId(
        bytes32 identifier,
        uint256 timestamp,
        bytes memory ancillaryData
    ) internal pure returns (bytes32) {
        return keccak256(abi.encode(identifier, timestamp, ancillaryData));
    }
}
