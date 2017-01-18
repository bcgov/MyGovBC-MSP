import {Injectable, Inject} from '@angular/core';
import {MspApplication} from "../model/application.model";
import {
  GenderType, NameType, AttachmentUuidsType, AddressType, NameTypeFactory,
  AttachmentUuidsTypeFactory, BasicCitizenshipTypeFactory, AddressTypeFactory
} from "../api-model/commonTypes";
import {Address} from "../model/address.model";
import {Person} from "../model/person.model";
import {
  ResidencyType, EnrolmentApplicationType, EnrolmentApplicantType,
  EnrolmentChildrenType, PersonTypeFactory, ResidencyTypeFactory, LivedInBCTypeFactory, EnrolmentApplicationTypeFactory,
  EnrolmentApplicantTypeFactory, EnrolmentChildrenTypeFactory, PreviousCoverageTypeFactory, OutsideBCTypeFactory,
  WillBeAwayTypeFactory
} from "../api-model/enrolmentTypes";
import {StatusInCanada, Activities} from "../model/status-activities-documents";
import {CitizenshipType} from "../api-model/commonTypes";
import {BasicCitizenshipType} from "../api-model/commonTypes";
import {LivedInBCType} from "../api-model/enrolmentTypes";
import {PersonType} from "../api-model/enrolmentTypes";
import {
  ApplicationType, AttachmentsType, document, _ApplicationTypeNameSpace,
  AttachmentType, ApplicationTypeFactory, DocumentFactory, AttachmentsTypeFactory, AttachmentTypeFactory
} from "../api-model/applicationTypes";
import {MspImage} from "../model/msp-image";
import {PersonDocuments} from "../model/person-document.model";
import {ResponseType} from "../api-model/responseTypes";
import {Http, Response, Headers, RequestOptions} from "@angular/http";
import * as moment from "moment";
import ISO_8601 = moment.ISO_8601;
import {FinancialAssistApplication} from "../model/financial-assist-application.model";
import {AssistanceApplicationTypeFactory} from "../api-model/assistanceTypes";
let jxon = require ("jxon/jxon");

@Injectable()
export class MspApiService {

  constructor (private http: Http, @Inject('appConstants') private appConstants: Object) {}

  /**
   * Sends the Application and returns an MspApplication if successful with referenceNumber populated
   * @param app
   * @returns {Promise<MspApplication>}
   */
  sendMspApplication(app: MspApplication): Promise<MspApplication> {

    return new Promise<MspApplication>((resolve, reject) => {
      console.log("Start sending...");

      try {
        // first convert the model
        let document:document = this.convert(app);

        // second convert to XML
        let convertedAppXml = this.toXmlString(document);

        // if no errors, then we'll sendMspApplication all attachments
        this.sendAttachments(document.application.uuid, app.getAllImages()).then(() => {

          // once all attachments are done we can sendMspApplication in the data
          this.sendEnrolmentApplication(document).then((response:ResponseType) => {
            console.log("sent application resolved");
            // Add reference number
            app.referenceNumber = response.referenceNumber.toString();

            // Let our caller know were done passing back the application
            resolve(app);

          }).catch((error: Response | any) => {
            console.log("sent application rejected: ", error);
            reject(error);
          });
        })
        .catch((error: Response | any) => {
          console.log("sent all attachments rejected: ", error);
          reject(error);
        });
      } catch (error) {
        console.log("sendMspApplication error: ", error);
        reject(error);
      }
    });
  }

  private sendAttachments(applicationUUID:string, attachments: MspImage[]): Promise<void> {
    return new Promise<void>((resolve, reject) => {

      // Make a list of promises for each attachment
      let attachmentPromises = new Array<Promise<ResponseType>>();
      for (let attachment of attachments) {
        attachmentPromises.push(this.sendAttachment(applicationUUID, attachment));
      }
      // Execute all promises are waiting for results
      Promise.all(attachmentPromises).then((responses: ResponseType[]) => {
        resolve();
      }).catch((error: Response | any) => {
        console.log("error sending attachment: ", error);
        reject(error);
      })
    });
  }

