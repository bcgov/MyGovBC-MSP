import {
    Component, Input, Output, EventEmitter,
    ViewChild, ElementRef, ChangeDetectorRef
} from '@angular/core';
import { state, trigger, style, } from '@angular/animations';
import * as _ from 'lodash';
import {BaseComponent} from '../../../../models/base.component';
import { MspAccountApp } from '../../models/account.model';
import { Address } from 'moh-common-lib';
import { MspAccountMaintenanceDataService } from '../../services/msp-account-data.service';
import { StatusInCanada, CanadianStatusReason, CanadianStatusStrings } from '../../../msp-core/models/canadian-status.enum';
import { statusRules, statusReasonRules } from '../../../msp-core/components/canadian-status/canadian-status.component';
import { Relationship } from 'app/models/relationship.enum';
import { MspPerson } from '../../../../components/msp/model/msp-person.model';

@Component({
        selector: 'msp-account-personal-details',
        templateUrl: './personal-details.component.html',

        animations: [
            trigger('shrinkOut', [
                state('in', style({display: 'none'})),
                state('out', style({display: 'block'}))
                // transition('* => *', animate(500))
            ]),

            trigger('shrinkOutStatus', [
                state('in', style({display: 'none'})),
                state('out', style({display: 'block'}))
                // transition('* => *', animate(500))
            ]),

            trigger('genderListSignal', [
                state('in', style({display: 'none'})),
                state('out', style({display: 'block'}))
                // transition('* => *', animate(500))
            ]),

            trigger('institutionWorkSignal', [
                state('in', style({display: 'none'})),
                state('out', style({display: 'block'}))
                // transition('* => *', animate(500))
            ])
        ]

    }
)

export class AccountPersonalDetailsComponent extends BaseComponent {
    //lang = require('./i18n');
    langStatus = CanadianStatusStrings;
    //langAccountActivities = require('../../../../components/msp/common/account-activities/i18n');
    //langDocuments = require('../../../../../components/msp/common/documents/i18n');

    // Expose some types to template
    Activities: typeof CanadianStatusReason = CanadianStatusReason;
    Relationship: typeof Relationship = Relationship;
    StatusInCanada: typeof StatusInCanada = StatusInCanada;

   // @ViewChild('formRef') form: NgForm;

    @ViewChild('gender') gender: ElementRef;
  //  @ViewChild('birthDate') birthdate: MspBirthDateComponent;
 //   @ViewChild('name') name: ElementRef;
  //  @ViewChild('phn') phn: MspPhnComponent;
   // @ViewChild('phone') phone: MspPhoneComponent;
    //@ViewChild(MspStatusInCanadaRadioComponent) statusRadioComponents: MspStatusInCanadaRadioComponent;

    @Input() person: MspPerson;
    @Input() id: string;
    public buttonClass: string = 'btn btn-default btn-xs pull-right';
    public defaultCountry = 'CANADA';
    public defaultProvince = 'BRITISH COLUMBIA';


    /**
     * Field is generally True.Set it false in special scenarios where showError is true but the address field need not to be highighted. .Use this field to overrider showError.  For example:'Removal of spouse' address field is not mandatory where other fields are mandatory.
     *
     */
    @Input() showErrorAddress: boolean = true;

    @Input() showError: boolean;


    /** Hides the 'Clear Spouse/Child' button, and the <hr> at the end of the component. Useful in layouts where this form must be embedded in a larger form.. */
    @Input() embedded: boolean = false;

    /**
     *
     * In add/remove screen , address field is not mandatory. To handle , this field is introduced.
     * This field is set to true in PI update Personal information Page only.Evverywhere else its optional
     */
    @Input() addressRequired: boolean = false;
    /** Is the PHN field required? In cases where the dependent is NOT an existing beneficiary, then PHN is optional, and may not be known. */
    @Input() requirePHN: boolean = true;
    @Output() notifyChildRemoval: EventEmitter<MspPerson> = new EventEmitter<MspPerson>();
    @Output() notifySpouseRemoval: EventEmitter<MspPerson> = new EventEmitter<MspPerson>();
    @Output() onChange: EventEmitter<any> = new EventEmitter<any>();
    shrinkOut: string;
    shrinkOutStatus: string;
    genderListSignal: string;
    institutionWorkSignal: string;
    mspAccountApp: MspAccountApp;
    public label: string = 'PHN 333';

