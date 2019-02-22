import { Component, ViewChild, OnInit, AfterViewInit, DoCheck } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MspDataService } from '../../service/msp-data.service';
import {FinancialAssistApplication}from '../../model/financial-assist-application.model';
import {MspImage} from '../../../msp/model/msp-image';
import {FileUploaderComponent} from '../../common/file-uploader/file-uploader.component';
import {MspImageErrorModalComponent} from '../../common/image-error-modal/image-error-modal.component';
import {Router} from '@angular/router';
import {ProcessService} from '../../service/process.service';


@Component({
  templateUrl: './retro-years.component.html'
})
export class AssistanceRetroYearsComponent implements AfterViewInit, DoCheck{

  static ProcessStepNum = 2;
  lang = require('./i18n');
  application: FinancialAssistApplication;

  @ViewChild('formRef') form: NgForm;
  @ViewChild('fileUploader') fileUploader: FileUploaderComponent;
  @ViewChild('mspImageErrorModal') mspImageErrorModal: MspImageErrorModalComponent;


  constructor(private dataService: MspDataService,
              private _router: Router,
              private _processService: ProcessService){
    this.application = this.dataService.finAssistApp;
  }

  ngDoCheck(): void {
    const valid = this.canContinue;
    this._processService.setStep(AssistanceRetroYearsComponent.ProcessStepNum, valid);
  }

  ngAfterViewInit(){
    this.form.valueChanges.subscribe( value => {
      this.dataService.saveFinAssistApplication();
    });
  }

  get docRequiredInstruction(): any{
    const docsRequiredYears: string = this.application.getAppliedForTaxYears().reduce(
      function(acc, value, idx){
        if (value.docsRequired){
          if (acc.length > 0){
            return acc + ', ' + value.year;
          }else{
            return acc + value.year;
          }
        }else{
          return acc;
        }
      }, ''
    );
    const applicantLine = this.lang('./en/index.js').applicantDocsRequired
      .replace('{taxYearsAppliedFor}', docsRequiredYears);

    const spouseLine = this.lang('./en/index.js').spouseDocsRequired
      .replace('{taxYearsAppliedFor}', docsRequiredYears);

    return {
      applicant: applicantLine,
      spouse: spouseLine
    };

  }

  getDocNotRequiredInstruction(){

    const docsNotRequiredYears: string = this.application.getAppliedForTaxYears().reduce(
      function(acc, value, idx){
        if (!value.docsRequired){
          if (acc.length > 0){
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

  addDoc(doc: MspImage){
    this.application.assistYeaDocs = this.application.assistYeaDocs.concat(doc);
    this.fileUploader.forceRender();
    this.dataService.saveFinAssistApplication();
  }

  errorDoc(evt: MspImage) {
    this.mspImageErrorModal.imageWithError = evt;
    this.mspImageErrorModal.showFullSizeView();
    this.mspImageErrorModal.forceRender();
  }

  deleteDoc(doc: MspImage){
    this.application.assistYeaDocs = this.application.assistYeaDocs
      .filter( d => {
        return d.id !== doc.id;
      });
    this.dataService.saveFinAssistApplication();
  }

  get hasSpouse(): boolean {
    return this.application.hasSpouseOrCommonLaw;
  }

  get docRequired(): boolean {
    const required = false;
    for (let i = 0; i < this.application.getAppliedForTaxYears().length; i++){
      console.log(this.application.getAppliedForTaxYears()[i]);
      if (this.application.getAppliedForTaxYears()[i].apply && this.application.getAppliedForTaxYears()[i].docsRequired){
        return true;
      }
    }
    return required;
  }

  get canContinue(): boolean {

    if (!this.docRequired) return true;

    if (this.docRequired && this.application.assistYeaDocs.length > 0) {
      return true;
    }

    return false;
  }

  continue(): void {
    this._processService.setStep(AssistanceRetroYearsComponent.ProcessStepNum, true);
    this._router.navigate(['/msp/assistance/review']);
  }
}