  private sendAttachment(applicationUUID:string, attachment: MspImage): Promise<ResponseType> {
    return new Promise<ResponseType>((resolve, reject) => {

      /*
       Create URL
       /{applicationUUID}/attachment/{attachmentUUID}
       */
      let url = this.appConstants['apiBaseUrl']
        + "/MSPDESubmitAttachment/" + applicationUUID
        + "/attachment/" + attachment.uuid;

      // programArea
      url += "?programArea=enrolment";

      // attachmentDocumentType - UI does NOT collect this property
      url += "&attachmentDocumentType=" + MspApiService.AttachmentDocumentType;

      // contentType
      url += "&contentType=" + attachment.contentType;

      // imageSize
      url += "&imageSize=" + attachment.size;

      // description - UI does NOT collect this property

      // Setup headers
      let headers = new Headers({ 'Content-Type':  attachment.contentType});
      let options = new RequestOptions({ headers: headers });

      let binary = atob(attachment.fileContent.split(',')[1]);
      let array = <any>[];
      for(var i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
      }
      let blob = new Blob([new Uint8Array(array)], {type: attachment.contentType});

      this.http
        .post(url, blob, options)
        .toPromise()
        .then((response:Response) => {
          resolve(<ResponseType>{});
        })
        .catch((error: Response | any) => {
          console.log("attachment error: ", error);
          let response = this.convertResponse(error);
          reject(response || error);
        });
    });
  }

  /**
   * Sends the application XML, last step in overall transaction
   * @param document
   * @returns {Promise<ResponseType>}
   */
  private sendEnrolmentApplication(document:document): Promise<ResponseType> {
    return new Promise<ResponseType>((resolve, reject) => {
      /*
       Create URL
       /{applicationUUID}
       */
      let url = this.appConstants['apiBaseUrl']
        + "/MSPDESubmitApplication/" + document.application.uuid
        + "?programArea=enrolment";

      // Setup headers
      let headers = new Headers({ 'Content-Type': 'application/xml' });
      let options = new RequestOptions({ headers: headers });

      // Convert doc to XML
      let documentXmlString = this.toXmlString(document);

      this.http.post(url, documentXmlString, options)
        .toPromise()
        .then((response:Response) => {
          console.log("sent application resolved");
          resolve(this.convertResponse(response.text()));
        })
        .catch((error: Response | any) => {
          console.log("sent application rejected: " + error.toString());
          console.log("document sent: ", documentXmlString);
          let response = this.convertResponse(error);
          console.log("full error: ", error)
          reject(response || error);
        });
    });
  }

  convertResponse(responseBody:string):ResponseType {
    return this.stringToJs<ResponseType>(responseBody)["ns2:response"];
  }


  /**
   * Start of MSP Application converted converter operation
   * @param from
   * @returns {applicationTypes.ApplicationType}
   */
  convert(from: MspApplication):document  {
    // Instantiate new object from interface
    let to = DocumentFactory.make();
    to.application = ApplicationTypeFactory.make();

    // UUID
    to.application.uuid = from.uuid;

    // Init data structure
    to.application.enrolmentApplication = EnrolmentApplicationTypeFactory.make();

    // Applicant section
    to.application.enrolmentApplication.applicant = EnrolmentApplicantTypeFactory.make();
    to.application.enrolmentApplication.applicant.name = this.convertName(from.applicant);

    /*
     birthDate: Date;
     gender: GenderType;
     */
    to.application.enrolmentApplication.applicant.attachmentUuids = this.convertAttachmentUuids(from.applicant.documents);

    if (from.applicant.hasDob) {
      to.application.enrolmentApplication.applicant.birthDate = from.applicant.dob.format(this.ISO8601DateFormat);
    }
    if (from.applicant.gender != null) {
      to.application.enrolmentApplication.applicant.gender = <GenderType>{};
      to.application.enrolmentApplication.applicant.gender = <GenderType> from.applicant.gender.toString();
    }
    /*
     authorizedByApplicant: ct.YesOrNoType;
     authorizedByApplicantDate: Date;
     authorizedBySpouse: ct.YesOrNoType;
     authorizedBySpouseDate: Date;
     */
    if (from.authorizedByApplicant != null) {
      to.application.enrolmentApplication.applicant.authorizedByApplicant = from.authorizedByApplicant ? "Y" : "N";
      to.application.enrolmentApplication.applicant.authorizedByApplicantDate = moment(from.authorizedByApplicantDate)
        .format(this.ISO8601DateFormat);
    }
    if (from.authorizedBySpouse != null) {
      to.application.enrolmentApplication.applicant.authorizedBySpouse = from.authorizedBySpouse ? "Y" : "N";
      to.application.enrolmentApplication.applicant.authorizedBySpouseDate = moment(from.authorizedBySpouseDate)
        .format(this.ISO8601DateFormat);
    }
     /*
     mailingAddress?: ct.AddressType;
     residenceAddress: ct.AddressType;
     residency: ResidencyType;
     telephone: number;
     */
    if (!from.mailingSameAsResidentialAddress) {
      to.application.enrolmentApplication.applicant.mailingAddress = this.convertAddress(from.mailingAddress);
    }
    to.application.enrolmentApplication.applicant.residenceAddress = this.convertAddress(from.residentialAddress);

    to.application.enrolmentApplication.applicant.residency = this.convertResidency(from.applicant);
    if (from.phoneNumber) {
      to.application.enrolmentApplication.applicant.telephone = Number(from.phoneNumber.replace(new RegExp("[^0-9]", "g"), ""));
    }

    // Convert spouse
    if (from.spouse) {
      to.application.enrolmentApplication.spouse = this.convertPersonFromEnrollment(from.spouse);
    }

    // Convert children
    if (from.children &&
      from.children.length > 0) {

      to.application.enrolmentApplication.children = EnrolmentChildrenTypeFactory.make();
      to.application.enrolmentApplication.children.child = new Array<PersonType>();
      for (let child of from.children) {
        to.application.enrolmentApplication.children.child.push(this.convertPersonFromEnrollment(child));
      }
    }

    // Convert attachments
    to.application.attachments = this.convertAttachmentsForEnrolment(from);

    return to;
  }

