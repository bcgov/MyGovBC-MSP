import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import MspDataService from '../../service/msp-data.service';
import {FinancialAssistApplication}from '../../model/financial-assist-application.model';
import {AssistanceYear} from '../../model/assistance-year.model';
import {MspImage} from "../../../msp/model/msp-image";
import {FileUploaderComponent} from "../../common/file-uploader/file-uploader.component";
import {MspImageErrorModalComponent} from "../../common/image-error-modal/image-error-modal.component";
import {Router} from "@angular/router";
import ProcessService from "../../service/process.service";


@Component({
  templateUrl: './retro-years.component.html'
})
export class AssistanceRetroYearsComponent implements OnInit, AfterViewInit{
  static ProcessStepNum = 2;
  lang = require('./i18n');
  application: FinancialAssistApplication;
  years: AssistanceYear[];

  @ViewChild('formRef') form: NgForm;
  @ViewChild('fileUploader') fileUploader: FileUploaderComponent;
  @ViewChild('mspImageErrorModal') mspImageErrorModal: MspImageErrorModalComponent;


  constructor(private dataService: MspDataService,
              private _router: Router,
              private _processService: ProcessService){
    this.application = this.dataService.finAssistApp;
  }

  ngAfterViewInit(){
    this.form.valueChanges.subscribe( value => {
      this.dataService.saveFinAssistApplication();
    });
  }
  ngOnInit(){

  }
  get docRequiredInstruction(): any{
    let docsRequiredYears:string = this.application.getAppliedForTaxYears().reduce(
      function(acc, value, idx){
        if(value.docsRequired){
          if(acc.length > 0){
            return acc + ', ' + value.year;
          }else{
            return acc + value.year;
          }
        }else{
          return acc;
        }
      }, ''
    );
    let applicantLine = this.lang('./en/index.js').applicantDocsRequired
      .replace('{taxYearsAppliedFor}', docsRequiredYears);

    let spouseLine = this.lang('./en/index.js').spouseDocsRequired
      .replace('{taxYearsAppliedFor}', docsRequiredYears);
    
    return {
      applicant: applicantLine,
      spouse: spouseLine
    }
      
  }

  getDocNotRequiredInstruction(){

    let docsNotRequiredYears:string = this.application.getAppliedForTaxYears().reduce(
      function(acc, value, idx){
        if(!value.docsRequired){
          if(acc.length > 0){
            return acc + ', ' + value.year;
          }else{
            return acc + value.year;
          }
        }else{
          return acc;
        }
      }, ''
    );
    return this.lang('./en/index.js').docNotRequiredInstruction
      .replace('{notRequiredYears}', docsNotRequiredYears);
    
  }

  addDoc(doc:MspImage){
    this.application.assistYeaDocs = this.application.assistYeaDocs.concat(doc);
    this.fileUploader.forceRender();
    this.dataService.saveFinAssistApplication();
  }

  errorDoc(evt:MspImage) {
    this.mspImageErrorModal.imageWithError = evt;
    this.mspImageErrorModal.showFullSizeView();
    this.mspImageErrorModal.forceRender();
  }

  deleteDoc(doc:MspImage){
    this.application.assistYeaDocs = this.application.assistYeaDocs
      .filter( d=> {
        return d.id !== doc.id;
      });
    this.dataService.saveFinAssistApplication();
  }

  get hasSpouse():boolean {
    return this.application.hasSpouseOrCommonLaw;
  }
  
  get docRequired():boolean {
    let required = false;
    for(let i=0; i<this.application.getAppliedForTaxYears().length; i++){
      if(this.application.getAppliedForTaxYears()[i].apply && this.application.getAppliedForTaxYears()[i].docsRequired){
        return true;
      }
    }
    return required;
  }

  continue(): void {
    this._processService.setStep(AssistanceRetroYearsComponent.ProcessStepNum, true);
    this._router.navigate(['/msp/assistance/review']);
  }
}