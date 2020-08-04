import { async, TestBed } from '@angular/core/testing';
import { LocalStorageService, ILocalStorageServiceConfig, INotifyOptions } from 'angular-2-local-storage';
import { BenefitApplication } from '../models/benefit-application.model';
import { BenefitApplicationDto } from '../models/benefit-application.dto';
import { MspBenefitDataService } from './msp-benefit-data.service';
import { MspDataService } from '../../../services/msp-data.service';

const localStorageConfig: ILocalStorageServiceConfig = {
  notifyOptions: {setItem: true, removeItem: true},
  prefix: '',
  storageType: 'localStorage'
}

describe('MspBenefitDataService', () => {
  let service: MspBenefitDataService;
  beforeEach(() => {
    const localStorageServiceStub = () => (new LocalStorageService(localStorageConfig));

    TestBed.configureTestingModule({
      providers: [
        MspDataService,
        BenefitApplication,
        BenefitApplicationDto,
        { provide: LocalStorageService, useFactory: localStorageServiceStub }
      ]
    });
    
    service = TestBed.get(MspBenefitDataService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('saveBenefitApplication', () => {
    it('should make expected call', () => {
      const localStorageServiceStub: LocalStorageService = TestBed.get(
        LocalStorageService
      );
      spyOn(localStorageServiceStub, 'set').and.callThrough();
      service.saveBenefitApplication();
      expect(localStorageServiceStub.set).toHaveBeenCalled();
    });
  });
});
