import { Component, OpaqueToken, Inject, ViewChild, ElementRef, NgZone } from '@angular/core'
import { environment } from '../../../../environments/environment';
declare var System: any;
import { Http } from '@angular/http';
import 'rxjs/add/operator/timeout';

@Component({
  selector: 'core-footer',
  templateUrl: './index.html',
  styleUrls: ['./index.less']
})
export class CoreFooterComponent {
  private QUERY_TIMEOUT = 500; //ms

  /** Defaults to using external assistSdk. Only use internal if we're sure we can get it. */
  private useInternalAssistSdk: boolean = false;

  constructor(private http: Http, private zone: NgZone) {
    // Determine if we can access the internal assistSDK link. 
    // Should only be accessible on the intranet.
    const url = environment.appConstants.assistSDKInternalUrl + environment.appConstants.assistPath;
    http.get(url)
      .timeout(this.QUERY_TIMEOUT)
      .subscribe(data => {
        // console.log('using internal assistSDK link');
        this.useInternalAssistSdk = true;
      },
      err => {
        // console.log('using external assistSDK link');
      });

      console.log('ZONE', zone);

  }

  clickedAssist = () => {

    Promise.all([
      // System.import('./assist-support.js'),
      System.import('./assist-support.ts'),
      System.import('./short-code-assist.ts')
    ]).then(modules => {
      (<any>window).AssistBoot.addAssistBehaviour();
      (<any>window).AssistBoot.startAssistDialog();
    }).then(_ => {
      environment.appConstants.assistSDKUrl = this.useInternalAssistSdk ?
        environment.appConstants.assistSDKInternalUrl
        : environment.appConstants.assistSDKExternalUrl;

      const url = environment.appConstants.assistSDKUrl + environment.appConstants.assistPath;

      this.addScript(url);
    });

  }


  private addScript(url: string): void {
    console.log("adding script: ", url);
    var tt = document.createElement('script');
    tt.setAttribute('src', url);
    document.head.appendChild(tt);
  }
}