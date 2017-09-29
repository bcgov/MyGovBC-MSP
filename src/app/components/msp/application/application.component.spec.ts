import { TestBed } from '@angular/core/testing'
import { FormsModule } from '@angular/forms';
import { ApplicationComponent } from './application.component';
import { MspDataService } from '../service/msp-data.service';
import { LocalStorageService, LocalStorageModule } from 'angular-2-local-storage';
import {MspProgressBarComponent} from "../common/progressBar/progressBar.component";
import {RouterTestingModule} from "@angular/router/testing";
import appConstants from '../../../services/appConstants';
import { ProcessService } from "../service/process.service";

describe('ApplicationComponent', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ApplicationComponent, MspProgressBarComponent],
      imports: [FormsModule, RouterTestingModule, LocalStorageModule.withConfig({
        prefix: 'ca.bc.gov.msp',
        storageType: 'sessionStorage'
      })],
      providers: [MspDataService, ProcessService,
        
        {provide: 'appConstants', useValue: appConstants}
      ]
    })
  });
  it ('should work', () => {
    let fixture = TestBed.createComponent(ApplicationComponent);
    expect(fixture.componentInstance instanceof ApplicationComponent).toBe(true, 'should create ApplicationComponent');

  });
})
