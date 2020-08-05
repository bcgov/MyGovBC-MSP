import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedCoreModule } from 'moh-common-lib';
import { FormsModule } from '@angular/forms';
import { LocalStorageModule } from 'angular-2-local-storage';
import { AssistanceHomeComponent } from './home.component';
import { MspCoreModule } from '../../../msp-core/msp-core.module';
import { AssistRatesModalComponent } from '../../components/assist-rates-modal/assist-rates-modal.component';
import { MspDataService } from '../../../../services/msp-data.service';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';

describe('HomeComponent', () => {
  let component: AssistanceHomeComponent;
  let fixture: ComponentFixture<AssistanceHomeComponent>;
  const activatedRouteStub = () => ({
    route: {
      snapshot: {
        routeConfig: {
          path: ''
        }
      }
    }
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AssistanceHomeComponent,
        AssistRatesModalComponent
      ],
      imports: [
        MspCoreModule,
        SharedCoreModule,
        FormsModule,
        LocalStorageModule.withConfig({
          prefix: 'ca.bc.gov.msp',
          storageType: 'sessionStorage'
        }),
        RouterTestingModule
      ],
      providers: [
        MspDataService,
        { provide: ActivatedRoute, useFactory: activatedRouteStub }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssistanceHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /*
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  */
});
