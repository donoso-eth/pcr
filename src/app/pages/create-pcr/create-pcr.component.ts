import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-pcr',
  templateUrl: './create-pcr.component.html',
  styleUrls: ['./create-pcr.component.scss'],
})
export class CreatePcrComponent implements OnInit {
  rewardForm: FormGroup;

  tokens = [
    { name: 'DAI', id: 0, image: 'dai' },
    { name: 'DAIx', id: 1, image: 'dai' },
    { name: 'USDCx', id: 1, image: 'usdc' },
    { name: 'USDC', id: 1, image: 'usdc' },
  ];

  intervals = [{name:'hours', id:0},{ name:'days', id:1}, {name:'months', id:2}]

  selectedToken!: { name: string; id: number; image: string };

  display = false;

  constructor(public formBuilder: FormBuilder, private router: Router) {
    this.selectedToken = this.tokens[0];

    this.rewardForm = this.formBuilder.group({
      titleCtrl: ['', [Validators.required, Validators.maxLength(100)]],
      conditionCtrl: ['', [Validators.required, Validators.maxLength(500)]],
      urlCtrl:[],
      tokenCtrl: [{ name: 'DAI', id: 0, image: 'dai' },Validators.required],
      tokenAmountCtrl: [0,[Validators.required,Validators.min(1)]],
      intervalCtrl: [{name:'hours', id:0},[Validators.required]],
      intervalAmountCtrl: [0,[Validators.required,Validators.min(1)]],
    });
  }

  ngOnInit(): void {}

  goTOwned(){
    this.display = false;
    this.router.navigateByUrl('')
  }

  createPcr(){
    this.display = true;
  }

  back() {
    this.router.navigateByUrl('home');
  }
}
