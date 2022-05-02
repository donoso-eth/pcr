import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { utils } from 'ethers';

import {DappBaseComponent, DappInjector, global_address, Web3Actions} from 'angular-web3'
import { IDAINPUTStruct, OPTIMISTICORACLEINPUTStruct, PCRHOSTCONFIGINPUTStruct } from 'src/assets/contracts/interfaces/PcrHost';
import { timeStamp } from 'console';
import { doSignerTransaction } from 'src/app/dapp-injector/classes/transactor';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-create-pcr',
  templateUrl: './create-pcr.component.html',
  styleUrls: ['./create-pcr.component.scss'],
})
export class CreatePcrComponent extends DappBaseComponent implements OnInit {
  rewardForm: FormGroup;

  tokens = [
    { name: 'DAI', id: 0, image: 'dai', rewardToken:global_address.kovan.fDai, superToken:global_address.kovan.fDaix },
   // { name: 'DAIx', id: 1, image: 'dai', rewardToken:global_address.kovan.fDaix,superToken:global_address.kovan.fDaix  },
    // { name: 'USDCx', id: 2, image: 'usdc' },
    // { name: 'USDC', id: 3, image: 'usdc' },
  ];
  /// intervals for pcr reward checking, factor interval in sec
  intervals = [
    { name: 'minutes', id: 0, factor: 60 },
    { name: 'hours', id: 1, factor: 3600 },
    { name: 'days', id: 2, factor: 86400 },
    { name: 'months', id: 3, factor: 2592000 },
  ];


  /// PriceIdentifier for ortimistic oracle
  priceIdentifier = utils.formatBytes32String('YES_OR_NO_QUERY');

  selectedToken!: { name: string; id: number; image: string };

  display = false;

  constructor(public formBuilder: FormBuilder, private router: Router, dapp:DappInjector, store:Store) {
    super(dapp,store)
    this.selectedToken = this.tokens[0];

    this.rewardForm = this.formBuilder.group({
      titleCtrl: [
        'Follow Increase',
        [Validators.required, Validators.maxLength(100)],
      ],
      conditionCtrl: [
        'Does Our Twitter followers increase 5%',
        [Validators.required, Validators.maxLength(500)],
      ],
      urlCtrl: [''],
      tokenCtrl: [{ name: 'DAI', id: 0, image: 'dai', rewardToken:global_address.kovan.fDai, superToken:global_address.kovan.fDaix }, Validators.required],
      tokenAmountCtrl: [10, [Validators.required, Validators.min(1)]],
      intervalCtrl: [{ name: 'hours', id: 1, factor: 3600  }, [Validators.required]],
      intervalAmountCtrl: [1, [Validators.required, Validators.min(1)]],
      livelinessCtrl: [{ name: 'hours', id: 1, factor: 3600  }, [Validators.required]],
      livelinessAmountCtrl: [1, [Validators.required, Validators.min(1)]],
    });
  }


  ngOnInit(): void {}

  goTOwned() {
    this.display = false;
    this.router.navigateByUrl('');
  }

  async createPcr() {
  // 

    const question = this.rewardForm.controls.conditionCtrl.value

    const customAncillaryData= utils.hexlify(utils.toUtf8Bytes(
      `q: title: ${question}?, p1: 0, p2: 1, p3: 0.5. Where p2 corresponds to YES, p1 to a NO, p3 to unknown`
    ))


      const rewardConfig:PCRHOSTCONFIGINPUTStruct = {
        title: this.rewardForm.controls.titleCtrl.value,
        url: this.rewardForm.controls.urlCtrl.value,
        pcrTokenImpl: this.dapp.tokenImpl,
        pcrOptimisticOracleImpl: this.dapp.optimisticOracleImpl
      }

    const OptimisticOracle: OPTIMISTICORACLEINPUTStruct = {
      finder: global_address.kovan.finder,
      rewardAmount: this.rewardForm.controls.tokenAmountCtrl.value,
      interval: this.rewardForm.controls.intervalAmountCtrl.value * this.rewardForm.controls.intervalCtrl.value.factor,
      optimisticOracleLivenessTime: 36000,
      customAncillaryData,
      priceIdentifier:this.priceIdentifier,
    };
  
    const Ida: IDAINPUTStruct = {
      host: global_address.kovan.host,
      ida: global_address.kovan.ida,
      rewardToken:this.rewardForm.controls.tokenCtrl.value.superToken ,
    };


    this.store.dispatch(Web3Actions.chainBusy({ status: true }));

    await doSignerTransaction(this.dapp.pcrHostContract?.instance.createPcrReward(rewardConfig,Ida,OptimisticOracle)!)

    this.display = true;

  }

  back() {
    this.router.navigateByUrl('home');
  }
}
