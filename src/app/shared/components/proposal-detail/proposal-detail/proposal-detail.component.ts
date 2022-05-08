import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { calculateStep } from 'src/app/shared/helpers/helpers';
import { IPROPOSAL } from 'src/app/shared/models/pcr';

@Component({
  selector: 'proposal-detail',
  templateUrl: './proposal-detail.component.html',
  styleUrls: ['./proposal-detail.component.scss']
})
export class ProposalDetailComponent implements OnChanges {

  stepItems: { label: string }[];
  activeStep = 0;
  constructor() { 
    this.stepItems = [
      {label: 'Qualifying'},
      {label: 'Propose Period'},
      {label: 'Liveness Period'},
      {label: 'Execution Period'},
  ];
  }
  ngOnChanges(changes: SimpleChanges): void {
      let step = calculateStep(+this.proposal.step,this.proposal.startExecutionPeriod)
      console.log(this.proposal)
      console.log(step)
  }

  @Input()  public proposal!: IPROPOSAL;

  @Output() private proposeValue = new EventEmitter<any>();
  @Output() private executeProposal = new EventEmitter();

  doProseValue(){
    this.proposeValue.emit('')
  }

  doExecuteProposal(){

  }


}
