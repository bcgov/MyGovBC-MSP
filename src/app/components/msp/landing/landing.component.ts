import { Component } from '@angular/core';
import MspDataService from '../service/msp-data.service';
require('./landing.component.less')

/**
 * Application for MSP
 *
 * IMG_2336.jpg
 * https://apps.gcpe.gov.bc.ca/jira/browse/PSPDN-255?filter=16000
 */
@Component({
  templateUrl: './landing.component.html'
})
export class LandingComponent {
  lang = require('./i18n')

  constructor(private mspDataService:MspDataService){

  }
  clearSavedFinAssisApp(){
    console.log('deleting saved fin assist app.');
    this.mspDataService.removeFinAssistApplication();
  }

  clearSavedMspApp(){
    this.mspDataService.removeMspApplication();
  }
}
