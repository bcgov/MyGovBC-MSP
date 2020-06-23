import { Component, OnInit, ChangeDetectorRef, Injectable, ViewChild, ElementRef } from '@angular/core';
import {ConsentModalComponent, PageStateService} from 'moh-common-lib';
import { MspAccountMaintenanceDataService } from '../../services/msp-account-data.service';
import {ActivatedRoute} from '@angular/router';
import { MspAccountApp } from '../../models/account.model';
import { HeaderService } from '../../../../services/header.service';
import { environment } from 'environments/environment';
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
  outLinkUrl: string;

  constructor(private dataService: MspAccountMaintenanceDataService,
              private header: HeaderService,
              private pageStateService: PageStateService) { 
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
    this.outLinkUrl = 'http://www.addresschange.gov.bc.ca/';
    this.showAddressChangeCaptcha = false;
    this.showMoveCaptcha = false;
    this.mspAccountApp.authorizationToken = null;
    
    setTimeout(() => {
      this.showAddressChangeCaptcha = true;
    }, 50);
  }

  onClickMove() {
    this.outLinkUrl = 'http://www.health.gov.bc.ca/exforms/msp/7063.html';
    this.showAddressChangeCaptcha = false;
    this.showMoveCaptcha = false;
    this.mspAccountApp.authorizationToken = null;

    setTimeout(() => {
      this.showMoveCaptcha = true;
    }, 50);
  }

  continue() {
    window.open(this.outLinkUrl, '_blank');
  }
}
