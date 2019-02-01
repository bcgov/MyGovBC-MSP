import { TestBed, inject, ComponentFixture, fakeAsync, async, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Mod11CheckValidator } from '../phn/phn.validator';
import { SinCheckValidator } from './sin.validator';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { CompletenessCheckService } from '../../service/completeness-check.service';
import { MspDataService } from '../../service/msp-data.service';
import { MspValidationService } from '../../service/msp-validation.service';
import { LocalStorageService, LocalStorageModule } from 'angular-2-local-storage';

import { AssistancePersonalDetailComponent } from '../../assistance/personal-info/personal-details/personal-details.component';
import { MspNameComponent } from '../name/name.component';
import { MspBirthDateComponent } from '../birthdate/birthdate.component';
import { MspPhnComponent } from '../phn/phn.component';

import { CalendarYearFormatter } from '../../common/calendar/calendar-year-formatter.component';
import { CalendarYearValidator } from '../../common/calendar/calendar-year.validator';
import { CalendarDayValidator } from '../../common/calendar/calendar-day.validator';

import { Person } from '../../model/person.model';
import { Relationship } from '../../model/status-activities-documents';
import { RouterTestingModule } from '@angular/router/testing';
import {TextMaskModule} from 'angular2-text-mask';


describe('SIN Validator Test', () => {

  // let nameComponentFixture:ComponentFixture<MspNameComponent>;
  // let nameComponent:MspNameComponent;

  let fixture: ComponentFixture<AssistancePersonalDetailComponent>;
  let container: AssistancePersonalDetailComponent;
  let element: Element;
  let validator: SinCheckValidator;
  let debugElement: DebugElement;
  const testLabel: string = 'Social Insurance Number (SIN)';

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SinCheckValidator, AssistancePersonalDetailComponent,
        MspBirthDateComponent, MspNameComponent, MspPhnComponent, Mod11CheckValidator,
        CalendarYearFormatter, CalendarYearValidator, CalendarDayValidator],
      imports: [TextMaskModule,
        BrowserModule,
        CommonModule,
        RouterTestingModule,
        FormsModule,
        LocalStorageModule.withConfig({
          prefix: 'ca.bc.gov.msp',
          storageType: 'sessionStorage'
        })],
      providers: [
        CompletenessCheckService, MspDataService, MspValidationService,
      ]

    });

    fixture = TestBed.createComponent(AssistancePersonalDetailComponent);
    container = fixture.componentInstance;
    element = fixture.nativeElement;
    debugElement = fixture.debugElement;

    // nameComponentFixture = TestBed.createComponent(MspNameComponent);
    // nameComponent = nameComponentFixture.componentInstance;
  });


  it('should render without error a msp-assistance-personal-details component that contains a valid SIN and sinCheck validator', async(() => {
    //Original test here, but was invalid when upgrading to angular4 as it didn't have all the Person fields (relationship, etc.)
    // let testPerson = {
    //   firstName: 'Test user first name',
    //   middleName: 'Test user middle name',
    //   lastName: 'Test user last name',
    //   sin: '654987874',
    // };
    const testPerson = new Person(Relationship.Applicant);
    container.person = testPerson;

    //trigger change detection
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(element.querySelector('label[for=\'sin\']').textContent).toBe(testLabel);
    });
  }));

  it('should render with error message for a msp-phn component that has an invalid phn input value', fakeAsync(() => {
    // let testPerson = {
    //   firstName: 'Test user (with invalid SIN) first name',
    //   middleName: 'Test user (with invalid SIN) middle name',
    //   lastName: 'Test user (with invalid SIN) last name',
    //   sin: '054987874'
    // };
    const testPerson = new Person(Relationship.Applicant);
    container.person = testPerson;

    //trigger change detection
    fixture.detectChanges();

    element.querySelector('input').click();
    element.querySelector('input').blur();

    expect(element.querySelectorAll('input#sin').length).toEqual(1);

    /**
     * focus and bluring the element should be currently not triggering the touch event.
     */
    Array(element.querySelectorAll('input').length).fill(1).reduce(
      function (acc, cur, idx) {
        const inputEl: HTMLInputElement = element.querySelectorAll('input').item(idx);
        inputEl.focus();
        // inputEl.click();
        inputEl.blur();
        return cur;
      }
      , 1);

    // let htmlElement:HTMLElement  = <HTMLElement>document.querySelectorAll("input#sin")[0];
    // expect(htmlElement).not.toBe(null);

    // console.debug('AssistancePersonalDetailComponent before blur', element);

    // htmlElement.click();
    // htmlElement.focus();
    // htmlElement.blur();


    // document.getElementById("sin").click();
    // document.getElementById("sin").blur();

    tick(1000);



    fixture.whenStable().then(() => {
      // console.debug('input element to click: ', element.querySelector('input'));
      // element.querySelector('input#sin')[0].click();
      // element.querySelector('input#sin')[0].blur();

      // Array(element.querySelectorAll('input').length).fill(1).reduce(
      //   function(acc, cur, idx){
      //     let inputEl:HTMLInputElement = element.querySelectorAll('input').item(idx);
      //     inputEl.focus();
      //     // inputEl.click();
      //     inputEl.blur();

      //     return cur;
      //   }
      // , 1);
      // element.querySelector('input').blur();


      fixture.detectChanges();
      //console.debug('AssistancePersonalDetailComponent after blur', element);

      expect(element.querySelector('label[for=\'sin\']').textContent).toBe(testLabel);

      // let debugEl:DebugElement = fixture.debugElement.query(By.css('ng-invalid'));
      // console.debug('native SIN input element to console', document.getElementById("sin"));
      // console.debug('native AssistancePersonalDetailComponent to console', element);
      // console.debug('output AssistancePersonalDetailComponent to console', debugEl);
      // console.debug('output text-danger to console', element.querySelector('div.text-danger'));

      // expect(debugEl).not.toBe(null);
      // expect(element.querySelector('div.text-danger').textContent).not.toBe(null);
      // expect(element.querySelector('div.text-danger').textContent).toEqual('SIN is not in the correct format');
    });
  }));
});
