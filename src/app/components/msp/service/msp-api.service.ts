import {Injectable, Inject} from '@angular/core';
import {MspApplication} from "../model/application.model";
import {GenderType, NameType, AttachmentUuidsType, AddressType} from "../api-model/commonTypes";
import {Address} from "../model/address.model";
import {Person} from "../model/person.model";
import {
  ResidencyType, EnrolmentApplicationType, EnrolmentApplicantType,
  EnrolmentChildrenType
} from "../api-model/enrolmentTypes";
import {StatusInCanada, Activities} from "../model/status-activities-documents";
import {CitizenshipType} from "../api-model/commonTypes";
import {BasicCitizenshipType} from "../api-model/commonTypes";
import {LivedInBCType} from "../api-model/enrolmentTypes";
import {PersonType} from "../api-model/enrolmentTypes";
import {
  ApplicationType, AttachmentsType, document, _ApplicationTypeNameSpace,
  AttachmentType
} from "../api-model/applicationTypes";
import {MspImage} from "../model/msp-image";
import {PersonDocuments} from "../model/person-document.model";
import {ResponseType} from "../api-model/responseTypes";
import {Http, Response, Headers, RequestOptions} from "@angular/http";
import {Observable} from "rxjs";
let jxon = require ("jxon/jxon");

@Injectable()
export class MspApiService {

  constructor (private http: Http, @Inject('appConstants') private appConstants: Object) {}

