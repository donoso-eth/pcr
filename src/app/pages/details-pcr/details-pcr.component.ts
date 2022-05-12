import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { DappBaseComponent, DappInjector, global_tokens, Web3Actions } from 'angular-web3';
import { Contract, utils } from 'ethers';
import { takeUntil } from 'rxjs';
import { doSignerTransaction } from 'src/app/dapp-injector/classes/transactor';

import { GraphQlService } from 'src/app/dapp-injector/services/graph-ql/graph-ql.service';
import { calculateStep, prepareDisplayProposal } from 'src/app/shared/helpers/helpers';
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
  selector: 'details-pcr',
  templateUrl: './details-pcr.component.html',
  styleUrls: ['./details-pcr.component.scss'],
})
export class DetailsPcrComponent extends DappBaseComponent {

  utils = utils;

  toUpdateReward: IPCR_REWARD | undefined = undefined;

  valSwitch = true;
  showFundingState = false;
  showIssuingState = false;
  showingUpdateAmount = false;
  showTransferState = false;
  //// FormControls
  toFundAmountCtrl = new FormControl(0, Validators.required);
  toUpdateAmountCtrl = new FormControl(0, Validators.required);
  toUpgradeAmountCtrl = new FormControl(0, Validators.required);
  toDowngradeAmountCtrl = new FormControl(0, Validators.required);
  adressesCtrl = new FormControl('', [Validators.required, Validators.minLength(32), Validators.maxLength(32)]);
  routeItems: { label: string }[];
  activeStep = 0;
  rewardStatus!:boolean;

  currentProposal!: IPROPOSAL;



  chartConfig!:{id:string, priceType:number, target:number }


  constructor(private cd: ChangeDetectorRef, private router: Router, private route: ActivatedRoute, dapp: DappInjector, store: Store, private graphqlService: GraphQlService) {
    super(dapp, store);
    this.routeItems = [{ label: 'Qualifying' }, { label: 'Propose Period' }, { label: 'Liveness Period' }, { label: 'Execution Period' }];

  }

  async changeStatus(value: boolean) {
    this.store.dispatch(Web3Actions.chainBusy({ status: true }));
    await doSignerTransaction(this.dapp.DAPP_STATE.contracts[+this.toUpdateReward!.id]?.pcrOptimisticOracle.instance.switchRewardStatus());
   // this.store.dispatch(Web3Actions.chainBusy({ status: false }));
   

  }


  async refreshBalance(){
    const superToken = this._createSuperTokenInstance(this.toUpdateReward!.fundToken.superToken);
    const balanceSupertoken = await superToken.realtimeBalanceOfNow(this.dapp.signerAddress);

    this.toUpdateReward!.fundToken.superTokenBalance = (+utils.formatEther(balanceSupertoken[0])).toFixed(4);

    const rewardToken = this._createERC20Instance(this.toUpdateReward!.fundToken.rewardToken);
    const balanceRewardToken = await rewardToken.balanceOf(this.dapp.signerAddress);

    this.toUpdateReward!.fundToken.rewardTokenBalance = (+utils.formatEther(balanceRewardToken)).toFixed(4);

  }

  showTransfer(){
    this.showTransferState = true;
  }

  async showFunding() {
    // this.store.dispatch(Web3Actions.chainBusy({ status: true }));
    // await this.refreshBalance()
    // this.store.dispatch(Web3Actions.chainBusy({ status: false }));
    this.showFundingState = true;
  }

  async doUpgrade() {
    if (this.toUpgradeAmountCtrl.value <= 0) {
      alert('please add Amount to Upgrade');
      return
    }
    this.store.dispatch(Web3Actions.chainBusy({ status: true }));
    const value = utils.parseEther(this.toUpgradeAmountCtrl.value.toString())

    await doSignerTransaction(
      this._createERC20Instance(this.toUpdateReward!.fundToken.rewardToken).approve(
        this.toUpdateReward!.fundToken.superToken
        ,
        value
      )
    );

    const superToken = this._createSuperTokenInstance(this.toUpdateReward!.fundToken.superToken);
    await doSignerTransaction(superToken.upgrade(value));

    await this.refreshBalance()
    this.store.dispatch(Web3Actions.chainBusy({ status: false }));

  }

