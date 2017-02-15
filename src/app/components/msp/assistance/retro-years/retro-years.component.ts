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

    // this calendar year
    let thisYear:number = moment().utc().year()-1;
    let pre = thisYear;
    while(--pre > thisYear - 7){

      let assistYr:AssistanceYear = new AssistanceYear();
      assistYr.year = pre;
      assistYr.apply = false;

      if(!this.containsYear(assistYr)){
        this.addYear(assistYr);
      }
    }
  }

  private containsYear(y: AssistanceYear){
    for(let i=0; i< this.years.length; i++){
      if(this.years[i].year === y.year){
        return true;
      }
    }
  }

  private addYear(y:AssistanceYear){
    this.years.push(y);
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

  get docRequired():boolean {
    let required = false;
    for(let i=0; i<this.years.length; i++){
      if(this.years[i].apply){
        return true;
      }
    }
    return required;
  }

}