  /**
   * Sends the Application and returns an MspApplication if successful with referenceNumber populated
   * @param app
   * @returns {Promise<MspApplication>}
   */
  send(app: MspApplication): Promise<MspApplication> {

    return new Promise<MspApplication>((resolve, reject) => {

      try {
        // first convert the model
        let document:document = this.convert(app);

        // second convert to XML
        let convertedAppXml = this.toXmlString(document, MspApiService.ApplicationTypeNameSpace);

        console.log("num images: " + app.getAllImages().length);

        // if no errors, then we'll send all attachments
        this.sendAttachments(document.application.uuid, app.getAllImages()).then(() => {

          // once all attachments are done we can send in the data
          console.log("// once all attachments are done we can send in the data");
          this.sendApplication(document).then((response:ResponseType) => {
            console.log("sent application resolved");
            // Add reference number
            app.referenceNumber = response.referenceNumber.toString();

            // Let our caller know were done passing back the application
            resolve(app);

          }).catch((error:Error) => {
            console.log("sent application rejected");
            reject(error);
          });
        });

      } catch (error) {
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
      console.log("Execute all promises are waiting for results");
      Promise.all(attachmentPromises).then((responses: ResponseType[]) => {
        console.log("All promises resolved");
        resolve();
      }).catch((error:Error) => {
        console.log("a promise rejected");
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

      console.log("url: " + url);

      // programArea
      url += "?programArea=enrolment";

      // attachmentDocumentType - UI does NOT collect this property
      url += "&attachmentDocumentType=" + MspApiService.AttachmentDocumentType;

      // contentType
      url += "&contentType=" + attachment.contentType;

      // imageSize
      url += "&imageSize=" + attachment.size;

      // description - UI does NOT collect this property

      this.http
        .post(url, attachment.fileContent)
        .toPromise()
        .then((response:Response) => {
          resolve(<ResponseType>{});
        })
        .catch((error: any) => {
          console.log("error:" + error.toString());
          reject();
        });
    });
  }

  private sendApplication(document:document): Promise<ResponseType> {
    return new Promise<ResponseType>((resolve, reject) => {
      /*
       Create URL
       /{applicationUUID}
       */
      let url = this.appConstants['apiBaseUrl']
        + "/MSPDESubmitApplication/" + document.application.uuid
        + "?programArea=enrolment";

      console.log("url: " + url);

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
          reject();
        });
    });
  }

  convertResponse(responseBody:string):ResponseType {
    return this.stringToJs<ResponseType>(responseBody);
  }


  /**
   * Start of a converter operation
   * @param from
   * @returns {applicationTypes.ApplicationType}
   */
  convert(from: MspApplication):document  {
    // Instantiate new object from interface
    let to = <document>{};
    to.application = <ApplicationType>{};

    // UUID
    to.application.uuid = from.uuid;

    // Init data structure
    to.application.enrolmentApplication = <EnrolmentApplicationType>{};

    // Applicant section
    to.application.enrolmentApplication.applicant = <EnrolmentApplicantType>{};
    to.application.enrolmentApplication.applicant.name = this.convertName(from.applicant);

    /*
     birthDate: Date;
     gender: GenderType;
     */
    to.application.enrolmentApplication.applicant.attachmentUuids = this.convertAttachmentUuids(from.applicant.documents);

    if (from.applicant.hasDob) {
      to.application.enrolmentApplication.applicant.birthDate = from.applicant.dob.toDate();
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
      to.application.enrolmentApplication.applicant.authorizedByApplicantDate = from.authorizedByApplicantDate;
    }
    if (from.authorizedBySpouse != null) {
      to.application.enrolmentApplication.applicant.authorizedBySpouse = from.authorizedBySpouse ? "Y" : "N";
      to.application.enrolmentApplication.applicant.authorizedBySpouseDate = from.authorizedBySpouseDate;
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
      to.application.enrolmentApplication.spouse = this.convertPerson(from.spouse);
    }

    // Convert children
    if (from.children &&
      from.children.length > 0) {

      to.application.enrolmentApplication.children = <EnrolmentChildrenType>{};
      to.application.enrolmentApplication.children.child = new Array<PersonType>();
      for (let child of from.children) {
        to.application.enrolmentApplication.children.child.push(this.convertPerson(child));
      }
    }

    // Convert attachments
    to.application.attachments = this.convertAttachments(from);

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
  private convertAttachments(from: MspApplication): AttachmentsType {
    let to = <AttachmentsType>{};
    to.attachment = new Array<AttachmentType>();

    // assemble all attachments
    let attachments = from.getAllImages();

    // Convert each one
    for (let attachment of attachments) {
      // Init new attachment with defaults
      let toAttachment = <AttachmentType>{};
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

  private convertPerson(from: Person):PersonType {
    let to = <PersonType>{};

    to.name = this.convertName(from);
    to.attachmentUuids = this.convertAttachmentUuids(from.documents);

    if (from.hasDob) {
      to.birthDate = from.dob.toDate();
    }
    if (from.gender != null) {
      to.gender = <GenderType>{};
      to.gender = <GenderType> from.gender.toString();
    }
    to.residency = this.convertResidency(from);

    return to;
  }

  private convertName(from: Person): NameType {
    let to = <NameType>{};

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
    let to = <AttachmentUuidsType>{};

    to.attachmentUuid = new Array<string>();
    for(let image of from.images) {
      to.attachmentUuid.push(image.uuid);
    }

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
        if (from.hasArrivalToBC) {
          to.livedInBC.recentBCMoveDate = from.arrivalToBC.toDate();
        }
        if (from.hasArrivalToCanada) {
          to.livedInBC.recentCanadaMoveDate = from.arrivalToCanada.toDate();
        }
        break;
      case Activities.MovingFromProvince:
      case Activities.MovingFromCountry:
        //TODO: to.outsideBC.beenOutsideBCMoreThan
        if (from.hasStudiesDeparture) {
          to.outsideBC.departureDate = from.studiesDepartureDate.toDate();
        }
        if (from.hasStudiesFinished) {
          to.outsideBC.returnDate = from.studiesFinishedDate.toDate();
        }
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

  static ApplicationTypeNameSpace = _ApplicationTypeNameSpace;
  private static XmlDocumentType = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
  private static QualifiedName = "ns1:application";

  /**
   * Converts any JS object to XML with optional namespace
   * @param from
   * @param namespace
   * @returns {any}
   */
  toXmlString (from: any, namespace?: string):string {
    let xml = jxon.jsToXml(from, namespace);
    let xmlString = jxon.xmlToString(xml);
    return MspApiService.XmlDocumentType + xmlString;
  }

  stringToJs<T> (from:string):T {
    return jxon.stringToJs(from) as T;
  }

  jsToXml (from:any) {
    return jxon.jsToXml(from);
  }


}