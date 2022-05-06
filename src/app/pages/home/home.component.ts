import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { DappBaseComponent, DappInjector, global_tokens, Web3Actions } from 'angular-web3';
import { Contract, utils } from 'ethers';
import { takeUntil } from 'rxjs';
import { doSignerTransaction } from 'src/app/dapp-injector/classes/transactor';

import { GraphQlService } from 'src/app/dapp-injector/services/graph-ql/graph-ql.service';
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

  toUpdateReward!: IPCR_REWARD;

  valSwitch = true;
  showFunding = false;

  //// FormControls
  toFundAmountCtrl = new FormControl(0, Validators.required);
  routeItems: { label: string }[];

  activeStep = 0;

  constructor(private router: Router, dapp: DappInjector, store: Store, private graphqlService: GraphQlService) {
    super(dapp, store);
    this.routeItems = [
      {label: 'Qualifying'},
      {label: 'Propose Period'},
      {label: 'Liveness Period'},
      {label: 'Execution Period'},
  ];
  }

  changeStatus(value: boolean, i: number) {
    console.log(i, value);
  }

  async doFunding(reward:IPCR_REWARD) {
    this.store.dispatch(Web3Actions.chainBusy({ status: true }));
    this.toUpdateReward = reward;

    const superToken = this._createSuperTokenInstance(this.toUpdateReward.fundToken.superToken);
    const balanceSupertoken = await superToken.realtimeBalanceOfNow(this.dapp.signerAddress);

    this.toUpdateReward.fundToken.superTokenBalance = balanceSupertoken[0].toString();

    this.store.dispatch(Web3Actions.chainBusy({ status: false }));
    this.showFunding = true;
  }

  async doPropose(reward:IPCR_REWARD){
    this.store.dispatch(Web3Actions.chainBusy({ status: true }));
    await doSignerTransaction(this.dapp.DAPP_STATE.pcrOptimisticOracleContract?.instance.proposeDistribution(1)!);

  }

  async fundDeposit() {
    if (this.toFundAmountCtrl.value <= 0) {
      alert('please add a numer');
    }
    this.store.dispatch(Web3Actions.chainBusy({ status: true }));
    await doSignerTransaction(this._createERC20Instance(this.toUpdateReward.fundToken.superToken).approve(this.dapp.DAPP_STATE.pcrOptimisticOracleContract?.address, 50));
    await doSignerTransaction(this.dapp.DAPP_STATE.pcrOptimisticOracleContract?.instance.depositReward(this.toFundAmountCtrl.value)!);

    this.toUpdateReward.currentdeposit = +this.toUpdateReward.currentdeposit + this.toFundAmountCtrl.value;

    this.store.dispatch(Web3Actions.chainBusy({ status: false }));
    this.showFunding = false;
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

  async getTokens() {

    const proposals = await this.graphqlService.query()
    console.log(proposals)

    this.graphqlService.tokens$.pipe(takeUntil(this.destroyHooks)).subscribe((data: any) => {
      console.log(data);
      if (data) {
        const localTokens = data['rewards'];

        if (localTokens !== undefined) {
          localTokens.forEach((each: any) => {
            const availableTokenIndex = this.pcrTokens.map((fil) => fil.id).indexOf(each.id);
            if (availableTokenIndex == -1) {
              this.pcrTokens.push(this.transformRewardObject(each));
            } else {
              this.pcrTokens[availableTokenIndex] = { ...this.pcrTokens[availableTokenIndex], ...each, ...{ step: this.calculateStep(each) } };
            }
          });
        } else {
          this.pcrTokens = [];
        }
      }
      this.store.dispatch(Web3Actions.chainBusy({ status: false}));
      console.log(this.pcrTokens);
    });

    this.graphqlService.watchTokens();

    this.store.dispatch(Web3Actions.chainBusy({ status: false }));
  }

  createPcr() {
    this.router.navigateByUrl('create-pcr');
  }

  override async hookContractConnected(): Promise<void> {
    this.getTokens();

    let pcrAddress = await this.dapp.DAPP_STATE.pcrHostContract?.instance!.getTokensAddressByUserAndId(this.dapp.signerAddress!, 1);

    if (pcrAddress !== undefined) {
      await this.dapp.launchClones(pcrAddress!.tokenContract, pcrAddress!.optimisticOracleContract);
    }
  }
}
