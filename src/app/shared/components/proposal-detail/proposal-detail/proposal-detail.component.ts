import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { calculateStep } from 'src/app/shared/helpers/helpers';
import { IPROPOSAL, REWARD_STEP } from 'src/app/shared/models/pcr';

@Component({
  selector: 'proposal-detail',
  templateUrl: './proposal-detail.component.html',
  styleUrls: ['./proposal-detail.component.scss']
})
export class ProposalDetailComponent implements OnChanges {

  stepItems: { label: string }[];
  activeStep = 0;
  display_step!: REWARD_STEP;
  
  constructor() { 
    this.stepItems = [
      {label: 'Qualifying'},
      {label: 'Propose Period'},
      {label: 'Liveness Period'},
      {label: 'Execution Period'},
  ];
  }
  ngOnChanges(changes: SimpleChanges): void {
     this.display_step = calculateStep(+this.proposal.step,this.proposal.earliestNextAction)
      console.log(this.proposal)
    


    this.activeStep = this.display_step;
    console.log(this.activeStep)


  }

  @Input()  public proposal!: IPROPOSAL;

  @Output() private proposeValue = new EventEmitter<number>();
  @Output() private executeProposal = new EventEmitter();

  doProseValue(value:number){
    this.proposeValue.emit(value)
  }

  doExecuteProposal(){

  }


}
