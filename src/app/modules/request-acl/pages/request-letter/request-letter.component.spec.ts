import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderService } from '../../../../services/header.service';
import { AclDataService } from '../../services/acl-data.service';
import { MspLogService } from '../../../../services/log.service';
import { AclApiService } from '../../services/acl-api.service';
import { FormsModule } from '@angular/forms';
import { RequestLetterComponent } from './request-letter.component';
import { environment } from '../../../../../environments/environment';

describe('RequestLetterComponent', () => {
  let component: RequestLetterComponent;
  let fixture: ComponentFixture<RequestLetterComponent>;

  beforeEach(async(() => {
    const changeDetectorRefStub = () => ({ detectChanges: () => ({}) });
    const routerStub = () => ({ url: {} });
    const headerServiceStub = () => ({ setTitle: string => ({}) });
    const aclDataServiceStub = () => ({
      application: { infoCollectionAgreement: {} },
      saveApplication: () => ({}),
      removeApplication: () => ({})
    });
    const mspLogServiceStub = () => ({ log: (object, string) => ({}) });
    const aclApiServiceStub = () => ({
      sendAclRequest: application => ({ subscribe: f => f({}) }),
      sendSpaEnvServer: arg => ({ subscribe: f => f({}) })
    });
    TestBed.configureTestingModule({
      imports: [FormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [RequestLetterComponent],
      providers: [
        { provide: ChangeDetectorRef, useFactory: changeDetectorRefStub },
        { provide: Router, useFactory: routerStub },
        { provide: HeaderService, useFactory: headerServiceStub },
        { provide: AclDataService, useFactory: aclDataServiceStub },
        { provide: MspLogService, useFactory: mspLogServiceStub },
        { provide: AclApiService, useFactory: aclApiServiceStub }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`should have the default loading value`, () => {
    expect(component.loading).toEqual(false);
  });

  it(`should have the default captchaApiBaseUrl value`, () => {
    expect(component.captchaApiBaseUrl).toEqual(
      environment.appConstants.captchaApiBaseUrl
    );
  });

  it(`should have the default showCaptcha value`, () => {
    expect(component.showCaptcha).toEqual(false);
  });

  describe('ngOnInit', () => {
    it('makes expected call', () => {
      const mspLogServiceStub: MspLogService = fixture.debugElement.injector.get(
        MspLogService
      );
      spyOn(mspLogServiceStub, 'log').and.callThrough();
      component.ngOnInit();
      expect(mspLogServiceStub.log).toHaveBeenCalled();
    });
  });
});
