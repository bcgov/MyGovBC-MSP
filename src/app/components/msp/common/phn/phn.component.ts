import {Component, ElementRef, Input, EventEmitter, Output, ViewChild, ChangeDetectorRef} from '@angular/core';
import {NgForm} from '@angular/forms';
import {BaseComponent} from '../base.component';
import { MspDataService } from '../../service/msp-data.service';
import { MspAccountApp } from '../../model/account.model';
import { MspApplication, Person } from '../../model/application.model';
import { FinancialAssistApplication } from '../../model/financial-assist-application.model';
import { Router } from '@angular/router';
import {debounceTime} from "rxjs/operators";
import {Masking, NUMBER, SPACE} from '../../../msp/model/masking.model';
import {MspBenefitDataService} from '../../service/msp-benefit-data.service';

@Component({
  selector: 'msp-phn',
  templateUrl: './phn.component.html',
})

export class MspPhnComponent extends Masking {
  lang = require('./i18n');

  @Input() required: boolean = false;
  @Input() phnLabel: string = this.lang('./en/index.js').phnLabel;
  @Input() placeholder: string ;
  @Input() phn: string;
  @Output() phnChange = new EventEmitter<string>();
  @Input() bcPhn: boolean = false;
  @Input() showError: boolean;
  @Output() onChange = new EventEmitter<any>();
  @ViewChild('formRef') form: NgForm;
  @ViewChild('phnRef') phnRef: ElementRef;
  @ViewChild('phnfocus') phnFocus: ElementRef;
  @Input() isForAccountChange: boolean = false;
  @Input() isACL: boolean = false;
  @Input() phnTextmask: Array<any>;

  // Input Masking 
  public mask = [NUMBER, NUMBER, NUMBER, NUMBER, SPACE, NUMBER, NUMBER, NUMBER, SPACE, NUMBER, NUMBER, NUMBER];
  

  //@Input() isPhnDuplicate: boolean = false;

  constructor(private cd: ChangeDetectorRef,
    private dataService: MspDataService, private benefitDataService: MspBenefitDataService,
    private router: Router) {
    super(cd);
  }

  
  ngAfterViewInit(): void {

    // https://github.com/angular/angular/issues/24818
    this.form.valueChanges.pipe(debounceTime(0)).subscribe((values) => {
      this.onChange.emit(values);
    });

  }

  setPhn(value: string){
    this.phn = value;
    this.phnChange.emit(value);
  }


  isUnique(): boolean {
    //For tests, router url often isn't mocked.
    if (!this.getPersonList()) { console.log('====='); return null; }

    return this.getPersonList() //Detect what application person to use
      .map(x => x.previous_phn)
      .filter(x => x) //Filter 'undefined' out
      .filter(x => x.length >= 10) //PHN are 10 long. Don't process before.
      .filter(x => x === this.phn).length <= 1; //Allow for one, i.e. itself
     
  }


  /**
   * Only get the Persons relevant to the section the user is on.
   *
   * Avoids rare bugs if users go back partway through one appliction then
   * begin filling out others.
   */
  private getPersonList(): Person[]{
    if (this.router.url.indexOf('/assistance/') !== -1){
      return this.dataService.finAssistApp.allPersons;
    }
    if (this.router.url.indexOf('/application/') !== -1){
      return this.dataService.getMspApplication().allPersons;
    }
    if (this.router.url.indexOf('/account/personal-info') !== -1){
      return this.dataService.getMspAccountApp().allPersonsInPI;
    }
    if (this.router.url.indexOf('/account/dependent-change') !== -1){
      return this.dataService.getMspAccountApp().allPersonsInDep;
    }
    if (this.router.url.indexOf('/account-letter/personal-info') !== -1){
      return this.dataService.accountLetterApp.allPersons;
    }

      if (this.router.url.indexOf('/benefit/personal-info') !== -1){
          return this.benefitDataService.benefitApp.allPersons;
      }
  }

  focus() {
    this.phnFocus.nativeElement.focus();
  }
}
