import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { DappBaseComponent, DappInjector, global_tokens, Web3Actions } from 'angular-web3';
import { Contract, utils } from 'ethers';
import { takeUntil } from 'rxjs';
import { doSignerTransaction } from 'src/app/dapp-injector/classes/transactor';

import { GraphQlService } from 'src/app/dapp-injector/services/graph-ql/graph-ql.service';
import { calculateStep } from 'src/app/shared/helpers/helpers';
import { IPCR_REWARD } from 'src/app/shared/models/pcr';

import { abi_ERC20 } from './abis/erc20';
import { abi_SuperToken } from './abis/superToken';

export enum REWARD_STEP {
  QUALIFYING,
  AWAITING_PROPOSAL,
  LIVENESS_PERIOD,
  AWAITING_EXECUTION,
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent extends DappBaseComponent {
  pcrTokens: Array<IPCR_REWARD> = [];
  pcrMemberships:Array<any> = [];


 
  activeStep = 0;
   constructor(private router: Router, dapp: DappInjector, store: Store, private graphqlService: GraphQlService) {
    super(dapp, store);



  }

  changeStatus(value: boolean, i: number) {
    console.log(i, value);
  }



  goDetailsToken(reward:IPCR_REWARD){
    this.router.navigateByUrl(`details-pcr/${reward.id}`)
  }


  goDetailsMembership(membership:any){
    this.router.navigateByUrl(`details-membership/${membership.id}`)
  }





  transformRewardObject(reward: IPCR_REWARD) {
    console.log();
    // reward.status = true;
    // reward.step = 0);
    reward.displayDate = new Date(+reward.earliestNextAction * 1000).toLocaleString()
    const displayReward = global_tokens.filter((fil) => fil.superToken == reward.rewardToken)[0];
    reward.fundToken = displayReward;
    reward.displayStep = calculateStep(+reward.rewardStep,+reward.earliestNextAction);
    return reward;
  }



  async getTokens() {

    const b = await this.graphqlService.queryIndexes()
    console.log(b);
    this.pcrTokens = [];
    this.pcrMemberships = [];
    const  users = this.graphqlService.queryUser(this.dapp.signerAddress!).pipe(takeUntil(this.destroyHooks)).subscribe((val=> {
      console.log(val)
     
      if (!!val && !!val.data && !!val.data.user) {
        const user = val.data.user;
        const localTokens = user.rewardsCreated;
        if (localTokens !== undefined) {
          localTokens.forEach((each: any) => {
            const availableTokenIndex = this.pcrTokens.map((fil) => fil.id).indexOf(each.id);
            if (availableTokenIndex == -1) {
              this.pcrTokens.push(this.transformRewardObject(each));
            } else {
              this.pcrTokens[availableTokenIndex] = { ...this.pcrTokens[availableTokenIndex], ...each, ...{ step: calculateStep(+each.rewardStep,+each.earliestNextAction) } };
            }
          });
        } else {
          this.pcrTokens = [];
        }


        const localSubscriptions = user.rewardsMembership;
        console.log(localSubscriptions)
        if (localSubscriptions !== undefined) {
          localSubscriptions.forEach((each: any) => {
            const availableSubscriptionIndex = this.pcrMemberships.map((fil) => fil.id).indexOf(each.id);
            if (availableSubscriptionIndex == -1) {
              let membership = {... each.reward, ...{ units:each.units, id:each.id}}
              this.pcrMemberships.push(this.transformRewardObject(membership));
              
            } else {
              let membership = {... each.reward, ...{ units:each.units, id:each.id}}
              this.pcrMemberships[availableSubscriptionIndex] = { ...this.pcrMemberships[availableSubscriptionIndex], ...membership, ...{ step: calculateStep(+membership.rewardStep, + membership.earliestNextAction) }};
            }
          });
        } else {
          this.pcrMemberships = [];
        }

       
      }
   
      console.log(this.pcrMemberships)

    }))
  

 

    this.store.dispatch(Web3Actions.chainBusy({ status: false }));
  }

  createPcr() {
    this.router.navigateByUrl('create-pcr');
  }



  override async hookContractConnected(): Promise<void> {
    console.log(' I am down 127')
    this.getTokens();


  }
}
