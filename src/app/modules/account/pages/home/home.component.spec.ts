import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { PageStateService } from 'moh-common-lib';
import { MspAccountMaintenanceDataService } from '../../services/msp-account-data.service';
import { HeaderService } from '../../../../services/header.service';
import { MspApiAccountService } from '../../services/msp-api-account.service';
import { MspLogService } from '../../../../services/log.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HomeComponent } from './home.component';
import { ApiResponse } from 'app/models/api-response.interface';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(() => {
    const pageStateServiceStub = () => ({ setPageComplete: () => ({}) });
    const mspAccountMaintenanceDataServiceStub = () => ({
      getMspAccountApp: () => ({}),
      saveMspAccountApp: () => ({})
    });
    const headerServiceStub = () => ({ setTitle: string => ({}) });
    const mspApiAccountServiceStub = () => ({
      sendChangeAddressApplication: (mspAccountApp): Promise<ApiResponse> => {
        return new Promise((res, rej) => {
          return res({op_return_code: 'SUCCESS', op_technical_error: '', dbErrorMessage: '', op_reference_number: '', req_num: ''})
        })
      }
    });
    const mspLogServiceStub = () => ({ log: (object, arg) => ({}) });
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [HomeComponent],
      providers: [
        { provide: PageStateService, useFactory: pageStateServiceStub },
        {
          provide: MspAccountMaintenanceDataService,
          useFactory: mspAccountMaintenanceDataServiceStub
        },
        { provide: HeaderService, useFactory: headerServiceStub },
        { provide: MspApiAccountService, useFactory: mspApiAccountServiceStub },
        { provide: MspLogService, useFactory: mspLogServiceStub }
      ]
    });
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('continue', () => {
    it('should call sendChangeAddressApplication when addressAppSent is false', () => {
      const mspApiAccountServiceStub: MspApiAccountService = fixture.debugElement.injector.get(MspApiAccountService);
      spyOn(mspApiAccountServiceStub, 'sendChangeAddressApplication').and.callThrough();
      component.continue();
      expect(mspApiAccountServiceStub.sendChangeAddressApplication).toHaveBeenCalled();
    });

    it('should not call sendChangeAddressApplication when addressAppSent is true', () => {
      const mspApiAccountServiceStub: MspApiAccountService = fixture.debugElement.injector.get(MspApiAccountService);
      spyOn(mspApiAccountServiceStub, 'sendChangeAddressApplication').and.callThrough();
      component.addressAppSent = true;
      component.continue();
      expect(mspApiAccountServiceStub.sendChangeAddressApplication).not.toHaveBeenCalled();
    });
  });
});
