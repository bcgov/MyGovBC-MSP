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
        (<any>window).AssistBoot.startAssistDialog();
        // AssistSupport.testClickedAssist();
        console.log("gi");
    });
  }
}
