import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedCoreModule } from 'moh-common-lib';
import { FormsModule } from '@angular/forms';
import { LocalStorageModule } from 'angular-2-local-storage';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ContactInfoComponent } from './contact-info.component';
import { MspAccountMaintenanceDataService } from '../../services/msp-account-data.service';
import { ProcessService } from '../../../../services/process.service';
import { MspDataService } from '../../../../services/msp-data.service';
import { MspLogService } from '../../../../services/log.service';

describe('ContactInfoComponent', () => {
  let component: ContactInfoComponent;
  let fixture: ComponentFixture<ContactInfoComponent>;

  beforeEach(async(() => {
    const mspLogServiceStub = () => ({ log: () => {} });
    TestBed.configureTestingModule({
      declarations: [ ContactInfoComponent ],
      imports: [
        SharedCoreModule,
        FormsModule,
        LocalStorageModule.withConfig({
          prefix: 'ca.bc.gov.msp',
          storageType: 'sessionStorage'
        }),
        RouterTestingModule,
        HttpClientTestingModule
      ],
      providers: [
        MspAccountMaintenanceDataService,
        ProcessService,
        MspDataService,
        { provide: MspLogService, useFactory: mspLogServiceStub }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactInfoComponent);
    component = fixture.componentInstance;
    spyOn(component._processService, 'setStep').and.returnValue(null);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
