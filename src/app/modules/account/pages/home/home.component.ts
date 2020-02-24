import { Component, OnInit, ChangeDetectorRef, Injectable, ViewChild, ElementRef } from '@angular/core';
import {ConsentModalComponent} from 'moh-common-lib';
import { MspAccountMaintenanceDataService } from '../../services/msp-account-data.service';
import {ActivatedRoute} from '@angular/router';
import { MspAccountApp } from '../../models/account.model';
@Component({
  selector: 'msp-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  static ProcessStepNum = 0;
  public addressChangeLabel = 'Update Address';
  mspAccountApp: MspAccountApp;
  captchaApiBaseUrl: string;
  addressChangeBCUrl: string;
  @ViewChild('mspConsentModal', {static: true}) mspConsentModal: ConsentModalComponent;

  constructor(private dataService: MspAccountMaintenanceDataService) { }

  ngOnInit() {
    this.mspAccountApp = this.dataService.getMspAccountApp();
  }
 
  ngAfterViewInit() {
    if (!this.mspAccountApp.infoCollectionAgreement) {
        this.mspConsentModal.showFullSizeView();
    }

  }
  onAccept(event: boolean) {
    console.log(event);
    this.mspAccountApp.infoCollectionAgreement = event;
    this.dataService.saveMspAccountApp();
  }

  
}
