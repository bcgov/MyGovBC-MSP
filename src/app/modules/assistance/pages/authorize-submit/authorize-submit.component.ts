import { Component, ViewChild, OnInit, ChangeDetectorRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MspDataService } from '../../../../services/msp-data.service';
import { MspImageErrorModalComponent } from '../../../msp-core/components/image-error-modal/image-error-modal.component';
//import {ProcessService} from '../../service/process.service';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { FinancialAssistApplication } from '../../models/financial-assist-application.model';
import { AssistStateService } from '../../services/assist-state.service';
import { BaseComponent } from '../../../../models/base.component';
import { CommonImage } from 'moh-common-lib';

@Component({
  templateUrl: './authorize-submit.component.html'
})
export class AssistanceAuthorizeSubmitComponent extends BaseComponent implements OnInit {

  title = 'Authorize and submit your application';

  declarationOne = `The information I provide will be relevant to and used solely for the purpose of determining and verifying my entitlement to Retroactive Premium Assistance under the
  `;
  declarationOneEm = 'Medicare Protection Act';
  declarationOneB = `, and will not be disclosed to any other party.`;
  declarationTwo = `I hereby declare that I resided in Canada as a Canadian citizen or holder of permanent resident status (landed immigrant) for at least 12 months immediately preceding the period for which I am applying for Retroactive Premium Assistance. I am not exempt from liability to pay income tax by reason of any other Act.
  `;
  captchaApiBaseUrl: string;

  agreeLabel = 'Yes, I agree';

  poaAgreeLabel = 'Yes, I have Power of Attorney or another legal representation agreement';

  private hasToken = false;
  touched$ = this.stateSvc.touched.asObservable();

  get questionApplicant() {
    return `${
      this.applicantName
      } (or legal representative), do you agree?`;
  }

  get questionForAttorney() {
    return `Note: If you have Power of Attorney document (or another legal representation document) to apply on behalf of ${this.applicantName}, please upload it.`;
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
    this.stateSvc.setPageIncomplete(this.route.snapshot.routeConfig.path);
  }

  ngAfterViewInit(): void {
    this.subscriptionList.push(
      this.form.valueChanges.subscribe(() => {

        console.log('form: ', this.form);

        this.stateSvc.setPageValid(this.route.snapshot.routeConfig.path, this.isPageValid());
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

  addDocument(mspImage: CommonImage) {
    this.application.powerOfAttorneyDocs = this.application.powerOfAttorneyDocs.concat(
      mspImage
    );
    this.dataService.saveFinAssistApplication();
  }

  errorDocument(evt: CommonImage) {
    this.mspImageErrorModal.imageWithError = evt;
    this.mspImageErrorModal.showFullSizeView();
    this.mspImageErrorModal.forceRender();
  }

  deleteDocument(mspImage: CommonImage) {
    console.log(mspImage);
    this.application.powerOfAttorneyDocs = this.application.powerOfAttorneyDocs.filter(
      (doc: CommonImage) => {
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

    console.log( 'isPageValid: ', isValid, this.form.valid, this.hasToken, this.form );

    // Power of Attorney must have documents if selected
    if (this.application.authorizedByAttorney) {
      console.log('Need power of attorney docs');
      isValid = isValid && this.application.powerOfAttorneyDocs.length > 0;
    }
    return isValid;
  }

  setToken(token): void {
    this.hasToken = true;

    this.stateSvc.setPageValid(this.route.snapshot.routeConfig.path, this.isPageValid());
    this.application.authorizationToken = token;
  }

  ngOnDestroy() {
    this.subscriptionList.forEach(itm => itm.unsubscribe());
  }
}
