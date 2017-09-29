import { TestBed } from '@angular/core/testing'
import { FormsModule } from '@angular/forms';
import { MspIdReqModalComponent } from './id-req-modal.component';
import { MspDataService } from '../../service/msp-data.service';
import { LocalStorageService, LocalStorageModule } from 'angular-2-local-storage';
import {RouterTestingModule} from "@angular/router/testing";
import {AccordionModule, ModalModule} from "ngx-bootstrap";

describe('MspIdReqModalComponent', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MspIdReqModalComponent],
      imports: [FormsModule, RouterTestingModule, ModalModule.forRoot(), AccordionModule.forRoot(), LocalStorageModule.withConfig({
        prefix: 'ca.bc.gov.msp',
        storageType: 'sessionStorage'
      })],
      providers: [MspDataService]
    })
  });
  it ('should work', () => {
    let fixture = TestBed.createComponent(MspIdReqModalComponent);
    expect(fixture.componentInstance instanceof MspIdReqModalComponent).toBe(true, 'should create MspIdReqModalComponent');

  });
})
