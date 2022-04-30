// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "hardhat/console.sol";
import {Clones} from "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import {ISuperfluid, ISuperToken} from "@superfluid-finance/ethereum-contracts/contracts/apps/SuperAppBase.sol";
import {IInstantDistributionAgreementV1} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/agreements/IInstantDistributionAgreementV1.sol";

import {IPcrToken} from "./interfaces/IPcrToken.sol";
import {IOptimisticDistributor} from "./interfaces/IOptimisticDistributor.sol";


import "@uma/core/contracts/oracle/interfaces/FinderInterface.sol";

contract PcrHost {
  using Counters for Counters.Counter;
  Counters.Counter public _pcrTokensIssued;

  struct Pcr_addresses {
    address tokenContract;
    address distributorContract;
  }

  mapping(address => mapping(uint256 => Pcr_addresses))
    private _pcrTokensContractsByUser;
  mapping(address => uint256) private _pcrTokensByUser;

  struct IDA {
    address tokenImpl;
    address host;
    address ida;
    address superToken;
  }

struct OPTIMISTIC_DISTRIBUTOR {
    address distributorImpl;
    FinderInterface finder;
    uint256 rewardAmount;
    uint256 interval;
    uint256 optimisticOracleLivenessTime;
    bytes32 priceIdentifier;
    bytes customAncillaryData;
}

  constructor() {}

  function createTokenContract(
    IDA memory ida,
    OPTIMISTIC_DISTRIBUTOR memory distributor
  ) external {
    _pcrTokensIssued.increment();

    _pcrTokensByUser[msg.sender]++;
    uint256 _tokenId = _pcrTokensByUser[msg.sender];
    address _tokenContract = Clones.clone(ida.tokenImpl);

    console.log(ida.tokenImpl);

    console.log(_tokenContract);


    //// TODO CLONE OPTIMISTIC CONTRACT

    address _distributorContract = Clones.clone(distributor.distributorImpl);

    _pcrTokensContractsByUser[msg.sender][_tokenId] = Pcr_addresses(
      {tokenContract:_tokenContract,distributorContract:_distributorContract}) ;



      //// INITIALIZE TOJEN cONTRACT WITH

    IPcrToken(_tokenContract).initialize(
      msg.sender,
      _distributorContract,
      "PCR",
      "PCR",
      ISuperfluid(ida.host),
      IInstantDistributionAgreementV1(ida.ida),
      ISuperToken(ida.superToken)
    );

    console.log('555');

    IOptimisticDistributor(_distributorContract).initialize(
      distributor.finder,
      _pcrTokensIssued.current(),
      _tokenContract,
      ida.superToken,
      distributor.rewardAmount,
      distributor.interval,
      distributor.optimisticOracleLivenessTime,
      distributor.priceIdentifier,
      distributor.customAncillaryData
    );


  }

  // ============= View Functions ============= ============= =============  //

  // #region ViewFunctions

  function getNumbersOfPcrTokens() external view returns (uint256) {
    uint256 id = _pcrTokensIssued.current();
    return id;
  }

  function getTotalPcrTokensByUser(address _owner)
    external
    view
    returns (uint256)
  {
    uint256 _totalPcrTokens = _pcrTokensByUser[_owner];
    return _totalPcrTokens;
  }

  function getTokensAddressByUserAndId(address _owner, uint256 _id)
    external
    view
    returns (Pcr_addresses memory)
  {
    Pcr_addresses memory _contractAdresses = _pcrTokensContractsByUser[_owner][_id];
    return _contractAdresses;
  }

  // #endregion View Functions
}
