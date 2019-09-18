import { Injectable } from '@angular/core';
import { MspLogService } from '../../../services/log.service';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse
} from '@angular/common/http';
import { MspApplication } from '../../../modules/enrolment/models/application.model';
import { _ApplicationTypeNameSpace } from '../../../modules/msp-core/api-model/applicationTypes';
import { environment } from '../../../../environments/environment';
import { AbstractHttpService, CommonImage } from 'moh-common-lib';
import { Observable } from 'rxjs';
import { of } from 'rxjs';
import { Response } from '@angular/http';
import { MspApiService } from '../../../services/msp-api.service';
import { ApiResponse } from '../../../models/api-response.interface';
import {
 MSPApplicationSchema
} from '../../../modules/msp-core/interfaces/i-api';



@Injectable({
  providedIn: 'root'
})
export class MspApiEnrolmentService extends AbstractHttpService {

  protected _headers: HttpHeaders = new HttpHeaders();
  readonly ISO8601DateFormat = 'YYYY-MM-DD';
  suppBenefitResponse: ApiResponse;


  constructor(
    protected http: HttpClient,
    private logService: MspLogService,
  ) {
    super(http);
  }

  /**
   * User does NOT specify document type therefore we always say its a supporting document
   * @type {string}
   */
  static readonly AttachmentDocumentType = 'SupportDocument';
  static readonly ApplicationType = 'benefitApplication';

