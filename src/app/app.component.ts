import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'pcr';
  constructor(private primengConfig: PrimeNGConfig){}

  ngOnInit() {
    this.primengConfig.ripple = true;
    document.documentElement.style.fontSize = '20px';
}
}
