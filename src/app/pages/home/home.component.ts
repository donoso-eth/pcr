import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { DappBaseComponent, DappInjector, global_tokens, Web3Actions } from 'angular-web3';
import { Contract, utils } from 'ethers';
import { takeUntil } from 'rxjs';
import { doSignerTransaction } from 'src/app/dapp-injector/classes/transactor';

import { GraphQlService } from 'src/app/dapp-injector/services/graph-ql/graph-ql.service';
import { abi_ERC20 } from './abis/erc20';
import { abi_SuperToken } from './abis/superToken';

enum REWARD_STEP {
  FUNDING,
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
  pcrTokens!: Array<any>;

  toUpdateToken: any;

  valSwitch = true;
  showFunding = false;

  //// FormControls
  toFundAmountCtrl = new FormControl(0, Validators.required);

  constructor(private router: Router, dapp: DappInjector, store: Store, private graphqlService: GraphQlService) {
    super(dapp, store);
  }

  changeStatus(value: boolean, i: number) {
    console.log(i, value);
  }

  async doFunding(token: any) {
    this.store.dispatch(Web3Actions.chainBusy({ status: true }));
    this.toUpdateToken = token;
    console.log(token);
    const superToken = this._createSuperTokenInstance(this.toUpdateToken.fundToken.superToken);
    const balanceSupertoken = await superToken.realtimeBalanceOfNow(this.dapp.signerAddress);

    this.toUpdateToken.fundToken.superTokenBalance = balanceSupertoken[0].toString();

    this.store.dispatch(Web3Actions.chainBusy({ status: false }));
    this.showFunding = true;
  }

  async fundDeposit() {
    if (this.toFundAmountCtrl.value <= 0) {
      alert('please add a numer');
    }
    this.store.dispatch(Web3Actions.chainBusy({ status: true }));
    await doSignerTransaction(this._createERC20Instance(this.toUpdateToken.fundToken.superToken).approve(this.dapp.DAPP_STATE.pcrOptimisticOracleContract?.address, 50));
    await doSignerTransaction(this.dapp.DAPP_STATE.pcrOptimisticOracleContract?.instance.depositReward(this.toFundAmountCtrl.value)!);

    this.toUpdateToken.currentdeposit = +this.toUpdateToken.currentdeposit + this.toFundAmountCtrl.value;

    this.store.dispatch(Web3Actions.chainBusy({ status: false }));
    this.showFunding = false;
  }
  

 transformTokenObject(token: any) {
   token.displayCustomAncillaryData = utils.toUtf8String(token.customAncillaryData);
    console.log(new Date(+token.earliestNextAction * 1000).toLocaleString());
    // token.status = true;
    // token.step = 0);

    const displayToken = global_tokens.filter((fil) => fil.superToken == token.rewardToken)[0];
    token.fundToken = displayToken;
    return token
  }

  private _createERC20Instance(ERC: string): Contract {
    return new Contract(ERC, abi_ERC20, this.dapp.signer!);
  }

  private _createSuperTokenInstance(SuperToken: string): Contract {
    return new Contract(SuperToken, abi_SuperToken, this.dapp.signer!);
  }

  async getTokens() {
    this.pcrTokens = [];
    this.graphqlService.tokens$.pipe(takeUntil(this.destroyHooks)).subscribe((data: any) => {
      console.log(data)
      if(data){

      const localTokens = data['rewards'];

      if (localTokens !== undefined) {
        localTokens.forEach((each: any) => {
          
          const availableTokenIndex = this.pcrTokens.map(fil=> fil.id).indexOf(each.id)
          if (availableTokenIndex == -1) {
            this.pcrTokens.push(this.transformTokenObject(each));
       
          } else {
            this.pcrTokens[availableTokenIndex]  =  {...this.pcrTokens[availableTokenIndex],...each};
          }

         
        });

   
      } else {
        this.pcrTokens = [];
      }
    }

    console.log(this.pcrTokens)

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
