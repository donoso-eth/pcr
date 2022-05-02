// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity ^0.8.0;

import {DataTypes} from "./DataTypes.sol";

library Events {
    /**
     * @dev Emitted when a new Perpetual Cond
     itional Reward is created.
     *
    
     */
    event PerpetualConditionalRewardCreated(DataTypes.REWARD_EVENT reward);


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
