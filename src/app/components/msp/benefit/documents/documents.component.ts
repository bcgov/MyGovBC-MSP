import {AfterViewInit, Component, DoCheck, OnInit, ViewChild} from '@angular/core';
import {MspDataService} from '../../service/msp-data.service';
import {FileUploaderComponent} from '../../common/file-uploader/file-uploader.component';
import {Router} from '@angular/router';
import {FinancialAssistApplication} from '../../model/financial-assist-application.model';
import {NgForm} from '@angular/forms';
import {MspImage} from '../../model/msp-image';
import {MspImageErrorModalComponent} from '../../common/image-error-modal/image-error-modal.component';
import {ProcessService} from '../../service/process.service';
import {BenefitApplication} from '../../model/benefit-application.model';
import {MspBenefitDataService} from '../../service/msp-benefit-data.service';

@Component({
  selector: 'msp-benefit-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})
export class BenefitDocumentsComponent  implements AfterViewInit, DoCheck {

    static ProcessStepNum = 2;
    lang = require('./i18n');
    application: BenefitApplication;

    @ViewChild('formRef') form: NgForm;
    @ViewChild('fileUploader') fileUploader: FileUploaderComponent;
    @ViewChild('mspImageErrorModal') mspImageErrorModal: MspImageErrorModalComponent;


    constructor(private dataService: MspBenefitDataService,
                private _router: Router,
                private _processService: ProcessService){
        this.application = this.dataService.benefitApp;
    }

    ngDoCheck(): void {
        const valid = this.canContinue;
        this._processService.setStep(BenefitDocumentsComponent.ProcessStepNum, valid);
    }

    ngAfterViewInit(){
        this.form.valueChanges.subscribe( value => {
            this.dataService.saveBenefitApplication();
        });
    }

    get docRequiredInstruction(): any{

        const applicantLine = this.lang('./en/index.js').applicantDocsRequired
            .replace('{taxYearsAppliedFor}', this.application.taxYear);

        const spouseLine = this.lang('./en/index.js').spouseDocsRequired
            .replace('{taxYearsAppliedFor}', this.application.taxYear);

        return {
            applicant: applicantLine,
            spouse: spouseLine
        };

    }

   /* Not needed
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

    }*/

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

   /* get docRequired(): boolean {
        const required = false;
        for (let i = 0; i < this.application.getAppliedForTaxYears().length; i++){
            if (this.application.getAppliedForTaxYears()[i].apply && this.application.getAppliedForTaxYears()[i].docsRequired){
                return true;
            }
        }
        return required;
    }*/

    get canContinue(): boolean {


        if ( this.application.assistYeaDocs.length > 0) {
            return true;
        }

        return false;
    }

    continue(): void {
        this._processService.setStep(BenefitDocumentsComponent.ProcessStepNum, true);
        this._router.navigate(['/msp/benefit/review']);
    }

}
