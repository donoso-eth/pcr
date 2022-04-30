import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

import { Subscription } from 'rxjs';
import { AppConfig, Product } from 'src/app/shared/models/appconfig';
import { ConfigService } from 'src/app/shared/services/app.config.service';
import { ProductService } from 'src/app/shared/services/productservice';

 
@Component({
    templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {

    items: MenuItem[] = [];

    products: Product[] = [];

    chartData: any;

    chartOptions: any;

    subscription: Subscription = new Subscription;

    config!: AppConfig;

    constructor(private productService: ProductService, public configService: ConfigService) {}

    ngOnInit() {
        this.config = this.configService.config;
        this.subscription = this.configService.configUpdate$.subscribe((config:AppConfig) => {
            this.config = config;
            this.updateChartOptions();
        });
        this.productService.getProductsSmall().then((data:any) => this.products = data);
          
        this.items = [
            {label: 'Add New', icon: 'pi pi-fw pi-plus'},
            {label: 'Remove', icon: 'pi pi-fw pi-minus'}
        ];

        this.chartData = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'First Dataset',
                    data: [65, 59, 80, 81, 56, 55, 40],
                    fill: false,
                    backgroundColor: '#2f4860',
                    borderColor: '#2f4860',
                    tension: .4
                },
                {
                    label: 'Second Dataset',
                    data: [28, 48, 40, 19, 86, 27, 90],
                    fill: false,
                    backgroundColor: '#00bb7e',
                    borderColor: '#00bb7e',
                    tension: .4
                }
            ]
        };
    }

    updateChartOptions() {
        if (this.config.dark)
            this.applyDarkTheme();
        else
            this.applyLightTheme();

    }

    applyDarkTheme() {
        this.chartOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: '#ebedef'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#ebedef'
                    },
                    grid: {
                        color:  'rgba(160, 167, 181, .3)',
                    }
                },
                y: {
                    ticks: {
                        color: '#ebedef'
                    },
                    grid: {
                        color:  'rgba(160, 167, 181, .3)',
                    }
                },
            }
        };
    }

    applyLightTheme() {
            this.chartOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: '#495057'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color:  '#ebedef',
                    }
                },
                y: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color:  '#ebedef',
                    }
                },
            }
        };
    }
}
