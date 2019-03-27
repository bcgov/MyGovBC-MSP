import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AclErrorViewComponent } from './acl-error-view.component';
import { FormsModule } from '@angular/forms';
import { MspDataService } from '../../../service/msp-data.service';
import {HttpClientModule} from '@angular/common/http';
import { ProcessService } from '../../../service/process.service';
import { MspLogService } from '../../../service/log.service';
import { MspACLService } from '../../../service/msp-acl-api.service';
import {RouterTestingModule} from '@angular/router/testing';
import { LocalStorageModule } from 'angular-2-local-storage';

describe('AclErrorViewComponent', () => {
  let component: AclErrorViewComponent;
  let fixture: ComponentFixture<AclErrorViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AclErrorViewComponent ],
      imports: [FormsModule, HttpClientModule, RouterTestingModule, LocalStorageModule.withConfig({
        prefix: 'ca.bc.gov.msp',
        storageType: 'sessionStorage'
      })],
      providers: [MspDataService, ProcessService, MspLogService, MspACLService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AclErrorViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
