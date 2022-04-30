import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OwnedPcrsRoutingModule } from './owned-pcrs-routing.module';
import { OwnedPcrsComponent } from './owned-pcrs.component';


@NgModule({
  declarations: [
    OwnedPcrsComponent
  ],
  imports: [
    CommonModule,
    OwnedPcrsRoutingModule
  ]
})
export class OwnedPcrsModule { }
