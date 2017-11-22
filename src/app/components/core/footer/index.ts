import {Component, OpaqueToken, Inject} from '@angular/core'
// import * as AssistSupport from './assist-support.js';

declare var System: any;
// declare var testClickedAssist: any;

@Component({
  selector: 'core-footer',
  templateUrl: './index.html',
  styleUrls: ['./index.less']
})
export class CoreFooterComponent {
  constructor() {
  }

  clickedAssist = () =>{
    console.log ('clickedAssist');
    System.import('./assist-support.js').then(AssistSupport=> {
        (<any>window).AssistBoot.addAssistBehaviour();
        console.log("loaded AssistBoot.addAssistBehaviour");
        (<any>window).AssistBoot.startAssistDialog();
        console.log("loaded AssistBoot.startAssistDialog");
    }).then(LoadAssistSDK=> {
        var tt = document.createElement('script');
        tt.setAttribute('src', 'https://video-poc1.maximusbc.ca/assistserver/sdk/web/consumer/assist.js');
        document.head.appendChild(tt);
        console.log("loaded AssistSDK");
    });
    // <script src="https://video-poc1.maximusbc.ca:8443/assistserver/sdk/web/consumer/assist.js"></script>
  }
}
