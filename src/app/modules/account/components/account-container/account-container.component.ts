import { Component, OnInit } from '@angular/core';
import { Container } from 'moh-common-lib';
import { Router } from '@angular/router';
import { accountPages } from '../../account-page-routing.module';

@Component({
  selector: 'msp-account-container',
  templateUrl: './account-container.component.html',
  styleUrls: ['./account-container.component.scss']
})
export class AccountContainerComponent extends Container implements OnInit {

  constructor( public router: Router ) {
    super();
    this.setProgressSteps( accountPages );
  }

  ngOnInit() {
  }
}
