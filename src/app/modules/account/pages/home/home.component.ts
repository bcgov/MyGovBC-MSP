import { Component, OnInit, ChangeDetectorRef, Injectable, ViewChild, ElementRef } from '@angular/core';
import {ConsentModalComponent, PageStateService} from 'moh-common-lib';
import { MspAccountMaintenanceDataService } from '../../services/msp-account-data.service';
import { Router } from '@angular/router';
import { MspAccountApp } from '../../models/account.model';
import { HeaderService } from '../../../../services/header.service';
import { environment } from 'environments/environment';
import { MspApiAccountService } from '../../services/msp-api-account.service';
import { ApiResponse } from '../../../../models/api-response.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { MspLogService } from '../../../../services/log.service';
import devOnlyConsoleLog from 'app/_developmentHelpers/dev-only-console-log';

@Component({
  selector: 'msp-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  static ProcessStepNum = 0;
  public addressChangeLabel = 'Update Address';
  mspAccountApp: MspAccountApp;
  captchaApiBaseUrl: string = environment.appConstants.captchaApiBaseUrl;
  addressChangeBCUrl: string;
  @ViewChild('mspConsentModal') mspConsentModal: ConsentModalComponent;
  showAddressChangeCaptcha: boolean = false;
  showMoveCaptcha: boolean = false;
  outLinkTitle: string;
  outLinkUrl: string;
  continueButtonLoading: boolean = false;

  constructor(private dataService: MspAccountMaintenanceDataService,
              private header: HeaderService,
              private pageStateService: PageStateService,
              private apiService: MspApiAccountService,
              private router: Router,
              private logService: MspLogService) {
    this.header.setTitle('Account Management');
    this.pageStateService.setPageComplete();
  }

  ngOnInit() {
    this.mspAccountApp = this.dataService.getMspAccountApp();
  }

  ngAfterViewInit() {
    if (!this.mspAccountApp.infoCollectionAgreement) {
        this.mspConsentModal.showFullSizeView();
    }

  }
  onAccept(event: boolean) {
    this.mspAccountApp.infoCollectionAgreement = event;
    this.dataService.saveMspAccountApp();
  }

  onClickAddressChange() {
    this.outLinkTitle = 'Address Change BC';
    this.outLinkUrl = 'http://www.addresschange.gov.bc.ca/';
    this.showAddressChangeCaptcha = false;
    this.showMoveCaptcha = false;
    this.mspAccountApp.authorizationToken = null;

    setTimeout(() => {
      this.showAddressChangeCaptcha = true;
    }, 50);
  }

  onClickMove() {
    this.outLinkTitle = 'Move Outside BC';
    this.outLinkUrl = 'http://www.health.gov.bc.ca/exforms/msp/7063.html';
    this.showAddressChangeCaptcha = false;
    this.showMoveCaptcha = false;
    this.mspAccountApp.authorizationToken = null;

    setTimeout(() => {
      this.showMoveCaptcha = true;
    }, 50);
  }
}
