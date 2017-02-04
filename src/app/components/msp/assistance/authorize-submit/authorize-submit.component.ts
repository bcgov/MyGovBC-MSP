import { Component, AfterViewInit, ViewChild, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import MspDataService from '../../service/msp-data.service';
import {FinancialAssistApplication} from "../../model/financial-assist-application.model";
import {MspImage} from '../../model/msp-image';
import {MspImageErrorModalComponent} from "../../common/image-error-modal/image-error-modal.component";
import {FileUploaderComponent} from "../../common/file-uploader/file-uploader.component";
@Component({
  templateUrl: './authorize-submit.component.html'
})
export class AssistanceAuthorizeSubmitComponent {
  lang = require('./i18n');

  application: FinancialAssistApplication;

  @ViewChild('fileUploader') fileUploader: FileUploaderComponent;
  @ViewChild('mspImageErrorModal') mspImageErrorModal: MspImageErrorModalComponent;

  constructor(private dataService: MspDataService){
    this.application = this.dataService.finAssistApp;
  }

  @ViewChild('form') form: NgForm;

  ngAfterViewInit(): void {
    this.form.valueChanges.subscribe(values => {
      // console.log('authorization form change: %o', values);
      // this.onChange.emit(values);
      this.dataService.saveFinAssistApplication();
    });
  }
  
  addDocument(mspImage:MspImage) {
    this.application.powerOfAttorneyDocs.push(mspImage);
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
}