import { Injectable } from '@angular/core';
import { Address, AbstractHttpService, CommonImage, SimpleDate } from 'moh-common-lib';
import { AddressType } from '../modules/msp-core/interfaces/i-api';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { MspLogService } from './log.service';
import { of } from 'rxjs';
import { ApiResponse } from '../models/api-response.interface';
import * as moment from 'moment';
import { environment } from '../../environments/environment';

interface AttachmentRequestPartial {
  contentType: 'IMAGE_JPEG';
  // attachmentDocumentType: string; // TODO lock down
  attachmentDocumentType: 'SupportDocument';
  attachmentOrder: string; // String of number! '1', '2', '3'
  description: string;
  attachmentUuid: string;
}

@Injectable({
  providedIn: 'root'
})
export class BaseMspApiService extends AbstractHttpService  {

  protected _headers: HttpHeaders = new HttpHeaders();
  protected _application: string = '';
  protected _programArea: string = 'enrolment';
  protected _dpackage: string = '';

  suppBenefitResponse: ApiResponse;

  readonly ISO8601DateFormat = 'YYYY-MM-DD';

  /**
   * User does NOT specify document type therefore we always say its a supporting document
   * @type {string}
   */
  static readonly AttachmentDocumentType = 'SupportDocument';
  static readonly ApplicationType = 'benefitApplication';

  constructor( protected http: HttpClient,
               protected logService: MspLogService ) {
    super(http);
  }

  // Set headers for request
  setHeaders( authToken: string ) {
    this._headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Response-Type': 'application/json',
      'X-Authorization': 'Bearer ' + authToken
    });
  }


  public sendAttachments( token: string,
                          applicationUUID: string,
                          attachments: CommonImage[] ): Promise<string[]> {

    return new Promise<string[]>((resolve, reject) => {
      // Instantly resolve if no attachments
      if (!attachments || attachments.length < 1) {
        resolve();
      }

      // Make a list of promises for each attachment
      const attachmentPromises = new Array<Promise<string>>();
      for (const attachment of attachments) {
        attachmentPromises.push(
          this.sendAttachment(token, applicationUUID, attachment )
        );
      }

      // Execute all promises are waiting for results
      return Promise.all(attachmentPromises)
        .then(
          (responses: string[]) => {
            this.logService.log({
                text: 'Send All Attachments - Success',
                response: responses,
              }, 'Send All Attachments - Success'
            );
            console.log('resolving responess', responses);
            return resolve(responses);
          },
          (_error: Response | any) => {
            this.logService.log({
                text: 'Attachments - Send Error ',
                error: _error
              }, 'Attachments - Send Error ');
            console.log('error sending attachment: ', _error);
            return reject();
          }
        )
        .catch((_error: Response | any) => {
          this.logService.log({
              text: 'Attachments - Send Error ',
              error: _error
            }, 'Attachments - Send Error '
          );
          console.log('error sending attachment: ', _error );
          return _error;
        });
    });
  }


  protected formatDate( dt: SimpleDate ) {
    const hasDt = Object.keys(dt)
                    .map( x => dt[x] === null || dt[x] === undefined )
                    .filter( itm => itm === true )
                    .length === 0;
    return hasDt ? moment.utc( {year: dt.year, month: dt.month - 1, day: dt.day} ).format( this.ISO8601DateFormat ) : '';
  }

  protected convertToAttachment( images: CommonImage[] ): AttachmentRequestPartial[] {
    const output = [];
    images.map((image, i) => {
      const partial: AttachmentRequestPartial = {
        contentType: 'IMAGE_JPEG',
        attachmentDocumentType: BaseMspApiService.AttachmentDocumentType,
        attachmentOrder: (i + 1).toString(),
        description: '',
        attachmentUuid: image.uuid
      };
      output.push(partial);
    });

    return output;
  }


  // Convert address to JSON AddressType
  protected convertAddress( from: Address ): AddressType {
    const addr: AddressType = {
      addressLine1: from.addressLine1,
      city: from.city,
      provinceOrState: from.province,
      country: from.country,
      postalCode: from.postal.toUpperCase().replace(' ', '')
    };

    if ( from.addressLine2 ) {
      addr.addressLine2 = from.addressLine2;
    }

    if ( from.addressLine3 ) {
      addr.addressLine3 = from.addressLine3;
    }
    return addr;
  }


  // User must remember to set the application name for logging
  protected handleError( _error: HttpErrorResponse ) {

    if (_error.error instanceof ErrorEvent) {
      //Client-side / network error occured
      console.error('MSP ' + this._application + ' API error: ', _error.error.message);
    } else {
      // The backend returned an unsuccessful response code
      console.error(`MSP ${this._application} Backend returned error code: ${_error.status}.  Error body: ${_error.error}`);
    }

    this.logService.log({
        text: `Cannot get ${this._application} API response`,
        response: _error
      }, `Cannot get ${this._application} API response`);

    // A user facing erorr message /could/ go here; we shouldn't log dev info through the throwError observable
    return of(_error);
  }

  private sendAttachment( token: string,
                            applicationUUID: string,
                            attachment: CommonImage ): Promise<string> {
    return new Promise<string>((resolve, reject) => {

      /* Create URL /{applicationUUID}/attachment/{attachmentUUID */
      let _url = environment.appConstants['apiBaseUrl'] + environment.appConstants['attachment'] +
                 applicationUUID + '/attachments/' + attachment.uuid;

      // programArea
      _url += `?programArea=${this._programArea}`;

      // attachmentDocumentType - UI does NOT collect this property
      _url += '&attachmentDocumentType=' + BaseMspApiService.AttachmentDocumentType;

      // contentType
      _url += '&contentType=' + attachment.contentType;

      // imageSize
      _url += '&imageSize=' + attachment.size;

      // Necessary to differentiate between PA, SuppBen and enrolment
      _url += `&dpackage=${this._dpackage}`;

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
        .post(_url, blob, options)
        .toPromise()
        .then(
          response => {
            // this.logService.log({
            //     text: "Send Individual Attachment - Success",
            //     response: response,
            // }, "Send Individual Attachment - Success")
            return resolve(response);
          },
          (_error: Response | any) => {
            console.log('error response in its origin form: ', _error);
            this.logService.log({
                text: 'Attachment - Send Error ',
                response: _error
              }, 'Attachment - Send Error '
            );
            return reject(_error);
          }
        )
        .catch((_error: Response | any) => {
          console.log('Error in sending individual attachment: ', _error);
          this.logService.log({
              text: 'Attachment - Send Error ',
              response: _error
            }, 'Attachment - Send Error '
          );

          reject(_error);
        });
    });
  }
}
