import { Reward } from '../generated/schema';
import { RewardCreated } from '../generated/PcrHost/PcrHost';
import { RewardDeposit } from '../generated/templates/PcrOptimisticOracle/PcrOptimisticOracle';
import { PcrOptimisticOracle, PcrToken } from '../generated/templates';
import { BigDecimal, BigInt } from '@graphprotocol/graph-ts';

export function handleRewardCreated(
  event: RewardCreated
): void {
  let id = event.params.reward.pcrId.toString();

  let reward = Reward.load(id);

  if (reward === null) {
    reward = new Reward(id);
    reward.title = event.params.reward.title;
    reward.url = event.params.reward.url;

    reward.admin = event.params.reward.admin.toHexString();
    
    reward.currentdeposit = new BigInt(0);
    reward.rewardStatus = 0;
    reward.rewardStep =  0;

    reward.rewardToken = event.params.reward.rewardToken.toHexString();
    reward.rewardAmount =
    event.params.reward.optimisticOracleInput.rewardAmount;
    reward.token = event.params.reward.token;

    reward.earliestNextAction = event.params.reward.earliestNextAction;

    reward.target = event.params.reward.target;

    reward.targetCondition = event.params.reward.targetCondition;

    reward.optimisticOracleLivenessTime =
      event.params.reward.optimisticOracleInput.optimisticOracleLivenessTime;
    reward.priceIdentifier =
      event.params.reward.optimisticOracleInput.priceIdentifier;

    reward.customAncillaryData =
      event.params.reward.optimisticOracleInput.customAncillaryData;

    reward.interval = event.params.reward.optimisticOracleInput.interval;
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
