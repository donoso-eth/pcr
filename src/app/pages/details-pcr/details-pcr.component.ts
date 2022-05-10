import { Component, OnInit } from '@angular/core';
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
  pcrTokens: Array<IPCR_REWARD> = [];

  toUpdateReward: IPCR_REWARD | undefined = undefined;

  valSwitch = true;
  showFundingState = false;
  showIssuingState = false;

  //// FormControls
  toFundAmountCtrl = new FormControl(0, Validators.required);
  toUpgradeAmountCtrl = new FormControl(0, Validators.required);
  toDowngradeAmountCtrl = new FormControl(0, Validators.required);
  adressesCtrl = new FormControl('', [Validators.required, Validators.minLength(32), Validators.maxLength(32)]);
  routeItems: { label: string }[];
  activeStep = 0;

  chartData: { labels: string[]; datasets: { label: string; data: number[]; fill: boolean; backgroundColor: string; borderColor: string; tension: number }[] };
  chartOptions: any;
  currentProposal!: IPROPOSAL;
  constructor(private router: Router, private route: ActivatedRoute, dapp: DappInjector, store: Store, private graphqlService: GraphQlService) {
    super(dapp, store);
    this.routeItems = [{ label: 'Qualifying' }, { label: 'Propose Period' }, { label: 'Liveness Period' }, { label: 'Execution Period' }];
    this.chartOptions = {
      plugins: {
        legend: {
          labels: {
            color: '#ebedef',
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: '#ebedef',
          },
          grid: {
            color: 'rgba(160, 167, 181, .3)',
          },
        },
        y: {
          ticks: {
            color: '#ebedef',
          },
          grid: {
            color: 'rgba(160, 167, 181, .3)',
          },
        },
      },
    };
    this.chartData = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'First Dataset',
          data: [65, 59, 80, 81, 56, 55, 40],
          fill: false,
          backgroundColor: '#2f4860',
          borderColor: '#2f4860',
          tension: 0.4,
        },
        {
          label: 'Second Dataset',
          data: [28, 48, 40, 19, 86, 27, 90],
          fill: false,
          backgroundColor: '#00bb7e',
          borderColor: '#00bb7e',
          tension: 0.4,
        },
      ],
    };
  }

  changeStatus(value: boolean) {
    console.log(value);
  }

  async showFunding(reward: IPCR_REWARD) {
    this.store.dispatch(Web3Actions.chainBusy({ status: true }));

    const superToken = this._createSuperTokenInstance(this.toUpdateReward!.fundToken.superToken);
    const balanceSupertoken = await superToken.realtimeBalanceOfNow(this.dapp.signerAddress);

    this.toUpdateReward!.fundToken.superTokenBalance = balanceSupertoken[0].toString();

    const rewardToken = this._createERC20Instance(this.toUpdateReward!.fundToken.rewardToken);
    const balanceRewardToken = await rewardToken.balanceOf(this.dapp.signerAddress);

    this.toUpdateReward!.fundToken.rewardTokenBalance = balanceRewardToken;

    this.store.dispatch(Web3Actions.chainBusy({ status: false }));
    this.showFundingState = true;
  }

  async doUpgrade(){
    if (this.toDowngradeAmountCtrl.value <= 0) {
      alert('please add Aount to Upgrade');
    }
  }

  async doDowngrade(){
    if (this.toUpgradeAmountCtrl.value <= 0) {
      alert('please add Aount to Upgrade');
    }
  }


  async doFunding() {
    if (this.toFundAmountCtrl.value <= 0) {
      alert('please add a numer');
    }
    this.store.dispatch(Web3Actions.chainBusy({ status: true }));
    await doSignerTransaction(
      this._createERC20Instance(this.toUpdateReward!.fundToken.superToken).approve(this.dapp.DAPP_STATE.contracts[+this.toUpdateReward!.id]?.pcrOptimisticOracle.address, 50)
    );
    await doSignerTransaction(this.dapp.DAPP_STATE.contracts[+this.toUpdateReward!.id]?.pcrOptimisticOracle.instance.depositReward(this.toFundAmountCtrl.value)!);

    this.toUpdateReward!.currentdeposit = +this.toUpdateReward!.currentdeposit + this.toFundAmountCtrl.value;

    this.store.dispatch(Web3Actions.chainBusy({ status: false }));
    this.showFundingState = false;
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

  async proposeValue(value:number) {
    this.store.dispatch(Web3Actions.chainBusy({ status: true }));

    const answer = utils.parseEther(value.toString())

    await doSignerTransaction(this.dapp.DAPP_STATE.contracts[+this.toUpdateReward!.id]?.pcrOptimisticOracle.instance.proposeDistribution(answer)!);
  }

async executeProposal(){
    /// TO dO CHAEK IF CURRENT DEPOSIT and ISSUER MEMBERs
  if (+this.toUpdateReward!.rewardAmount > +this.toUpdateReward!.currentdeposit) {
    alert("Please Fund The Deposit")
    return;
  }

  if (+this.toUpdateReward!.unitsIssued <= 0) {
    alert("No members yet")
    return;
  }
  this.store.dispatch(Web3Actions.chainBusy({ status: true }));

  

  this.dapp.DAPP_STATE.contracts[+this.toUpdateReward!.id]?.pcrOptimisticOracle.instance.on("ProposalRejected", (pcrId, proposalId, newProposalId) => {
    console.log(pcrId.toString(),proposalId.toString(),"NOOP")
    if (proposalId.toString() == this.currentProposal.id && pcrId.toString() == this.currentProposal.rewardId) {
      console.log(pcrId,proposalId,"NOOP")
      this.store.dispatch(Web3Actions.chainBusy({ status: false }));
    }

   
  })

  this.dapp.DAPP_STATE.contracts[+this.toUpdateReward!.id]?.pcrOptimisticOracle.instance.on("ProposalAcceptedAndDistribuition", (pcrId, proposalId, newProposalId) => {

    if (proposalId.toString() == this.currentProposal.id && pcrId.toString() == this.currentProposal.rewardId) {
      console.log(pcrId.toString(),proposalId.toString(),"YES")
      this.store.dispatch(Web3Actions.chainBusy({ status: false }));
    }
    this.store.dispatch(Web3Actions.chainBusy({ status: false }));
  })


  try {
    const tx = await doSignerTransaction(this.dapp.DAPP_STATE.contracts[+this.toUpdateReward!.id]?.pcrOptimisticOracle.instance.executeDistribution());

  } catch (error) {
    console.log(error)
    this.store.dispatch(Web3Actions.chainBusy({ status: false }));
  }

 

}


  transformRewardObject(reward: IPCR_REWARD) {
    reward.displayCustomAncillaryData = (utils.toUtf8String(reward.customAncillaryData)).replace(`q: title: `,'').replace(', p1: 0, p2: 1, p3: 0.5. Where p2 corresponds to YES, p1 to a NO, p3 to unknown','');
    console.log(new Date(+reward.earliestNextAction * 1000).toLocaleString());
    // reward.status = true;
    // reward.step = 0);

    const displayReward = global_tokens.filter((fil) => fil.superToken == reward.rewardToken)[0];
    reward.fundToken = displayReward;
    reward.displayStep = calculateStep(+reward.rewardStep, reward.earliestNextAction);
    return reward;
  }

  private _createERC20Instance(ERC: string): Contract {
    return new Contract(ERC, abi_ERC20, this.dapp.signer!);
  }

  private _createSuperTokenInstance(SuperToken: string): Contract {
    return new Contract(SuperToken, abi_SuperToken, this.dapp.signer!);
  }

  async getTokens(id: string) {
    this.graphqlService
      .watchTokens(id)
      .pipe(takeUntil(this.destroyHooks))
      .subscribe(async (data: any) => {
        console.log(data);
        if (data) {
          const localReward = data.data['reward'];

          if (localReward !== undefined) {
            if (this.toUpdateReward == undefined) {
              this.toUpdateReward = this.transformRewardObject(localReward);
            } else {
              this.toUpdateReward = {
                 ...this.toUpdateReward, ...localReward, 
                ...{ 
                  step: calculateStep(localReward.rewardStep, localReward.earliestNextAction) }
               };
            }
          } else {
            this.toUpdateReward = undefined;
          }

          this.currentProposal = prepareDisplayProposal(this.toUpdateReward!)

        }

        await this.dapp.launchClones(this.toUpdateReward!.tokenImpl, this.toUpdateReward!.optimisticOracleImpl, +this.toUpdateReward!.id);

        this.store.dispatch(Web3Actions.chainBusy({ status: false }));
        console.log(this.toUpdateReward);
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
    console.log(params);
    if (params['id'] !== undefined) {
      this.getTokens(params['id']);
    }

    // let pcrAddress = await this.dapp.DAPP_STATE.pcrHostContract?.instance!.getTokensAddressByUserAndId(this.dapp.signerAddress!, 1);

    // if (pcrAddress !== undefined) {
    //   await this.dapp.launchClones(pcrAddress!.tokenContract, pcrAddress!.optimisticOracleContract,1);
    // }
  }
}
