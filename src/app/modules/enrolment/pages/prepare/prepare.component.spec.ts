import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { PageStateService } from '../../../../services/page-state.service';
import { EnrolDataService } from '../../services/enrol-data.service';
import { FormsModule, NgForm } from '@angular/forms';
import { PrepareComponent } from './prepare.component';
import { MspConsentModalComponent } from '../../../msp-core/components/consent-modal/consent-modal.component';
import { ConsentModalComponent } from 'moh-common-lib';
import { ModalModule } from 'ngx-bootstrap/modal';
import { HttpClient, HttpClientModule } from '@angular/common/http';

describe('PrepareComponent', () => {
  let component: PrepareComponent;
  let fixture: ComponentFixture<PrepareComponent>;
  beforeEach(async(() => {
    const routerStub = () => ({});
    const pageStateServiceStub = () => ({ setPageIncomplete: () => {}} );
    const enrolDataServiceStub = () => ({ application: {}, saveApplication: () => ({}) });
    TestBed.configureTestingModule({
      imports: [ModalModule.forRoot(), HttpClientModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [PrepareComponent, MspConsentModalComponent, ConsentModalComponent, NgForm],
      providers: [
        { provide: Router, useFactory: routerStub },
        { provide: PageStateService, useFactory: pageStateServiceStub },
        { provide: EnrolDataService, useFactory: enrolDataServiceStub }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrepareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