  convertAssistance(from:FinancialAssistApplication):document {
    // Instantiate new object from interface
    let to = DocumentFactory.make();
    to.application = ApplicationTypeFactory.make();

    // UUID
    to.application.uuid = from.uuid;

    // Init assistance
    to.application.assistanceApplication = AssistanceApplicationTypeFactory.make();

    //to.application.assistanceApplication.applicant

    // Convert attachments
    //to.application.attachments = this.convertAttachments(from);


    return to;
  }

  /**
   * User does NOT specify document type therefore we always say its a supporting document
   * @type {string}
   */
  static readonly AttachmentDocumentType = "SupportDocument";

  /**
   * Creates the array of attachments from applicant, spouse and all children
   * @param from
   * @returns {AttachmentsType}
   */
  private convertAttachmentsForEnrolment(from: MspApplication): AttachmentsType {

    let to = AttachmentsTypeFactory.make();
    to.attachment = new Array<AttachmentType>();

    // assemble all attachments
    let attachments:MspImage[] = from.getAllImages();

    // Convert each one
    for (let attachment of attachments) {
      // Init new attachment with defaults
      let toAttachment = AttachmentTypeFactory.make();
      toAttachment.attachmentDocumentType = MspApiService.AttachmentDocumentType;

      // Content type
      switch (attachment.contentType) {
        case "image/jpeg":
          toAttachment.contentType = "image/jpeg";
          break;
        case "application/pdf":
          toAttachment.contentType = "application/pdf";
          break;
        default:
          //TODO: throw error on bad content type
      }

      // uuid
      toAttachment.attachmentUuid = attachment.uuid;

      // user does NOT provide description so it's left blank for now, may be used in future

      // Add to array
      to.attachment.push(toAttachment);
    }

    return to;
  }

  private convertPersonFromEnrollment(from: Person):PersonType {
    let to = PersonTypeFactory.make();

    to.name = this.convertName(from);
    to.attachmentUuids = this.convertAttachmentUuids(from.documents);

    if (from.hasDob) {
      to.birthDate = from.dob.format(this.ISO8601DateFormat);
    }
    if (from.gender != null) {
      to.gender = <GenderType> from.gender.toString();
    }
    to.residency = this.convertResidency(from);

    return to;
  }

  private convertName(from: Person): NameType {
    let to = NameTypeFactory.make();

    /*
     firstName: string;
     lastName: string;
     secondName?: string;
     */
    to.firstName = from.firstName;
    to.secondName = from.middleName;
    to.lastName = from.lastName;

    return to;
  }

  private convertAttachmentUuids (from: PersonDocuments): AttachmentUuidsType {
    let to = AttachmentUuidsTypeFactory.make();

    to.attachmentUuid = new Array<string>();
    for(let image of from.images) {
      to.attachmentUuid.push(image.uuid);
    }

    return to;
  }

