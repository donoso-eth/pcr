// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity ^0.8.0;

import {DataTypes} from "./DataTypes.sol";

library Events {
    /**
     * @dev Emitted when a new Perpetual Cond
     itional Reward is created.
     *
    
     */
    event PerpetualConditionalRewardCreated(
        address admin,
        address rewardToken,
        string token,
        uint256 indexed pcrId,
        uint256 earliestProposalTimestamp,
        DataTypes.OPTIMISTIC_ORACLE_INPUT optimisticOracleInput,
        address tokenContract,
        address optimisticOracleContract
    );

    event RewardDeposit(uint256 pcrId, uint256 depositAmount);

    event ProposalCreated(
        address proposer,
        uint256  proposalId,
        uint256 pcrId,
        uint256 timeStamp );


    event ProposalRejected(uint256 pcrId, uint256 proposalId);


    event RewardDistributed(
        address  admin,
        address rewardToken,
        uint256  pcrId,
        uint256 rewardAmount,
        uint256 proposalId
    );
}
