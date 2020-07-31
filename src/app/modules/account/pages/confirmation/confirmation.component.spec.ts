import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedCoreModule } from 'moh-common-lib';
import { RouterTestingModule } from '@angular/router/testing';
import { LocalStorageModule } from 'angular-2-local-storage';
import { AccountConfirmationComponent } from './confirmation.component';
import { MspAccountMaintenanceDataService } from '../../services/msp-account-data.service';

describe('AccountConfirmationComponent', () => {
  let component: AccountConfirmationComponent;
  let fixture: ComponentFixture<AccountConfirmationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountConfirmationComponent ],
      imports: [
        SharedCoreModule,
        RouterTestingModule,
        LocalStorageModule.withConfig({
          prefix: 'ca.bc.gov.msp',
          storageType: 'sessionStorage'
        })
      ],
      providers: [
        MspAccountMaintenanceDataService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