    constructor(private el: ElementRef,
                private cd: ChangeDetectorRef, private dataService: MspAccountMaintenanceDataService) {
        super(cd);
        this.mspAccountApp = this.dataService.getMspAccountApp();
        this.person = this.dataService.getMspAccountApp().applicant ;
    }


    institutionList: string[] = ['Yes', 'No'];

    /**
     * Gets status available to the current person
     */
    get statusInCanada(): StatusInCanada[] {
        return statusRules(this.person.relationship);
    }



    setStatus(value: StatusInCanada, p: MspPerson) {
        p.status = value;
        p.currentActivity = null;

        if (p.status !== StatusInCanada.CitizenAdult) {
        //    p.institutionWorkHistory = 'No'; DEAM doesnt use it
        }
        this.onChange.emit(value);
    }

    setActivity(value: CanadianStatusReason) {
        this.person.currentActivity = value;
        this.person.movedFromProvinceOrCountry = '';
        this.onChange.emit(value);
    }

    setName(evt: any) {
        this.person.firstName = evt.first_name;
        this.person.middleName = evt.middle_name;
        this.person.lastName = evt.last_name;

        console.log(this.person);
        console.log(evt);
        this.onChange.emit(evt);
    }

    setGender(evt: any) {
        this.person.gender = evt;
        console.log(this.person);
        console.log(evt);
        this.onChange.emit(evt);
    }


    toggleMailingSameAsResidentialAddress(evt: boolean) {
        //this.person.mailingSameAsResidentialAddress = evt;
        if (evt) {
            this.person.mailingAddress = new Address();
        }
        //this.dataService.saveMspAccountApp();
    }

    handleAddressUpdate(evt: any) {
        console.log('Abhi Address --> ');
        console.log(evt);
       // this.dataService.saveMspAccountApp();
        this.emitIsFormValid();
        this.onChange.emit();
    }


    /**
     * Gets the available reason for given the known status
     */
    get activities(): CanadianStatusReason[] {
        return statusReasonRules(this.person.relationship, this.person.status);
    }


    ngAfterContentInit() {
        super.ngAfterContentInit();


        this.cd.detectChanges();
        /**
         * Load an empty row to screen
         */
        if (this.person.relationship === Relationship.Spouse) {
            window.scrollTo(0, this.el.nativeElement.offsetTop);
        }
    }


    removeChild(): void {
        this.notifyChildRemoval.emit(this.person);
        // this.notifyChildRemoval.next(id);
    }

    removeSpouse(): void {
        this.notifySpouseRemoval.emit(this.person);
    }


    get hasValidCurrentActivity(): boolean {
        const v = _.isNumber(this.person.currentActivity);
        return v;
    }

    get isInstitutionListShown() {
        return this.institutionWorkSignal === 'out';
    }

    handleHealthNumberChange(evt: string) {
        this.person.healthNumberFromOtherProvince = evt;
        this.onChange.emit(evt);

    }




    isValid(): boolean {
        if (!this.person) {
            if (this.addressRequired) {
                if (!this.person.residentialAddress ) { //|| !this.person.residentialAddress.isValid ) {
                    return false;
                }
            }
            // residential address if exists , it shud be BC

            //if (!this.person.residentialAddress ) { // && this.person.residentialAddress.isValid) {
               /* if (!this.person.residentialAddress){
                    return false ;
                }*/
           // }


            /*if (!this.person.mailingSameAsResidentialAddress) {
                if (!this.person.mailingAddress.isValid){
                    return false;
                }
            }*/


        }

        return true;
    }
}
