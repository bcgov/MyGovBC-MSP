import {Component, Input, EventEmitter, Output, ViewChild, ChangeDetectorRef} from '@angular/core';
import {NgForm} from "@angular/forms";
import {BaseComponent} from "../base.component";
import { MspDataService } from '../../service/msp-data.service';
import { MspAccountApp } from '../../model/account.model';
import { MspApplication, Person } from '../../model/application.model';
import { FinancialAssistApplication } from '../../model/financial-assist-application.model';
import { Router } from '@angular/router';

@Component({
  selector: 'msp-phn',
  templateUrl: './phn.component.html',
})

export class MspPhnComponent extends BaseComponent {
  lang = require('./i18n');

  @Input() required: boolean = false;
  @Input() phnLabel: string = this.lang("./en/index.js").phnLabel;
  @Input() phn: string;
  @Output() phnChange = new EventEmitter<string>();
  @Input() bcPhn: boolean = false;
  @Input() showError:boolean;
  @Output() onChange = new EventEmitter<any>();
  @ViewChild('formRef') form: NgForm;
  @Input() isForAccountChange: boolean = false;

  constructor(private cd: ChangeDetectorRef,
    private dataService: MspDataService,
    private router: Router) {
    super(cd);
  }

  ngAfterViewInit(): void {
    this.form.valueChanges.subscribe(values => {
      this.onChange.emit(values);
    });
  }

  setPhn(value:string){
    this.phn = value;
    this.phnChange.emit(value);
  }

  isUnique(): boolean {
    //For tests, router url often isn't mocked.
    if (!this.getPersonList()) { return null };

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
    if (this.router.url.indexOf("/assistance/") !== -1){
      return this.dataService.finAssistApp.allPersons;
    }
    if (this.router.url.indexOf("/application/") !== -1){
      return this.dataService.getMspApplication().allPersons;
    }
    if (this.router.url.indexOf("/account/") !== -1){
      return this.dataService.getMspAccountApp().allPersons;
    }

  }

  isValid(): boolean {
    return this.isUnique();
  }
}