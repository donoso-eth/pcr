import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OwnedPcrsComponent } from './owned-pcrs.component';

const routes: Routes = [{ path: '', component: OwnedPcrsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OwnedPcrsRoutingModule { }