  async doDowngrade() {
    if (this.toDowngradeAmountCtrl.value <= 0) {
      alert('please add Aount to Upgrade');
      return
    }
    this.store.dispatch(Web3Actions.chainBusy({ status: true }));
    const value = utils.parseEther(this.toDowngradeAmountCtrl.value.toString())

    const superToken = this._createSuperTokenInstance(this.toUpdateReward!.fundToken.superToken);
    await doSignerTransaction(superToken.downgrade(value));

    await this.refreshBalance()
    this.store.dispatch(Web3Actions.chainBusy({ status: false }));
  }

  async doFunding() {
    if (this.toFundAmountCtrl.value <= 0) {
      alert('please add a numer');
      return
    }
    this.store.dispatch(Web3Actions.chainBusy({ status: true }));
    const value = utils.parseEther(this.toFundAmountCtrl.value.toString())
    await doSignerTransaction(
      this._createERC20Instance(this.toUpdateReward!.fundToken.superToken).approve(
        this.dapp.DAPP_STATE.contracts[+this.toUpdateReward!.id]?.pcrOptimisticOracle.address,
        value
      )
    );
    await doSignerTransaction(this.dapp.DAPP_STATE.contracts[+this.toUpdateReward!.id]?.pcrOptimisticOracle.instance.depositReward(value)!);

    //this.toUpdateReward!.currentdeposit = +this.toUpdateReward!.currentdeposit + this.toFundAmountCtrl.value;

    await this.refreshBalance()

    // this.store.dispatch(Web3Actions.chainBusy({ status: false }));
    this.showFundingState = false;
  }

  showUpdateRewardAmount() {
    this.showingUpdateAmount = true;
  }

  async doUpdateRewardAmount() {
    const newAmount = this.toUpdateAmountCtrl.value;
    if (newAmount <= 0) {
      alert('please onput a positive value');
      return;
    }
    this.showingUpdateAmount = false;
 
    this.store.dispatch(Web3Actions.chainBusy({ status: true }));
    await doSignerTransaction(this.dapp.DAPP_STATE.contracts[+this.toUpdateReward!.id]?.pcrOptimisticOracle.instance.updateRewardAmount(newAmount));
    this.store.dispatch(Web3Actions.chainBusy({ status: false }));
   
  }

  showAddMembers(reward: IPCR_REWARD) {
    this.showIssuingState = true;
  }

  async doAddMember(reward: IPCR_REWARD) {
    if (this.adressesCtrl.value.invalid) {
      alert('please add and adresse');
    }

    this.store.dispatch(Web3Actions.chainBusy({ status: true }));
    await doSignerTransaction(this.dapp.DAPP_STATE.contracts[+reward.id]?.pcrToken?.instance.issue(this.adressesCtrl.value, 1)!);
    this.showIssuingState = true;
  }

  async proposeValue(value: number) {
    this.store.dispatch(Web3Actions.chainBusy({ status: true }));

    const answer = utils.parseEther(value.toString());

    await doSignerTransaction(this.dapp.DAPP_STATE.contracts[+this.toUpdateReward!.id]?.pcrOptimisticOracle.instance.proposeDistribution(answer)!);
  }

