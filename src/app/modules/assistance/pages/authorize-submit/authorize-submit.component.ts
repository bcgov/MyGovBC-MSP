import {Component, AfterViewInit, ViewChild, Output, Inject, OnInit} from '@angular/core';
import { NgForm } from '@angular/forms';
import { MspDataService } from '../../../../services/msp-data.service';
import {MspImageErrorModalComponent} from '../../../msp-core/components/image-error-modal/image-error-modal.component';
import {CompletenessCheckService} from '../../../../services/completeness-check.service';
//import {ProcessService} from '../../service/process.service';
import {Router} from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { FinancialAssistApplication } from '../../models/financial-assist-application.model';
import { MspFileUploaderComponent } from '../../../../components/msp/common/file-uploader/file-uploader.component';
import { ProcessService } from '../../../../components/msp/service/process.service';
import { MspImage } from '../../../../models/msp-image';

@Component({
  templateUrl: './authorize-submit.component.html'
})
export class AssistanceAuthorizeSubmitComponent implements OnInit{
  static ProcessStepNum = 4;
  lang = require('./i18n');
  captchaApiBaseUrl: string;

  application: FinancialAssistApplication;

  @ViewChild('fileUploader') fileUploader: MspFileUploaderComponent;
  @ViewChild('mspImageErrorModal') mspImageErrorModal: MspImageErrorModalComponent;

  constructor(private dataService: MspDataService,
              private completenessCheck: CompletenessCheckService,
              private _router: Router,
              //private _processService: ProcessService
              ){
    this.application = this.dataService.finAssistApp;
    this.captchaApiBaseUrl = environment.appConstants.captchaApiBaseUrl;

  }

  @ViewChild('form') form: NgForm;

  ngOnInit(){
  /*  let oldUUID = this.application.uuid;
    this.application.regenUUID();
    this.dataService.saveFinAssistApplication();
    console.log('PA uuid updated: from %s to %s', oldUUID, this.dataService.finAssistApp.uuid);*/
  }

  ngAfterViewInit(): void {
    this.form.valueChanges.subscribe(values => {
      // console.log('authorization form change: %o', values);
      // this.onChange.emit(values);
      this.dataService.saveFinAssistApplication();
    });
  }

  addDocument(mspImage: MspImage) {
    this.application.powerOfAttorneyDocs = this.application.powerOfAttorneyDocs.concat(mspImage);
    this.fileUploader.forceRender();
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

  deleteAllDocs(doDelete: boolean){
    if (doDelete){
      this.application.powerOfAttorneyDocs = [];
      this.dataService.saveFinAssistApplication();
    }
  }

  handleAuthorizedByAttorney(byAttorney: boolean){
    // console.log('Power of Attorney, %o', byAttorney);
    if (!byAttorney){
      this.deleteAllDocs(!byAttorney);
    }
  }

  get authorized(): boolean {
    return this.completenessCheck.finAppAuthorizationCompleted();
  }

  get questionApplicant(){
    return this.lang('./en/index.js').doYouAgreeLabel.replace('{name}', this.applicantName);
  }
  get questionSpouse(){
    return this.lang('./en/index.js').doYouAgreeLabel.replace('{name}', this.spouseName);
  }
  get questionForAttorney(){
    return this.lang('./en/index.js').attorneyDoYouAgreeLabel.replace('{applicantName}', this.applicantName);
  }
  get applicantName(){
    return this.application.applicant.firstName + ' ' + this.application.applicant.lastName;
  }
  get spouseName(){
    return this.application.spouse.firstName + ' ' + this.application.spouse.lastName;
  }

  get canContinue(): boolean {
    return this.authorized &&
      this.application.authorizationToken &&
      this.application.authorizationToken.length > 1;
  }

  continue() {
    //this._processService.setStep(AssistanceAuthorizeSubmitComponent.ProcessStepNum, true);
   
    // TODO:  Should this URL not be '/assistance/sending'
    this._router.navigate(['/benefit/sending']);
  }
}
