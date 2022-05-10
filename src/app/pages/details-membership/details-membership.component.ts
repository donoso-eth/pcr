import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { DappBaseComponent, DappInjector, global_tokens, Web3Actions } from 'angular-web3';
import { Contract, utils } from 'ethers';
import { takeUntil } from 'rxjs';
import { doSignerTransaction } from 'src/app/dapp-injector/classes/transactor';

import { GraphQlService } from 'src/app/dapp-injector/services/graph-ql/graph-ql.service';
import { SuperFluidServiceService } from 'src/app/dapp-injector/services/super-fluid/super-fluid-service.service';
import { prepareDisplayProposal } from 'src/app/shared/helpers/helpers';
import { IPCR_REWARD, IPROPOSAL } from 'src/app/shared/models/pcr';

import { abi_ERC20 } from './abis/erc20';
import { abi_SuperToken } from './abis/superToken';

export enum REWARD_STEP {
  QUALIFYING,
  AWAITING_PROPOSAL,
  LIVENESS_PERIOD,
  AWAITING_EXECUTION,
}

@Component({
  selector: 'details-membership',
  templateUrl: './details-membership.component.html',
  styleUrls: ['./details-membership.component.scss'],
})
export class DetailsMembershipComponent extends DappBaseComponent {
  pcrTokens: Array<IPCR_REWARD> = [];

  toUpdateMembership: any | undefined = undefined;

  valSwitch = true;
  showFundingState = false;
  showIssuingState = false;

  //// FormControls
  toFundAmountCtrl = new FormControl(0, Validators.required);
  adressesCtrl = new FormControl('', [Validators.required, Validators.minLength(32), Validators.maxLength(32)]);
  routeItems: { label: string }[];

  activeStep = 0;
  chartData: { labels: string[]; datasets: { label: string; data: number[]; fill: boolean; backgroundColor: string; borderColor: string; tension: number; }[]; };
  chartOptions:any;
  currentProposal!: IPROPOSAL;
  constructor(
    private router: Router, 
    private superFluidService: SuperFluidServiceService,
    private route:ActivatedRoute, dapp: DappInjector, store: Store, private graphqlService: GraphQlService) {
    super(dapp, store);
    this.routeItems = [
      {label: 'Qualifying'},
      {label: 'Propose Period'},
      {label: 'Liveness Period'},
      {label: 'Execution Period'},
  ];
  this.chartOptions = {
    plugins: {
        legend: {
            labels: {
                color: '#ebedef'
            }
        }
    },
    scales: {
        x: {
            ticks: {
                color: '#ebedef'
            },
            grid: {
                color:  'rgba(160, 167, 181, .3)',
            }
        },
        y: {
            ticks: {
                color: '#ebedef'
            },
            grid: {
                color:  'rgba(160, 167, 181, .3)',
            }
        },
    }
};
  this.chartData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
        {
            label: 'First Dataset',
            data: [65, 59, 80, 81, 56, 55, 40],
            fill: false,
            backgroundColor: '#2f4860',
            borderColor: '#2f4860',
            tension: .4
        },
        {
            label: 'Second Dataset',
            data: [28, 48, 40, 19, 86, 27, 90],
            fill: false,
            backgroundColor: '#00bb7e',
            borderColor: '#00bb7e',
            tension: .4
        }
    ]
};
 

  }

  async proposeValue(value:number) {
    this.store.dispatch(Web3Actions.chainBusy({ status: true }));
    await doSignerTransaction(this.dapp.DAPP_STATE.contracts[+this.toUpdateMembership!.id]?.pcrOptimisticOracle.instance.proposeDistribution(value)!);
  }

