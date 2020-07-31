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

describe('ContactInfoComponent', () => {
  let component: ContactInfoComponent;
  let fixture: ComponentFixture<ContactInfoComponent>;

  beforeEach(async(() => {
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
        MspDataService
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
