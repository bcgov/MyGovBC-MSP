import { TestBed } from '@angular/core/testing'
import { FormsModule } from '@angular/forms';
import { MspDataService } from '../../service/msp-data.service';
import { LocalStorageService, LocalStorageModule } from 'angular-2-local-storage';
import {RouterTestingModule} from "@angular/router/testing";
import {Ng2BootstrapModule} from "ngx-bootstrap";
import appConstants from '../../../../services/appConstants';
import {MspImageErrorModalComponent} from "./image-error-modal.component";

describe('MspImageErrorModalComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MspImageErrorModalComponent],
      imports: [FormsModule, RouterTestingModule, Ng2BootstrapModule.forRoot(), LocalStorageModule.withConfig({
        prefix: 'ca.bc.gov.msp',
        storageType: 'sessionStorage'
      })],
      providers: [MspDataService,
        
        {provide: 'appConstants', useValue: appConstants}
      ]
    })
  });
  it ('should work', () => {
    let fixture = TestBed.createComponent(MspImageErrorModalComponent);
    expect(fixture.componentInstance instanceof MspImageErrorModalComponent).toBe(true, 'should create MspImageErrorModalComponent');

  });
})
