// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity ^0.8.0;

import "@uma/core/contracts/oracle/interfaces/FinderInterface.sol";

/**
 * @title DataTypes
 * @author
 *
 * @notice A standard library of data types used throughout.
 */
library DataTypes {


  struct PCRHOST_CONFIG_INPUT  {
    address pcrTokenImpl;
    address pcrOptimisticOracleImpl;
    string title;
    string url;
  }


  /**
   * @notice A struct containing the necessary information to launch the InstandDistricution agreemens
   *
   * @param host Superfluid Host address parameter.
   * @param ida Superfluid InstantDistribution address parameter.
   * @param rewardToken SuperFluid SuperToken parameter
   */
  struct PCRTOKEN_INITIALIZER {
    address owner;
    uint256 rewardId;
    address optimisticOracleContract;
    string name;
    string symbol;
    IDA_INPUT ida;
  }

  struct IDA_INPUT {
    address host;
    address ida;
    address rewardToken;
  }


  struct PCR_OPTIMISTIC_ORACLE_INITIALIZER {
    address owner;
    uint256 rewardId;
    address tokenContract;
    address rewardToken;
    OPTIMISTIC_ORACLE_INPUT optimisticOracleInput;
  }



  struct OPTIMISTIC_ORACLE_INPUT {
    FinderInterface finder;
    int256 target;
    uint256 rewardAmount;
    uint256 interval;
    uint256 optimisticOracleLivenessTime;
    bytes32 priceIdentifier;
    bytes customAncillaryData;
  }


  /////// EVENT TYPES
  struct REWARD_EVENT {
        address admin;
        int256 target;
        address rewardToken;
        string token;
        uint256 pcrId;
        uint256 earliestProposalTimestamp;
        DataTypes.OPTIMISTIC_ORACLE_INPUT optimisticOracleInput;
        address tokenContract;
        address optimisticOracleContract;
        string title;
        string url;
  }


    enum RewardStep {
        Funding, // New proposal can be submitted (either there have been no proposals or the prior one was disputed).
        Pending, // Proposal is not yet resolved.
        Accepted // Proposal has been confirmed through Optimistic Oracle and rewards transferred to Token distributor.
    }

    // Represents reward posted by a admin.
    struct Reward {
        RewardStep rewardStep;
        address admin;
        int256 target;
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
        uint256 pcrId;
        uint256 proposalId;
        uint256 timestamp;
    }


}
