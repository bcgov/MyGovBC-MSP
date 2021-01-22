import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedCoreModule } from 'moh-common-lib';
import { FormsModule } from '@angular/forms';
import { LocalStorageModule } from 'angular-2-local-storage';
import { RouterTestingModule } from '@angular/router/testing';
import { ChildInfoComponent } from './child-info.component';
import { MspCoreModule } from '../../../msp-core/msp-core.module';
import { PageStateService } from '../../../../services/page-state.service';
import { EnrolDataService } from '../../services/enrol-data.service';
import { EnrolApplication } from '../../models/enrol-application';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MspLogService } from '../../../../services/log.service';

describe('ChildInfoComponent', () => {
  let component: ChildInfoComponent;
  let fixture: ComponentFixture<ChildInfoComponent>;
  const pageStateServiceStub = () => ({
    setPageIncomplete: (str, arr) => ({})
  });
  const enrolDataServiceStub = () => ({
    application: new EnrolApplication()
  });

  beforeEach(async(() => {
    const mspLogServiceStub = () => ({ log: () => {} });
    TestBed.configureTestingModule({
      declarations: [ ChildInfoComponent ],
      imports: [
        SharedCoreModule,
        FormsModule,
        MspCoreModule,
        LocalStorageModule.withConfig({
          prefix: 'ca.bc.gov.msp',
          storageType: 'sessionStorage'
        }),
        RouterTestingModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: PageStateService, useFactory: pageStateServiceStub },
        { provide: EnrolDataService, useFactory: enrolDataServiceStub },
        { provide: MspLogService, useFactory: mspLogServiceStub }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChildInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
