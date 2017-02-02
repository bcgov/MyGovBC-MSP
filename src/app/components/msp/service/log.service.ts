import {Injectable, Inject} from '@angular/core'
import {Http, Headers, RequestOptions} from "@angular/http"

@Injectable()
export class MspLogService {
  constructor(private http: Http, @Inject('appConstants') private appConstants: Object) {
  }

  log(logItem: Object): Promise<any> {
    let url = this.appConstants['logBaseUrl']
    let headers = new Headers({'Content-Type': 'application/json'})
    let options = new RequestOptions({headers: headers})
    return this.http.post(url, logItem, options)
      .toPromise()
  }
}
