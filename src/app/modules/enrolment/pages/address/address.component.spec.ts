import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { PageStateService } from '../../../../services/page-state.service';
import { EnrolDataService } from '../../services/enrol-data.service';
import { FormsModule } from '@angular/forms';
import { EnrolAddressComponent } from './address.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MspLogService } from '../../../../services/log.service';

describe('EnrolAddressComponent', () => {
  let component: EnrolAddressComponent;
  let fixture: ComponentFixture<EnrolAddressComponent>;
  beforeEach(() => {
    const routerStub = () => ({});
    const pageStateServiceStub = () => ({setPageIncomplete: () => {}});
    const enrolDataServiceStub = () => ({ application: {}});
    const mspLogServiceStub = () => ({ log: () => {} });
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        HttpClientTestingModule
      ],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [EnrolAddressComponent],
      providers: [
        { provide: Router, useFactory: routerStub },
        { provide: PageStateService, useFactory: pageStateServiceStub },
        { provide: EnrolDataService, useFactory: enrolDataServiceStub },
        { provide: MspLogService, useFactory: mspLogServiceStub }
      ]
    });
    fixture = TestBed.createComponent(EnrolAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
