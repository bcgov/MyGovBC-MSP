import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedCoreModule } from 'moh-common-lib';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { LocalStorageModule } from 'angular-2-local-storage';
import { SpouseInfoComponent } from './spouse-info.component';
import { MspCoreModule } from '../../../msp-core/msp-core.module';
import { PageStateService } from '../../../../services/page-state.service';
import { EnrolDataService } from '../../services/enrol-data.service';
import { EnrolApplication } from '../../models/enrol-application';

describe('SpouseInfoComponent', () => {
  let component: SpouseInfoComponent;
  let fixture: ComponentFixture<SpouseInfoComponent>;
  const pageStateServiceStub = () => ({
    setPageIncomplete: (str, arr) => ({})
  });
  const enrolDataServiceStub = () => ({
    application: new EnrolApplication()
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpouseInfoComponent ],
      imports: [
        SharedCoreModule,
        FormsModule,
        MspCoreModule,
        RouterTestingModule,
        LocalStorageModule.withConfig({
          prefix: 'ca.bc.gov.msp',
          storageType: 'sessionStorage'
        })
      ],
      providers: [
        { provide: PageStateService, useFactory: pageStateServiceStub },
        { provide: EnrolDataService, useFactory: enrolDataServiceStub }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpouseInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
