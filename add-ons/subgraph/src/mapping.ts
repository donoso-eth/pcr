import { Reward } from '../generated/schema';
import { PerpetualConditionalRewardCreated } from '../generated/PcrHost/PcrHost';
import { RewardDeposit } from '../generated/PcrOptimisticOracle/PcrOptimisticOracle';
import { PcrOptimisticOracle, PcrToken } from '../generated/templates';
import { BigDecimal, BigInt } from '@graphprotocol/graph-ts';

export function handleRewardCreated(
  event: PerpetualConditionalRewardCreated
): void {

   let id = event.params.pcrId.toString();

  let reward = Reward.load(id);

  if (reward === null) {
    reward = new Reward(id);
    reward.admin = event.params.admin.toHexString();
    reward.rewardToken = event.params.rewardToken.toHexString();
    reward.token = event.params.token;
    reward.earliestProposalTimestamp = event.params.earliestProposalTimestamp;
    reward.rewardAmount = event.params.optimisticOracleInput.rewardAmount;
    reward.currentdeposit = new BigInt(0);
    reward.optimisticOracleLivenessTime =
      event.params.optimisticOracleInput.optimisticOracleLivenessTime;
    reward.priceIdentifier = event.params.optimisticOracleInput.priceIdentifier;
    reward.customAncillaryData =
      event.params.optimisticOracleInput.customAncillaryData;
    reward.earliestProposalTimestamp = event.params.earliestProposalTimestamp;
    reward.interval = event.params.optimisticOracleInput.interval;
  }

  reward.save();

  PcrOptimisticOracle.create(event.params.optimisticOracleContract)
  PcrToken.create(event.params.tokenContract)

}

export function handleRewardDeposit(event: RewardDeposit): void {
  let id = event.params.pcrId.toString();

  let reward = Reward.load(id);
  if (reward !== null) {
  reward.currentdeposit = event.params.depositAmount;
  reward.save();
  }
}
