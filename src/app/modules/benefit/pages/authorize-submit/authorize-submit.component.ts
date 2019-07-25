import {Component, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {CompletenessCheckService} from '../../../../services/completeness-check.service';
import {ProcessService} from '../../../../services/process.service';
import {MspImageErrorModalComponent} from '../../../msp-core/components/image-error-modal/image-error-modal.component';
import {environment} from '../../../../../environments/environment';
import {NgForm} from '@angular/forms';
import {MspImage} from '../../../../models/msp-image';
import {BenefitApplication} from '../../models/benefit-application.model';
import {MspBenefitDataService} from '../../services/msp-benefit-data.service';

@Component({
  selector: 'msp-authorize-submit',
  templateUrl: './authorize-submit.component.html',
  styleUrls: ['./authorize-submit.component.scss']
})
export class BenefitAuthorizeSubmitComponent {

    static ProcessStepNum = 5;
    lang = require('./i18n');
    captchaApiBaseUrl: string;

    application: BenefitApplication;

   // @ViewChild('fileUploader') fileUploader: FileUploaderComponent;
    @ViewChild('mspImageErrorModal') mspImageErrorModal: MspImageErrorModalComponent;

    constructor(private dataService: MspBenefitDataService,
                private completenessCheck: CompletenessCheckService,
                private _router: Router,
                private _processService: ProcessService){
        this.application = this.dataService.benefitApp;
        this.captchaApiBaseUrl = environment.appConstants.captchaApiBaseUrl;

    }

    @ViewChild('form') form: NgForm;

    ngAfterViewInit(): void {
        this.form.valueChanges.subscribe(values => {
            // console.log('authorization form change: %o', values);
            // this.onChange.emit(values);
            this.dataService.saveBenefitApplication();
        });
    }

    addDocument(mspImage: MspImage) {
        this.application.powerOfAttorneyDocs = this.application.powerOfAttorneyDocs.concat(mspImage);
     //   this.fileUploader.forceRender();
        this.dataService.saveBenefitApplication();
    }

    uploadDocument(evt: Array<any>) {
        console.log('evt', evt);
        this.application.powerOfAttorneyDocs = evt;
        this.dataService.saveBenefitApplication();
        //this.docActionEvent.emit(evt);
        //this.onChange.emit(evt);
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
        this.application.powerOfAttorneyDocs = [];
        this.dataService.saveBenefitApplication();
    }

    deleteAllDocs(doDelete: boolean){
        if (doDelete){
            //this.application.powerOfAttorneyDocs = [];
            this.dataService.saveBenefitApplication();
        }
    }

    handleAuthorizedByAttorney(byAttorney: boolean){
        // console.log('Power of Attorney, %o', byAttorney);
        if (!byAttorney){
            this.deleteAllDocs(!byAttorney);
        }
    }

    get authorized(): boolean {
        return this.finAppAuthorizationCompleted();
    }

    //TODO check this logic again...
    finAppAuthorizationCompleted(): boolean {
        const familyAuth = (this.application.authorizedByApplicant ) &&
               (this.application.hasSpouseOrCommonLaw && this.application.authorizedBySpouse || !this.application.hasSpouseOrCommonLaw);

        const attorneyAUth = this.application.authorizedByAttorney && this.application.powerOfAttorneyDocs.length > 0;

        if (this.application.authorizationToken == null) return false;
        return familyAuth === true || attorneyAUth === true;
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
        this._processService.setStep(BenefitAuthorizeSubmitComponent.ProcessStepNum, true);
        this._router.navigate(['/benefit/sending']);
    }
}
