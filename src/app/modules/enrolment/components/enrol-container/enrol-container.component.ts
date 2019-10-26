import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Container } from 'moh-common-lib';
import { enrolPages } from '../../enrol-page-routing.module';
import { ROUTES_ENROL } from '../../models/enrol-route-constants';
import { PageStateService } from '../../../../services/page-state.service';
import { HeaderService } from '../../../../services/header.service';
import { EnrolDataService } from '../../services/enrol-data.service';

@Component({
  selector: 'msp-enrol-container',
  templateUrl: './enrol-container.component.html',
  styleUrls: ['./enrol-container.component.scss']
})
export class EnrolContainerComponent extends Container implements OnInit {

  // Spinner to show that application is processing
  isLoading = false;

  constructor( public router: Router,
               private pageStateService: PageStateService,
               private enrolDataService: EnrolDataService,
               private header: HeaderService ) {
    super();

    // Set service name for application
    this.header.setTitle('Application for Enrolment');
    this.setProgressSteps( enrolPages );
    this.enrolDataService.pageStatus = this.pageStateService.setPages( enrolPages,
                                                                       ROUTES_ENROL,
                                                                       this.enrolDataService.pageStatus );
  }

  ngOnInit() {
  }
}
