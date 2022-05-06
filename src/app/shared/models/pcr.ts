import { string } from "hardhat/internal/core/params/argumentTypes";

export enum REWARD_STEP {
  QUALIFYING,
  AWAITING_PROPOSAL,
  LIVENESS_PERIOD,
  AWAITING_EXECUTION,
}

export interface IPCR_REWARD {
  id: string;
  admin: string;
  currentdeposit: string;
  customAncillaryData: string;
  earliestNextAction: number;
  interval: string;
  rewardAmount: string;
  rewardStatus: string;
  rewardStep: string;
  rewardToken: string;
  title: string;
  url: string | null;
  token: string;
  

  totalDistributed: string;
  currentIndex: string;
  unitsIssued:string;


  fundToken: { 
    name: string; 
    id: number; 
    image: string; 
    rewardToken: string; 
    superToken: string;
    superTokenBalance?:string };
  
  displayStep: number;
  displayCustomAncillaryData: string;
  displayTime: { started:number, finish:number, percentage:number}
 
}
