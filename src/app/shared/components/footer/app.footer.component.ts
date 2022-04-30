import { Component } from '@angular/core';
import { AppConfig } from '../../models/appconfig';
import { ConfigService } from '../../services/app.config.service';


@Component({
    selector: 'app-footer',
    templateUrl: './app.footer.component.html'
})
export class AppFooterComponent{
    config: AppConfig;
    constructor(private configService:ConfigService) {
        this.config = this.configService.config;
    }
}
