import {Injectable} from '@angular/core';
import {MspApplication} from "../model/application.model";
import * as applicationTypes from "../api-model/applicationTypes";
import * as enrolmentTypes from "../api-model/enrolmentTypes";
import * as commonTypes from "../api-model/commonTypes";
import {GenderType} from "../api-model/commonTypes";
let jxon = require ("jxon/jxon");

@Injectable()
export class MspApiService {

  /**
   * Start of a converter operation
   * @param from
   * @returns {applicationTypes.ApplicationType}
   */
  convert(from: MspApplication):applicationTypes.ApplicationType  {
    // Instantiate new object from interface
    let to = <applicationTypes.ApplicationType>{};

    to.enrolmentApplication = <enrolmentTypes.EnrolmentApplicationType>{};
    to.enrolmentApplication.applicant = <enrolmentTypes.EnrolmentApplicantType>{};

    /*
     firstName: string;
     lastName: string;
     secondName?: string;
     */
    to.enrolmentApplication.applicant.name = <commonTypes.NameType>{};
    to.enrolmentApplication.applicant.name.firstName = from.applicant.firstName;
    to.enrolmentApplication.applicant.name.secondName = from.applicant.middleName;
    to.enrolmentApplication.applicant.name.lastName = from.applicant.lastName;

    /*
     attachmentUuids: AttachmentUuidsType;
     birthDate: Date;
     gender: GenderType;
     */
    to.enrolmentApplication.applicant.attachmentUuids =  <commonTypes.AttachmentUuidsType>{};
    to.enrolmentApplication.applicant.attachmentUuids.attachmentUuid = new Array<string>();
    for(let image of from.applicant.documents.images) {
      to.enrolmentApplication.applicant.attachmentUuids.attachmentUuid.push(image.uuid);
    }

    if (from.applicant.hasDob) {
      to.enrolmentApplication.applicant.birthDate = from.applicant.dob.toDate();
    }
    if (from.applicant.gender != null) {
      to.enrolmentApplication.applicant.gender = <commonTypes.GenderType>{};
      to.enrolmentApplication.applicant.gender = <GenderType> from.applicant.gender.toString();
    }
    /*
     authorizedByApplicant: ct.YesOrNoType;
     authorizedByApplicantDate: Date;
     authorizedBySpouse: ct.YesOrNoType;
     authorizedBySpouseDate: Date;
     mailingAddress?: ct.AddressType;
     residenceAddress: ct.AddressType;
     residency: ResidencyType;
     telephone: number;
     */

    //to.enrolmentApplication.applicant.

    return to;
  }

  /**
   * Converts Javascript Object to XML String
   * @param from
   * @returns {any}
   */
  toXmlString (from: any):string {
    let xml = jxon.jsToXml(from);
    return jxon.xmlToString(xml);
  }
}