import { Injectable } from '@angular/core';
import { MspLogService } from '../../../services/log.service';
import { HttpClient } from '@angular/common/http';
import { MspApplication } from '../../../modules/enrolment/models/application.model';
import { _ApplicationTypeNameSpace } from '../../../modules/msp-core/api-model/applicationTypes';
import { environment } from '../../../../environments/environment';
import { CommonImage } from 'moh-common-lib';
import { Observable } from 'rxjs';
import { Response } from '@angular/http';
import { ApiResponse } from '../../../models/api-response.interface';
import {
 MSPApplicationSchema,
 EnrolmentApplicationType,
 ResidencyType,
 CitizenshipType,
 PersonType,
 DependentType,
 NameType,
 EnrolmentApplicantType
} from '../../../modules/msp-core/interfaces/i-api';
import * as moment from 'moment';
import { MspPerson } from '../../../components/msp/model/msp-person.model';
import { StatusInCanada, CanadianStatusReason } from '../../msp-core/models/canadian-status.enum';
import { Relationship } from '../../../models/relationship.enum';
import { SchemaService } from '../../../services/schema.service';
import { BaseMspApiService } from '../../../services/base-msp-api.service';




@Injectable({
  providedIn: 'root'
})
export class MspApiEnrolmentService extends BaseMspApiService {


  constructor( protected http: HttpClient,
               protected logService: MspLogService,
               private schemaSvc: SchemaService ) {

    super( http, logService );
    this._dpackage = 'msp_enrolment_pkg';
    this._application = 'Enrolment';
  }

  sendRequest(app: MspApplication): Promise<any> {
    console.log(app.uuid);
    const enrolmentRequest = this.prepareEnrolmentApplication(app);
    console.log(enrolmentRequest);

    return new Promise<ApiResponse>((resolve, reject) => {

      //Validating the response against the schema
      this.schemaSvc.validate(enrolmentRequest).then(res => {
        console.log(res.errors);
        if (res.errors) {
          let errorField;
          let errorMessage;

          // Getting the error field
          for (const err of res.errors) {
            errorField = err.dataPath.substr(34);
            errorMessage = err.message;
          }
          // checking the errors and routing to the correct URL
          if (errorField && errorMessage) {
            this.logService.log(
              {
                text:
                  'Enrolment Application  - API validation against schema failed becuase of ' +
                  errorField +
                  ' field',
                response: errorMessage
              },
              'Enrolment Application -  API validation against schema failed'
            );

            //const mapper = new FieldPageMap();
            //const index = mapper.findStep(errorField);
            //const urls = this.dataSvc.getMspProcess().processSteps;
            //this.router.navigate([urls[index].route]);
            return reject(errorMessage);
          }
        }
      });

      // if no errors, then we'll sendApplication all attachments
      return this.sendAttachments(
        app.authorizationToken,
        app.uuid,
        app.getAllImages()
      )
      .then(attachmentResponse => {
      console.log('sendAttachments response', attachmentResponse);

      return this.sendEnrolmentApplication(
        enrolmentRequest,
        app.authorizationToken
      ).subscribe(response => {
        // Add reference number
        if (response && response.referenceNumber) {
        app.referenceNumber = response.referenceNumber.toString();
        }
        // Let our caller know were done passing back the application
        return resolve(response);
      });
      })
      .catch((err: Response | any) => {
      // TODO - Is this error correct? What if sendApplication() errors, would it be caught in this .catch()?
      console.log('sent all attachments rejected: ', err);
      this.logService.log(
        {
        text: 'Attachment - Send All Rejected ',
        response: err
        },
        'Attachment - Send All Rejected '
      );
      return resolve(err);
      });

    });
  }

  sendEnrolmentApplication(app: MSPApplicationSchema, authToken: string): Observable<any> {
    const _url = environment.appConstants['apiBaseUrl'] + '/submit-application/' + app.uuid;

    // Setup headers
    this.setHeaders( authToken );

    return this.post<MspApplication>(_url, app);
  }

