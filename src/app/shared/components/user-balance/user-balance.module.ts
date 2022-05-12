import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserBalanceComponent } from './user-balance/user-balance.component';



@NgModule({
  declarations: [
    UserBalanceComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    UserBalanceComponent
  ]
})
export class UserBalanceModule { }
