import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProposalDetailComponent } from './proposal-detail/proposal-detail.component';
import { StepsModule } from 'primeng/steps';


@NgModule({
  declarations: [
    ProposalDetailComponent
  ],
  imports: [
    CommonModule,
    StepsModule
  ],
  exports: [
    ProposalDetailComponent
  ]
})
export class ProposalDetailModule { }