  private prepareEnrolmentApplication(from: MspApplication): MSPApplicationSchema {
    const object = {
      enrolmentApplication: this.convertMspApplication(from),
      attachments: this.convertToAttachment(from.getAllImages()),
      uuid: from.uuid
    };
    return object;
  }

  private getAttachementUuids( suppDocs: CommonImage[], nameChangeDocs: CommonImage[] ): string[] {
    const suppDocUuids = suppDocs && suppDocs.length > 0 ?
                          suppDocs.map( x => x.uuid ) : [];
    const nameChangeDocUuids = nameChangeDocs && nameChangeDocs.length > 0 ?
                                nameChangeDocs.map( x => x.uuid ) : [];
    return [...suppDocUuids, ...nameChangeDocUuids];
  }

  private convertResidency( from: MspPerson ): ResidencyType {

    let citizenType;
    // citizenship
    switch (from.status) {
      case StatusInCanada.CitizenAdult:
        citizenType = CitizenshipType.CanadianCitizen;
        break;
      case StatusInCanada.PermanentResident:
        citizenType = CitizenshipType.PermanentResident;
      break;
      case StatusInCanada.TemporaryResident:
        switch (from.currentActivity) {
          case CanadianStatusReason.WorkingInBC:
            citizenType = CitizenshipType.WorkPermit;
          break;
        case CanadianStatusReason.StudyingInBC:
          citizenType = CitizenshipType.StudyPermit;
          break;
        case CanadianStatusReason.Diplomat:
          citizenType = CitizenshipType.Diplomat;
          break;
        case CanadianStatusReason.ReligiousWorker:
          citizenType = CitizenshipType.ReligiousWorker;
          break;
        case CanadianStatusReason.Visiting:
        default:
          citizenType = CitizenshipType.VisitorPermit;
          break;
      }
    }

    const attachmentUuids = new Array<string>();
    for (const image of from.documents.images) {
        attachmentUuids.push(image.uuid);
    }

    const to: ResidencyType = {
      citizenshipStatus: {
        citizenshipType: citizenType,
        attachmentUuids: attachmentUuids
      },
      livedInBC: {
        hasLivedInBC: from.livedInBCSinceBirth === true ? 'Y' : 'N',
      },
      outsideBC: {
        beenOutsideBCMoreThan: from.beenOutSideOver30Days ? 'Y' : 'N'
      },
      previousCoverage: {
        hasPreviousCoverage: from.hasPreviousBCPhn ? 'Y' : 'N'
      },
      willBeAway: {
        isFullTimeStudent: from.fullTimeStudent ? 'Y' : 'N'
      }
    };

   // outsideBCinFuture?: OutsideBCType;  - Not sure this is used

    if ( from.madePermanentMoveToBC !== undefined  ) {
      to.livedInBC.isPermanentMove = from.madePermanentMoveToBC === true ? 'Y' : 'N';
    }

    if ( from.hasPreviousBCPhn ) {
      to.livedInBC.prevHealthNumber = from.previous_phn;
    }

    if (from.movedFromProvinceOrCountry) {
        to.livedInBC.prevProvinceOrCountry = from.movedFromProvinceOrCountry;
    }

    // Arrival dates
    if (from.hasArrivalToBC) {
        to.livedInBC.recentBCMoveDate = from.arrivalToBC.format(this.ISO8601DateFormat);
    }
    if (from.hasArrivalToCanada) {
        to.livedInBC.recentCanadaMoveDate = from.arrivalToCanada.format(this.ISO8601DateFormat);
    }

    // Outside BC - optional fields
    if (from.beenOutSideOver30Days) {
      to.outsideBC.departureDate = this.convertSimpleDate(from.departureDate);
      to.outsideBC.returnDate = this.convertSimpleDate(from.returnDate);
      to.outsideBC.familyMemeberReason = from.departureReason;
      to.outsideBC.destination = from.departureDestination;
    }

    if (from.inBCafterStudies !== undefined ) {
      to.willBeAway.isInBCafterStudies = from.inBCafterStudies ? 'Y' : 'N';
    }

    if (from.hasDischarge) {
      to.willBeAway.armedDischargeDate = from.dischargeDate.format(this.ISO8601DateFormat);
    }

    if (from.hasPreviousBCPhn && from.previous_phn) {
      to.previousCoverage.prevPHN = from.previous_phn.replace(new RegExp('[^0-9]', 'g'), '');
    }
    return to;
  }

