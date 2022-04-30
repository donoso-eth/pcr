// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity ^0.8.0;

import "@uma/core/contracts/oracle/interfaces/FinderInterface.sol";



/**
 * @title  OptimisticDistributor contract.
 * @notice Allows admins to distribute rewards through MerkleDistributor contract secured by UMA Optimistic Oracle.
 */
interface IOptimisticDistributor {
   
    /**
     * @notice INITILIZER.
     * @param _pcrIndex ERC20 token that the bond is paid in.
     * @param _pcrTokenAdress PcrTokenAddress
     * @param _finder Finder to look up UMA contract addresses.
     * @param _rewardToken ERC20 token that the rewards will be paid in.
     * @param rewardAmount Maximum reward amount that the admin is posting for distribution.
     * @param earliestProposalTimestamp Starting timestamp when proposals for distribution can be made.
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
        uint256 earliestProposalTimestamp,
        uint256 optimisticOracleLivenessTime,
        bytes32 priceIdentifier,
        bytes calldata customAncillaryData
    ) external;


    /**
     * @notice Allows anyone to deposit additional rewards for distribution before `earliestProposalTimestamp`.
     * @dev The caller must approve this contract to transfer `additionalRewardAmount` amount of `rewardToken`.
     * @param depositAmount Additional reward amount that the admin is posting for distribution.
     */
    function depositReward(uint256 depositAmount) external;

    /********************************************
     *          DISTRIBUTION FUNCTIONS          *
     ********************************************/

    /**
     * @notice Allows any caller to propose distribution for funded reward starting from `earliestProposalTimestamp`.
     * Only one undisputed proposal at a time is allowed.
     * @dev The caller must approve this contract to transfer `optimisticOracleProposerBond` + final fee amount
     * of `bondToken`.
     * @param ipfsHash Hash of IPFS object, conveniently stored for clients to verify proposed distribution.
     */
    function proposeDistribution(
        string calldata ipfsHash
    ) external;

    /**
     * @notice Allows any caller to execute distribution that has been validated by the Optimistic Oracle.
     * @param proposalId Hash for identifying existing rewards distribution proposal.
     * @dev Calling this for unresolved proposals will revert.
     */
    function executeDistribution(bytes32 proposalId) external;

}
