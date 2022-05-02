import { Reward } from '../generated/schema';
import { PerpetualConditionalRewardCreated } from '../generated/PcrHost/PcrHost';
import { RewardDeposit } from '../generated/PcrOptimisticOracle/PcrOptimisticOracle';
import { PcrOptimisticOracle, PcrToken } from '../generated/templates';
import { BigDecimal, BigInt } from '@graphprotocol/graph-ts';

export function handleRewardCreated(
  event: PerpetualConditionalRewardCreated
): void {

   let id = event.params.reward.pcrId.toString();

  let reward = Reward.load(id);

  if (reward === null) {
    reward = new Reward(id);
    reward.title = event.params.reward.title;
    reward.url = event.params.reward.url;
    reward.admin = event.params.reward.admin.toHexString();
    reward.rewardToken = event.params.reward.rewardToken.toHexString();
    reward.token = event.params.reward.token;
    reward.earliestProposalTimestamp = event.params.reward.earliestProposalTimestamp;
    reward.rewardAmount = event.params.reward.optimisticOracleInput.rewardAmount;
    reward.currentdeposit = new BigInt(0);
    reward.optimisticOracleLivenessTime =
      event.params.reward.optimisticOracleInput.optimisticOracleLivenessTime;
    reward.priceIdentifier = event.params.reward.optimisticOracleInput.priceIdentifier;
    reward.customAncillaryData =
      event.params.reward.optimisticOracleInput.customAncillaryData;
    reward.earliestProposalTimestamp = event.params.reward.earliestProposalTimestamp;
    reward.interval = event.params.reward.optimisticOracleInput.interval;
  }

  reward.save();

  PcrOptimisticOracle.create(event.params.reward.optimisticOracleContract)
  PcrToken.create(event.params.reward.tokenContract)

}

export function handleRewardDeposit(event: RewardDeposit): void {
  let id = event.params.pcrId.toString();

  let reward = Reward.load(id);
  if (reward !== null) {
  reward.currentdeposit = event.params.depositAmount;
  reward.save();
  }
}
