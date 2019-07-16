import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Container, CheckCompleteBaseService } from 'moh-common-lib';
import { enrolPages } from '../../enrol-page-routing.module';
import { environment } from '../../../../../environments/environment';
import { ROUTES_ENROL } from '../../models/enrol-route-constants';

@Component({
  selector: 'msp-enrol-container',
  templateUrl: './enrol-container.component.html',
  styleUrls: ['./enrol-container.component.scss']
})
export class EnrolContainerComponent extends Container implements OnInit {

  constructor( public router: Router, private pgCheckService: CheckCompleteBaseService ) {
    super();

    // Set service name for application
    environment.appConstants.serviceName = 'Apply For MSP';
    this.setProgressSteps( enrolPages );

  /**
    * This is the same service that FPCare uses
    * Please do not change!
    *
    * If this service requires something or it does not function as required
    * please write a new service that implements AbstractPgCheckService or
    * extend CheckCompleteBaseService
    *
    * TODO: Fix routes
    */
   this.pgCheckService.pageCheckList = enrolPages.map( page => {
     if ( page.path !== '' ) {
       return {
         route: page.path,
         isComplete: false
       };
     }
   }).filter( x => x );

   this.pgCheckService.startUrl = ROUTES_ENROL.CHECK_ELIG.fullpath;
   this.pgCheckService.bypassGuards = environment.bypassGuards;
  }

  ngOnInit() {
  }
}
