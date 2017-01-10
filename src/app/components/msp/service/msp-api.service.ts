import {Injectable} from '@angular/core';
import {MspApplication} from "../model/application.model";
import {GenderType, NameType, AttachmentUuidsType, AddressType} from "../api-model/commonTypes";
import {Address} from "../model/address.model";
import {Person} from "../model/person.model";
import {ResidencyType, EnrolmentApplicationType, EnrolmentApplicantType} from "../api-model/enrolmentTypes";
import {StatusInCanada, Activities} from "../model/status-activities-documents";
import {CitizenshipType} from "../api-model/commonTypes";
import {BasicCitizenshipType} from "../api-model/commonTypes";
import {LivedInBCType} from "../api-model/enrolmentTypes";
import {PersonType} from "../api-model/enrolmentTypes";
import {ApplicationType} from "../api-model/applicationTypes";
let jxon = require ("jxon/jxon");

@Injectable()
export class MspApiService {

  /**
   * Start of a converter operation
   * @param from
   * @returns {applicationTypes.ApplicationType}
   */
  convert(from: MspApplication):ApplicationType  {
    // Instantiate new object from interface
    let to = <ApplicationType>{};

    to.enrolmentApplication = <EnrolmentApplicationType>{};
    to.enrolmentApplication.applicant = <EnrolmentApplicantType>{};

    /*
     firstName: string;
     lastName: string;
     secondName?: string;
     */
    to.enrolmentApplication.applicant.name = <NameType>{};
    to.enrolmentApplication.applicant.name.firstName = from.applicant.firstName;
    to.enrolmentApplication.applicant.name.secondName = from.applicant.middleName;
    to.enrolmentApplication.applicant.name.lastName = from.applicant.lastName;

    /*
     attachmentUuids: AttachmentUuidsType;
     birthDate: Date;
     gender: GenderType;
     */
    to.enrolmentApplication.applicant.attachmentUuids =  <AttachmentUuidsType>{};
    to.enrolmentApplication.applicant.attachmentUuids.attachmentUuid = new Array<string>();
    for(let image of from.applicant.documents.images) {
      to.enrolmentApplication.applicant.attachmentUuids.attachmentUuid.push(image.uuid);
    }

    if (from.applicant.hasDob) {
      to.enrolmentApplication.applicant.birthDate = from.applicant.dob.toDate();
    }
    if (from.applicant.gender != null) {
      to.enrolmentApplication.applicant.gender = <GenderType>{};
      to.enrolmentApplication.applicant.gender = <GenderType> from.applicant.gender.toString();
    }
    /*
     authorizedByApplicant: ct.YesOrNoType;
     authorizedByApplicantDate: Date;
     authorizedBySpouse: ct.YesOrNoType;
     authorizedBySpouseDate: Date;
     */
    if (from.authorizedByApplicant != null) {
      to.enrolmentApplication.applicant.authorizedByApplicant = from.authorizedByApplicant ? "Y" : "N";
      to.enrolmentApplication.applicant.authorizedByApplicantDate = from.authorizedByApplicantDate;
    }
    if (from.authorizedBySpouse != null) {
      to.enrolmentApplication.applicant.authorizedBySpouse = from.authorizedBySpouse ? "Y" : "N";
      to.enrolmentApplication.applicant.authorizedBySpouseDate = from.authorizedBySpouseDate;
    }
     /*
     mailingAddress?: ct.AddressType;
     residenceAddress: ct.AddressType;
     residency: ResidencyType;
     telephone: number;
     */
    if (!from.mailingSameAsResidentialAddress) {
      to.enrolmentApplication.applicant.mailingAddress = this.convertAddress(from.mailingAddress);
    }
    to.enrolmentApplication.applicant.residenceAddress = this.convertAddress(from.residentialAddress);

    to.enrolmentApplication.applicant.residency = this.convertResidency(from.applicant);
    if (from.phoneNumber) {
      to.enrolmentApplication.applicant.telephone = Number(from.phoneNumber.replace(new RegExp("[^0-9]", "g"), ""));
    }

    return to;
  }

  private convertPerson(from: Person):PersonType {
    let to = <PersonType>{};

    return to;
  }

