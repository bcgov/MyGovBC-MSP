import {UUID} from "angular2-uuid";
import {ApplicationBase} from "./application-base.model";
import {MspImage} from "./msp-image";

export class AccountChangeOptions {
    personInfoUpdate: boolean = false;
    depdendentChange: boolean = false;
    addressUpdate: boolean = false;
    statusUpdate: boolean = false;
    resetNavBar: boolean = false;

}

class MspAccount implements ApplicationBase {

    private _uuid = UUID.UUID();
    infoCollectionAgreement: boolean = false;
    authorizationToken: string;
    phnRequired: boolean = false;
    /**
     * Set by the API, not for client use
     */
    referenceNumber: string;

    private _accountChangeOptions :AccountChangeOptions = new AccountChangeOptions ();


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
        let allImages = Array<MspImage>();

        //TODO  //FIXME implement logic.

        /*   // add applicant
           allImages = allImages.concat(this.applicant.documents.images);

           if (this.spouse) {
               allImages = allImages.concat(this.spouse.documents.images);
           }
           for (let child of this.children) {
               allImages = allImages.concat(child.documents.images);
           }*/

        return allImages;
    }

}

export {MspAccount}