  private convertDependentType( person: MspPerson ): DependentType {
    return {
      name: this.convertName( person ),
      gender: person.gender.toString(),
      birthDate: String( person.dob.format( this.ISO8601DateFormat ) ),
      attachmentUuids: this.getAttachementUuids( person.documents.images, person.nameChangeDocs.images ),
      residency: this.convertResidency( person ),
      schoolName: person.schoolName,
      schoolAddress: this.convertAddress( person.schoolAddress ),
      dateStudiesFinish: this.convertSimpleDate( person.studiesFinishedSimple ),
      departDateSchoolOutside: this.convertSimpleDate( person.studiesDepartureSimple ),
    };
  }

  // This method is used to convert the response from user into a JSON object
  private convertMspApplication(from: MspApplication): EnrolmentApplicationType {
    const application: EnrolmentApplicationType = {
      applicant: this.convertEnrolmentApplicantType( from )
    };

    // Convert spouse
    if (from.spouse) {
      application.spouse = this.convertPersonType( from.spouse );
    }

    // Convert children and dependants
    if (from.children &&
        from.children.length > 0) {

      // Filter out children vs dependants
      const children = from.children.filter((child: MspPerson) => {
          return child.relationship === Relationship.ChildUnder19;
      });
      const dependants = from.children.filter((child: MspPerson) => {
          return child.relationship === Relationship.Child19To24;
      });

      // Children
      if (children.length > 0) {
        application.children = new Array<PersonType>();
        for (const child of children) {
          application.children.push( this.convertPersonType( child ) );
        }
      }

      // Dependants
      if (dependants.length > 0) {
        application.dependents = new Array<DependentType>();
        for (const dependant of dependants) {
          application.dependents.push( this.convertDependentType( dependant ) );
        }
      }
    }

    return application;
  }


  private convertName( person: MspPerson ): NameType {
    return {
      firstName: person.firstName,
      lastName: person.lastName,
      secondName: person.middleName
    };
  }

  private convertPersonType( person: MspPerson ): PersonType {
   return {
      name: this.convertName( person ),
      gender: person.gender.toString(),
      birthDate: String( person.dob.format( this.ISO8601DateFormat ) ),
      attachmentUuids: this.getAttachementUuids( person.documents.images, person.nameChangeDocs.images ),
      residency: this.convertResidency( person )
    };
  }

  private convertEnrolmentApplicantType( application: MspApplication): EnrolmentApplicantType {
    const applicant: MspPerson = application.applicant;
    console.log( 'applicant gender: ', applicant.gender );
    const enrolee: EnrolmentApplicantType =  {
      name: this.convertName( applicant ),
      gender: applicant.gender.toString(),
      birthDate: String( applicant.dob.format( this.ISO8601DateFormat ) ),
      attachmentUuids: this.getAttachementUuids( applicant.documents.images, applicant.nameChangeDocs.images ),
      residency: this.convertResidency( applicant ),
      residenceAddress: this.convertAddress( application.residentialAddress ),
      authorizedByApplicant: application.authorizedByApplicant ? 'Y' : 'N',
      authorizedByApplicantDate: moment(application.authorizedByApplicantDate).format(this.ISO8601DateFormat),
      authorizedBySpouse: application.authorizedBySpouse ? 'Y' : 'N'
    };

    if (application.phoneNumber) {
      enrolee.telephone = application.phoneNumber.replace(/[() +/-]/g, '').substr(1);
    }

    if ( !application.mailingSameAsResidentialAddress ) {
      enrolee.mailingAddress = this.convertAddress( application.mailingAddress );
    }

    return enrolee;
  }
}