  sendRequest(app: MspApplication): Promise<any> {
    console.log(app.uuid);
    const suppBenefitRequest = this.prepareEnrolmentApplication(app);

    console.log(suppBenefitRequest);

    return new Promise<ApiResponse>((resolve) => {

      // if no errors, then we'll sendApplication all attachments
      return this.sendAttachments(
        app.authorizationToken,
        app.uuid,
        app.getAllImages()
      )
      .then(attachmentResponse => {
      console.log('sendAttachments response', attachmentResponse);

      return this.sendEnrolmentApplication(
        suppBenefitRequest,
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
      .catch((error: Response | any) => {
      // TODO - Is this error correct? What if sendApplication() errors, would it be caught in this .catch()?
      console.log('sent all attachments rejected: ', error);
      this.logService.log(
        {
        text: 'Attachment - Send All Rejected ',
        response: error
        },
        'Attachment - Send All Rejected '
      );
      return resolve(error);
      });

    });
  }

  sendEnrolmentApplication(app: MSPApplicationSchema, authToken: string): Observable<any> {
    const url = environment.appConstants['apiBaseUrl'] + '/submit-application/' + app.uuid;
    // Setup headers
    this._headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Response-Type': 'application/json',
      'X-Authorization': 'Bearer ' + authToken
    });
    //return this.post<MspApplication>(url, app);
    return this.http.post<MspApplication>(url, app);
  }


  public sendAttachments(
    token: string,
    applicationUUID: string,
    attachments: CommonImage[]
  ): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
      // Instantly resolve if no attachments
      if (!attachments || attachments.length < 1) {
        resolve();
      }

      // Make a list of promises for each attachment
      const attachmentPromises = new Array<Promise<string>>();
      for (const attachment of attachments) {
        attachmentPromises.push(
          this.sendAttachment(token, applicationUUID, attachment)
        );
      }
      // this.logService.log({
      //    text: "Send All Attachments - Before Sending",
      //     numberOfAttachments: attachmentPromises.length
      // }, "Send Attachments - Before Sending")

      // Execute all promises are waiting for results
      return Promise.all(attachmentPromises)
        .then(
          (responses: string[]) => {
            // this.logService.log({
            //     text: "Send All Attachments - Success",
            //     response: responses,
            // }, "Send All Attachments - Success")
            console.log('resolving responess', responses);
            return resolve(responses);
          },
          (error: Response | any) => {
            this.logService.log(
              {
                text: 'Attachments - Send Error ',
                error: error
              },
              'Attachments - Send Error '
            );
            console.log('error sending attachment: ', error);
            return reject();
          }
        )
        .catch((error: Response | any) => {
          this.logService.log(
            {
              text: 'Attachments - Send Error ',
              error: error
            },
            'Attachments - Send Error '
          );
          console.log('error sending attachment: ', error);
          return error;
        });
    });
  }

  private sendAttachment(
    token: string,
    applicationUUID: string,
    attachment: CommonImage
  ): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      /*
             Create URL
             /{applicationUUID}/attachment/{attachmentUUID}
             */
      let url =
        environment.appConstants['apiBaseUrl'] +
        environment.appConstants['attachment'] +
        applicationUUID +
        '/attachments/' +
        attachment.uuid;

      // programArea
      url += '?programArea=enrolment';

      // attachmentDocumentType - UI does NOT collect this property
      url += '&attachmentDocumentType=' + MspApiService.AttachmentDocumentType;

      // contentType
      url += '&contentType=' + attachment.contentType;

      // imageSize
      url += '&imageSize=' + attachment.size;

      // Necessary to differentiate between PA and SuppBen
      // TODO - VALIDATE THIS VALUE IS CORRECT, NEEDS TO BE CONFIRMED
      url += '&dpackage=msp_sb_pkg';

      // Setup headers
      const headers = new HttpHeaders({
        'Content-Type': attachment.contentType,
        'Access-Control-Allow-Origin': '*',
        'X-Authorization': 'Bearer ' + token
      });
      const options = { headers: headers, responseType: 'text' as 'text' };

      const binary = atob(attachment.fileContent.split(',')[1]);
      const array = <any>[];
      for (let i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
      }
      const blob = new Blob([new Uint8Array(array)], {
        type: attachment.contentType
      });

      return this.http
        .post(url, blob, options)
        .toPromise()
        .then(
          response => {
            // this.logService.log({
            //     text: "Send Individual Attachment - Success",
            //     response: response,
            // }, "Send Individual Attachment - Success")
            return resolve(response);
          },
          (error: Response | any) => {
            console.log('error response in its origin form: ', error);
            this.logService.log(
              {
                text: 'Attachment - Send Error ',
                response: error
              },
              'Attachment - Send Error '
            );
            return reject(error);
          }
        )
        .catch((error: Response | any) => {
          console.log('Error in sending individual attachment: ', error);
          this.logService.log(
            {
              text: 'Attachment - Send Error ',
              response: error
            },
            'Attachment - Send Error '
          );

          reject(error);
        });
    });
  }

  protected handleError(error: HttpErrorResponse) {
    // console.log("handleError", JSON.stringify(error));
    if (error.error instanceof ErrorEvent) {
      //Client-side / network error occured
      console.error('MSP Enrolment API error: ', error.error.message);
    } else {
      // The backend returned an unsuccessful response code
      console.error(
        `Msp Enrolment Backend returned error code: ${
          error.status
        }.  Error body: ${error.error}`
      );
    }

    this.logService.log(
      {
        text: 'Cannot get Suppbenefit API response',
        response: error
      },
      'Cannot get Suppbenefit API response'
    );

    // A user facing erorr message /could/ go here; we shouldn't log dev info through the throwError observable
    return of(error);
    // return of([]);
  }


 /* private prepareBenefitApplication(
    from: MspApplication
  ): MSPApplicationSchema {
    const object = {
      supplementaryBenefitsApplication: this.convertBenefitApplication(from),
      attachments: this.convertToAttachment(from.getAllImages()),
      uuid: from.uuid
    };
    return object;
  }
*/
  private convertToAttachment(images: CommonImage[]): AttachmentRequestPartial[] {
    const output = [];
    images.map((image, i) => {
      const partial: AttachmentRequestPartial = {
        contentType: 'IMAGE_JPEG',
        attachmentDocumentType: MspApiEnrolmentService.AttachmentDocumentType,
        attachmentOrder: (i + 1).toString(),
        description: '',
        // TODO - Sure this is the correct UUID here?
        attachmentUuid: image.uuid
      };
      output.push(partial);
    });

    return output;
  }



  private prepareEnrolmentApplication(from: MspApplication): any {
    console.log('prepareBenefitApplication', {from, imageUUIDs: from.getAllImages().map(x => x.uuid)});
    const output = {
      'enrolmentApplication': {
        'applicant': {
          'name': {
          'firstName': 'Smith',
          'lastName': 'Butler',
          'secondName': 'Middle Name'
          },
          'gender': 'M',
          'birthDate': '1982-03-03',
          'residenceAddress': {
            'addressLine1': '236 Tret Street',
            'city': 'Vancouver',
            'postalCode': 'V6J8U7',
            'provinceOrState': 'BC',
            'country': 'Canada',
            'addressLine2': 'ABCDEFGH',
            'addressLine3': 'ABCDEFGHIJKLMNOPQRS'
          },
          'residency': {
          'citizenshipStatus': {
            'citizenshipType': 'ReligiousWorker',
             'attachmentUuids': [
             'ABCDEFGHIJKLMNOPQRST'
             ]
          },
          'previousCoverage': {
            'hasPreviousCoverage': 'N',
            'prevPHN': '9876458907'
          },
          'livedInBC': {
            'hasLivedInBC': 'N',
            'recentBCMoveDate': '1989-03-03',
            'recentCanadaMoveDate': '1985-03-03',
            'isPermanentMove': 'Y',
            'prevProvinceOrCountry': 'ABCDEFGHIJKLMNOPQRSTU',
            'prevHealthNumber': '9876458907'
          },
          'outsideBC': {
            'beenOutsideBCMoreThan': 'Y',
            'departureDate': '1986-03-03',
            'returnDate': '1987-03-03',
            'familyMemberReason': 'ABCDEFGHIJKLMNOPQ',
            'destination': 'ABCDEFGHIJKLMN'
          },
          'willBeAway': {
            'isFullTimeStudent': 'N',
            'isInBCafterStudies': 'Y',
            'armedDischargeDate': '1989-03-03',
            'armedForceInstitutionName': 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
          }
          },
          'attachmentUuids': [
            'ABCDEFGHIJKLMNOPQRSTUVWX'
          ],
          'authorizedByApplicant': 'Y',
          'authorizedByApplicantDate': '2018-09-10',
          'authorizedBySpouse': 'N',
          'telephone': '2356626262'
        }
      }
     };

      // create Attachment from Images
      console.log(from.getAllImages());
      output['attachments'] =  this.convertToAttachment(from.getAllImages());
      output['uuid'] = from.uuid;
      console.log(output);
      return output;
    }
}

// TODO - Move file - meant to be generic?
interface AttachmentRequestPartial {
  contentType: 'IMAGE_JPEG';
  // attachmentDocumentType: string; // TODO lock down
  attachmentDocumentType: 'SupportDocument';
  attachmentOrder: string; // String of number! '1', '2', '3'
  description: string;
  attachmentUuid: string;
}


