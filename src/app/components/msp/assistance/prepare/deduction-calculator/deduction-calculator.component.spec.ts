import { TestBed } from '@angular/core/testing'
import { HttpModule }    from '@angular/http';
import { Component, ViewChild, AfterViewInit, OnInit, ElementRef} from '@angular/core';
import { FormsModule, FormGroup, NgForm, AbstractControl } from '@angular/forms';
import { MspLogService } from '../../../service/log.service';
import {DeductionCalculatorComponent} from './deduction-calculator.component';
import { MspDataService } from '../../../service/msp-data.service';
import { LocalStorageService, LocalStorageModule } from 'angular-2-local-storage';
import {MspCancelComponent} from "../../../common/cancel/cancel.component";
import {ModalModule} from "ngx-bootstrap";
import appConstants from '../../../../../services/appConstants';
import {MspLoggerDirective} from "../../../common/logging/msp-logger.directive";
import {RouterTestingModule} from "@angular/router/testing";
import { ProcessService } from "../../../service/process.service";

describe('DeductionCalculatorComponent', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeductionCalculatorComponent, MspCancelComponent, MspLoggerDirective],
      imports: [RouterTestingModule, FormsModule, ModalModule.forRoot(), HttpModule, LocalStorageModule.withConfig({
        prefix: 'ca.bc.gov.msp',
        storageType: 'sessionStorage'
      })],
      providers: [MspDataService,MspLogService, ProcessService,
        
        {provide: 'appConstants', useValue: appConstants}
      ]
    })
  });
  it ('should work', () => {
    let fixture = TestBed.createComponent(DeductionCalculatorComponent);
    expect(fixture.componentInstance instanceof DeductionCalculatorComponent).toBe(true, 'should create DeductionCalculatorComponent');
  });
})
