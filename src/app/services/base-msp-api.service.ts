import { Injectable } from '@angular/core';
import { Address, AbstractHttpService, CommonImage, SimpleDate } from 'moh-common-lib';
import { AddressType } from '../modules/msp-core/interfaces/i-api';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { MspLogService } from './log.service';
import { of } from 'rxjs';
import { ApiResponse } from '../models/api-response.interface';
import * as moment from 'moment';

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

  protected _applicationName: string = '';
  protected _headers: HttpHeaders = new HttpHeaders();

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



  protected convertSimpleDate( dt: SimpleDate ): string {

    const dtFields = Object.keys(dt).filter( x => dt[x] );
    console.log( 'convertSimpleDate: dtFields ', dtFields );

    if ( dtFields.length === 3 ) {
        const date = moment.utc({
          year: dt.year,
          month: dt.month - 1, // moment use 0 index for month :(
          day: dt.day,
      }); // use UTC mode to prevent browser timezone shifting
      return  String( date.format(this.ISO8601DateFormat ) );
    }
    return '';
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

    // console.log("handleError", JSON.stringify(error));
    if (_error.error instanceof ErrorEvent) {
      //Client-side / network error occured
      console.error('MSP ' + this._applicationName + ' API error: ', _error.error.message);
    } else {
      // The backend returned an unsuccessful response code
      console.error(`MSP ${this._applicationName} Backend returned error code: ${_error.status}.  Error body: ${_error.error}`);
    }

    this.logService.log(
      {
        text: `Cannot get ${this._applicationName} API response`,
        response: _error
      },
      `Cannot get ${this._applicationName} API response`
    );

    // A user facing erorr message /could/ go here; we shouldn't log dev info through the throwError observable
    return of(_error);
  }
}
