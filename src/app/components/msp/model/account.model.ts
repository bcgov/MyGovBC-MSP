import {UUID} from "angular2-uuid";
import {ApplicationBase} from "./application-base.model";
import {MspImage} from "./msp-image";
import {Person,OperationActionType} from "./person.model";
import {Relationship, StatusInCanada, Activities, Documents} from "./status-activities-documents";
import {PhoneNumber} from "./phone.model";


class MspAccountApp implements ApplicationBase {

    private _uuid = UUID.UUID();
    infoCollectionAgreement: boolean = false;
    authorizationToken: string;
    phnRequired: boolean = false;
    /**
     * Set by the API, not for client use
     */
    referenceNumber: string;
    private _applicant: Person = new Person(Relationship.Applicant);
    public phoneNumber: string;
    documents:MspImage[] = [];
    id:string;

    authorizedByApplicant: boolean;
    authorizedByApplicantDate: Date;

    /**
     * validator for phone number
     * @returns {boolean}
     */
    get phoneNumberIsValid(): boolean {

        // Phone is optional
        if (this.phoneNumber == null ||
            this.phoneNumber.length < 1) {
            return true;
        }

        // But if it's provided is must be valid
        let regEx = new RegExp(PhoneNumber.PhoneNumberRegEx);
        return regEx.test(this.phoneNumber);
    }

    private _removedSpouse: Person;

    get children(): Array<Person> {
        return this._children;
    }

    set children(value: Array<Person>) {
        this._children = value;
    }

    private _addedSpouse: Person;
    private _updatedSpouse: Person;
    private _children: Array<Person>  = [];

    private _accountChangeOptions :AccountChangeOptions = new AccountChangeOptions ();

    removeUpdatedSpouse =() => {
        this._updatedSpouse = null;
    } ;

    addUpdatedSpouse = (sp:Person)=>{
        if(!this._updatedSpouse){
            this._updatedSpouse = sp;
        }else{
            console.log('spouse for updating already added to your coverage.');
        }
    };

    get hasValidAuthToken(){
        return this.authorizationToken && this.authorizationToken.length > 1;
    }
    addUpdateChild(): Person {
        let c = new Person(Relationship.ChildUnder24,OperationActionType.Update);
        this._children.length < 30 ? this._children.push(c): console.log('No more than 30 children can be added to one application');
        return c;
    }


    removeUpdateChild(idx: number):void {
        let removed = this._children.splice(idx,1);
    }

    get updateChildren(): Array<Person> {
        var updateChildren =  this._children.filter( (child:Person) => child.operationActionType === OperationActionType.Update);
        return updateChildren;
    }

    get applicant(): Person {
        return this._applicant;
    }



    get removedSpouse(): Person {
        return this._removedSpouse;
    }

    set removedSpouse(value: Person) {
        this._removedSpouse = value;
    }

    get addedSpouse(): Person {
        return this._addedSpouse;
    }

    set addedSpouse(value: Person) {
        this._addedSpouse = value;
    }

    get updatedSpouse(): Person {
        return this._updatedSpouse;
    }

    set updatedSpouse(value: Person) {
        this._updatedSpouse = value;
    }

    set applicant(apt: Person) {
        this._applicant = apt;
    }

    get accountChangeOptions(): AccountChangeOptions {
        return this._accountChangeOptions;
    }

    get uuid(): string {
        return this._uuid;
    }

    regenUUID() {
        this._uuid = UUID.UUID();
        /**
         * Each image will have a uuid that starts with application uuid
         * followed by [index]-of-[total]
         */
        let all = this.getAllImages();
        all.forEach(image => {
            image.uuid = UUID.UUID();
        });
    }

    /*
    Gets all images for applicant, spouse and all children
   */
    getAllImages(): MspImage[] {
        return this.documents;
    }

    constructor(){
        this.id = UUID.UUID();
    }

}

class AccountChangeOptions {

    personInfoUpdate: boolean = false;
    dependentChange: boolean = false;
    addressUpdate: boolean = false;
    statusUpdate: boolean = false;

    hasAnyPISelected () :boolean {
        return this.personInfoUpdate || this.statusUpdate;
    }
    hasAllOptionsSelected () :boolean {
        return this.personInfoUpdate && this.dependentChange && this.addressUpdate && this.statusUpdate ;
    }
    hasAllPISelected () {
        return this.personInfoUpdate && this.addressUpdate && this.statusUpdate ;
    }
    hasOnlyAddressSelected () {
        return  this.addressUpdate && !(this.personInfoUpdate  ||  this.dependentChange || this.statusUpdate);
    }

    hasAnyOptionSelected() {
        return  this.addressUpdate || this.personInfoUpdate  ||  this.dependentChange || this.statusUpdate;
    }
}

export {MspAccountApp,AccountChangeOptions,Person}
