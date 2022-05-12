
import { Contract, Signer, utils } from 'ethers';
import { abi_ERC20 } from '../components/user-balance/abis/erc20';
import { abi_SuperToken } from '../components/user-balance/abis/superToken';
import { IPCR_REWARD, IPROPOSAL, REWARD_STEP } from '../models/pcr';


export const calculateStep = (_step: number, _earliestNextAction: number): REWARD_STEP => {
  let rewardStep = +_step.toString();
  let timeStamp = +(new Date().getTime() / 1000).toFixed(0);
  let earliestNextAction = +_earliestNextAction.toString();
  let step: REWARD_STEP = REWARD_STEP.QUALIFYING;
  if (rewardStep == 0 && timeStamp < earliestNextAction) {
    step = REWARD_STEP.QUALIFYING;
  } else if (rewardStep == 0 && timeStamp >= earliestNextAction) {
    step = REWARD_STEP.AWAITING_PROPOSAL;
  } else if (rewardStep == 2 && timeStamp < earliestNextAction) {
    step = REWARD_STEP.LIVENESS_PERIOD;
  } else if (rewardStep == 2 && timeStamp >= earliestNextAction) {
    step = REWARD_STEP.AWAITING_EXECUTION;
  }
  return step;
};

export const prepareDisplayProposal = (reward:IPCR_REWARD):IPROPOSAL => {
    let proposal:IPROPOSAL = {
        ...reward.currentProposal, 
        ...{
            earliestNextAction:reward.earliestNextAction,
            interval:+reward.interval,
            optimisticOracleLivenessTime: + reward.optimisticOracleLivenessTime,
            title:reward.title, 
            priceType: reward.priceType,
            step:reward.rewardStep, 
            rewardId:reward.id,
            rewardStatus:reward.rewardStatus
        }}
    return proposal;

};

export const createERC20Instance = (ERC: string, signer:Signer): Contract => {
  return new Contract(ERC, abi_ERC20, signer);
}

export const  createSuperTokenInstance = (SuperToken: string, signer:Signer): Contract => {
  return new Contract(SuperToken, abi_SuperToken,signer);
}

export const isAddress = (address:string) => {
  try {
      utils.getAddress(address);
  } catch (e) { return false; }
  return true;
}