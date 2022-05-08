import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProposalDetailComponent } from './proposal-detail/proposal-detail.component';
import { StepsModule } from 'primeng/steps';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';


@NgModule({
  declarations: [
    ProposalDetailComponent
  ],
  imports: [
    CommonModule,
    StepsModule,
    ButtonModule,
    InputNumberModule
  ],
  exports: [
    ProposalDetailComponent
  ]
})
export class ProposalDetailModule { }
