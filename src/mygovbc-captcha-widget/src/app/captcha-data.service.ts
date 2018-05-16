import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import {Observable} from "rxjs/Rx";
import 'rxjs/Rx';

@Injectable()
export class CaptchaDataService {

  constructor(private http: Http) { }
  
    fetchData(apiBaseUrl:string, nonce:string) {
      return this.http.post(apiBaseUrl + '/captcha', {nonce: nonce}, {})
    }
  
    verifyCaptcha(apiBaseUrl:string, nonce:string, answer:string, encryptedAnswer:string) {
      return this.http.post(apiBaseUrl + '/verify/captcha', {nonce: nonce, answer: answer, validation: encryptedAnswer}, {});
    }
  
    fetchAudio(apiBaseUrl:string, validation:string) {
      return this.http.post(apiBaseUrl + '/captcha/audio', {validation: validation}, {})
    }
  
}
