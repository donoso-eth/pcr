
export enum REWARD_STEP {
  QUALIFYING,
  AWAITING_PROPOSAL,
  LIVENESS_PERIOD,
  AWAITING_EXECUTION,
}

export interface IPCR_REWARD {
  id: string;
  admin: string;
  tokenImpl:string;
  optimisticOracleImpl:string;
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


  currentProposal: {
    id:string;
    startQualifying: number
    startProposePeriod: number
    startLivenessPeriod: number
    startExecutionPeriod: number
    status:string
  };


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
  displayDate: string
 
}


export interface IPROPOSAL {
  id: string
  startQualifying: number
  startProposePeriod: number
  startLivenessPeriod: number
  startExecutionPeriod: number
  earliestNextAction: number
  title:string,
  step:string,
  rewardId:string
  status: string

  display_startQualifying?: string
  display_startProposePeriod?: string
  display_startLivenessPeriod?: string
  display_startExecutionPeriod?: string
  display_earliestNextAction?: string

}
