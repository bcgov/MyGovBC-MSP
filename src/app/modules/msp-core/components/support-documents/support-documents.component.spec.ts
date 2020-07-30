import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SupportDocumentsComponent } from './support-documents.component';
import { SharedCoreModule } from 'moh-common-lib';
import { MspLogService } from '../../../../services/log.service';
import { MspDataService } from '../../../../services/msp-data.service';
import { LocalStorageModule } from 'angular-2-local-storage';
import { RouterTestingModule } from '@angular/router/testing';
import { SupportDocuments } from '../../models/support-documents.model';

describe('SupportDocumentsComponent', () => {
  let component: SupportDocumentsComponent;
  let fixture: ComponentFixture<SupportDocumentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupportDocumentsComponent ],
      imports: [
        FormsModule,
        SharedCoreModule,
        HttpClientTestingModule,
        LocalStorageModule.withConfig({
          prefix: 'ca.bc.gov.msp',
          storageType: 'sessionStorage'
        }),
        RouterTestingModule
      ],
      providers: [
        MspLogService,
        MspDataService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportDocumentsComponent);
    component = fixture.componentInstance;
    component.supportDoc = new SupportDocuments();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
