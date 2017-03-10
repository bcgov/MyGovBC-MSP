import {TestBed, inject, ComponentFixture, fakeAsync, async, tick} from '@angular/core/testing';
import {DebugElement} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Mod11CheckValidator} from './phn.validator';
import {BrowserModule} from "@angular/platform-browser";
import {CommonModule} from "@angular/common";
import CompletenessCheckService from '../../service/completeness-check.service';
import MspDataService from '../../service/msp-data.service';
import ValidationService from '../../service/msp-validation.service';
import { LocalStorageService, LOCAL_STORAGE_SERVICE_CONFIG } from 'angular-2-local-storage';
import {MspPhnComponent} from './phn.component';

describe('PHN Component', () => {
  let fixture:ComponentFixture<MspPhnComponent>;
  let container:MspPhnComponent;
  let element:Element;
  let validator:Mod11CheckValidator;
  let debugElement:DebugElement;
  let testLabel:string = 'Your previous BC Personal Health Number';

  let localStorageServiceConfig = {
    prefix: 'ca.bc.gov.msp',
    storageType: 'localStorage'
  };
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Mod11CheckValidator, MspPhnComponent],
      imports: [BrowserModule,
        CommonModule,
        FormsModule],
      providers: [
        CompletenessCheckService, MspDataService,ValidationService,
        LocalStorageService,{
          provide: LOCAL_STORAGE_SERVICE_CONFIG, useValue: localStorageServiceConfig
        }
        
      ]
    });

    fixture = TestBed.createComponent(MspPhnComponent);   
    container = fixture.componentInstance; 
    element = fixture.nativeElement;
    debugElement = fixture.debugElement;  
  });

  it('should render without error a msp-phn component with a valid phn', async(() => {
    container.required = true;
    container.phnLabel = testLabel;
    container.bcPhn = true;
    container.phn = '9012372173';
    container.showError = true;

    //trigger change detection
    fixture.detectChanges();
    fixture.whenStable().then(() => { 
      expect(element.querySelector('label').innerText).toBe(testLabel);
    });
  }));  

  it('should render without error a msp-phn component with a three 0 padded valid phn', async(() => {
    container.required = true;
    container.phnLabel = testLabel;
    container.bcPhn = true;
    container.phn = '0009012372173';
    container.showError = true;

    //trigger change detection
    fixture.detectChanges();
    fixture.whenStable().then(() => { 
      expect(element.querySelector('label').innerText).toBe(testLabel);
    });
  }));  

  it('should render without error a msp-phn component with a one 0 padded valid phn', async(() => {
    container.required = true;
    container.phnLabel = testLabel;
    container.bcPhn = true;
    container.phn = '09012372173';
    container.showError = true;

    //trigger change detection
    fixture.detectChanges();
    fixture.whenStable().then(() => { 
      expect(element.querySelector('label').innerText).toBe(testLabel);
    });
  }));  

  it('should render with error message for a msp-phn component with invalid phn input value', fakeAsync(() => {
    container.required = true;
    container.phnLabel = testLabel;
    container.bcPhn = true;
    container.phn = '9012372173-';
    container.showError = true;

    //trigger change detection
    fixture.detectChanges();
    element.querySelector('input').click();
    element.querySelector('input').blur();

    tick();
    fixture.detectChanges();
    
    fixture.whenStable().then(() => { 
      expect(element.querySelector('label').innerText).toBe(testLabel);
      expect(element.querySelector('div.text-danger').textContent).not.toBe(null);
      expect(element.querySelector('div.text-danger').textContent).toEqual('PHN is not valid');
    });
  }));  

  it('should render with error for a msp-phn component with a invalid non bc phn', fakeAsync(() => {
    container.required = true;
    container.phnLabel = testLabel;
    container.bcPhn = false;
    container.phn = '1234567899';
    container.showError = true;

    //trigger change detection
    fixture.detectChanges();
    element.querySelector('input').click();
    element.querySelector('input').blur();

    tick();
    fixture.detectChanges();

    fixture.whenStable().then(() => { 
      fixture.detectChanges();
      console.log('div text content error message: ',element.querySelector('div.text-danger').textContent);
      expect(element.querySelector('label').innerText).toBe(testLabel);
      expect(element.querySelector('div.text-danger').textContent).not.toBe(null);
      expect(element.querySelector('div.text-danger').textContent).toEqual('PHN is not valid');
    });
  })); 

  
})
