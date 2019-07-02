import { Component, ViewChild, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MspDataService } from '../../../../services/msp-data.service';
import { MspImageErrorModalComponent } from '../../../msp-core/components/image-error-modal/image-error-modal.component';
import { CompletenessCheckService } from '../../../../services/completeness-check.service';
//import {ProcessService} from '../../service/process.service';
import { Router } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { FinancialAssistApplication } from '../../models/financial-assist-application.model';
import { MspImage } from '../../../../models/msp-image';

@Component({
  template: `
    <!-- <h1 [innerHTML]="lang('./en/index.js').pageTitle"></h1>
  <p class="helpblock intro" [innerHTML]="lang('./en/index.js').helpBlock"></p>
  <h2 [innerHTML]="lang('./en/index.js').declarationAndConsentTitle"></h2>
  <p [innerHTML]="lang('./en/index.js').declaration"></p> -->
    <common-page-section layout="noTips">
      <h2>{{ title }}</h2>
      <p>{{ declarationOne }}</p>
      <p>{{ declarationTwo }}</p>
    </common-page-section>
    <form #form="ngForm">
      <p>{{ questionApplicant }}</p>
      <div class="form-check form-check-inline mb-3">
        <input
          class="input-lg form-check-input"
          name="authorizedByApplicant"
          [(ngModel)]="application.authorizedByApplicant"
          (ngModelChange)="deleteAllDocs($event)"
          id="firstPersonAuthorize"
          type="checkbox"
        />
        <label class="form-check-label" for="firstPersonAuthorize">{{
          agreeLabel
        }}</label>
      </div>
      <!--     <div *ngIf="application.hasSpouseOrCommonLaw">
              <div class="strong" [innerHTML]="questionSpouse"></div>
              <div class="form-check form-check-inline">
                  <input class="input-lg form-check-input"
                  name="authorizedBySpouse"
                  [(ngModel)] = "application.authorizedBySpouse"
                  (ngModelChange) = "deleteAllDocs($event)"
                  id="secondPersonAuthorize" type="checkbox">
                  <label class="form-check-label" for="secondPersonAuthorize" [innerHTML]="lang('./en/index.js').agreeLabel"></label>
              </div>
          </div> -->
      <div>
        <p>{{ questionForAttorney }}</p>
        <div class="form-check form-check-inline mb-3">
          <input
            class="input-lg form-check-input"
            name="authorizedByAttorney"
            [(ngModel)]="application.authorizedByAttorney"
            (ngModelChange)="handleAuthorizedByAttorney($event)"
            id="authByAttorney"
            type="checkbox"
          />
          <label class="form-check-label" for="authByAttorney">
            {{ agreeLabel }}</label
          >
        </div>
      </div>

      <div style="margin-top: 20px;" *ngIf="application.authorizedByAttorney">
        <label for="">Power of Attorney Document (required)</label>
        <common-file-uploader
          #fileUploader
          [images]="application.powerOfAttorneyDocs"
          [id]="application.id"
          (onAddDocument)="addDocument($event)"
          (onErrorDocument)="errorDocument($event)"
          (onDeleteDocument)="deleteDocument($event)"
        >
          <span id="uploadInstruction" #uploadInstruction>
            Please upload required power of attorney documents
          </span>
        </common-file-uploader>
        <msp-image-error-modal #mspImageErrorModal></msp-image-error-modal>
      </div>
      <div class="row">
        <div class="col-lg-8">
          <common-captcha
            [apiBaseUrl]="captchaApiBaseUrl"
            [nonce]="application.uuid"
            (onValidToken)="application.authorizationToken = $event"
          ></common-captcha>
        </div>
      </div>
    </form>
  `
})
export class AssistanceAuthorizeSubmitComponent implements OnInit {
  static ProcessStepNum = 4;

  title = 'Authorize and submit your application';

  declarationOne = `The information I provide will be relevant to and used solely for the purpose of determining and verifying my entitlement to Retroactive Premium Assistance under the Medicare Protection Act, and will not be disclosed to any other party.
  `;
  declarationTwo = `I hereby declare that I resided in Canada as a Canadian citizen or holder of permanent resident status (landed immigrant) for at least 12 months immediately preceding the period for which I am applying for retroactive premium assistance. I am not exempt from liability to pay income tax by reason of any other Act.
  `;
  captchaApiBaseUrl: string;

  agreeLabel = 'Yes, I agree';

  application: FinancialAssistApplication;

  //@ViewChild('fileUploader') fileUploader: FileUploaderComponent;
  @ViewChild('mspImageErrorModal')
  mspImageErrorModal: MspImageErrorModalComponent;

  constructor(
    private dataService: MspDataService,
    private completenessCheck: CompletenessCheckService,
    private _router: Router //private _processService: ProcessService
  ) {
    this.application = this.dataService.finAssistApp;
    this.captchaApiBaseUrl = environment.appConstants.captchaApiBaseUrl;
  }

  @ViewChild('form') form: NgForm;

  ngOnInit() {
    /*  let oldUUID = this.application.uuid;
    this.application.regenUUID();
    this.dataService.saveFinAssistApplication();
    console.log('PA uuid updated: from %s to %s', oldUUID, this.dataService.finAssistApp.uuid);*/
  }

  ngAfterViewInit(): void {
    this.form.valueChanges.subscribe(() => {
      // console.log('authorization form change: %o', values);
      // this.onChange.emit(values);
      this.dataService.saveFinAssistApplication();
    });
  }

  addDocument(mspImage: MspImage) {
    this.application.powerOfAttorneyDocs = this.application.powerOfAttorneyDocs.concat(
      mspImage
    );
    //this.fileUploader.forceRender();
    this.dataService.saveFinAssistApplication();
  }

  errorDocument(evt: MspImage) {
    this.mspImageErrorModal.imageWithError = evt;
    this.mspImageErrorModal.showFullSizeView();
    this.mspImageErrorModal.forceRender();
  }

  deleteDocument(mspImage: MspImage) {
    // console.log('doc to be deleted: %o', mspImage);
    this.application.powerOfAttorneyDocs = this.application.powerOfAttorneyDocs.filter(
      (doc: MspImage) => {
        return doc.uuid !== mspImage.uuid;
      }
    );
    this.dataService.saveFinAssistApplication();
  }

  deleteAllDocs(doDelete: boolean) {
    if (doDelete) {
      this.application.powerOfAttorneyDocs = [];
      this.dataService.saveFinAssistApplication();
    }
  }

  handleAuthorizedByAttorney(byAttorney: boolean) {
    // console.log('Power of Attorney, %o', byAttorney);
    if (!byAttorney) {
      this.deleteAllDocs(!byAttorney);
    }
  }

  get authorized(): boolean {
    return this.completenessCheck.finAppAuthorizationCompleted();
  }

  get questionApplicant() {
    return `${this.applicantName}, do you agree?`;
  }

  get questionForAttorney() {
    return `I have a power of attorney and I'm applying on behalf of ${
      this.applicantName
    }`;
  }
  get applicantName() {
    return (
      this.application.applicant.firstName +
      ' ' +
      this.application.applicant.lastName
    );
  }
  get spouseName() {
    return (
      this.application.spouse.firstName + ' ' + this.application.spouse.lastName
    );
  }

  get canContinue(): boolean {
    return (
      this.authorized &&
      this.application.authorizationToken &&
      this.application.authorizationToken.length > 1
    );
  }

  continue() {
    //this._processService.setStep(AssistanceAuthorizeSubmitComponent.ProcessStepNum, true);

    // TODO:  Should this URL not be '/assistance/sending'
    this._router.navigate(['/benefit/sending']);
  }
}
