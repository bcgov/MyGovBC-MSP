import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Container, PageStateService } from 'moh-common-lib';
import { Router } from '@angular/router';
import { accountPageRoutes } from '../../account-pages.route';
import { HeaderService } from '../../../../services/header.service';
import { ACCOUNT_PAGES } from '../../account.constants';

@Component({
  selector: 'msp-account-container',
  templateUrl: './account-container.component.html',
  styleUrls: ['./account-container.component.scss']
})
export class AccountContainerComponent extends Container implements OnInit {

  constructor(public router: Router,
              private header: HeaderService,) {
    super();
    this.setProgressSteps(  accountPageRoutes );
    this.header.setTitle('Account Management');
    //this.pageStateService.setPages(accountPageRoutes, ACCOUNT_PAGES);
  }

  ngOnInit() {
  }
}
