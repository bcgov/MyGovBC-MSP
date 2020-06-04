import { Component, OnInit } from '@angular/core';
import { Container } from 'moh-common-lib';
import { Router } from '@angular/router';
import { accountPages, accountStepperPages } from '../../account-page-routing.module';
import { HeaderService } from '../../../../services/header.service';

@Component({
  selector: 'msp-account-container',
  templateUrl: './account-container.component.html',
  styleUrls: ['./account-container.component.scss']
})
export class AccountContainerComponent extends Container implements OnInit {

  constructor( public router: Router, private header: HeaderService ) {
    super();
    this.setProgressSteps(  accountStepperPages );
    this.header.setTitle('Account Management');
  }

  ngOnInit() {
  }
}
