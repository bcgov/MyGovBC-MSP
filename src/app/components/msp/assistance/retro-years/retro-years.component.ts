import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import * as moment from 'moment';
import { FormGroup, NgForm, AbstractControl } from '@angular/forms';

import MspDataService from '../../service/msp-data.service';
import {FinancialAssistApplication}from '../../model/financial-assist-application.model';
import {AssistanceYear} from '../../model/assistance-year.model';
import {MspImage} from "../../../msp/model/msp-image";
import {FileUploaderComponent} from "../../common/file-uploader/file-uploader.component";
import {MspImageErrorModalComponent} from "../../common/image-error-modal/image-error-modal.component";


@Component({
  templateUrl: './retro-years.component.html'
})
export class AssistanceRetroYearsComponent implements OnInit, AfterViewInit{
  lang = require('./i18n');
  application: FinancialAssistApplication;
  years: AssistanceYear[];

  @ViewChild('formRef') form: NgForm;
  @ViewChild('fileUploader') fileUploader: FileUploaderComponent;
  @ViewChild('mspImageErrorModal') mspImageErrorModal: MspImageErrorModalComponent;


  constructor(private dataService: MspDataService){
    this.application = this.dataService.finAssistApp;
  }

  ngAfterViewInit(){
    this.form.valueChanges.subscribe( value => {
      this.dataService.saveFinAssistApplication();
    });
  }
  ngOnInit(){
    this.years = this.application.assistYears;

    if(!this.years || this.years.length < 1){
      // this calendar year
      let thisYear:number = this.application.MostRecentTaxYear;
      let pre = thisYear;
      while(pre > thisYear - 6){

        let assistYr:AssistanceYear = new AssistanceYear();
        assistYr.year = pre;
        assistYr.apply = false;

        //NOA docs are required by default except for the current tax year.
        assistYr.docsRequired = true;
        if (pre == this.application.MostRecentTaxYear) {
          assistYr.docsRequired = false;
          assistYr.apply = true;
        }
        this.years.push(assistYr);
        pre--;
      }
    }
  }

  private containsYear(y: AssistanceYear){
    for(let i=0; i< this.years.length; i++){
      if(this.years[i].year === y.year){
        return true;
      }
    }

    return false;
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
    for(let i=0; i<this.years.length; i++){
      if(this.years[i].apply && this.years[i].docsRequired){
        return true;
      }
    }
    return required;
  }

}