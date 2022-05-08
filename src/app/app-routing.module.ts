import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'landing', pathMatch: 'full' },
  { path: 'dashboard', loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardModule) },
  { path: 'home', loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule) },
  { path: 'landing', loadChildren: () => import('./pages/landing/landing.module').then(m => m.LandingModule) },
  { path: 'create-pcr', loadChildren: () => import('./pages/create-pcr/create-pcr.module').then(m => m.CreatePcrModule) },
  { path: 'details-pcr', loadChildren: () => import('./pages/details-pcr/details-pcr.module').then(m => m.DetailsPcrModule) },
  { path: 'details-membership', loadChildren: () => import('./pages/details-membership/details-membership.module').then(m => m.DetailsMembershipModule) },
  { path: 'created-pcrs', loadChildren: () => import('./pages/owned-pcrs/owned-pcrs.module').then(m => m.OwnedPcrsModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
