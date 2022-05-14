import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { DappBaseComponent, DappInjector, global_tokens, Web3Actions } from 'angular-web3';
import { Contract, utils } from 'ethers';
import { takeUntil } from 'rxjs';
import { doSignerTransaction } from 'src/app/dapp-injector/classes/transactor';

import { GraphQlService } from 'src/app/dapp-injector/services/graph-ql/graph-ql.service';
import { calculateStep, createDisplayDescription, createERC20Instance, createSuperTokenInstance, isAddress, prepareDisplayProposal } from 'src/app/shared/helpers/helpers';
import { IPCR_REWARD, IPROPOSAL } from 'src/app/shared/models/pcr';



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
  showBulkIssuingState = false

  //// FormControls
  toFundAmountCtrl = new FormControl(0, Validators.required);
  toUpdateAmountCtrl = new FormControl(0, Validators.required);
  toUpgradeAmountCtrl = new FormControl(0, Validators.required);
  toDowngradeAmountCtrl = new FormControl(0, Validators.required);
  adressesCtrl = new FormControl('', [Validators.required, Validators.minLength(42), Validators.maxLength(42)]);
  bulkAdressesCtrl = new FormControl('', [Validators.required]);
  routeItems: { label: string }[];
  activeStep = 0;
  rewardStatus!:boolean;

  currentProposal!: IPROPOSAL;



  chartConfig!:{id:string, priceType:number, target:number }


  constructor(private cd: ChangeDetectorRef, private router: Router, private route: ActivatedRoute, dapp: DappInjector, store: Store, private graphqlService: GraphQlService) {
    super(dapp, store);
    this.routeItems = [{ label: 'Qualifying' }, { label: 'Propose Period' }, { label: 'Liveness Period' }, { label: 'Execution Period' }];

  }

  back (){
    this.router.navigateByUrl('home')
  }


  async changeStatus(value: boolean) {
    this.store.dispatch(Web3Actions.chainBusy({ status: true }));
    await doSignerTransaction(this.dapp.DAPP_STATE.contracts[+this.toUpdateReward!.id]?.pcrOptimisticOracle.instance.switchRewardStatus());
   // this.store.dispatch(Web3Actions.chainBusy({ status: false }));
   

  }


  async refreshBalance(){
    const superToken = createSuperTokenInstance(this.toUpdateReward!.fundToken.superToken, this.dapp.signer!);
    const balanceSupertoken = await superToken.realtimeBalanceOfNow(this.dapp.signerAddress);

    this.toUpdateReward!.fundToken.superTokenBalance = (+utils.formatEther(balanceSupertoken[0])).toFixed(4);

    const rewardToken = createERC20Instance(this.toUpdateReward!.fundToken.rewardToken, this.dapp.signer!);
    const balanceRewardToken = await rewardToken.balanceOf(this.dapp.signerAddress);

    this.toUpdateReward!.fundToken.rewardTokenBalance = (+utils.formatEther(balanceRewardToken)).toFixed(4);
    this.store.dispatch(Web3Actions.chainBusy({ status: false}));
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



  async doFunding() {
    if (this.toFundAmountCtrl.value <= 0) {
      alert('please add a numer');
      return
    }
    this.store.dispatch(Web3Actions.chainBusy({ status: true }));
    const value = utils.parseEther(this.toFundAmountCtrl.value.toString())
    await doSignerTransaction(
      createERC20Instance(this.toUpdateReward!.fundToken.superToken,this.dapp.signer!).approve(
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
  
    if (this.toUpdateAmountCtrl.value <= 0) {
      alert('please onput a positive value');
      return;
    }
   
 
    const newAmount = utils.parseEther(this.toUpdateAmountCtrl.value.toString());

    this.store.dispatch(Web3Actions.chainBusy({ status: true }));
    await doSignerTransaction(this.dapp.DAPP_STATE.contracts[+this.toUpdateReward!.id]?.pcrOptimisticOracle.instance.updateRewardAmount(newAmount));
    this.showingUpdateAmount = false;
    //this.store.dispatch(Web3Actions.chainBusy({ status: false }));
   
  }

  showAddMembers(reward: IPCR_REWARD) {
    this.showIssuingState = true;
  }

  
  async doAddMember() {
    console.log(this.adressesCtrl.invalid)
    if (this.adressesCtrl.invalid) {
      alert('please add and adresse');
      return
    }

    if (isAddress(this.adressesCtrl.value) == false){
      alert('addresse is not valid');
      return
    }

    this.store.dispatch(Web3Actions.chainBusy({ status: true }));
    await doSignerTransaction(this.dapp.DAPP_STATE.contracts[+this.toUpdateReward!.id]?.pcrToken?.instance.issue(this.adressesCtrl.value, 1)!);
    this.showIssuingState = true;
  }


  showBulkAddMembers(reward: IPCR_REWARD) {
    this.showBulkIssuingState = true;
  }

  async doBulkAddMembers() {
    if (this.bulkAdressesCtrl.invalid) {
      alert('please add and adresse');
    }

    let addresses:Array<string> = this.bulkAdressesCtrl.value.split(",")
  

    for (const checkAddress of addresses) {
      if (isAddress(checkAddress) == false){
        alert(`Address ${checkAddress} is not valid`)
        return
      }
    }
 

    this.store.dispatch(Web3Actions.chainBusy({ status: true }));
    await doSignerTransaction(this.dapp.DAPP_STATE.contracts[+this.toUpdateReward!.id]?.pcrToken?.instance.bulkIssue(addresses, 1)!);
    this.showBulkIssuingState = false;
  }


  async proposeValue(value: number) {
    this.store.dispatch(Web3Actions.chainBusy({ status: true }));

    const answer = utils.parseEther(value.toString());

    await doSignerTransaction(this.dapp.DAPP_STATE.contracts[+this.toUpdateReward!.id]?.pcrOptimisticOracle.instance.proposeDistribution(answer)!);
  }

  async disputeProposal(){
    this.store.dispatch(Web3Actions.chainBusy({ status: true }));
    await doSignerTransaction(this.dapp.DAPP_STATE.contracts[+this.toUpdateReward!.id]?.pcrOptimisticOracle.instance.disputeDistribution()!);

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
      await this.refreshBalance()
    } catch (error) {
      console.log(error);
      this.store.dispatch(Web3Actions.chainBusy({ status: false }));
    }
  }

  transformRewardObject(reward: IPCR_REWARD) {

 
      reward.displayDescription = createDisplayDescription(reward)


    const displayReward = global_tokens.filter((fil) => fil.superToken == reward.rewardToken)[0];
    reward.fundToken = displayReward;
    reward.displayStep = calculateStep(+reward.rewardStep, reward.earliestNextAction);
    reward.displayTargetCondition = utils.formatEther(reward.target)
    return reward;
  }


  refresh(){
    this.getTokens(this.toUpdateReward!.id)
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


  }



}
