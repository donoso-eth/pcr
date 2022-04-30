import { Component, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';
import { MenuItem } from 'primeng/api';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent {

    items!: MenuItem[];

    constructor() { }

    toggleMenu(val:any) {
        
    }

    toggleTopMenu(val:any) {

    }
}
