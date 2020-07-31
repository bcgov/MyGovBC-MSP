import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { SharedCoreModule } from 'moh-common-lib';
import { LocalStorageModule } from 'angular-2-local-storage';
import { RemoveSpouseComponent } from './remove-spouse.component';
import { AccountPersonalInformationComponent } from '../../../components/personal-information/personal-information.component';
import { MspCoreModule } from '../../../../msp-core/msp-core.module';
import { MspAccountMaintenanceDataService } from '../../../services/msp-account-data.service';
import { MspPerson } from '../../../../../components/msp/model/msp-person.model';
import { Relationship } from '../../../../../models/relationship.enum';

describe('RemoveSpouseComponent', () => {
  let component: RemoveSpouseComponent;
  let fixture: ComponentFixture<RemoveSpouseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        RemoveSpouseComponent,
        AccountPersonalInformationComponent
      ],
      imports: [
        FormsModule,
        SharedCoreModule,
        MspCoreModule,
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
    fixture = TestBed.createComponent(RemoveSpouseComponent);
    component = fixture.componentInstance;
    component.spouse = new MspPerson(Relationship.Spouse);
    component.phns = [''];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
