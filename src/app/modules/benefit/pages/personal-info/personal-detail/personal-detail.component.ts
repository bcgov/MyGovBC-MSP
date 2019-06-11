import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {debounceTime} from 'rxjs/operators';
import {MspPerson} from '../../../../../components/msp/model/msp-person.model';
//import {PhnComponent} from 'moh-common-lib';
import {NgForm} from '@angular/forms';
import {MspNameComponent} from '../../../../../components/msp/common/name/name.component';
import {MspBirthDateComponent} from '../../../../msp-core/components/birthdate/birthdate.component';
import {BaseComponent} from '../../../../../components/msp/common/base.component';
import {BenefitApplication} from '../../../../../components/msp/model/benefit-application.model';
import {MspBenefitDataService} from '../../../services/msp-benefit-data.service';

@Component({
  selector: 'msp-benefit-personal-detail',
  templateUrl: './personal-detail.component.html',
  styleUrls: ['./personal-detail.component.scss']
})
export class BenefitPersonalDetailComponent extends BaseComponent {

    lang = require('./i18n');
    public dateLabel = 'BirthDate1';
    private benefitApp: BenefitApplication;

    @Input() person: MspPerson;
    @ViewChild('name') name: MspNameComponent;
    @ViewChild('formRef') personalDetailsForm: NgForm;
    @ViewChild('birthdate') birthdate: MspBirthDateComponent;
    //@ViewChild('phn') phn: PhnComponent;

    @Output() onChange = new EventEmitter<any>();

    constructor(private dataService: MspBenefitDataService,
                private cd: ChangeDetectorRef) {
        super(cd);
        this.benefitApp = this.dataService.benefitApp;
        this.person = this.dataService.benefitApp.applicant;
        console.log(this.person);
    }

    ngAfterViewInit() {
        console.log(this.birthdate);
        this.personalDetailsForm.valueChanges.pipe(debounceTime(0))
            .subscribe( values => {
                console.log(this.person.dob_day);
                console.log(this.person.dob_month);
                console.log(this.person.dob_year);
                console.log(this.person.dob);
                this.onChange.emit(values);
            });
    }


    isSinUnique(): boolean {
        return this.dataService.benefitApp.isUniqueSin;
    }

    getSinList(): string[]{
        return this.benefitApp.allPersons.map(x => x.sin);
    }


}
