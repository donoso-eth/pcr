import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { DappBaseComponent, DappInjector, global_tokens } from 'angular-web3';
import { utils } from 'ethers';

import { GraphQlService } from 'src/app/dapp-injector/services/graph-ql/graph-ql.service';

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
  valSwitch  = true;



  constructor(
    private router: Router,
    dapp: DappInjector,
    store: Store,
    private graphqlService: GraphQlService
  ) {
    super(dapp, store);
  }

  changeStatus(value:boolean,i:number){
    console.log(i,value)
  }


  async transformTokenObject(token:any){
    token.customAncillaryData = utils.toUtf8String(token.customAncillaryData);
    console.log( new Date(+token.earliestNextAction*1000).toLocaleString())
    token.status = true,
    token.step = 0

    console.log(token)

    const display_token = global_tokens.filter(fil=> fil.superToken == token.rewardToken)[0]
    token.image = display_token.image;
    console.log(display_token)

  }


  async getTokens() {
    const localTokens = (await this.graphqlService.query())['rewards'];

    if (localTokens !== undefined) {
      localTokens.forEach((each: any) => {
        this.transformTokenObject(each)
      });

      this.pcrTokens = localTokens;
    } else {
      this.pcrTokens = [];
    }

    

  }

  createPcr() {
    this.router.navigateByUrl('create-pcr');
  }
  override async hookContractConnected(): Promise<void> {
    this.getTokens();

    let pcrAddress =
      await this.dapp.DAPP_STATE.pcrHostContract?.instance!.getTokensAddressByUserAndId(
        this.dapp.signerAddress!,
        1
      );

    if (pcrAddress !== undefined) {
      await this.dapp.launchClones(
        pcrAddress!.tokenContract,
        pcrAddress!.optimisticOracleContract
      );
    }
  }
}
