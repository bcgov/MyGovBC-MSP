import {ChangeDetectorRef, Component, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {Router} from '@angular/router';
import {MspPhoneComponent} from '../../common/phone/phone.component';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {ProcessService} from '../../service/process.service';
import {NgForm} from '@angular/forms';
import {BenefitPersonalDetailComponent} from '../../benefit/personal-info/personal-detail/personal-detail.component';
import {MspAddressComponent} from '../../common/address/address.component';
import {BaseComponent} from '../../common/base.component';
import {BenefitApplication} from '../../model/benefit-application.model';
import {MspBenefitDataService} from '../../service/msp-benefit-data.service';


@Component({
   templateUrl: './personal-info.component.html',
    styleUrls: ['./personal-info.component.scss']
})
export class BenefitPersonalInfoComponent extends BaseComponent {

    static ProcessStepNum = 1;

    lang = require('./i18n');

    @ViewChild('formRef') personalInfoForm: NgForm;
    @ViewChildren(BenefitPersonalDetailComponent) personalDetailsComponent: QueryList<BenefitPersonalDetailComponent>;
    @ViewChild('address') address: MspAddressComponent;
    @ViewChild('phone') phone: MspPhoneComponent;

    benefitApplication: BenefitApplication;

    constructor(private dataService: MspBenefitDataService,
                private _router: Router,
                private _processService: ProcessService,
                private cd: ChangeDetectorRef) {
        super(cd);
        this.benefitApplication = this.dataService.benefitApp;
    }

    ngAfterViewInit() {

        this.personalInfoForm.valueChanges.pipe(
            debounceTime(250),
            distinctUntilChanged()
        ).subscribe( values => {
            this.dataService.saveFinAssistApplication();
        });
    }

    ngOnInit(){
        this.initProcessMembers(BenefitPersonalInfoComponent.ProcessStepNum, this._processService);
    }

    onChange(values: any) {
        // console.log('changes from child component triggering save: ', values);
        this.dataService.saveFinAssistApplication();
    }

    onSubmit(form: NgForm){
        this._router.navigate(['/msp/benefit/documents']);
    }

    isValid(): boolean {
        return this.dataService.finAssistApp.isUniquePhns && this.dataService.finAssistApp.isUniqueSin;
    }

    get canContinue(): boolean{
        return this.isAllValid();
    }

}
