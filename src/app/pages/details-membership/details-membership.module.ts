import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DetailsMembershipRoutingModule } from './details-membership-routing.module';
import { DetailsMembershipComponent } from './details-membership.component';

import { TabViewModule } from 'primeng/tabview';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputSwitchModule } from 'primeng/inputswitch';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { StepsModule } from 'primeng/steps';
import { ChartModule } from 'primeng/chart';

@NgModule({
  declarations: [
    DetailsMembershipComponent
  ],
  imports: [
    CommonModule,
    DetailsMembershipRoutingModule,
    FormsModule,
    ReactiveFormsModule,

    TabViewModule,
    ButtonModule,
    InputTextModule, 
    InputNumberModule,
    InputTextareaModule,
    InputSwitchModule,
    DialogModule,
    StepsModule,
    ChartModule
  ]
})
export class DetailsMembershipModule{ }
