import { TestBed } from '@angular/core/testing';
import {RouterTestingModule} from "@angular/router/testing";
import { FormsModule } from '@angular/forms';
import { AssistanceSendingComponent } from './sending.component';
import { MspDataService } from '../../service/msp-data.service';
import { LocalStorageService, LocalStorageModule } from 'angular-2-local-storage';
import {MspApiService} from "../../service/msp-api.service";
import {Http, HttpClientModule} from "@angular/http";
import { ProcessService } from "../../service/process.service";

describe('AssistanceSendingComponent', () => {


  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssistanceSendingComponent, ],
      imports: [FormsModule, HttpClientModule, RouterTestingModule, LocalStorageModule.withConfig({
        prefix: 'ca.bc.gov.msp',
        storageType: 'sessionStorage'
      })],
      providers: [MspDataService, MspApiService, ProcessService]
    })
  });
  it ('should work', () => {
    //let fixture = TestBed.createComponent(AssistanceSendingComponent);
    //expect(fixture.componentInstance instanceof AssistanceSendingComponent).toBe(true, 'should create AssistanceSendingComponent');

  });
})
