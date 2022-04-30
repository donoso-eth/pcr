import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AppConfig } from '../models/appconfig';


@Injectable()
export class ConfigService {

    config: AppConfig = {
        theme: 'lara-dark-teal',
        dark: true,
        inputStyle: 'outlined',
        ripple: true
    };

    private configUpdate = new Subject<AppConfig>();

    configUpdate$ = this.configUpdate.asObservable();

    updateConfig(config: AppConfig) {
        this.config = config;
        this.configUpdate.next(config);
    }

    getConfig() {
        return this.config;
    }
}
