import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Container } from 'moh-common-lib';
import { enrolPages } from '../../enrol-page-routing.module';

@Component({
  selector: 'msp-enrol-container',
  templateUrl: './enrol-container.component.html',
  styleUrls: ['./enrol-container.component.scss']
})
export class EnrolContainerComponent extends Container implements OnInit {

  constructor( public router: Router ) {
    super();
    this.setProgressSteps( enrolPages );
  }

  ngOnInit() {
  }
}
