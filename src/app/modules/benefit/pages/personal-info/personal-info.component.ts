import {ChangeDetectorRef, Component, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {Router} from '@angular/router';
import {MspPhoneComponent} from '../../../../components/msp/common/phone/phone.component';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {ProcessService} from '../../../../services/process.service';
import {NgForm} from '@angular/forms';
import {PersonalDetailsRetroSuppbenComponent} from '../../../msp-core/components/personal-details-retro-suppben/personal-details-retro-suppben.component';
import {MspAddressComponent} from '../../../msp-core/components/address/address.component';
import {BaseComponent} from '../../../../models/base.component';
import {BenefitApplication} from '../../models/benefit-application.model';
import {MspBenefitDataService} from '../../services/msp-benefit-data.service';
import { MspImage } from 'app/models/msp-image';
import { Container, CheckCompleteBaseService, RouteGuardService, AbstractPgCheckService } from 'moh-common-lib';
import { validatePHN } from 'app/modules/msp-core/models/validate-phn';


@Component({
   templateUrl: './personal-info.component.html',
    styleUrls: ['./personal-info.component.scss']
})
export class BenefitPersonalInfoComponent extends BaseComponent {

    static ProcessStepNum = 1;

    lang = require('./i18n');

    @ViewChild('formRef') personalInfoForm: NgForm;
    //@ViewChildren(BenefitPersonalDetailComponent) personalDetailsComponent: QueryList<BenefitPersonalDetailComponent>;
    @ViewChildren(PersonalDetailsRetroSuppbenComponent) personalDetailsComponent: QueryList<PersonalDetailsRetroSuppbenComponent>;
    @ViewChild('address') address: MspAddressComponent;
    @ViewChild('phone') phone: MspPhoneComponent;
    benefitApplication: BenefitApplication;

    constructor(private dataService: MspBenefitDataService,
                private _router: Router,
                private _processService: ProcessService,
                private cd: ChangeDetectorRef) {
        super(cd);
        this.benefitApplication = this.dataService.benefitApp;
        this._processService.setStep(BenefitPersonalInfoComponent.ProcessStepNum, false);
        // if the country is blank or null or undefined then assign Canada By Default //DEF-153
        if (!this.benefitApplication.mailingAddress.country || this.benefitApplication.mailingAddress.country.trim().length === 0 ) {
            this.benefitApplication.mailingAddress.country = 'Canada';
        }
    }

    ngAfterViewInit() {

        this.personalInfoForm.valueChanges.pipe(
            debounceTime(250),
            distinctUntilChanged()
        ).subscribe( values => {
            this.dataService.saveBenefitApplication();
        });
    }

    ngOnInit(){
        //this._processService.setPageIncomplete();
        this.initProcessMembers(BenefitPersonalInfoComponent.ProcessStepNum, this._processService);
    }

    onChange(values: any) {
        this.dataService.saveBenefitApplication();
    }

    onSubmit(form: NgForm){
        this._processService.setStep(BenefitPersonalInfoComponent.ProcessStepNum, true);
        this._router.navigate(['/benefit/spouse-info']);
    }

    isValid(): boolean {
        return this.dataService.benefitApp.isUniquePhns && this.dataService.benefitApp.isUniqueSin && validatePHN(this.dataService.benefitApp.applicant.previous_phn);
    }

    get canContinue(): boolean{
        //const allDocs: MspImage[][] = this.dataService.benefitApp.allPersons.filter(x => x).map(x => x.assistYeaDocs).filter(x => x)  ;
        //console.log(this.benefitApplication.applicant.assistYearDocs.length);
        if ( this.isAllValid() && this.benefitApplication.applicant.assistYearDocs && this.benefitApplication.applicant.assistYearDocs.length > 0) {
            return true;
        }
        return  false;
    }

}
