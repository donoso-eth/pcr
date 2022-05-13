import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { utils } from 'ethers';

import {
  DappBaseComponent,
  DappInjector,
  global_address,
  Web3Actions,
} from 'angular-web3';
import {
  IDAINPUTStruct,
  OPTIMISTICORACLEINPUTStruct,
  PCRHOSTCONFIGINPUTStruct,
} from 'src/assets/contracts/interfaces/PcrHost';
import { doSignerTransaction } from 'src/app/dapp-injector/classes/transactor';
import { Store } from '@ngrx/store';
import { Description } from '@ethersproject/properties';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-create-pcr',
  templateUrl: './create-pcr.component.html',
  styleUrls: ['./create-pcr.component.scss'],
})
export class CreatePcrComponent extends DappBaseComponent  {
  rewardForm: FormGroup;

  conditions = [
    { name: 'Greater Than', code: 'GT', id:0  },
    { name: 'Greater Than Equal', code: 'GTE',id:1 },
    { name: 'Equal', code: 'E',id:2  },
    { name: 'Less Than Equal', code: 'LTE',id:3  },
    { name: 'Less Than', code: 'LT',id:4  },
  ];

  rewardTypes = [
    { Condition: 'Is the question True?', code: 'YES_OR_NO_QUERY', id:0 },
    { Condition: 'KPI with Target', code: 'YES_OR_NO_QUERY', id:1 },
  ];

  tokens = [
    {
      name: 'DAI',
      id: 0,
      image: 'dai',
      rewardToken: global_address.kovan.fDai,
      superToken: global_address.kovan.fDaix,
    },
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

  selectedToken!: { name: string; id: number; image: string };

  display = false; 

  constructor(
    private msg: MessageService,
    public formBuilder: FormBuilder,
    private router: Router,
    dapp: DappInjector,
    store: Store
  ) {
    super(dapp, store);
    this.selectedToken = this.tokens[0];

    this.rewardForm = this.formBuilder.group({
      titleCtrl: [
        'Follow Increase',
        [Validators.required, Validators.maxLength(100)],
      ],
      questionCtrl: [
        'Does Our Twitter followers increase 5%',
        [Validators.required, Validators.maxLength(500)],
      ],
      urlCtrl: [''],

      rewardTypeCtrl: [
        { Condition: 'Is the question True?', code: 'YES_OR_NO_QUERY', id:0 },
        [Validators.required],
      ],

      conditionTypeCtrl: [
        { name: 'Equal', code: 'E' , id:2},
        [Validators.required],
      ],
      targetAmountCtrl: [1, [Validators.required, Validators.min(1)]],


      tokenCtrl: [
        {
          name: 'DAI',
          id: 0,
          image: 'dai',
          rewardToken: global_address.kovan.fDai,
          superToken: global_address.kovan.fDaix,
        },
        Validators.required,
      ],
      tokenAmountCtrl: [10, [Validators.required, Validators.min(1)]],
      intervalCtrl: [
        { name: 'minutes', id: 0, factor: 60 },
        [Validators.required],
      ],
      intervalAmountCtrl: [10, [Validators.required, Validators.min(1)]],
      livenessCtrl: [
        { name: 'minutes', id: 0, factor: 60 },
        [Validators.required],
      ],
      livenessAmountCtrl: [10, [Validators.required, Validators.min(1)]],
    });
  }

 

  goHome() {
    this.display = false;
    this.router.navigateByUrl('home');
  }

  async createPcr() {
    //

    const question = this.rewardForm.controls.titleCtrl.value;
    const description = this.rewardForm.controls.questionCtrl.value;
    const customAncillaryData = utils.hexlify(
      utils.toUtf8Bytes(
        `q: title: ${question}?,description:${description}. res_data: p1: 0, p2: 1, p3: 0.5. Where p2 corresponds to Yes, p1 to a No, p3 to unknown`
      )
    );

    const rewardConfig: PCRHOSTCONFIGINPUTStruct = {
      title: this.rewardForm.controls.titleCtrl.value,
      url: this.rewardForm.controls.urlCtrl.value,
      pcrTokenImpl: this.dapp.tokenImpl,
      pcrOptimisticOracleImpl: this.dapp.optimisticOracleImpl,
    };

    /// PriceIdentifier for ortimistic oracle
    const priceIdentifier = utils.formatBytes32String('YES_OR_NO_QUERY');

    let condition = this.rewardForm.controls.conditionTypeCtrl.value.id
    let priceType= 0;
    let target;
    if (this.rewardForm.controls.rewardTypeCtrl.value.id == 0) {
        target = utils.parseEther("1")
        condition = 2;
    } else {
      target = utils.parseEther(this.rewardForm.controls.targetAmountCtrl.value.toString())
      priceType = 1;
    }

   


    const OptimisticOracle: OPTIMISTICORACLEINPUTStruct = {
      finder: global_address.kovan.finder,
      rewardAmount: utils.parseEther(this.rewardForm.controls.tokenAmountCtrl.value.toString()),
      target: target,
      priceType,
      targetCondition: condition,
      interval:
        this.rewardForm.controls.intervalAmountCtrl.value *
        this.rewardForm.controls.intervalCtrl.value.factor,
      optimisticOracleLivenessTime:  this.rewardForm.controls.livenessAmountCtrl.value *
      this.rewardForm.controls.livenessCtrl.value.factor,
      customAncillaryData,
      priceIdentifier,
    };

    const Ida: IDAINPUTStruct = {
      host: global_address.kovan.host,
      ida: global_address.kovan.ida,
      rewardToken: this.rewardForm.controls.tokenCtrl.value.superToken,
    };

 
    this.store.dispatch(Web3Actions.chainBusy({ status: true }));

   const result =  await doSignerTransaction(
      this.dapp.pcrHostContract?.instance.createPcrReward(
        rewardConfig,
        Ida,
        OptimisticOracle
      )!
    );
    if (result.success == true){
    this.store.dispatch(Web3Actions.chainBusy({ status: false }));
    this.display = true;
    } else {
      this.msg.add({key: 'tst', severity: 'danger', summary: 'OOPS', detail: 'Error creating the pcd'});
    }
  }

  back() {
    this.router.navigateByUrl('home');
  }
}
