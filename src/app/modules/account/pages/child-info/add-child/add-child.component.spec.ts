import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedCoreModule } from 'moh-common-lib';
import { FormsModule } from '@angular/forms';
import { LocalStorageModule } from 'angular-2-local-storage';
import { AddChildComponent } from './add-child.component';
import { AccountPersonalInformationComponent } from '../../../components/personal-information/personal-information.component';
import { ChildMovingInformationComponent } from '../../../components/moving-information/moving-information.component';
import { MspCoreModule } from '../../../../msp-core/msp-core.module';
import { MspAccountMaintenanceDataService } from '../../../services/msp-account-data.service';
import { MspPerson } from '../../../../../components/msp/model/msp-person.model';
import { Relationship } from '../../../../../models/relationship.enum';

describe('AddChildComponent', () => {
  let component: AddChildComponent;
  let fixture: ComponentFixture<AddChildComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AddChildComponent,
        AccountPersonalInformationComponent,
        ChildMovingInformationComponent
      ],
      imports: [
        SharedCoreModule,
        FormsModule,
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
    fixture = TestBed.createComponent(AddChildComponent);
    component = fixture.componentInstance;
    component.child = new MspPerson(Relationship.Child19To24);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
