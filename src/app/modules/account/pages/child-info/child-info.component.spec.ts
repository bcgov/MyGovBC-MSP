import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { SharedCoreModule } from 'moh-common-lib';
import { LocalStorageModule } from 'angular-2-local-storage';
import { RouterTestingModule } from '@angular/router/testing';
import { ChildInfoComponent } from './child-info.component';
import { AddChildComponent } from './add-child/add-child.component';
import { RemoveChildComponent } from './remove-child/remove-child.component';
import { UpdateChildComponent } from './update-child/update-child.component';
import { MspCoreModule } from '../../../msp-core/msp-core.module';
import { AccountPersonalInformationComponent } from '../../components/personal-information/personal-information.component';
import { ChildMovingInformationComponent } from '../../components/moving-information/moving-information.component';
import { MspAccountMaintenanceDataService } from '../../services/msp-account-data.service';

describe('ChildInfoComponent', () => {
  let component: ChildInfoComponent;
  let fixture: ComponentFixture<ChildInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ChildInfoComponent,
        AddChildComponent,
        RemoveChildComponent,
        UpdateChildComponent,
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
    fixture = TestBed.createComponent(ChildInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
