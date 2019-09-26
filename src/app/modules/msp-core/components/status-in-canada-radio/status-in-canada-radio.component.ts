import {ChangeDetectorRef, Component, Input, Output, EventEmitter, ViewChild} from '@angular/core';
import {MspPerson} from '../../../../components/msp/model/msp-person.model';
import {BaseComponent} from '../../../../models/base.component';
import {ServicesCardDisclaimerModalComponent} from '../services-card-disclaimer/services-card-disclaimer.component';
import { statusRules, statusReasonRules, getStatusReasonStrings } from '../canadian-status/canadian-status.component';
import { StatusInCanada, CanadianStatusReason } from '../../models/canadian-status.enum';
import { Relationship } from '../../../../models/relationship.enum';

// TODO: Remove component after add-dependent done in account module
@Component({
    selector: 'msp-status-in-canada-radio',
    templateUrl: './status-in-canada-radio.component.html',
    styleUrls: ['./status-in-canada-radio.component.scss']
})
export class MspStatusInCanadaRadioComponent extends BaseComponent {
    lang = require('./i18n');

    langAccountActivities: string[] = getStatusReasonStrings();

    Activities: typeof CanadianStatusReason = CanadianStatusReason;
    StatusInCanada: typeof StatusInCanada = StatusInCanada;
    Relationship: typeof Relationship = Relationship;

    @Input() person: MspPerson;
    @Output() onChange: EventEmitter<void> = new EventEmitter<void>();
    @Input() showError: boolean;
    @ViewChild('mspServicesCardModal') servicesCardDisclaimerModalComponent: ServicesCardDisclaimerModalComponent;
    @Input() showServicesCardModal: boolean;


    constructor(cd: ChangeDetectorRef) {
        super(cd);
    }

    setStatus(value: StatusInCanada, p: MspPerson) {
        p.status = value;
        p.currentActivity = null;

        if (p.status !== StatusInCanada.CitizenAdult) {
            p.hasBeenReleasedFromArmedForces = null;
            p.nameOfInstitute = null;
            p.dischargeYear = null;
            p.dischargeMonth = null;
            p.dischargeDay = null;
        }
        if (this.showServicesCardModal) {
            // For account change ,  children under 19 are excluded from showing pop up
            const isCorrectRelationShip: boolean = this.person.relationship !== this.Relationship.ChildUnder19  ;
            if ( this.person.bcServiceCardShowStatus && isCorrectRelationShip ) {
                this.servicesCardDisclaimerModalComponent.showModal();
            }
        }

        this.onChange.emit();
        this.emitIsFormValid();
    }

    setActivity(value: CanadianStatusReason) {


        this.person.currentActivity = value;
        this.person.movedFromProvinceOrCountry = '';
        this.onChange.emit();
        this.emitIsFormValid();
    }

    /**
     * Gets the available activities given the known status
     */
    get activities(): CanadianStatusReason[] {
        return statusReasonRules(this.person.relationship, this.person.status);
    }

    get statusInCanada(): StatusInCanada[] {
        return statusRules(this.person.relationship);
    }

    /** Valid as long as user has made a choice. Invalid if it's in its default state with no data. */
    isValid(): boolean {
        if (this.person.status === undefined || this.person.status == null) {
            return false;
        }
        if (this.person.status === StatusInCanada.TemporaryResident) {
            if (this.person.currentActivity === undefined || this.person.currentActivity == null) {
                return false;
            }
        }
        return true;
    }

}
