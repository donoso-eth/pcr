import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { PrimeNGConfig } from 'primeng/api';
import { DappBaseComponent } from './dapp-injector/classes';
import { DappInjector } from './dapp-injector/dapp-injector.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent extends DappBaseComponent implements OnInit {
  title = 'pcr';
  constructor(private primengConfig: PrimeNGConfig, dapp: DappInjector, store: Store, private router:Router) {
    super(dapp, store);
  
  }

  // override async hookForceDisconnect(): Promise<void> {
  //   console.log('force dis')
  //   this.router.navigateByUrl('landing')
  // }

 

  ngOnInit() {
    this.primengConfig.ripple = true;
    document.documentElement.style.fontSize = '20px';
  }
}
