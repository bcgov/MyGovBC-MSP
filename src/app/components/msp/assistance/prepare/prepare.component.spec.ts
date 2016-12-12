// import { TestBed } from '@angular/core/testing'
// import { Component, ViewChild, AfterViewInit, OnInit, ElementRef} from '@angular/core';
// import { FormsModule, FormGroup, NgForm, AbstractControl } from '@angular/forms';

// import { AssistancePrepareComponent } from './prepare.component'
// import {DeductionCalculatorComponent} from './deduction-calculator/deduction-calculator.component';
// import MspDataService from '../../service/msp-data.service';
// import { LocalStorageService, LOCAL_STORAGE_SERVICE_CONFIG } from 'angular-2-local-storage';

// describe('App', () => {
//   let localStorageServiceConfig = {
//       prefix: 'ca.bc.gov.msp',
//       storageType: 'localStorage'
//   };
  
//   beforeEach(() => {
//     TestBed.configureTestingModule({ 
//       declarations: [AssistancePrepareComponent,
//       DeductionCalculatorComponent],
//       imports: [FormsModule],
//       providers: [MspDataService,
//         LocalStorageService,{
//             provide: LOCAL_STORAGE_SERVICE_CONFIG, useValue: localStorageServiceConfig
//         }    
//       ]
//   })
//   });
//   it ('should work', () => {
//     let fixture = TestBed.createComponent(AssistancePrepareComponent)
//     expect(fixture.componentInstance instanceof AssistancePrepareComponent).toBe(true, 'should create AssistancePrepareComponent')
//     expect(fixture.componentInstance.lang('./en/index').pa).toContain('Apply')
//   });
// })