async executeProposal(){
    /// TO dO CHAEK IF CURRENT DEPOSIT and ISSUER MEMBERs
  if (+this.toUpdateMembership!.rewardAmount <= +this.toUpdateMembership!.currentdeposit) {
    alert("Please Fund The Deposit")
    return;
  }

  if (+this.toUpdateMembership!.unitsIssued <= 0) {
    alert("No members yet")
    return;
  }
   
  try {
    const tx = await doSignerTransaction(this.dapp.DAPP_STATE.contracts[+this.toUpdateMembership!.id]?.pcrOptimisticOracle.instance.executeDistribution());

  } catch (error) {
    console.log(error)
  }

 

}
  async showFunding(reward:IPCR_REWARD) {
    this.store.dispatch(Web3Actions.chainBusy({ status: true }));
    

    const superToken = this._createSuperTokenInstance(this.toUpdateMembership!.fundToken.superToken);
    const balanceSupertoken = await superToken.realtimeBalanceOfNow(this.dapp.signerAddress);

    this.toUpdateMembership!.fundToken.superTokenBalance = balanceSupertoken[0].toString();

    this.store.dispatch(Web3Actions.chainBusy({ status: false }));
    this.showFundingState = true;
  }

  async doFunding() {
    if (this.toFundAmountCtrl.value <= 0) {
      alert('please add a numer');
    }
    this.store.dispatch(Web3Actions.chainBusy({ status: true }));
    await doSignerTransaction(this._createERC20Instance(this.toUpdateMembership!.fundToken.superToken).approve(this.dapp.DAPP_STATE.contracts[+this.toUpdateMembership!.id]?.pcrOptimisticOracle.address, 50));
    await doSignerTransaction(this.dapp.DAPP_STATE.contracts[+this.toUpdateMembership!.id]?.pcrOptimisticOracle.instance.depositReward(this.toFundAmountCtrl.value)!);

    this.toUpdateMembership!.currentdeposit = +this.toUpdateMembership!.currentdeposit + this.toFundAmountCtrl.value;

    this.store.dispatch(Web3Actions.chainBusy({ status: false }));
    this.showFundingState = false;
  }


  showAddMembers(reward:IPCR_REWARD) {
  
    this.showIssuingState = true;
  }

  async doAddMember(reward:IPCR_REWARD){

    if (this.adressesCtrl.value.invalid) {
      alert('please add and adresse')
    }

    this.store.dispatch(Web3Actions.chainBusy({ status: true }));
    await doSignerTransaction(this.dapp.DAPP_STATE.contracts[+reward.id]?.pcrToken?.instance.issue(this.adressesCtrl.value,1)!);
    this.showIssuingState = true;
  }






  async doPropose(reward:IPCR_REWARD){
    this.store.dispatch(Web3Actions.chainBusy({ status: true }));
    await doSignerTransaction(this.dapp.DAPP_STATE.contracts[+reward.id]?.pcrOptimisticOracle.instance.proposeDistribution(1)!);

  }


  calculateStep(reward: IPCR_REWARD): REWARD_STEP {
    let rewardStep = +reward.rewardStep.toString();
    let timeStamp = +(new Date().getTime() / 1000).toFixed(0);
    let earliestNextAction = +reward.earliestNextAction.toString();
    let step: REWARD_STEP = REWARD_STEP.QUALIFYING;
    if (rewardStep == 0 && timeStamp < earliestNextAction) {
      step = REWARD_STEP.QUALIFYING;
    } else if (rewardStep == 0 && timeStamp >= earliestNextAction) {
      step = REWARD_STEP.AWAITING_PROPOSAL;
    } else if (rewardStep == 1 && timeStamp < earliestNextAction) {
      step = REWARD_STEP.LIVENESS_PERIOD;
    } else if (rewardStep == 1 && timeStamp >= earliestNextAction) {
      step = REWARD_STEP.AWAITING_EXECUTION;
    }
    return step;
  }

  
  transformRewardObject(reward: IPCR_REWARD) {
    reward.displayCustomAncillaryData = utils.toUtf8String(reward.customAncillaryData);
    console.log(new Date(+reward.earliestNextAction * 1000).toLocaleString());
    // reward.status = true;
    // reward.step = 0);

    const displayReward = global_tokens.filter((fil) => fil.superToken == reward.rewardToken)[0];
    reward.fundToken = displayReward;
    reward.displayStep = this.calculateStep(reward);

    return reward;
  }

  private _createERC20Instance(ERC: string): Contract {
    return new Contract(ERC, abi_ERC20, this.dapp.signer!);
  }

  private _createSuperTokenInstance(SuperToken: string): Contract {
    return new Contract(SuperToken, abi_SuperToken, this.dapp.signer!);
  }

  async getMemberships(id:string) {
    console.log(id)
    this.graphqlService.watchMemberships(id).pipe(takeUntil(this.destroyHooks)).subscribe( async (data: any) => {
      console.log(data);
      if (data) {
        let localmembership = data.data['userMembership'];

        if (localmembership !== undefined) {
      
          let membership = {... localmembership.reward, ...{ units:localmembership.units}}


            if ( this.toUpdateMembership == undefined) {
           
              this.toUpdateMembership= this.transformRewardObject(membership)

            } else {
              this.toUpdateMembership = { ...this.toUpdateMembership, ...membership, ...{ step: this.calculateStep(membership) } };
            }
            this.currentProposal = prepareDisplayProposal(this.toUpdateMembership!)
        
        } else {
          this.toUpdateMembership = undefined;
        }
      }

      await this.dapp.launchClones(this.toUpdateMembership!.tokenImpl, this.toUpdateMembership!.optimisticOracleImpl, +this.toUpdateMembership!.id)

      await this.superFluidService.getSubscription(this.toUpdateMembership.fundToken.superToken)

      this.store.dispatch(Web3Actions.chainBusy({ status: false}));
      console.log(this.toUpdateMembership)
    });

  

    this.store.dispatch(Web3Actions.chainBusy({ status: false }));
  }

  createPcr() {
    this.router.navigateByUrl('create-pcr');
  }


  override async hookContractConnected(): Promise<void> {
    //this.getTokens();
    this.store.dispatch(Web3Actions.chainBusy({ status: true}));
    const params = this.route.snapshot.params
    console.log(params)
    if (params['id']!== undefined) {
      this.getMemberships(params['id'])
      
    }

    // let pcrAddress = await this.dapp.DAPP_STATE.pcrHostContract?.instance!.getTokensAddressByUserAndId(this.dapp.signerAddress!, 1);

    // if (pcrAddress !== undefined) {
    //   await this.dapp.launchClones(pcrAddress!.tokenContract, pcrAddress!.optimisticOracleContract,1);
    // }
  }
}
