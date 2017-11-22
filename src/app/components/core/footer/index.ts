import { Component, OpaqueToken, Inject } from '@angular/core'
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

  constructor(private http: Http) {
    // Determine if we can access the internal assistSDK link. 
    // Should only be accessible on the intranet.
    http.get(environment.appConstants.assistSDKUrlInternal)
      .timeout(this.QUERY_TIMEOUT)
      .subscribe(data => {
        // console.log('using internal assistSDK link');
        this.useInternalAssistSdk = true;
      },
      err => {
        // console.log('using external assistSDK link');
      });

  }

  clickedAssist = () => {
    // console.log('clickedAssist');

    Promise.all([
      System.import('./assist-support.js'),
      System.import('./short-code-assist.js')
    ]).then(modules => {
      (<any>window).AssistBoot.addAssistBehaviour();
      (<any>window).AssistBoot.startAssistDialog();
    }).then(_ => {
      const url = this.useInternalAssistSdk ?
        environment.appConstants.assistSDKUrlInternal
        : environment.appConstants.assistSDKUrl;

      this.addScript(url);
      // console.log("loaded AssistSDK");
    });

  }


  private addScript(url: string): void {
    console.log("adding script: ", url);
    var tt = document.createElement('script');
    tt.setAttribute('src', url);
    document.head.appendChild(tt);
  }
}
