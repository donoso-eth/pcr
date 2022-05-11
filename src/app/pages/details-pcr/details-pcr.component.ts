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
  pcrTokens: Array<IPCR_REWARD> = [];

  toUpdateReward: IPCR_REWARD | undefined = undefined;

  valSwitch = true;
  showFundingState = false;
  showIssuingState = false;
  showingUpdateAmount = false;
  showIndexChart = false;
  showDistributionChart = false;
  //// FormControls
  toFundAmountCtrl = new FormControl(0, Validators.required);
  toUpdateAmountCtrl = new FormControl(0, Validators.required);
  toUpgradeAmountCtrl = new FormControl(0, Validators.required);
  toDowngradeAmountCtrl = new FormControl(0, Validators.required);
  adressesCtrl = new FormControl('', [Validators.required, Validators.minLength(32), Validators.maxLength(32)]);
  routeItems: { label: string }[];
  activeStep = 0;
  rewardStatus!:boolean;

  chartData!: any;
  chartOptions: any;
  currentProposal!: IPROPOSAL;
  distributionsChartOptions: any;
  distributionsChartData: any;

  constructor(private cd: ChangeDetectorRef, private router: Router, private route: ActivatedRoute, dapp: DappInjector, store: Store, private graphqlService: GraphQlService) {
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
          reverse: true,
          offset: true,
          ticks: {
            color: '#ebedef',
          },
          grid: {
            color: 'rgba(160, 167, 181, .3)',
          },
        },
        A: {
          id: 'A',
          type: 'linear',
          position: 'left',
          min: 0,
          ticks: {
            beginAtZero: true,
            color: '#ebedef',
            suggestedMin: 0,
            min: 0,
          },
        },
        B: {
          type: 'linear',
          position: 'right',
          display: true,
          min: 0,
          ticks: {
            min: 0,
            beginAtZero: true,
            color: '#00bb7e',
            suggestedMin: 0,
          },
        },

        // y: {
        //   ticks: {
        //     color: '#ebedef',
        //   },
        //   grid: {
        //     color: 'rgba(160, 167, 181, .3)',
        //   },
        // },
      },
    };

    this.distributionsChartOptions = {
      plugins: {
        legend: {
          labels: {
            color: '#ebedef',
          },
        },
      },
      scales: {
        x: {
          reverse: true,
          offset: true,
          display: true,
          ticks: {
            color: '#ebedef',
          },
          grid: {
            color: 'rgba(160, 167, 181, .3)',
          },
        },
        y: {
          id: 'A',
          display: false,
          type: 'linear',
          position: 'left',
          min: 0,
          ticks: {
            beginAtZero: true,
            color: '#ebedef',
            suggestedMin: 0,
            min: 0,
          },
        },

        // y: {
        //   ticks: {
        //     color: '#ebedef',
        //   },
        //   grid: {
        //     color: 'rgba(160, 167, 181, .3)',
        //   },
        // },
      },
    };
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

  async showFunding() {
    this.store.dispatch(Web3Actions.chainBusy({ status: true }));
    await this.refreshBalance()
    this.store.dispatch(Web3Actions.chainBusy({ status: false }));
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
    await doSignerTransaction(
      this._createERC20Instance(this.toUpdateReward!.fundToken.superToken).approve(
        this.dapp.DAPP_STATE.contracts[+this.toUpdateReward!.id]?.pcrOptimisticOracle.address,
        this.toFundAmountCtrl.value
      )
    );
    await doSignerTransaction(this.dapp.DAPP_STATE.contracts[+this.toUpdateReward!.id]?.pcrOptimisticOracle.instance.depositReward(this.toFundAmountCtrl.value)!);

    //this.toUpdateReward!.currentdeposit = +this.toUpdateReward!.currentdeposit + this.toFundAmountCtrl.value;

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

          this.currentProposal = prepareDisplayProposal(this.toUpdateReward!);
        }

     
        this.rewardStatus = this.toUpdateReward?.rewardStatus == '0' ? true : false


        await this.prepareCharts();

        await this.dapp.launchClones(this.toUpdateReward!.tokenImpl, this.toUpdateReward!.optimisticOracleImpl, +this.toUpdateReward!.id);

        this.store.dispatch(Web3Actions.chainBusy({ status: false }));
      });

    this.store.dispatch(Web3Actions.chainBusy({ status: false }));
  }

  async prepareCharts() {
    this.distributionsChartData = {
      labels: [],
      datasets: [
        {
          label: 'KPI evaluation',
          data: [],
          fill: false,
          backgroundColor: '#2f4860',
          borderColor: '#2f4860',
          tension: 0.4,
        },
        {
          label: 'Target',
          data: [],
          fill: false,
          backgroundColor: 'green',
          borderColor: 'green',
          tension: 0.4,
        },
      ],
    };

    ///////// DISTRIBUTIONS SUMMARY
    const dataProposal = await this.graphqlService.queryProposals(this.toUpdateReward!.id);
    console.log(dataProposal);
    if (dataProposal && dataProposal.data) {
      const proposalChart = [];
      const targetChart = [];

      const localProposals = dataProposal.data['proposals'] as Array<any>;
      for (let item of localProposals.filter((fil) => fil.status !== 'Pending')) {
        this.distributionsChartData.labels.push(new Date(item.timeStamp * 1000).toLocaleDateString());
        if (this.toUpdateReward!.priceType == 0) {
          let value = item.status == 'Accepted' ? 1 : 0;
          proposalChart.push(value);
        } else if (this.toUpdateReward!.priceType == 1) {
          proposalChart.push(utils.formatEther(item.priceProposed));
          targetChart.push(utils.formatEther(this.toUpdateReward!.target))
        }
      }
    
     
      if (proposalChart.length > 0){
        this.showDistributionChart = true;
      }
      this.distributionsChartData.datasets[0].data = proposalChart;
      this.distributionsChartData.datasets[1].data =targetChart;
      // this.chartData.datasets[1].data = amountChart;
      this.distributionsChartData = Object.assign({}, this.distributionsChartData);
      // console.log(this.chartData);
    }

    ///////// INDEX SUMMARY

    this.chartData = {
      labels: [],
      datasets: [
        {
          label: 'Index Evolution tokens/unit',
          data: [],
          fill: false,
          backgroundColor: '#2f4860',
          borderColor: '#2f4860',
          tension: 0.4,
          yAxisID: 'A',
        },
        {
          label: 'Reward Total Amount',
          data: [],
          fill: false,
          backgroundColor: '#00bb7e',
          borderColor: '#00bb7e',
          tension: 0.4,
          yAxisID: 'B',
        },
      ],
    };

    const data = await this.graphqlService.queryIndexes(this.toUpdateReward!.id);
    console.log(data);
    if (data) {
      const dataChart = [];
      const amountChart = [];
      const localIndexes = data.data['rewardIndexHistories'] as Array<any>;
      for (let item of localIndexes) {
        this.chartData.labels.push(new Date(item.timeStamp * 1000).toLocaleDateString());
        dataChart.push(+item.index);

        amountChart.push(+item.rewardAmount);
      }
 
     
      if (dataChart.length > 0){
        this.showIndexChart = true;
      }
      this.chartData.datasets[0].data = dataChart;
      this.chartData.datasets[1].data = amountChart;
      this.chartData = Object.assign({}, this.chartData);
      console.log(this.chartData);
    }
    this.cd.detectChanges();
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
