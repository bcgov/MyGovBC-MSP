import {Component, AfterViewInit, ViewChild, Output, Inject, OnInit} from '@angular/core';
import { NgForm } from '@angular/forms';
import { MspDataService } from '../../service/msp-data.service';
import {FinancialAssistApplication} from "../../model/financial-assist-application.model";
import {MspImage} from '../../model/msp-image';
import {MspImageErrorModalComponent} from "../../common/image-error-modal/image-error-modal.component";
import {FileUploaderComponent} from "../../common/file-uploader/file-uploader.component";
import {CompletenessCheckService} from '../../service/completeness-check.service';
import {ProcessService} from "../../service/process.service";
import {Router} from "@angular/router";

@Component({
  templateUrl: './authorize-submit.component.html'
})
export class AssistanceAuthorizeSubmitComponent implements OnInit{
  static ProcessStepNum = 4;
  lang = require('./i18n');
  captchaApiBaseUrl:string;

  application: FinancialAssistApplication;

  @ViewChild('fileUploader') fileUploader: FileUploaderComponent;
  @ViewChild('mspImageErrorModal') mspImageErrorModal: MspImageErrorModalComponent;

  constructor(private dataService: MspDataService,
              private completenessCheck:CompletenessCheckService,
              @Inject('appConstants') private appConstants: Object,
              private _router: Router,
              private _processService: ProcessService){
    this.application = this.dataService.finAssistApp;
    this.captchaApiBaseUrl = this.appConstants["captchaApiBaseUrl"];
  }

  @ViewChild('form') form: NgForm;

  ngOnInit(){
    let oldUUID = this.application.uuid;
    this.application.regenUUID();
    this.dataService.saveFinAssistApplication();
    console.log('PA uuid updated: from %s to %s', oldUUID, this.dataService.finAssistApp.uuid);
  }

  ngAfterViewInit(): void {
    this.form.valueChanges.subscribe(values => {
      // console.log('authorization form change: %o', values);
      // this.onChange.emit(values);
      this.dataService.saveFinAssistApplication();
    });
  }
  
  addDocument(mspImage:MspImage) {
    this.application.powerOfAttorneyDocs = this.application.powerOfAttorneyDocs.concat(mspImage);
    this.fileUploader.forceRender();
    this.dataService.saveFinAssistApplication();
  }

  errorDocument(evt:MspImage) {
    this.mspImageErrorModal.imageWithError = evt;
    this.mspImageErrorModal.showFullSizeView();
    this.mspImageErrorModal.forceRender();
  }

  deleteDocument(mspImage:MspImage) {
    // console.log('doc to be deleted: %o', mspImage);
    this.application.powerOfAttorneyDocs = this.application.powerOfAttorneyDocs.filter(
      (doc:MspImage) => {
        return doc.uuid !== mspImage.uuid;
      }
    );
    this.dataService.saveFinAssistApplication();
  }

  deleteAllDocs(doDelete:boolean){
    if(doDelete){
      this.application.powerOfAttorneyDocs = [];
      this.dataService.saveFinAssistApplication();
    }
  }

  handleAuthorizedByAttorney(byAttorney:boolean){
    // console.log('Power of Attorney, %o', byAttorney);
    if(!byAttorney){
      this.deleteAllDocs(!byAttorney);      
    }
  }

  get authorized():boolean {
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

  get canContinue():boolean {
    return this.authorized &&
      this.application.authorizationToken &&
      this.application.authorizationToken.length > 1;
  }

  continue() {
    this._processService.setStep(AssistanceAuthorizeSubmitComponent.ProcessStepNum, true);
    this._router.navigate(['/msp/assistance/sending']);
  }
}