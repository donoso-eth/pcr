import { InjectionToken, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DappInjectorModule } from './dapp-injector/dapp-injector.module';
import { StoreModule } from '@ngrx/store';
import { we3ReducerFunction } from 'angular-web3';

import { AppTopBarComponent } from './shared/components/toolbar/app.topbar.component';


import { AppFooterComponent } from './shared/components/footer/app.footer.component';

import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GraphQlModule } from './dapp-injector/services/graph-ql/graph-ql.module';

import PcrHostMetadata from '../assets/contracts/pcr_host_metadata.json';
import { ICONTRACT_METADATA } from 'angular-web3';
import { LoadingComponent } from './shared/components/loading/loading.component';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
export const contractMetadata = new InjectionToken<ICONTRACT_METADATA>('contractMetadata')

export const contractProvider= {provide: 'contractMetadata', useValue:PcrHostMetadata };

@NgModule({
  declarations: [
    AppComponent,

   LoadingComponent,

    AppTopBarComponent,
    AppFooterComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    DappInjectorModule.forRoot({wallet:'wallet', defaultNetwork:'kovan'}),
    StoreModule.forRoot({web3: we3ReducerFunction}),
    //GraphQlModule.forRoot({uri:"http://localhost:8000/subgraphs/name/donoso-eth/perpetual-conditional-reward"}),
    GraphQlModule.forRoot({uri:"https://api.thegraph.com/subgraphs/name/donoso-eth/perpetual-conditional-reward"}),

    DropdownModule,
    ProgressSpinnerModule,
    ToastModule,
    ButtonModule
  ],
  providers: [contractProvider,  MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
