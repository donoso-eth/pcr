import { InjectionToken, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DappInjectorModule } from './dapp-injector/dapp-injector.module';
import { StoreModule } from '@ngrx/store';
import { we3ReducerFunction } from 'angular-web3';

import { AppTopBarComponent } from './shared/components/toolbar/app.topbar.component';

import { AppMenuComponent } from './shared/components/menu/app.menu.component';
import { AppMenuitemComponent } from './shared/components/menu/app.menuitem.component';
import { ConfigService } from './shared/services/app.config.service';
import { MenuService } from './shared/services/app.menu.service';
import { AppFooterComponent } from './shared/components/footer/app.footer.component';
import { ProductService } from './shared/services/productservice';

import { TableModule } from 'primeng/table';
import { MenuModule } from 'primeng/menu';
import { ChartModule} from 'primeng/chart'
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GraphQlModule } from './dapp-injector/services/graph-ql/graph-ql.module';

import PcrHostMetadata from '../assets/contracts/pcr_host_metadata.json';
import { ICONTRACT_METADATA } from 'angular-web3';
export const contractMetadata = new InjectionToken<ICONTRACT_METADATA>('contractMetadata')

export const contractProvider= {provide: 'contractMetadata', useValue:PcrHostMetadata };

@NgModule({
  declarations: [
    AppComponent,

    AppTopBarComponent,
    AppMenuComponent,
    AppMenuitemComponent,
    AppFooterComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    DappInjectorModule.forRoot({wallet:'local', defaultNetwork:'localhost'}),
    StoreModule.forRoot({web3: we3ReducerFunction}),
    GraphQlModule.forRoot({uri:"http://localhost:8000/subgraphs/name/angular-web3/pcr"})

  ],
  providers: [ConfigService, MenuService, ProductService,contractProvider],
  bootstrap: [AppComponent]
})
export class AppModule { }
