import { TestBed } from '@angular/core/testing';
import {RouterTestingModule} from "@angular/router/testing";
import { FormsModule } from '@angular/forms';
import { AccountSendingComponent } from './sending.component';
import { MspDataService } from '../../service/msp-data.service';
import { LocalStorageService, LocalStorageModule } from 'angular-2-local-storage';
import {MspApiService} from "../../service/msp-api.service";
import { ProcessService } from "../../service/process.service";
import {HttpClientModule} from "@angular/common/http";
import {TransmissionErrorView} from "../../common/transmission-error-view/transmission-error-view.component";
import {MspLogService} from "../../service/log.service";

describe('SendingComponent', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AccountSendingComponent ,TransmissionErrorView],
      imports: [FormsModule, HttpClientModule, RouterTestingModule, LocalStorageModule.withConfig({
        prefix: 'ca.bc.gov.msp',
        storageType: 'sessionStorage'
      })],
      providers: [MspDataService, MspApiService, ProcessService,MspLogService]
    })
  });
  it ('should work', () => {
     let fixture = TestBed.createComponent(AccountSendingComponent);
     expect(fixture.componentInstance instanceof AccountSendingComponent).toBe(true, 'should create AccountSendingComponent');

  });
})
