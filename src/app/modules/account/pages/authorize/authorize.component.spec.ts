import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { ProcessService } from '../../../../services/process.service';
import { ContainerService } from 'moh-common-lib';
import { PageStateService } from 'moh-common-lib';
import { MspAccountMaintenanceDataService } from '../../services/msp-account-data.service';
import { MspLogService } from '../../../../services/log.service';
import { AuthorizeComponent } from './authorize.component';
import { FormsModule } from '@angular/forms';

describe('Account AuthorizeComponent', () => {
  let component: AuthorizeComponent;
  let fixture: ComponentFixture<AuthorizeComponent>;

  beforeEach(() => {
    const routerStub = () => ({});
    const processServiceStub = () => ({
      setStep: (processStepNum, arg) => ({})
    });
    const containerServiceStub = () => ({});
    const pageStateServiceStub = () => ({});
    const mspAccountMaintenanceDataServiceStub = () => ({
      getMspAccountApp: () => ({}),
      saveMspAccountApp: () => ({})
    });
    const mspLogServiceStub = () => ({});
    TestBed.configureTestingModule({
      imports: [ FormsModule ],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [AuthorizeComponent],
      providers: [
        { provide: Router, useFactory: routerStub },
        { provide: ProcessService, useFactory: processServiceStub },
        { provide: ContainerService, useFactory: containerServiceStub },
        { provide: PageStateService, useFactory: pageStateServiceStub },
        {
          provide: MspAccountMaintenanceDataService,
          useFactory: mspAccountMaintenanceDataServiceStub
        },
        { provide: MspLogService, useFactory: mspLogServiceStub }
      ]
    });
    fixture = TestBed.createComponent(AuthorizeComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
