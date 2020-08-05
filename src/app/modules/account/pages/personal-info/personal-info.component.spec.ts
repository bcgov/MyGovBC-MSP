import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MspAccountMaintenanceDataService } from '../../services/msp-account-data.service';
import { ContainerService } from 'moh-common-lib';
import { PageStateService } from 'moh-common-lib';
import { ProcessService } from '../../../../services/process.service';
import { AccountPersonalInfoComponent } from './personal-info.component'; 

describe('AccountPersonalInfoComponent', () => {
  let component: AccountPersonalInfoComponent;
  let fixture: ComponentFixture<AccountPersonalInfoComponent>;
  beforeEach(() => {
    const routerStub = () => ({});
    const mspAccountMaintenanceDataServiceStub = () => ({
      accountApp: {
        accountChangeOptions: {},
        applicant: {},
        isUniquePhnsInPI: {}
      },
      saveMspAccountApp: () => ({}),
      getMspAccountApp: () => ({
        accountChangeOptions: { statusUpdate: {} },
        hasAnyVisitorInApplication: () => false
      })
    });

    const containerServiceStub = () => ({});
    const pageStateServiceStub = () => ({});
    const processServiceStub = () => ({
      getStepNumber: () => 3,
      setStep: (processStepNum, arg) => ({})
    });

    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [AccountPersonalInfoComponent],
      providers: [
        { provide: Router, useFactory: routerStub },
        {
          provide: MspAccountMaintenanceDataService,
          useFactory: mspAccountMaintenanceDataServiceStub
        },
        { provide: ContainerService, useFactory: containerServiceStub },
        { provide: PageStateService, useFactory: pageStateServiceStub },
        { provide: ProcessService, useFactory: processServiceStub }
      ],
      imports: [
        FormsModule
      ]
    });
    fixture = TestBed.createComponent(AccountPersonalInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have an invalid status by default', () => {
    expect(component.hasAnyInvalidStatus()).toBe(false, 'should have hasAnyInvalidStatus false on init');
});
});
