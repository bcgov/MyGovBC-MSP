import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { AssistanceComponent } from './assistance.component';
import { MspDataService } from '../service/msp-data.service';
import { LocalStorageService, LocalStorageModule } from 'angular-2-local-storage';
import {MspProgressBarComponent} from '../common/progressBar/progressBar.component';
import { RouterModule } from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { ProcessService } from '../service/process.service';
import {MspLogService} from '../../../services/log.service';
import {HttpClientModule} from '@angular/common/http';

describe('AssistanceComponent', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssistanceComponent, MspProgressBarComponent],
      imports: [FormsModule, RouterTestingModule, HttpClientModule, RouterModule, LocalStorageModule.withConfig({
        prefix: 'ca.bc.gov.msp',
        storageType: 'sessionStorage'
      })],
      providers: [MspDataService, ProcessService, MspLogService


      ]
    });
  });
  it ('should work', () => {
    const fixture = TestBed.createComponent(AssistanceComponent);
    expect(fixture.componentInstance instanceof AssistanceComponent).toBe(true, 'should create AssistanceComponent');

  });
});
