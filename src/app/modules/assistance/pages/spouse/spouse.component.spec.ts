import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedCoreModule } from 'moh-common-lib';
import { FormsModule } from '@angular/forms';
import { LocalStorageModule } from 'angular-2-local-storage';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SpouseComponent } from './spouse.component';
import { AssistCraDocumentComponent } from '../../components/assist-cra-document/assist-cra-document.component';
import { MspDataService } from '../../../../services/msp-data.service';
import { MspLogService } from 'app/services/log.service';

describe('SpouseComponent', () => {
  let component: SpouseComponent;
  let fixture: ComponentFixture<SpouseComponent>;
  const fakeActivatedRoute = {
    snapshot: {
      routeConfig: {
        path: ''
      }
    }
  } as ActivatedRoute;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SpouseComponent,
        AssistCraDocumentComponent
      ],
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
        MspDataService,
        MspLogService,
        { provide: ActivatedRoute, useValue: fakeActivatedRoute }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpouseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
