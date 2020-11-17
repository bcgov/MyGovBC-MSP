import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedCoreModule } from 'moh-common-lib';
import { RouterTestingModule } from '@angular/router/testing';
import { LocalStorageModule } from 'angular-2-local-storage';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AssistContainerComponent } from './assist-container.component';
import { MspDataService } from '../../../../services/msp-data.service';
import { MspLogService } from 'app/services/log.service';

describe('AssistContainerComponent', () => {
  let component: AssistContainerComponent;
  let fixture: ComponentFixture<AssistContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssistContainerComponent ],
      imports: [
        SharedCoreModule,
        RouterTestingModule,
        LocalStorageModule.withConfig({
          prefix: 'ca.bc.gov.msp',
          storageType: 'sessionStorage'
        }),
        HttpClientTestingModule
      ],
      providers: [
        MspDataService,
        MspLogService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssistContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
