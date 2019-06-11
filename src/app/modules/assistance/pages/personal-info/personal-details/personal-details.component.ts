import { Component, Input, Output, ViewChild, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { NgForm } from '@angular/forms';
// import { IPerson } from "../../../model/person.interface";
import { MspDataService } from '../../../../../services/msp-data.service';
import {MspBirthDateComponent} from '../../../../msp-core/components/birthdate/birthdate.component';
//import {MspPhnComponent} from '../../../common/phn/phn.component';
import {debounceTime} from 'rxjs/operators';
import { BaseComponent } from '../../../../../models/base.component';
import { FinancialAssistApplication } from '../../../models/financial-assist-application.model';
import { MspPerson } from '../../../../enrolment/models/application.model';
import { MspNameComponent } from '../../../../../components/msp/common/name/name.component';

@Component({
  selector: 'msp-assistance-personal-details',
  templateUrl: './personal-details.component.html'
})
export class AssistancePersonalDetailComponent extends BaseComponent {
  lang = require('./i18n');
  private finApp: FinancialAssistApplication;

  @Input() person: MspPerson;
  @ViewChild('name') name: MspNameComponent;
  @ViewChild('formRef') personalDetailsForm: NgForm;
  @ViewChild('birthdate') birthdate: MspBirthDateComponent;
  //@ViewChild('phn') phn: MspPhnComponent;

  @Output() onChange = new EventEmitter<any>();

  constructor(private dataService: MspDataService,
    private cd: ChangeDetectorRef) {
    super(cd);
    this.finApp = this.dataService.finAssistApp;
    this.person = this.dataService.finAssistApp.applicant;
  }

  ngAfterViewInit() {

    this.personalDetailsForm.valueChanges.pipe(debounceTime(0))
      .subscribe( values => {
        this.onChange.emit(values);
      });
  }


  isSinUnique(): boolean {
    return this.dataService.finAssistApp.isUniqueSin;
  }

  isPHNUnique(): boolean {
    return this.dataService.finAssistApp.isUniquePhns;
  }

  getSinList(): string[]{
    return this.finApp.allPersons.map(x => x.sin);
  }

}
