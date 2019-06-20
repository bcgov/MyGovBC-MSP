import {
  ChangeDetectorRef,
  Component,
  ViewChild,
  ViewChildren,
  QueryList
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { MspDataService } from '../../../../services/msp-data.service';
import { Router } from '@angular/router';
import { AssistancePersonalDetailComponent } from './personal-details/personal-details.component';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { BaseComponent } from '../../../../models/base.component';
import { MspAddressComponent } from '../../../msp-core/components/address/address.component';
import { MspPhoneComponent } from '../../../../components/msp/common/phone/phone.component';
import { FinancialAssistApplication } from '../../models/financial-assist-application.model';
import { AssistanceYear } from '../../models/assistance-year.model';
import { MspPerson } from 'app/modules/account/models/account.model';

@Component({
  // templateUrl: './personal-info.component.html'
  template: `
    <h2>{{ title }}</h2>
    <h3>{{ subtitle }}</h3>
    <p class="border-bottom">{{ description }}</p>
    <common-page-section>
      <form #formRef="ngForm" (ngSubmit)="onSubmit(formRef)" novalidate>
        <msp-assist-account-holder
          [person]="financialAssistApplication.applicant"
          (dataChange)="saveAccountHolder($event)"
        ></msp-assist-account-holder>
      </form>
    </common-page-section>
    <h3>{{ documentsTitle }}</h3>
    <p class="border-bottom">{{ documentsDescription }}</p>
    <common-page-section layout="tips">
      <ng-container *ngFor="let year of assistanceYears; index as i">
        <label>{{ year.year }}</label>
        <common-file-uploader
          id="{{ year }}"
          instructionText="Click add or drag and drop documents"
          [images]="year.files"
        >
        </common-file-uploader>
      </ng-container>
      <aside>
        <div class="row">
          <div class="col-4">
            <i class="fa fa-exclamation-triangle" style="font-size: 40px;"></i>
          </div>
        </div>
        <div class="row">
          <p class="col-12">{{ tip1 }}</p>
        </div>
        <br />
        <div class="row">
          <p class="col-12">{{ tip2 }}</p>
          <p class="col-12">Make sure that it's:</p>
          <ul class="col-12">
            <li class="col-12" *ngFor="let item of tipList">{{ item }}</li>
          </ul>
        </div>
      </aside>
    </common-page-section>
  `
})
export class AssistancePersonalInfoComponent extends BaseComponent {
  //DEF-74 KPS
  static ProcessStepNum = 1;

  lang = require('./i18n');

  @ViewChild('formRef') personalInfoForm: NgForm;
  @ViewChildren(AssistancePersonalDetailComponent)
  personalDetailsComponent: QueryList<AssistancePersonalDetailComponent>;
  @ViewChild('address') address: MspAddressComponent;
  @ViewChild('phone') phone: MspPhoneComponent;
  financialAssistApplication: FinancialAssistApplication;

  title = 'Tell us about who is applying and upload official documents';
  subtitle = 'Account Holder (Main Applicant)';
  description =
    'Enter your legal name as it appears on your official Canadian identity documents, e.g., birth certificate, permanent resident card, passport.';
  documentsTitle = 'Documents';
  documentsDescription =
    'Upload your Notice of Assessment (NOA) or Notice of Reassessment (NORA) from Canada Revenue Agency for ';

  tip1 =
    'If you are uploading a copy of a NOA/NORA printed from the CRA website, ensure that the applicable name, tax year and tax return line 236 (net income) are included on the copy.';

  tip2 = `Scan the document, or take a photo of it.

  `;
  tipList = [
    'The entire document, from corner to corner',
    'At least 1000 pixels wide x 1500 pixels tall',
    'Rotate correctly (not upside down or sideways)',
    'In focus and easy to read',
    'A JPG, PNHG, GIF, BMP or PDF'
  ];

  assistanceYears: any[];
  constructor(
    private dataService: MspDataService,
    private _router: Router,
    //private _processService: ProcessService,
    cd: ChangeDetectorRef
  ) {
    super(cd);
    this.financialAssistApplication = this.dataService.finAssistApp;
    // if the country is blank or null or undefined then assign Canada By Default //DEF-153
    if (
      !this.financialAssistApplication.mailingAddress.country ||
      this.financialAssistApplication.mailingAddress.country.trim().length === 0
    ) {
      this.financialAssistApplication.mailingAddress.country = 'Canada';
    }
  }

  ngAfterViewInit() {
    this.personalInfoForm.valueChanges
      .pipe(
        debounceTime(250),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.dataService.saveFinAssistApplication();
      });
  }

  ngOnInit() {
    //  this.initProcessMembers(AssistancePersonalInfoComponent.ProcessStepNum, this._processService);
    const assistYears = this.financialAssistApplication.assistYears;
    let arr = [];
    const checkYear = (year: AssistanceYear) => {
      return year.apply ? year : null;
    };
    for (let year of assistYears) {
      arr.push(checkYear(year));
    }
    this.assistanceYears = arr
      .filter(itm => itm != null)
      .map(itm => {
        let { ...obj } = itm;
        obj.files = [];
        return obj;
      });

    this.documentsDescription += this.createDocumentDesc(this.assistanceYears);

    // this.documentsDescription += '.';

    console.log('arr', this.assistanceYears);
  }

  createDocumentDesc(years: any[]) {
    return years
      .map(itm => itm.year)
      .sort((a, b) => a - b)
      .reduce((a, b, i, arr) =>
        i === arr.length - 1 ? `${a} and ${b}.` : `${a}, ${b}`
      );
  }

  onChange($event) {
    // console.log('changes from child component triggering save: ', values);
    this.dataService.saveFinAssistApplication();
  }

  onSubmit($event) {
    this._router.navigate(['/assistance/retro']);
  }

  isValid(): boolean {
    return (
      this.dataService.finAssistApp.isUniquePhns &&
      this.dataService.finAssistApp.isUniqueSin
    );
  }

  get canContinue(): boolean {
    return this.isAllValid() && this.hasCountry();
  }

  // Final check to see if the country is present // DEF 153
  hasCountry(): boolean {
    if (
      this.financialAssistApplication.mailingAddress.country &&
      this.financialAssistApplication.mailingAddress.country.trim().length > 0
    ) {
      return true;
    } else {
      return false;
    }
  }

  saveAccountHolder(evt: MspPerson) {
    this.dataService.saveFinAssistApplication();
  }
}
