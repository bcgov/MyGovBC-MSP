import { TestBed } from '@angular/core/testing';
import {RouterTestingModule} from "@angular/router/testing";
import { FormsModule } from '@angular/forms';
import { SendingComponent } from './sending.component';
import { MspDataService } from '../../service/msp-data.service';
import { LocalStorageService, LocalStorageModule } from 'angular-2-local-storage';
import {MspApiService} from "../../service/msp-api.service";
import {HttpClientModule} from "@angular/common/http";
import { ProcessService } from "../../service/process.service";

describe('SendingComponent', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SendingComponent],
      imports: [FormsModule, HttpClientModule, RouterTestingModule, LocalStorageModule.withConfig({
        prefix: 'ca.bc.gov.msp',
        storageType: 'sessionStorage'
      })],
      providers: [MspDataService, MspApiService, ProcessService,]
    })
  });
  it ('should work', () => {
    // let fixture = TestBed.createComponent(SendingComponent);
    // expect(fixture.componentInstance instanceof SendingComponent).toBe(true, 'should create SendingComponent');

  });
})
