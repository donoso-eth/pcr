import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';

import { TabViewModule } from 'primeng/tabview';

import { ButtonModule } from 'primeng/button';
@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    TabViewModule,
    ButtonModule,
  ]
})
export class HomeModule { }
