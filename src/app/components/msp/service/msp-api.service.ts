import {Injectable} from '@angular/core';
import {MspApplication} from "../model/application.model";
import * as applicationTypes from "../api-model/applicationTypes";
import * as enrolmentTypes from "../api-model/enrolmentTypes";
import * as commonTypes from "../api-model/commonTypes";
let jxon = require ("jxon/jxon");

@Injectable()
export class MspApiService {

  /**
   * Start of a converter operation
   * @param from
   * @returns {applicationTypes.ApplicationType}
   */
  convert(from: MspApplication) {
    // Instantiate new object from interface
    let to = <applicationTypes.ApplicationType>{};

    to.enrolmentApplication = <enrolmentTypes.EnrolmentApplicationType>{};
    to.enrolmentApplication.applicant = <enrolmentTypes.EnrolmentApplicantType>{};
    to.enrolmentApplication.applicant.name = <commonTypes.NameType>{};
    to.enrolmentApplication.applicant.name.firstName = from.applicant.firstName;

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