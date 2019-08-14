import { Component, ViewChild, OnInit, ChangeDetectorRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MspDataService } from '../../../../services/msp-data.service';
import { MspImageErrorModalComponent } from '../../../msp-core/components/image-error-modal/image-error-modal.component';
import { CompletenessCheckService } from '../../../../services/completeness-check.service';
//import {ProcessService} from '../../service/process.service';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { FinancialAssistApplication } from '../../models/financial-assist-application.model';
import { MspImage } from '../../../../models/msp-image';
import { AssistStateService } from '../../services/assist-state.service';
import { BaseComponent } from '../../../../models/base.component';

@Component({
  template: `
    <ng-container *ngIf="!stateSvc.submitted">
      <common-page-section layout="noTips">
        <h1>{{ title }}</h1>
        <p>
          {{ declarationOne }}<em>{{ declarationOneEm }}</em
          >{{ declarationOneB }}
        </p>

        <p>{{ declarationTwo }}</p>
      </common-page-section>
      <form #form="ngForm">
       <div>
          <p>{{ questionApplicant }}</p>
          <div class=" mb-3">
            <common-checkbox class="form-check-inline" label="{{agreeLabel}}"
                             [(data)]="application.authorizedByApplicant"
                             [required]='true'></common-checkbox>
            <common-error-container [displayError]="(touched$ | async) && !application.authorizedByApplicant">
              Field is required
            </common-error-container>
          </div>
        </div>
        <div>
          <p>{{ questionForAttorney }}</p>
          <div class="form-check form-check-inline mb-3">
            <common-checkbox label="{{poaAgreeLabel}}"
                             [(data)]="application.authorizedByAttorney"></common-checkbox>

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
            (imagesChange)="updateFiles($event)"
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
              (onValidToken)="setToken($event)"
            ></common-captcha>
          </div>
        </div>
      </form>
    </ng-container>
    <msp-confirmation *ngIf="stateSvc.submitted"></msp-confirmation>
  `
})
export class AssistanceAuthorizeSubmitComponent extends BaseComponent implements OnInit {

  title = 'Authorize and submit your application';

  declarationOne = `The information I provide will be relevant to and used solely for the purpose of determining and verifying my entitlement to Retroactive Premium Assistance under the
  `;
  declarationOneEm = 'Medicare Protection Act';
  declarationOneB = `, and will not be disclosed to any other party.`;
  declarationTwo = `I hereby declare that I resided in Canada as a Canadian citizen or holder of permanent resident status (landed immigrant) for at least 12 months immediately preceding the period for which I am applying for retroactive premium assistance. I am not exempt from liability to pay income tax by reason of any other Act.
  `;
  captchaApiBaseUrl: string;

  agreeLabel = 'Yes, I agree';

  poaAgreeLabel = 'Yes, I have Power of Attorney';

  private hasToken = false;
  touched$ = this.stateSvc.touched.asObservable();

  get questionApplicant() {
    return `${
      this.applicantName
    } (or representative with Power of Attorney), do you agree?`;
  }

  get questionForAttorney() {
    return `Do you have Power of Attorney to apply on behalf of ${
      this.applicantName
    }?`;
  }
  get applicantName() {
    return (
      this.application.applicant.firstName +
      ' ' +
      this.application.applicant.lastName
    );
  }

  application: FinancialAssistApplication;

  @ViewChild('mspImageErrorModal')
  mspImageErrorModal: MspImageErrorModalComponent;

  constructor(
    private dataService: MspDataService,
    cd: ChangeDetectorRef,
    //private completenessCheck: CompletenessCheckService,
    private route: ActivatedRoute,
    public stateSvc: AssistStateService
  ) {
    super(cd);
    this.application = this.dataService.finAssistApp;
    this.captchaApiBaseUrl = environment.appConstants.captchaApiBaseUrl;
  }

  @ViewChild('form') form: NgForm;

  ngOnInit() {
    this.stateSvc.setPageIncomplete( this.route.snapshot.routeConfig.path );
  }

  ngAfterViewInit(): void {
    this.subscriptionList.push(
      this.form.valueChanges.subscribe(() => {

        console.log( 'form: ', this.form );

        this.stateSvc.setPageValid( this.route.snapshot.routeConfig.path, this.isPageValid() );
        this.dataService.saveFinAssistApplication();
      })
    );

    setTimeout(
      () =>
      this.subscriptionList.push(
          this.stateSvc.touched.asObservable().subscribe(obs => {
            if (obs) {
              const controls = this.form.form.controls;
              for (const control in controls) {
                controls[control].markAsTouched();
              }
            }
          })
        ),
      500
    );
  }

  addDocument(mspImage: MspImage) {
    this.application.powerOfAttorneyDocs = this.application.powerOfAttorneyDocs.concat(
      mspImage
    );
    this.dataService.saveFinAssistApplication();
  }

  errorDocument(evt: MspImage) {
    this.mspImageErrorModal.imageWithError = evt;
    this.mspImageErrorModal.showFullSizeView();
    this.mspImageErrorModal.forceRender();
  }

  deleteDocument(mspImage: MspImage) {
    console.log(mspImage);
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
    if (!byAttorney) {
      this.deleteAllDocs(!byAttorney);
    }
  }
  updateFiles(evt) {
    console.log(evt);
    this.application.powerOfAttorneyDocs = evt;
    this.dataService.saveFinAssistApplication();
  }

  isPageValid(): boolean {
    let isValid = this.form.valid && this.hasToken;

    // Power of Attorney must have documents if selected
    if ( this.application.authorizedByAttorney ) {
      console.log( 'Need power of attorney docs' );
      isValid = isValid && this.application.powerOfAttorneyDocs.length > 0;
    }
    return isValid;
  }

  setToken(token): void {
    this.hasToken = true;

    this.stateSvc.setPageValid( this.route.snapshot.routeConfig.path, this.isPageValid() );
    this.application.authorizationToken  = token;
  }

  ngOnDestroy() {
    this.subscriptionList.forEach(itm => itm.unsubscribe());
  }
}
