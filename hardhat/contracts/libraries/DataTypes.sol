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
    uint256 rewardAmount;
    uint256 interval;
    uint256 optimisticOracleLivenessTime;
    bytes32 priceIdentifier;
    bytes customAncillaryData;
  }
}
