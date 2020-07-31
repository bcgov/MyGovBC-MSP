import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { SharedCoreModule } from 'moh-common-lib';
import { LocalStorageModule } from 'angular-2-local-storage';
import { RouterTestingModule } from '@angular/router/testing';
import { SpouseInfoComponent } from './spouse-info.component';
import { UpdateSpouseComponent } from './update-spouse/update-spouse.component';
import { AddSpouseComponent } from './add-spouse/add-spouse.component';
import { RemoveSpouseComponent } from './remove-spouse/remove-spouse.component';
import { AccountPersonalInformationComponent } from '../../components/personal-information/personal-information.component';
import { UpdateRequestComponent } from '../../components/update-request/update-request.component';
import { MspCoreModule } from '../../../msp-core/msp-core.module';
import { ChildMovingInformationComponent } from '../../components/moving-information/moving-information.component';
import { MspAccountMaintenanceDataService } from '../../services/msp-account-data.service';

describe('SpouseInfoComponent', () => {
  let component: SpouseInfoComponent;
  let fixture: ComponentFixture<SpouseInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SpouseInfoComponent,
        UpdateSpouseComponent,
        AddSpouseComponent,
        RemoveSpouseComponent,
        AccountPersonalInformationComponent,
        UpdateRequestComponent,
        ChildMovingInformationComponent
      ],
      imports: [
        FormsModule,
        SharedCoreModule,
        MspCoreModule,
        LocalStorageModule.withConfig({
          prefix: 'ca.bc.gov.msp',
          storageType: 'sessionStorage'
        }),
        RouterTestingModule
      ],
      providers: [
        MspAccountMaintenanceDataService
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
