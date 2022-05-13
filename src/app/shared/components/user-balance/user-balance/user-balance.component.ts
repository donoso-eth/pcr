import { Component, Input, OnChanges, Output, SimpleChanges, EventEmitter } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { DappInjector, Web3Actions } from 'angular-web3';
import { Contract, utils } from 'ethers';
import { doSignerTransaction } from 'src/app/dapp-injector/classes/transactor';

import { IFUND_TOKEN } from 'src/app/shared/models/pcr';
import { abi_ERC20 } from '../abis/erc20';
import { abi_SuperToken } from '../abis/superToken';




@Component({
  selector: 'user-balance',
  templateUrl: './user-balance.component.html',
  styleUrls: ['./user-balance.component.scss']
})
export class UserBalanceComponent implements OnChanges {

  showTransferState = false;
  toUpgradeAmountCtrl = new FormControl(0, Validators.required);
  toDowngradeAmountCtrl = new FormControl(0, Validators.required);
  constructor(private store: Store, private dapp:DappInjector) { }
  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.fundToken)
  }

  @Input() fundToken!: IFUND_TOKEN;
  @Output() refreshEvent = new EventEmitter()

  showTransfer(){
    this.showTransferState = true;
  }

  async doUpgrade() {
    if (this.toUpgradeAmountCtrl.value <= 0) {
      alert('please add Amount to Upgrade');
      return
    }
    this.store.dispatch(Web3Actions.chainBusy({ status: true }));
    const value = utils.parseEther(this.toUpgradeAmountCtrl.value.toString())

    await doSignerTransaction(
      this._createERC20Instance(this.fundToken.rewardToken).approve(
        this.fundToken.superToken
        ,
        value
      )
    );

    const superToken = this._createSuperTokenInstance(this.fundToken.superToken);
    await doSignerTransaction(superToken.upgrade(value));

    await this.refreshEvent.emit();
  

  }

  async doDowngrade() {
    if (this.toDowngradeAmountCtrl.value <= 0) {
      alert('please add Aount to Upgrade');
      return
    }
    this.store.dispatch(Web3Actions.chainBusy({ status: true }));
    const value = utils.parseEther(this.toDowngradeAmountCtrl.value.toString())
    console.log(value.toString())
    console.log(this.fundToken)
    const superToken = this._createSuperTokenInstance(this.fundToken.superToken);

    const balance = await superToken.realtimeBalanceOfNow(this.dapp.signerAddress!)
    console.log(balance[0].toString())

    await doSignerTransaction(superToken.downgrade(value));

    await this.refreshEvent.emit()

  }


    ////////PRIVATE 

    private _createERC20Instance(ERC: string): Contract {
      return new Contract(ERC, abi_ERC20, this.dapp.signer!);
    }
  
    private _createSuperTokenInstance(SuperToken: string): Contract {
      return new Contract(SuperToken, abi_SuperToken, this.dapp.signer!);
    }

}
