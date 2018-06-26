import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from "@angular/router/testing";
import { LocalStorageModule } from 'angular-2-local-storage';
import { MspProgressBarComponent } from "../common/progressBar/progressBar.component";
import { MspLogService } from "../service/log.service";
import { MspDataService } from '../service/msp-data.service';
import { ProcessService } from "../service/process.service";
import { AccountComponent } from './account.component';
import {HttpClientModule} from "@angular/common/http";

describe('AccountComponent', () => {


  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AccountComponent,MspProgressBarComponent],
      imports: [FormsModule, RouterTestingModule ,HttpClientModule, LocalStorageModule.withConfig({
          prefix: 'ca.bc.gov.msp',
          storageType: 'sessionStorage'
      })],
      providers: [MspDataService, ProcessService ,MspLogService

      ]
    })
  });
  it ('should work', () => {
    let fixture = TestBed.createComponent(AccountComponent);
    expect(fixture.componentInstance instanceof AccountComponent).toBe(true, 'should create AccountComponent');

  });
})
