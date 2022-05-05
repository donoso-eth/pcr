import { Proposal, Reward, RewardIndexHistory, UserSubscription } from '../generated/schema';
import { RewardCreated } from '../generated/PcrHost/PcrHost';
import {
  ProposalAccepted,
  ProposalCreated,
  ProposalRejected,
  RewardDeposit,
  RewardTargetAndConditionChanged,
} from '../generated/templates/PcrOptimisticOracle/PcrOptimisticOracle';
import { RewardDistributed, RewardUnitsDeleted, RewardUnitsIssued } from '../generated/templates/PcrToken/PcrToken';

import { PcrOptimisticOracle, PcrToken } from '../generated/templates';
import { BigDecimal, BigInt } from '@graphprotocol/graph-ts';

export function handleRewardCreated(event: RewardCreated): void {
  let id = event.params.reward.pcrId.toString();

  let reward = Reward.load(id);

  if (reward === null) {
    reward = new Reward(id);
    reward.title = event.params.reward.title;
    reward.url = event.params.reward.url;
    reward.admin = event.params.reward.admin.toHexString();

    reward.rewardToken = event.params.reward.rewardToken.toHexString();
    reward.rewardAmount = event.params.reward.optimisticOracleInput.rewardAmount;
    reward.token = event.params.reward.token;

    reward.currentdeposit = new BigInt(0);
    reward.rewardStatus = new BigInt(0);
    reward.rewardStep = new BigInt(0);
    reward.earliestNextAction = event.params.reward.earliestNextAction;

    reward.interval = event.params.reward.optimisticOracleInput.interval;
    reward.target = event.params.reward.target;
    reward.targetCondition = new BigInt(event.params.reward.targetCondition);

    reward.optimisticOracleLivenessTime = event.params.reward.optimisticOracleInput.optimisticOracleLivenessTime;
    reward.priceIdentifier = event.params.reward.optimisticOracleInput.priceIdentifier;
    reward.customAncillaryData = event.params.reward.optimisticOracleInput.customAncillaryData;

    reward.unitsIssued = new BigInt(0);
    reward.totalDistributed = new BigInt(0);
    reward.currentIndex = new BigInt(0);
  }

  reward.save();

  PcrOptimisticOracle.create(event.params.reward.optimisticOracleContract);
  PcrToken.create(event.params.reward.tokenContract);
}

export function handleRewardDeposit(event: RewardDeposit): void {
  let id = event.params.pcrId.toString();

  let reward = Reward.load(id);
  if (reward !== null) {
    reward.currentdeposit = event.params.depositAmount;
    reward.save();
  }
}

export function handleProposalCreated(event: ProposalCreated): void {
  let prId = event.params.pcrId.toString();
  let reward = Reward.load(prId);
  if (reward !== null) {
    reward.rewardStep = new BigInt(1);
    reward.earliestNextAction = event.block.timestamp.plus(reward.optimisticOracleLivenessTime);
    reward.save();
  }

  let id = event.params.proposalId.toString();
  let proposal = Proposal.load(id);

  if (proposal === null) {
    let proposal = new Proposal(id);
    proposal.proposer = event.params.proposer.toHexString();
    proposal.timeStamp = event.block.timestamp;
    proposal.reward = prId;
    proposal.status = 'Pending';
    proposal.save();
  }
}

export function handleProposalRejected(event: ProposalRejected): void {
  let prId = event.params.pcrId.toString();
  let reward = Reward.load(prId);
  if (reward !== null) {
    reward.rewardStep = new BigInt(0);

    reward.save();
  }

  let id = event.params.proposalId.toString();
  let proposal = Proposal.load(id);

  if (proposal !== null) {
    proposal.status = 'Rejected';
  }
}

export function handleProposalAccepted(event: ProposalAccepted): void {
  let id = event.params.proposalId.toString();
  let proposal = Proposal.load(id);

  if (proposal !== null) {
    proposal.status = 'Accepted';
  }
}

export function handleRewardTargetAndConditionChanged(event: RewardTargetAndConditionChanged): void {
  let prId = event.params.pcrId.toString();
  let reward = Reward.load(prId);
  if (reward !== null) {
    reward.targetCondition = new BigInt(event.params.targetCondition);
    reward.target = event.params.target;
    reward.earliestNextAction = event.block.timestamp.plus(reward.optimisticOracleLivenessTime);
    reward.save();
  }
}

export function handleRewardUnitsIssued(event: RewardUnitsIssued): void {
  //// UPDATE The Current Index in the Reward Entity
  let prId = event.params.pcrId.toString();
  let reward = Reward.load(prId);
  if (reward !== null) {
    reward.unitsIssued = reward.unitsIssued.plus(event.params.amount);
    reward.currentIndex = reward.rewardAmount.div(reward.unitsIssued);
    reward.save();

    //// CREATE  a new History Index  Entity
    let indexId = event.transaction.hash.toHex();
    let rewardIndexHistory = new RewardIndexHistory(indexId);
    rewardIndexHistory.timeStamp = event.block.timestamp;
    rewardIndexHistory.index = reward.currentIndex;
    rewardIndexHistory.reward = prId;
    rewardIndexHistory.save();
  }
  //// CREATE/UPDATE the Reward/subscription per user
  let subscriptionId = event.params.beneficiary.toHexString().concat(prId);
  let subscription = UserSubscription.load(subscriptionId);

  if (subscription == null) {
    subscription = new UserSubscription(subscriptionId);
    subscription.units = event.params.amount;
  } else {
    subscription.units = subscription.units.plus(event.params.amount);
  }
  subscription.save();
}

export function handleRewardUnitsDeleted(event: RewardUnitsDeleted): void {
  //// UPDATE The Current Index in the Reward Entity
  let prId = event.params.pcrId.toString();
  let reward = Reward.load(prId);
  if (reward !== null) {
    reward.unitsIssued = reward.unitsIssued.minus(event.params.amount);
    reward.currentIndex = reward.rewardAmount.div(reward.unitsIssued);
    reward.save();

    //// CREATE  a new History Index  Entity
    let indexId = event.transaction.hash.toHex();
    let rewardIndexHistory = new RewardIndexHistory(indexId);
    rewardIndexHistory.timeStamp = event.block.timestamp;
    rewardIndexHistory.index = reward.currentIndex;
    rewardIndexHistory.reward = prId;
    rewardIndexHistory.save();
  }
  //// CREATE/UPDATE the Reward/subscription per user
  let subscriptionId = event.params.beneficiary.toHexString().concat(prId);
  let subscription = UserSubscription.load(subscriptionId);
  if (subscription !== null) {
    subscription.units = subscription.units.minus(event.params.amount);
    subscription.save();
  }
}

export function handleRewardDistributed(event: RewardDistributed): void {
  //// UPDATE The Current Index in the Reward Entity
  let prId = event.params.pcrId.toString();
  let reward = Reward.load(prId);
  if (reward !== null) {
    reward.totalDistributed = reward.totalDistributed.plus(event.params.rewardAmount);
    reward.currentdeposit = reward.currentdeposit.minus(reward.rewardAmount);
    reward.rewardStatus = new BigInt(0);
    reward.rewardStep = new BigInt(0);
    reward.earliestNextAction = event.block.timestamp.plus(reward.optimisticOracleLivenessTime);
    reward.save();
  }
}
