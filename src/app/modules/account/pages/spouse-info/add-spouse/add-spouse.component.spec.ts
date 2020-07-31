import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { SharedCoreModule } from 'moh-common-lib';
import { LocalStorageModule } from 'angular-2-local-storage';
import { AddSpouseComponent } from './add-spouse.component';
import { MspCoreModule } from '../../../../msp-core/msp-core.module';
import { AccountPersonalInformationComponent } from '../../../components/personal-information/personal-information.component';
import { ChildMovingInformationComponent } from '../../../components/moving-information/moving-information.component';
import { MspAccountMaintenanceDataService } from '../../../services/msp-account-data.service';
import { MspPerson } from '../../../../../components/msp/model/msp-person.model';
import { Relationship } from '../../../../../models/relationship.enum';

describe('AddSpouseComponent', () => {
  let component: AddSpouseComponent;
  let fixture: ComponentFixture<AddSpouseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AddSpouseComponent,
        AccountPersonalInformationComponent,
        ChildMovingInformationComponent
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
    fixture = TestBed.createComponent(AddSpouseComponent);
    component = fixture.componentInstance;
    component.spouse = new MspPerson(Relationship.Spouse);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
