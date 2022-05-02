import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { DappBaseComponent, DappInjector } from 'angular-web3';
import { utils } from 'ethers';

import { GraphQlService } from 'src/app/dapp-injector/services/graph-ql/graph-ql.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent extends DappBaseComponent {

  pcrTokens!:Array<any>;

  constructor(private router: Router, dapp:DappInjector, store:Store, private graphqlService:GraphQlService) {
    super(dapp,store)
   
   }

   async getTokens() {
    const localTokens= (await  this.graphqlService.query())['rewards'];
    console.log(this.pcrTokens)

    localTokens.forEach((each:any)=> {
      each.customAncillaryData =  utils.toUtf8String((each.customAncillaryData))
    })

    this.pcrTokens = localTokens;

   }



  createPcr(){
    this.router.navigateByUrl('create-pcr')
  }
  override async hookContractConnected(): Promise<void> {
      
    this.getTokens()

    let pcrAddress = await this.dapp.DAPP_STATE.pcrHostContract?.instance!.getTokensAddressByUserAndId(
      this.dapp.signerAddress!,
      1
    );

   if (pcrAddress !== undefined){
    await this.dapp.launchClones(pcrAddress!.tokenContract,pcrAddress!.optimisticOracleContract)
   }
  }

}
