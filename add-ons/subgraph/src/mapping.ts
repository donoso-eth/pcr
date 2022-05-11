import { Proposal, Reward, RewardIndexHistory, User, UserMembership } from '../generated/schema';
import { RewardCreated } from '../generated/PcrHost/PcrHost';
import {
  ProposalAcceptedAndDistribuition,
  ProposalCreated,
  ProposalRejected,
  RewardDeposit,
  RewardAmountUpdated,
  RewardTargetAndConditionChanged,
} from '../generated/templates/PcrOptimisticOracle/PcrOptimisticOracle';
import { RewardUnitsDeleted, RewardUnitsIssued } from '../generated/templates/PcrToken/PcrToken';

import { PcrOptimisticOracle, PcrToken } from '../generated/templates';
import { BigDecimal, BigInt } from '@graphprotocol/graph-ts';
import { store } from '@graphprotocol/graph-ts';

function createNewProposal(id: string, reward: Reward): void {
  let proposal = new Proposal(id);
  proposal.startQualifying = reward.earliestNextAction.minus(reward.interval);

  proposal.startLivenessPeriod = BigInt.fromI32(0);
  proposal.reward = reward.id;
  proposal.priceProposed = BigInt.fromI32(0);
  proposal.priceResolved = BigInt.fromI32(0);
  proposal.status = 'Pending';
  proposal.save();
}

function createUser(userId: string): void {
  let user = User.load(userId);
  if (user === null) {
    user = new User(userId);
    user.save();
  }
}

export function handleRewardCreated(event: RewardCreated): void {
  let userId = event.params.reward.admin.toHexString();
  createUser(userId);

  let id = event.params.reward.pcrId.toString();
  let reward = Reward.load(id);

  if (reward === null) {
    reward = new Reward(id);
    reward.title = event.params.reward.title;
    reward.url = event.params.reward.url;
    reward.admin = userId;
    reward.optimisticOracleImpl = event.params.reward.optimisticOracleContract.toHexString();
    reward.tokenImpl = event.params.reward.tokenContract.toHexString();

    reward.rewardToken = event.params.reward.rewardToken.toHexString();
    reward.rewardAmount = event.params.reward.optimisticOracleInput.rewardAmount;
    reward.token = event.params.reward.token;

    reward.currentdeposit = BigInt.fromI32(0);
    reward.rewardStatus = BigInt.fromI32(0);
    reward.rewardStep = BigInt.fromI32(0);
    reward.earliestNextAction = event.params.reward.earliestNextAction;

    reward.interval = event.params.reward.optimisticOracleInput.interval;
    reward.target = event.params.reward.target;
    reward.targetCondition = BigInt.fromI32(event.params.reward.targetCondition);

    reward.priceType = BigInt.fromI32(event.params.reward.optimisticOracleInput.priceType);
    reward.optimisticOracleLivenessTime = event.params.reward.optimisticOracleInput.optimisticOracleLivenessTime;
    reward.priceIdentifier = event.params.reward.optimisticOracleInput.priceIdentifier;
    reward.customAncillaryData = event.params.reward.optimisticOracleInput.customAncillaryData;

    reward.unitsIssued = BigInt.fromI32(0);
    reward.totalDistributed = BigInt.fromI32(0);
    reward.currentIndex = BigInt.fromI32(0);
    reward.currentProposal = '1';

    let propossalId = '1';
    let proposal = Proposal.load(propossalId);

    if (proposal === null) {
      createNewProposal(propossalId, reward);
    }
  }

  reward.save();

  PcrOptimisticOracle.create(event.params.reward.optimisticOracleContract);
  PcrToken.create(event.params.reward.tokenContract);
}

export function handleRewardDeposit(event: RewardDeposit): void {
  let id = event.params.pcrId.toString();

  let reward = Reward.load(id);
  if (reward !== null) {
    reward.currentdeposit = event.params.depositAmount.plus(reward.currentdeposit);
    reward.save();
  }
}

export function handleRewardAmountUpdated(event: RewardAmountUpdated): void {
  let prId = event.params.pcrId.toString();

  let reward = Reward.load(prId);

  if (reward !== null) {
    reward.rewardAmount = event.params.newRewardAmount;
    if (reward.unitsIssued.gt(BigInt.fromI32(0))) {
      reward.currentIndex = reward.rewardAmount.div(reward.unitsIssued);
      //// CREATE  a new History Index  Entity
      let indexId = event.transaction.hash.toHex();
      let rewardIndexHistory = new RewardIndexHistory(indexId);
      rewardIndexHistory.timeStamp = event.block.timestamp;
      rewardIndexHistory.index = reward.currentIndex;
      rewardIndexHistory.rewardAmount = reward.rewardAmount;
      rewardIndexHistory.reward = prId;
      rewardIndexHistory.save();
    }
    reward.save();
  }
}

