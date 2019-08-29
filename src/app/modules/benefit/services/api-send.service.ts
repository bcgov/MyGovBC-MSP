import { Injectable } from '@angular/core';
import { SchemaService } from 'app/services/schema.service';
import { MSPApplicationSchema } from 'app/modules/msp-core/interfaces/i-api';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse
} from '@angular/common/http';
import { environment } from 'environments/environment';
import { MspApiService } from 'app/services/msp-api.service';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AbstractHttpService, CommonImage } from 'moh-common-lib';

@Injectable({
  providedIn: 'root'
})
export class ApiSendService extends AbstractHttpService {
  protected _headers: HttpHeaders;
  protected handleError(error: HttpErrorResponse) {
    throw new Error('Method not implemented.');
  }
  constructor(private schemaSvc: SchemaService, http: HttpClient) {
    super(http);
  }

  async validate(app: MSPApplicationSchema) {
    try {
      const valid = await this.schemaSvc.validate(app);
      return valid;
    } catch (err) {
      return err;
    }
  }

  async sendApp(
    app: MSPApplicationSchema,
    token: string,
    applicationUUID,
    attachments: CommonImage[]
  ) {
    const appUrl = this.setAppUrl(applicationUUID);
    this._headers = this.setHeaders('application/json', token);
    await this.sendFiles(token, applicationUUID, attachments);
    console.log('first app', JSON.stringify(app, null, 2));

    // return files$
    // .pipe(mergeMap(q => forkJoin(from(q))))
    // .pipe(() => from(
    return this.post<MSPApplicationSchema>(appUrl, app).pipe(
      //catchError(err => of(err))
    );

    // ));
  }

  async sendFiles(
    token: string,
    applicationUUID: string,
    attachments: CommonImage[]
  ) {
    const attachmentPromises = new Array<Promise<string>>();
    for (const attachment of attachments) {
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

  setFileUrl(attachment: CommonImage, uuid: string): string {
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