  private convertResidency(from: Person): ResidencyType {
    let to = <ResidencyType>{};

    /*
     citizenshipStatus: ct.BasicCitizenshipType;
     livedInBC: LivedInBCType;
     outsideBC: OutsideBCType;
     previousCoverage: PreviousCoverageType;
     willBeAway: WillBeAwayType;
     */

    //("Citizen" | "PermanentResident" | "WorkPermit" | "StudyPermit" | "Diplomat" | "VisitorPermit");
    to.citizenshipStatus = <BasicCitizenshipType>{};
    switch (from.status) {
      case StatusInCanada.CitizenAdult:
        to.citizenshipStatus.citizenshipType = "Citizen";
        break;
      case StatusInCanada.PermanentResident:
        to.citizenshipStatus.citizenshipType = "PermanentResident";
        break;
      case StatusInCanada.TemporaryResident:
        switch (from.currentActivity) {
          case Activities.WorkingInBC:
            to.citizenshipStatus.citizenshipType = "WorkPermit";
            break;
          case Activities.StudyingInBC:
            to.citizenshipStatus.citizenshipType = "StudyPermit";
            break;
          case Activities.Diplomat:
            to.citizenshipStatus.citizenshipType = "Diplomat";
            break;
          default:
            to.citizenshipStatus.citizenshipType = "VisitorPermit";
            break;
        }
    }
    to.citizenshipStatus.attachmentUuids = <AttachmentUuidsType>{};
    to.citizenshipStatus.attachmentUuids.attachmentUuid = new Array<string>();
    for(let image of from.documents.images) {
      to.citizenshipStatus.attachmentUuids.attachmentUuid.push(image.uuid);
    }

    /*
     hasLivedInBC: ct.YesOrNoType;
     isPermanentMove?: ct.YesOrNoType;
     prevHealthNumber?: string;
     prevProvinceOrCountry?: string;
     recentBCMoveDate?: Date;
     recentCanadaMoveDate?: Date;

     beenOutsideBCMoreThan: ct.YesOrNoType;
     departureDate?: Date;
     familyMemberReason?: string;
     returnDate?: Date;
     */
    to.livedInBC = <LivedInBCType>{};
    to.livedInBC.hasLivedInBC = "N";
    switch (from.currentActivity) {
      case Activities.Returning:
        to.livedInBC.hasLivedInBC = "Y";
        to.livedInBC.isPermanentMove = "Y"; // Always Y, you can't proceed without
        to.livedInBC.prevHealthNumber = from.previous_phn;
        to.livedInBC.prevProvinceOrCountry = from.movedFromProvince;
        to.livedInBC.recentBCMoveDate = from.arrivalToBC.toDate();
        to.livedInBC.recentCanadaMoveDate = from.arrivalToCanada.toDate();
        break;
      case Activities.MovingFromProvince:
      case Activities.MovingFromCountry:
        //TODO: to.outsideBC.beenOutsideBCMoreThan
        to.outsideBC.departureDate = from.studiesDepartureDate.toDate();
        to.outsideBC.returnDate = from.studiesFinishedDate.toDate();
        //TODO: familyMemberReason;
        break;

    }

    /*
     armedDischageDate?: Date;
     TODO: following up with meg on these properties
     isFullTimeStudent: ct.YesOrNoType;
     isInBCafterStudies?: ct.YesOrNoType;
     willBeAway: ct.YesOrNoType;
     */
    if (from.hasDischarge) {
      to.willBeAway.armedDischageDate = from.dischargeDate.toDate();
    }
    /*
     hasPreviousCoverage: ct.YesOrNoType;
     prevPHN?: number;
     */
    //to.previousCoverage.hasPreviousCoverage
    //to.previousCoverage.prevPHN

    return to;
  }

  private convertAddress(from: Address): AddressType {
    // Instantiate new object from interface
    let to = <AddressType>{};

    /*
     addressLine1: string;
     addressLine2?: string;
     addressLine3?: string;
     city?: string;
     country?: string;
     postalCode?: string;
     provinceOrState?: string;
     */

    to.addressLine1 = from.addressLine1;
    to.addressLine2 = from.addressLine2;
    to.addressLine3 = from.addressLine3;
    to.city = from.city;
    to.country = from.country;
    if (from.postal) {
      to.postalCode = from.postal.toUpperCase().replace(" ", "");
    }
    to.provinceOrState = from.province;

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