export function handleProposalCreated(event: ProposalCreated): void {
  let proposerId = event.params.proposer.toHexString();
  createUser(proposerId);

  let id = event.params.proposalId.toString();
  let prId = event.params.pcrId.toString();
  let reward = Reward.load(prId);
  if (reward !== null) {
    let proposal = Proposal.load(id);

    if (proposal !== null) {
      proposal.proposer = proposerId;
      proposal.priceProposed = event.params.priceProposed;
      proposal.startLivenessPeriod = event.block.timestamp;
      proposal.status = 'Pending';
      proposal.save();
    }

    reward.rewardStep = BigInt.fromI32(2);
    reward.earliestNextAction = event.block.timestamp.plus(reward.optimisticOracleLivenessTime);
    reward.save();
  }
}

export function handleProposalRejected(event: ProposalRejected): void {
  let prId = event.params.pcrId.toString();

  let reward = Reward.load(prId);

  let newProposalId = event.params.newProposalId.toString();

  if (reward !== null) {
    reward.rewardStep = BigInt.fromI32(0);
    reward.earliestNextAction = event.block.timestamp.plus(reward.optimisticOracleLivenessTime);
    reward.currentProposal = newProposalId;
    reward.save();

    let id = event.params.proposalId.toString();
    let proposal = Proposal.load(id);

    if (proposal !== null) {
      proposal.status = 'Rejected';

      proposal.timeStamp = event.block.timestamp;
      proposal.priceResolved = event.params.resolvedPrice;
      proposal.save();
    }

    let newProposal = Proposal.load(newProposalId);
    if (newProposal === null) {
      createNewProposal(newProposalId, reward);
    }
  }
}

export function handleProposalAcceptedAndDistribuition(event: ProposalAcceptedAndDistribuition): void {
  let prId = event.params.pcrId.toString();
  let reward = Reward.load(prId);

  let newProposalId = event.params.newProposalId.toString();

  if (reward !== null) {
    reward.totalDistributed = reward.totalDistributed.plus(reward.rewardAmount);
    reward.currentdeposit = reward.currentdeposit.minus(reward.rewardAmount);
    reward.rewardStatus = BigInt.fromI32(0);
    reward.rewardStep = BigInt.fromI32(0);
    reward.earliestNextAction = event.block.timestamp.plus(reward.optimisticOracleLivenessTime);
    reward.currentProposal = newProposalId;
    reward.save();

    let id = event.params.proposalId.toString();
    let proposal = Proposal.load(id);
    if (proposal !== null) {
      proposal.status = 'Accepted';
      proposal.timeStamp = event.block.timestamp;
      proposal.priceResolved = event.params.resolvedPrice;
      proposal.save();
    }
    let newProposal = Proposal.load(newProposalId);
    if (newProposal === null) {
      createNewProposal(newProposalId, reward);
    }
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

///////// PCRTOKEN/IDA EVENTS

export function handleRewardUnitsIssued(event: RewardUnitsIssued): void {
  let beneficiaryId = event.params.beneficiary.toHexString();
  createUser(beneficiaryId);

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
    rewardIndexHistory.rewardAmount = reward.rewardAmount;
    rewardIndexHistory.reward = prId;
    rewardIndexHistory.save();
  }
  //// CREATE/UPDATE the Reward/subscription per user
  let subscriptionId = event.params.beneficiary.toHexString().concat(prId);
  let subscription = UserMembership.load(subscriptionId);

  if (subscription === null) {
    subscription = new UserMembership(subscriptionId);
    subscription.units = event.params.amount;
    subscription.beneficiary = beneficiaryId;
    subscription.reward = prId;
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
    rewardIndexHistory.rewardAmount = reward.rewardAmount;
    rewardIndexHistory.index = reward.currentIndex;
    rewardIndexHistory.reward = prId;
    rewardIndexHistory.save();
  }
  //// CREATE/UPDATE the Reward/subscription per user
  let subscriptionId = event.params.beneficiary.toHexString().concat(prId);
  let subscription = UserMembership.load(subscriptionId);
  if (subscription !== null) {
    subscription.units = subscription.units.minus(event.params.amount);
    if (subscription.units.gt(BigInt.fromI32(0))) {
      subscription.save();
    } else {
      store.remove('UserMembership', subscriptionId);
    }
  }
}
