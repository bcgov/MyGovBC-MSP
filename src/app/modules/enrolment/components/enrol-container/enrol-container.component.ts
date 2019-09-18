import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Container, CheckCompleteBaseService } from 'moh-common-lib';
import { enrolPages } from '../../enrol-page-routing.module';
import { environment } from '../../../../../environments/environment';
import { ROUTES_ENROL } from '../../models/enrol-route-constants';
import { PageStateService } from '../../../../services/page-state.service';
import { MspDataService } from '../../../../services/msp-data.service';
import { HeaderService } from '../../../../services/header.service';

@Component({
  selector: 'msp-enrol-container',
  templateUrl: './enrol-container.component.html',
  styleUrls: ['./enrol-container.component.scss']
})
export class EnrolContainerComponent extends Container implements OnInit {

  constructor( public router: Router,
               private pageStateService: PageStateService,
               private dataService: MspDataService,
               private header: HeaderService ) {
    super();

    // Set service name for application
    this.header.setTitle('Apply For Medical Services Plan');
    this.setProgressSteps( enrolPages );
    this.dataService.mspApplication.pageStatus =
      this.pageStateService.setPages( enrolPages,
                                      ROUTES_ENROL,
                                      this.dataService.mspApplication.pageStatus );
  }

  ngOnInit() {
  }
}