  async executeProposal() {
    /// TO dO CHAEK IF CURRENT DEPOSIT and ISSUER MEMBERs
    if (+this.toUpdateReward!.rewardAmount > +this.toUpdateReward!.currentdeposit) {
      alert('Please Fund The Deposit');
      return;
    }

    if (+this.toUpdateReward!.unitsIssued <= 0) {
      alert('No members yet');
      return;
    }
    this.store.dispatch(Web3Actions.chainBusy({ status: true }));

    this.dapp.DAPP_STATE.contracts[+this.toUpdateReward!.id]?.pcrOptimisticOracle.instance.on('ProposalRejected', (pcrId, proposalId, newProposalId) => {
      if (proposalId.toString() == this.currentProposal.id && pcrId.toString() == this.currentProposal.rewardId) {
        this.store.dispatch(Web3Actions.chainBusy({ status: false }));
      }
    });

    this.dapp.DAPP_STATE.contracts[+this.toUpdateReward!.id]?.pcrOptimisticOracle.instance.on('ProposalAcceptedAndDistribuition', (pcrId, proposalId, newProposalId) => {
      if (proposalId.toString() == this.currentProposal.id && pcrId.toString() == this.currentProposal.rewardId) {
        this.store.dispatch(Web3Actions.chainBusy({ status: false }));
      }
   
    });

    try {
      const tx = await doSignerTransaction(this.dapp.DAPP_STATE.contracts[+this.toUpdateReward!.id]?.pcrOptimisticOracle.instance.executeDistribution());
    } catch (error) {
      console.log(error);
      this.store.dispatch(Web3Actions.chainBusy({ status: false }));
    }
  }

  transformRewardObject(reward: IPCR_REWARD) {
    reward.displayCustomAncillaryData = utils
      .toUtf8String(reward.customAncillaryData)
      .replace(`q: title: `, '')
      .replace(', p1: 0, p2: 1, p3: 0.5. Where p2 corresponds to YES, p1 to a NO, p3 to unknown', '');

    const displayReward = global_tokens.filter((fil) => fil.superToken == reward.rewardToken)[0];
    reward.fundToken = displayReward;
    reward.displayStep = calculateStep(+reward.rewardStep, reward.earliestNextAction);
    reward.displayTargetCondition = utils.formatEther(reward.target)
    return reward;
  }


  async getTokens(id: string) {
    this.graphqlService
      .watchTokens(id)
      .pipe(takeUntil(this.destroyHooks))
      .subscribe(async (data: any) => {
        if (data) {
          const localReward = data.data['reward'];
      

          if (localReward !== undefined) {
            if (this.toUpdateReward == undefined) {
              this.toUpdateReward = this.transformRewardObject(localReward);
            } else {
              this.toUpdateReward = {
                ...this.toUpdateReward,
                ...localReward,
                ...{
                  displayTargetCondition :utils.formatEther(localReward.target),
                  step: calculateStep(localReward.rewardStep, localReward.earliestNextAction),
                },
              };
            }
          } else {
            this.toUpdateReward = undefined;
          }
          await this.refreshBalance()

          this.currentProposal = prepareDisplayProposal(this.toUpdateReward!);
        }

        console.log(this.toUpdateReward)
     
     
        this.rewardStatus = this.toUpdateReward?.rewardStatus == '0' ? true : false


     

        this.chartConfig = { id: this.toUpdateReward?.id!, priceType:+this.toUpdateReward?.priceType!,target:+this.toUpdateReward?.target! }


        await this.dapp.launchClones(this.toUpdateReward!.tokenImpl, this.toUpdateReward!.optimisticOracleImpl, +this.toUpdateReward!.id);

        this.store.dispatch(Web3Actions.chainBusy({ status: false }));
      });

    this.store.dispatch(Web3Actions.chainBusy({ status: false }));
  }


  createPcr() {
    this.router.navigateByUrl('create-pcr');
  }

  override async hookContractConnected(): Promise<void> {
    //this.getTokens();
    this.store.dispatch(Web3Actions.chainBusy({ status: true }));
    const params = this.route.snapshot.params;

    if (params['id'] !== undefined) {
      this.getTokens(params['id']);
    }

    // let pcrAddress = await this.dapp.DAPP_STATE.pcrHostContract?.instance!.getTokensAddressByUserAndId(this.dapp.signerAddress!, 1);

    // if (pcrAddress !== undefined) {
    //   await this.dapp.launchClones(pcrAddress!.tokenContract, pcrAddress!.optimisticOracleContract,1);
    // }
  }

  ////////PRIVATE 

  private _createERC20Instance(ERC: string): Contract {
    return new Contract(ERC, abi_ERC20, this.dapp.signer!);
  }

  private _createSuperTokenInstance(SuperToken: string): Contract {
    return new Contract(SuperToken, abi_SuperToken, this.dapp.signer!);
  }

}
