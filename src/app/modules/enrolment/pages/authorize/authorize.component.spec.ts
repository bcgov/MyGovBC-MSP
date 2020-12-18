import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { PageStateService } from '../../../../services/page-state.service';
import { MspLogService } from '../../../../services/log.service';
import { MspApiEnrolmentService } from '../../services/msp-api-enrolment.service';
import { EnrolDataService } from '../../services/enrol-data.service';
import { FormsModule } from '@angular/forms';
import { AuthorizeComponent } from './authorize.component';

describe('Enrolment AuthorizeComponent', () => {
  let component: AuthorizeComponent;
  let fixture: ComponentFixture<AuthorizeComponent>;

  beforeEach(() => {
    const routerStub = () => ({ url: {}, navigate: (array, object) => ({}) });
    const pageStateServiceStub = () => ({
      setPageComplete: (url, pageStatus) => ({}),
      clearCompletePages: pageStatus => ({})
    });
    const mspLogServiceStub = () => ({ log: (object, arg) => ({}) });
    const mspApiEnrolmentServiceStub = () => ({
      sendRequest: mspApplication => ({ then: () => ({ catch: () => ({}) }) })
    });
    const enrolDataServiceStub = () => ({
      pageStatus: {},
      saveApplication: () => ({}),
      removeApplication: () => ({})
    });
    TestBed.configureTestingModule({
      imports: [FormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [AuthorizeComponent],
      providers: [
        { provide: Router, useFactory: routerStub },
        { provide: PageStateService, useFactory: pageStateServiceStub },
        { provide: MspLogService, useFactory: mspLogServiceStub },
        {
          provide: MspApiEnrolmentService,
          useFactory: mspApiEnrolmentServiceStub
        },
        { provide: EnrolDataService, useFactory: enrolDataServiceStub }
      ]
    });
    fixture = TestBed.createComponent(AuthorizeComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
