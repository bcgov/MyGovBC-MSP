import {AfterViewInit,EventEmitter, Component, DoCheck, ViewChild, Input, Output} from '@angular/core';
import {Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {MspImage} from '../../../../models/msp-image';
import {MspImageErrorModalComponent} from '../../../msp-core/components/image-error-modal/image-error-modal.component';
import {ProcessService} from '../../../../services/process.service';
import {BenefitApplication} from '../../models/benefit-application.model';
import {MspBenefitDataService} from '../../services/msp-benefit-data.service';


@Component({
  selector: 'msp-benefit-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})
export class BenefitDocumentsComponent  implements AfterViewInit, DoCheck {

    static ProcessStepNum = 2;
    lang = require('./i18n');
    @Input() application: BenefitApplication;
    @Input() hasSpouse: boolean;

    @Output() docActionEvent = new EventEmitter<any>();

    @ViewChild('formRef') form: NgForm;
    //@ViewChild('fileUploader') fileUploader: FileUploaderComponent;
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
        this.form.valueChanges.subscribe( () => {
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
       // this.fileUploader.forceRender();
        this.dataService.saveFinAssistApplication();
        this.docActionEvent.emit(doc);

    }

    errorDoc(evt: MspImage) {
        this.mspImageErrorModal.imageWithError = evt;
        this.mspImageErrorModal.showFullSizeView();
        this.mspImageErrorModal.forceRender();
        this.docActionEvent.emit(evt);
    }

    deleteDoc(doc: MspImage){
        this.application.assistYeaDocs = this.application.assistYeaDocs
            .filter( d => {
                return d.id !== doc.id;
            });
        this.dataService.saveFinAssistApplication();
        this.docActionEvent.emit(doc);
    }

    get hasSpouse1(): boolean {
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
        this._router.navigate(['/benefit/review']);
    }

}