   private convertResidency(from: Person): ResidencyType {
    let to = ResidencyTypeFactory.make();

    /*
     citizenshipStatus: ct.BasicCitizenshipType;
     livedInBC: LivedInBCType;
     outsideBC: OutsideBCType;
     previousCoverage: PreviousCoverageType;
     willBeAway: WillBeAwayType;
     */

    //("Citizen" | "PermanentResident" | "WorkPermit" | "StudyPermit" | "Diplomat" | "VisitorPermit");
    to.citizenshipStatus = BasicCitizenshipTypeFactory.make();
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
    to.citizenshipStatus.attachmentUuids = AttachmentUuidsTypeFactory.make();
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
    // Init and set defaults
    to.livedInBC = LivedInBCTypeFactory.make();
    to.livedInBC.hasLivedInBC = "N";
    to.outsideBC = OutsideBCTypeFactory.make();
    to.outsideBC.beenOutsideBCMoreThan = "N";

    switch (from.currentActivity) {
      case Activities.Returning:
        to.livedInBC.hasLivedInBC = "Y";
        to.livedInBC.isPermanentMove = "Y"; // Always Y, you can't proceed without
        to.livedInBC.prevHealthNumber = from.previous_phn;
        to.livedInBC.prevProvinceOrCountry = from.movedFromProvince;
        if (from.hasArrivalToBC) {
          to.livedInBC.recentBCMoveDate = from.arrivalToBC.format(this.ISO8601DateFormat);
        }
        if (from.hasArrivalToCanada) {
          to.livedInBC.recentCanadaMoveDate = from.arrivalToCanada.format(this.ISO8601DateFormat);
        }
        break;
      case Activities.MovingFromProvince:
      case Activities.MovingFromCountry:

        //TODO: familyMemberReason;
        break;

    }

     //TODO: to.outsideBC.beenOutsideBCMoreThan
     if (from.hasStudiesDeparture) {
       to.outsideBC.departureDate = from.studiesDepartureDate.format(this.ISO8601DateFormat);
     }
     if (from.hasStudiesFinished) {
       to.outsideBC.returnDate = from.studiesFinishedDate.format(this.ISO8601DateFormat);
     }

    /*
     armedDischageDate?: Date;
     TODO: following up with meg on these properties
     isFullTimeStudent: ct.YesOrNoType;
     isInBCafterStudies?: ct.YesOrNoType;
     willBeAway: ct.YesOrNoType;
     */

    //to.willBeAway.isFullTimeStudent = from.
    to.willBeAway = WillBeAwayTypeFactory.make();
    to.willBeAway.willBeAway = "N";
    to.willBeAway.isFullTimeStudent = "N";


    if (from.hasDischarge) {
      to.willBeAway.armedDischageDate = from.dischargeDate.format(this.ISO8601DateFormat);
    }
    /*
    TODO: figure out these, are they duplicateS?

     hasPreviousCoverage: ct.YesOrNoType;
     prevPHN?: number;
     */
    to.previousCoverage = PreviousCoverageTypeFactory.make();
    to.previousCoverage.hasPreviousCoverage = "N";

    return to;
  }

  private convertAddress(from: Address): AddressType {
    // Instantiate new object from interface
    let to = AddressTypeFactory.make();

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

    // convert name to code
    let provinceData = require('../common/province/i18n/data/en/index').provinceData;
    let stateData = require('../common/province/i18n/data/en/index').stateData;
    let provinceStateData = Array().concat(provinceData, stateData);

    let itemFound = to.provinceOrState = provinceStateData.find((item)=> {
      if (item.name ===  from.province) {
        return true;
      }
    });
    if (itemFound) { to.provinceOrState = itemFound.code; }

    return to;
  }

  static ApplicationTypeNameSpace = _ApplicationTypeNameSpace;
  private static XmlDocumentType = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';

  /**
   * Converts any JS object to XML with optional namespace
   * @param from
   * @param namespace
   * @returns {any}
   */
  toXmlString (from: any):string {
    let xml = jxon.jsToXml(from);
    let xmlString = jxon.xmlToString(xml);
    //TODO: namespace not working properly, fix it and remove this hack
    xmlString = xmlString.replace("<application>", '<ns2:application xmlns:ns2="http://www.gov.bc.ca/hibc/applicationTypes">');
    xmlString = xmlString.replace("</application>", '</ns2:application>');
    return MspApiService.XmlDocumentType + xmlString;
  }

  stringToJs<T> (from:string):T {
    let converted = jxon.stringToJs(from) as T;
    return converted;
  }

  jsToXml (from:any) {
    return jxon.jsToXml(from);
  }

  stringToXml (from:string) {
    return jxon.stringToXml(from);
  }

  readonly ISO8601DateFormat = "YYYY-MM-DD";
}