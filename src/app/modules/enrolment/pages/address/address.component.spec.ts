import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { PageStateService } from '../../../../services/page-state.service';
import { EnrolDataService } from '../../services/enrol-data.service';
import { FormsModule } from '@angular/forms';
import { EnrolAddressComponent } from './address.component';

describe('EnrolAddressComponent', () => {
  let component: EnrolAddressComponent;
  let fixture: ComponentFixture<EnrolAddressComponent>;
  beforeEach(() => {
    const routerStub = () => ({});
    const pageStateServiceStub = () => ({});
    const enrolDataServiceStub = () => ({});
    TestBed.configureTestingModule({
      imports: [FormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [EnrolAddressComponent],
      providers: [
        { provide: Router, useFactory: routerStub },
        { provide: PageStateService, useFactory: pageStateServiceStub },
        { provide: EnrolDataService, useFactory: enrolDataServiceStub }
      ]
    });
    fixture = TestBed.createComponent(EnrolAddressComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
