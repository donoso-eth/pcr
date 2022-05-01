// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity ^0.8.0;

import "@uma/core/contracts/oracle/interfaces/FinderInterface.sol";

import {DataTypes} from "../libraries/DataTypes.sol";

/**
 * @title  OptimisticOracle contract.
 * @notice Allows admins to distribute rewards through MerkleDistributor contract secured by UMA Optimistic Oracle.
 */
interface IPcrOptimisticOracle {
   
    /**
     * @notice INITILIZER.
     * @param  optimisticOracleInput that the bond is paid in.
     */
    function initialize(DataTypes.PCR_OPTIMISTIC_ORACLE_INITIALIZER calldata optimisticOracleInput
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
    */
    function proposeDistribution(
    ) external;

    /**
     * @notice Allows any caller to execute distribution that has been validated by the Optimistic Oracle.
     * @dev Calling this for unresolved proposals will revert.
     */
    function executeDistribution() external;

}
