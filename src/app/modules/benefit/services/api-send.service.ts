import { Injectable } from '@angular/core';
import { SchemaService } from 'app/services/schema.service';
import { MSPApplicationSchema } from 'app/modules/msp-core/interfaces/i-api';
import { MspImage } from 'app/models/msp-image';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';
import { MspApiService } from 'app/services/msp-api.service';
import { Observable, forkJoin, from, of } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiSendService {
  constructor(private schemaSvc: SchemaService, private http: HttpClient) {}

  async validate(app: MSPApplicationSchema) {
    try {
      let valid = await this.schemaSvc.validate(app);
      return valid;
    } catch (err) {
      return err;
    }
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
    const source = from([...attachmentPromises]);
    return source.pipe(mergeMap(q => forkJoin(from(q))));
  }

  sendFile(token: string, applicationUUID: string, attachment) {
    console.log('send file run');
    const url = this.setUrl(attachment, applicationUUID);

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

  async sendApp(app: MSPApplicationSchema) {}

  setHeaders(contentType: string, token: string): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*',
      'X-Authorization': 'Bearer ' + token
    });
  }

  setUrl(attachment: MspImage, uuid: string): string {
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
