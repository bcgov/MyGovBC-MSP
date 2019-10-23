import { Injectable } from '@angular/core';
import { MspLogService } from '../../../services/log.service';
import { HttpClient } from '@angular/common/http';
import { _ApplicationTypeNameSpace } from '../../../modules/msp-core/api-model/applicationTypes';
import { CommonImage } from 'moh-common-lib';
import { Response } from '@angular/http';
import { ApiResponse } from '../../../models/api-response.interface';
import {
 MSPApplicationSchema,
 EnrolmentApplicationType,
 ResidencyType,
 PersonType,
 DependentType,
 EnrolmentApplicantType
} from '../../../modules/msp-core/interfaces/i-api';
import * as moment from 'moment';
import { Relationship } from '../../../models/relationship.enum';
import { SchemaService } from '../../../services/schema.service';
import { BaseMspApiService } from '../../../services/base-msp-api.service';
import { EnrolApplication } from '../models/enrol-application';
import { Enrollee } from '../models/enrollee';


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

  sendRequest(app: EnrolApplication): Promise<any> {
    console.log(app.uuid);
    const enrolmentRequest = this.prepareEnrolmentApplication( app );
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

        return this.sendApplication<EnrolApplication>( enrolmentRequest, app.authorizationToken )
          .subscribe(response => {
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

  private prepareEnrolmentApplication(from: EnrolApplication): MSPApplicationSchema {
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

  private convertResidency( from: Enrollee ): ResidencyType {

    // citizenship
    const citizenType = this.getCitizenType( from.status, from.currentActivity );

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
        beenOutsideBCMoreThan: from.outsideBCFor30Days ? 'Y' : 'N'
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
      to.livedInBC.prevHealthNumber = from.previousBCPhn;
    }

    if ( from.movedFromProvinceOrCountry ) {
        to.livedInBC.prevProvinceOrCountry = from.movedFromProvinceOrCountry;
    }

    // Arrival dates
    if ( from.arrivalToBCDate ) {
        to.livedInBC.recentBCMoveDate = this.formatDate( from.arrivalToBCDate );
    }
    if ( from.arrivalToCanadaDate ) {
        to.livedInBC.recentCanadaMoveDate = this.formatDate( from.arrivalToCanadaDate );
    }

    // Outside BC - optional fields
    if ( from.outsideBCFor30Days ) {
      to.outsideBC.departureDate = this.formatDate(from.oopDepartureDate);
      to.outsideBC.returnDate = this.formatDate(from.oopReturnDate);
      to.outsideBC.familyMemeberReason = from.departureReason;
      to.outsideBC.destination = from.departureDestination;
    }

    if ( from.inBCafterStudies ) {
      to.willBeAway.isInBCafterStudies = from.inBCafterStudies ? 'Y' : 'N';
    }

    if (from.hasBeenReleasedFromArmedForces) {
      to.willBeAway.armedDischargeDate = this.formatDate( from.dischargeDate );
    }

    if (from.hasPreviousBCPhn && from.previousBCPhn) {
      to.previousCoverage.prevPHN = from.previousBCPhn.replace(new RegExp('[^0-9]', 'g'), '');
    }
    return to;
  }

  private convertDependentType( person: Enrollee ): DependentType {
    return {
      name: this.convertName( person ),
      gender: person.gender.toString(),
      birthDate: this.formatDate( person.dateOfBirth ),
      attachmentUuids: this.getAttachementUuids( person.documents.images, person.nameChangeDocs.images ),
      residency: this.convertResidency( person ),
      schoolName: person.schoolName,
      schoolAddress: this.convertAddress( person.schoolAddress ),
      dateStudiesFinish: this.formatDate( person.schoolCompletionDate ),
      departDateSchoolOutside: this.formatDate( person.departureDateForSchool ),
    };
  }

  // This method is used to convert the response from user into a JSON object
  private convertMspApplication(from: EnrolApplication): EnrolmentApplicationType {
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
      const children = from.children.filter((child: Enrollee) => {
          return child.relationship === Relationship.ChildUnder19;
      });
      const dependants = from.children.filter((child: Enrollee) => {
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

  private convertPersonType( person: Enrollee ): PersonType {
   return {
      name: this.convertName( person ),
      gender: person.gender,
      birthDate: this.formatDate(person.dateOfBirth),
      attachmentUuids: this.getAttachementUuids( person.documents.images, person.nameChangeDocs.images ),
      residency: this.convertResidency( person )
    };
  }

  private convertEnrolmentApplicantType( application: EnrolApplication): EnrolmentApplicantType {
    const applicant: Enrollee = application.applicant;
    console.log( 'applicant gender: ', applicant.gender );
    const enrolee: EnrolmentApplicantType =  {
      name: this.convertName( applicant ),
      gender: applicant.gender.toString(),
      birthDate: this.formatDate( applicant.dateOfBirth ),
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
