import { Component, Input, Output, ViewChild, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { NgForm } from '@angular/forms';
// import { IPerson } from "../../../model/person.interface";
import { Person } from '../../../model/person.model';
import { MspDataService } from '../../../service/msp-data.service';
import {FinancialAssistApplication} from "../../../model/financial-assist-application.model";
import {BaseComponent} from "../../../common/base.component";
import {MspBirthDateComponent} from "../../../common/birthdate/birthdate.component";
import {MspPhnComponent} from "../../../common/phn/phn.component";
import {MspNameComponent} from "../../../common/name/name.component";

@Component({
  selector: 'msp-assistance-personal-details',
  templateUrl: './personal-details.component.html'
})
export class AssistancePersonalDetailComponent extends BaseComponent {
  lang = require('./i18n');
  private finApp:FinancialAssistApplication;

  @Input() person: Person;
  @ViewChild('name') name: MspNameComponent;
  @ViewChild('formRef') personalDetailsForm: NgForm;
  @ViewChild('birthdate') birthdate: MspBirthDateComponent;
  @ViewChild('phn') phn: MspPhnComponent;

  @Output() onChange = new EventEmitter<any>();

  constructor(private dataService: MspDataService,
    private cd: ChangeDetectorRef) {
    super(cd);
    this.finApp = this.dataService.finAssistApp;
    this.person = this.dataService.finAssistApp.applicant;
  }

  ngAfterViewInit() {
    this.personalDetailsForm.valueChanges
      .subscribe( values => {
        this.onChange.emit(values);
      });
  }


    isSinUnique(): boolean {
    return this.dataService.finAssistApp.isUniqueSin;
}

  getSinList(): string[]{
    return this.finApp.allPersons.map(x => x.sin);
  }

}