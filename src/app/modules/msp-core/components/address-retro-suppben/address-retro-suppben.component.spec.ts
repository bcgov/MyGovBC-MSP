import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressRetroSuppbenComponent } from './address-retro-suppben.component';

describe('AddressRetroSuppbenComponent', () => {
  let component: AddressRetroSuppbenComponent;
  let fixture: ComponentFixture<AddressRetroSuppbenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddressRetroSuppbenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressRetroSuppbenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
