import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {debounceTime} from 'rxjs/operators';
import {MspDataService} from '../../../service/msp-data.service';
import {Person} from '../../../model/person.model';
import {MspPhnComponent} from '../../../common/phn/phn.component';
import {NgForm} from '@angular/forms';
import {MspNameComponent} from '../../../common/name/name.component';
import {MspBirthDateComponent} from '../../../common/birthdate/birthdate.component';
import {BaseComponent} from '../../../common/base.component';
import {BenefitApplication} from '../../../model/benefit-application.model';
import {MspBenefitDataService} from '../../../service/msp-benefit-data.service';

@Component({
  selector: 'msp-benefit-personal-detail',
  templateUrl: './personal-detail.component.html',
  styleUrls: ['./personal-detail.component.scss']
})
export class BenefitPersonalDetailComponent extends BaseComponent {

    lang = require('./i18n');
    private benefitApp: BenefitApplication;

    @Input() person: Person;
    @ViewChild('name') name: MspNameComponent;
    @ViewChild('formRef') personalDetailsForm: NgForm;
    @ViewChild('birthdate') birthdate: MspBirthDateComponent;
    @ViewChild('phn') phn: MspPhnComponent;

    @Output() onChange = new EventEmitter<any>();

    constructor(private dataService: MspBenefitDataService,
                private cd: ChangeDetectorRef) {
        super(cd);
        this.benefitApp = this.dataService.benefitApp;
        this.person = this.dataService.benefitApp.applicant;
    }

    ngAfterViewInit() {

        this.personalDetailsForm.valueChanges.pipe(debounceTime(0))
            .subscribe( values => {
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
