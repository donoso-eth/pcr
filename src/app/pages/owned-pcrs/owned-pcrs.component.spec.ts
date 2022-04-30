import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnedPcrsComponent } from './owned-pcrs.component';

describe('OwnedPcrsComponent', () => {
  let component: OwnedPcrsComponent;
  let fixture: ComponentFixture<OwnedPcrsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OwnedPcrsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OwnedPcrsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
