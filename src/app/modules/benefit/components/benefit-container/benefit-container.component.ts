import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { benefitPages, displayedbenefitPages } from '../../benefit-page-routing.modules';
import { Container } from 'moh-common-lib';

@Component({
  selector: 'msp-benefit-container',
  templateUrl: './benefit-container.component.html',
  styleUrls: ['./benefit-container.component.scss']
})
export class BenefitContainerComponent extends Container implements OnInit  {

  constructor( public router: Router ) {
    super();
    this.setProgressSteps( displayedbenefitPages );
  }

  ngOnInit() {
  }
}
