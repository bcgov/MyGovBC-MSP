import { TestBed } from '@angular/core/testing'
import { FormsModule } from '@angular/forms';
import { MspDataService } from '../../service/msp-data.service';
import { LocalStorageService, LocalStorageModule } from 'angular-2-local-storage';
import {RouterTestingModule} from "@angular/router/testing";
import { ModalModule } from "ngx-bootstrap";
import {MspImageErrorModalComponent} from "./image-error-modal.component";

describe('MspImageErrorModalComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MspImageErrorModalComponent],
      imports: [FormsModule, RouterTestingModule,ModalModule.forRoot(),LocalStorageModule.withConfig({
        prefix: 'ca.bc.gov.msp',
        storageType: 'sessionStorage'
      })],
      providers: [MspDataService,
        
        
      ]
    })
  });
  it ('should work', () => {
    let fixture = TestBed.createComponent(MspImageErrorModalComponent);
    expect(fixture.componentInstance instanceof MspImageErrorModalComponent).toBe(true, 'should create MspImageErrorModalComponent');

  });
})
