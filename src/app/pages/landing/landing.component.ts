import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AngularContract, DappBaseComponent, DappInjector } from 'angular-web3';
import { doSignerTransaction } from 'src/app/dapp-injector/classes/transactor';
import { GraphQlService } from 'src/app/dapp-injector/services/graph-ql/graph-ql.service';
import { PcrHost } from 'src/assets/contracts/interfaces/PcrHost';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
})
export class LandingComponent extends DappBaseComponent {
  contract!: AngularContract<PcrHost>;
  constructor(private router: Router, store: Store, dapp: DappInjector, private graphqlService:GraphQlService) {
    super(dapp, store);
  }

 async  connect() {

  
   // await  doSignerTransaction(this.contract.instance.testEvent(80))
    //this.router.navigate(['home'])
    console.log('que paso');
  }

  async query(){
   const result = await  this.graphqlService.query();
    console.log(result)

  }

  override async hookContractConnected(): Promise<void> {
    this.contract = this.dapp.defaultContract!;
  
    // this.contract.instance.on('RewardDeposit',(args1,args2)=> {
    //     console.log(args1, args2)
    // })

  }
}
