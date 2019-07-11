import { Injectable } from '@angular/core';
import { SchemaService } from 'app/services/schema.service';
import { MSPApplicationSchema } from 'app/modules/msp-core/interfaces/i-api';
import { MspImage } from 'app/models/msp-image';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';
import { MspApiService } from 'app/services/msp-api.service';
import { Observable, forkJoin, from, of, concat } from 'rxjs';
import {
  catchError,
  mergeMap,
  tap,
  flatMap,
  concatMap,
  map
} from 'rxjs/operators';
import { AbstractHttpService } from 'moh-common-lib';

@Injectable({
  providedIn: 'root'
})
export class ApiSendService extends AbstractHttpService {
  protected _headers: HttpHeaders;
  protected handleError(
    error: import('@angular/common/http').HttpErrorResponse
  ) {
    throw new Error('Method not implemented.');
  }
  constructor(private schemaSvc: SchemaService, http: HttpClient) {
    super(http);
  }

  async validate(app: MSPApplicationSchema) {
    try {
      let valid = await this.schemaSvc.validate(app);
      return valid;
    } catch (err) {
      return err;
    }
  }

  async sendApp(
    app: MSPApplicationSchema,
    token: string,
    applicationUUID,
    attachments: MspImage[]
  ) {
    const appUrl = this.setAppUrl(applicationUUID);
    this._headers = this.setHeaders('application/json', token);
    // const files$ = await this.sendFiles(token, applicationUUID, attachments);
    console.log('first app', JSON.stringify(app, null, 2));

    // return files$
    // .pipe(mergeMap(q => forkJoin(from(q))))
    // .pipe(() => from(
    return this.post<MSPApplicationSchema>(appUrl, app);
    // ));

    // .pipe(catchError(err => of(err)));
  }

  testApp(app, token, applicationUUID) {
    console.log('first app', JSON.stringify(app, null, 2));
    // app = {
    //   assistanceApplication: {
    //     applicant: {
    //       name: {
    //         firstName: 'James',
    //         lastName: 'Cook'
    //       },
    //       gender: 'M',
    //       birthDate: '12-05-1966',
    //       attachmentUuids: ['4345678-f89c-52d3-a456-626655441236'],
    //       telephone: '2501231234',
    //       mailingAddress: {
    //         addressLine1: '1234 Fort St.',
    //         city: 'Victoria',
    //         postalCode: 'V9R3T1',
    //         provinceOrState: 'BC',
    //         country: 'Canada'
    //       },
    //       financials: {
    //         taxYear: '1999',
    //         assistanceYear: 'CurrentPA',
    //         numberOfTaxYears: '5',
    //         netIncome: 100000.0,
    //         totalNetIncome: 100000.0,
    //         sixtyFiveDeduction: 0,
    //         childDeduction: 0,
    //         deductions: 30000.0,
    //         totalDeductions: 30000.0,
    //         adjustedNetIncome: 70000.0
    //       },
    //       phn: '1234567890',
    //       sin: '123123123',
    //       powerOfAttorney: 'N'
    //     },
    //     spouse: {
    //       name: {
    //         firstName: 'Mary',
    //         lastName: 'Lamb'
    //       },
    //       birthDate: '12-02-1972',
    //       phn: '1234567880',
    //       sin: '124234567',
    //       spouseDeduction: 1000.0
    //     },
    //     authorizedByApplicant: 'Y',
    //     authorizedByApplicantDate: '06-18-2019',
    //     authorizedBySpouse: 'Y'
    //   },
    //   uuid: applicationUUID,
    //   attachments: [
    //     {
    //       contentType: 'IMAGE_JPEG',
    //       attachmentDocumentType: 'ImmigrationDocuments',
    //       attachmentUuid: '4345678-f89c-52d3-a456-626655441236',
    //       attachmentOrder: '1',
    //       description: 'Foreign Birth Certificate'
    //     }
    //   ]
    // };
    // console.log('claimed valid app', JSON.stringify(app, null, 2));

    const appUrl = this.setAppUrl(applicationUUID);
    this._headers = this.setHeaders('application/json', token);

    this.post(appUrl, app).subscribe(obs => console.log(obs));
  }

  async sendFiles(
    token: string,
    applicationUUID: string,
    attachments: MspImage[]
  ) {
    const attachmentPromises = new Array<Promise<string>>();
    for (let attachment of attachments) {
      attachmentPromises.push(
        this.sendFile(token, applicationUUID, attachment).toPromise()
      );
      // this.httpSvc.post()
    }

    const res = await Promise.all(attachmentPromises);
    console.log('promises', res);
    return;
    // return attachmentPromises
    // return from(attachmentPromises);
  }

  sendFile(token: string, applicationUUID: string, attachment) {
    console.log('send file run');
    const url = this.setFileUrl(attachment, applicationUUID);

    const headers = this.setHeaders(attachment.contentType, token);

    const options = { headers: headers, responseType: 'text' as 'text' };

    const binary = atob(attachment.fileContent.split(',')[1]);
    const array = <any>[];
    for (let i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    const blob = new Blob([new Uint8Array(array)], {
      type: attachment.contentType
    });

    return this.http.post(url, blob, options).pipe(catchError(err => of(err)));
  }

  setHeaders(contentType: string, token: string): HttpHeaders {
    return contentType === 'application/json'
      ? new HttpHeaders({
          'Content-Type': contentType,
          'Response-Type': 'application/json',
          'X-Authorization': 'Bearer ' + token
        })
      : new HttpHeaders({
          'Content-Type': contentType,
          'Access-Control-Allow-Origin': '*',
          'X-Authorization': 'Bearer ' + token
        });
  }

  setAppUrl(uuid: string) {
    console.log('url uuid', uuid);
    return (
      environment.appConstants.apiBaseUrl +
      environment.appConstants.suppBenefitAPIUrl +
      uuid
    );
  }

  setFileUrl(attachment: MspImage, uuid: string): string {
    let url =
      environment.appConstants['apiBaseUrl'] +
      environment.appConstants['attachment'] +
      uuid +
      '/attachments/' +
      attachment.uuid;

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
    return url;
  }
}
