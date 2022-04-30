import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';
import { AppConfig } from '../../models/appconfig';
import { ConfigService } from '../../services/app.config.service';



@Component({
    selector: 'app-config',
    templateUrl: './app.config.component.html'
})
export class AppConfigComponent implements OnInit, OnDestroy {

    scale: number = 14;

    scales: any[] = [12, 13, 14, 15, 16];

    config!: AppConfig;

    subscription!: Subscription;

    constructor( public configService: ConfigService) { }

    ngOnInit() {
        this.config = this.configService.config;
        this.subscription = this.configService.configUpdate$.subscribe(config => {
            this.config = config;
            this.scale = 14;

            this.applyScale();
        });
    }

    // onConfigButtonClick(event:any) {
    //     this.appMain.configActive = !this.appMain.configActive;
    //     this.appMain.configClick = true;
    //     event.preventDefault();
    // }

    incrementScale() {
        this.scale++;
        this.applyScale();
    }

    decrementScale() {
        this.scale--;
        this.applyScale();
    }

    applyScale() {
        document.documentElement.style.fontSize = this.scale + 'px';
    }


    onInputStyleChange() {
        this.configService.updateConfig(this.config);
    }

    changeTheme(theme:string, dark:boolean){
        let themeElement = document.getElementById('theme-css');
        themeElement!.setAttribute('href', 'assets/theme/' + theme + '/theme.css');
        this.configService.updateConfig({...this.config, ...{theme, dark}});
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}