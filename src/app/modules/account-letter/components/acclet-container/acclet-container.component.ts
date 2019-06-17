import { Component, OnInit } from '@angular/core';
import { Container } from 'moh-common-lib';
import { Router } from '@angular/router';
import { accletPages } from '../../acclet-page-routing.module';

@Component({
  selector: 'msp-acclet-container',
  templateUrl: './acclet-container.component.html',
  styleUrls: ['./acclet-container.component.scss']
})
export class AccletContainerComponent extends Container implements OnInit {

  constructor( public router: Router ) {
    super();
    this.setProgressSteps( accletPages );
  }

  ngOnInit() {
  }
}
