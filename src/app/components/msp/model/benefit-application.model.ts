import {ApplicationBase} from './application-base.model';
import {UUID} from 'angular2-uuid';
import {MspImage} from './msp-image';
import * as moment from 'moment';
import {Address} from './address.model';

export class BenefitApplication implements ApplicationBase {

    private _uuid = UUID.UUID();
    referenceNumber: string;
    infoCollectionAgreement: boolean = false;
    authorizationToken: string;
    phnRequired: boolean;
    benefitDocs: MspImage[] = [];

    private _netIncomelastYear: number;
    ageOver65: boolean;
    spouseAgeOver65: boolean;

    private _hasSpouseOrCommonLaw: boolean;
    /**
     * Applicant himself or herself eligible for disablity credit flag
     */
    private eligibleForDisabilityCredit: boolean;
    private spouseOrCommonLawEligibleForDisabilityCredit: boolean;

    get selfDisabilityCredit(){
        return this.eligibleForDisabilityCredit;
    }
    set selfDisabilityCredit(selfEligible: boolean){
        this.eligibleForDisabilityCredit = selfEligible;
    }

    get spouseEligibleForDisabilityCredit(){
        return this.spouseOrCommonLawEligibleForDisabilityCredit;
    }

    set spouseEligibleForDisabilityCredit(spouseEligible: boolean) {
        if (spouseEligible){
            this._hasSpouseOrCommonLaw = true;
        }
        this.spouseOrCommonLawEligibleForDisabilityCredit = spouseEligible;
    }

    // Address and Contact Info
    public residentialAddress: Address = new Address();
    public mailingSameAsResidentialAddress: boolean = true;
    public mailingAddress: Address = new Address();
    public phoneNumber: string;



    get uuid(): string {
        return this._uuid;
    }



    get netIncomelastYear(): number {
        return this._netIncomelastYear === null ? null : this._netIncomelastYear;
    }

    set netIncomelastYear(n: number) {
        if (!this.isEmptyString(n)){
            this._netIncomelastYear = n;
        }
    }

    regenUUID(){
        this._uuid = UUID.UUID();
        /**
         * Each image will have a uuid that starts with application uuid
         * followed by [index]-of-[total]
         */
        const all = this.getAllImages();
        all.forEach( image => {
            image.uuid = UUID.UUID();
        });
    }

    /**
     * Power of atterney docs and attendant care expense receipts
     */
    getAllImages(): MspImage[] {
        return [...this.benefitDocs];
    }

    get currentYear(): number {
        return moment().year() ;
    }

    isEmptyString(value: number){
        let temp: string = value + '';
        temp = temp.trim();
        return temp.length < 1;
    }
}
