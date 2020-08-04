import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MspLogService } from '../../../services/log.service';
import { SchemaService } from 'app/services/schema.service';
import { Router } from '@angular/router';
import { MspBenefitDataService } from './msp-benefit-data.service';
import { MspApiBenefitService } from './msp-api-benefit.service';

describe('MspApiBenefitService', () => {
  let service: MspApiBenefitService;
  beforeEach(() => {
    const mspLogServiceStub = () => ({ log: (object, string) => ({}) });
    const schemaServiceStub = () => ({
      validate: suppBenefitRequest => ({ then: () => ({}) })
    });
    const routerStub = () => ({ navigate: array => ({}) });
    const mspBenefitDataServiceStub = () => ({
      getMspProcess: () => ({ processSteps: { route: {} } })
    });
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        MspApiBenefitService,
        { provide: MspLogService, useFactory: mspLogServiceStub },
        { provide: SchemaService, useFactory: schemaServiceStub },
        { provide: Router, useFactory: routerStub },
        {
          provide: MspBenefitDataService,
          useFactory: mspBenefitDataServiceStub
        }
      ]
    });
    service = TestBed.get(MspApiBenefitService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it(`should have default date format value`, () => {
    expect(service.ISO8601DateFormat).toEqual(`yyyy-MM-dd`);
  });

  it(`should have default AttachmentDocumentType value`, () => {
    expect(MspApiBenefitService.AttachmentDocumentType).toEqual(`SupportDocument`);
  });

  it(`should have default ApplicationType value`, () => {
    expect(MspApiBenefitService.ApplicationType).toEqual(`benefitApplication`);
  });
});
