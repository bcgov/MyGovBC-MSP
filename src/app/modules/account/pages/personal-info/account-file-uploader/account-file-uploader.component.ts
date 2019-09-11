import {ChangeDetectorRef, Component, Injectable , ViewChild, ViewChildren , QueryList, Input } from '@angular/core';
import {NgForm} from '@angular/forms';
import {Router} from '@angular/router';
import {BaseComponent} from '../../../../../models/base.component';
import {ProcessService, ProcessUrls} from '../../../../../services/process.service';
import { MspPerson } from '../../../models/account.model';
import { Relationship } from '../../../../../models/status-activities-documents';
import { MspAccountMaintenanceDataService } from '../../../services/msp-account-data.service';
import {ActivatedRoute} from '@angular/router';
import { MspAccountApp, AccountChangeOptions, UpdateList } from '../../../models/account.model';
import { legalStatus } from '../../../../../models/msp.contants';
import {
  StatusRules,
  ActivitiesRules,
  StatusInCanada,
  Activities,
  DocumentRules,
  Documents
} from '../../../../../models/status-activities-documents';



@Component({
  selector: 'msp-account-file-uploader',
  templateUrl: './account-file-uploader.component.html',
  styleUrls: ['./account-file-uploader.component.scss']
})


export class AccountFileUploaderComponent  {

  @Input() title: string;
  @Input() subtitle: string;
  docSelected: string;
  @Input() person: MspPerson;
  @Input() activitiesTable: any[];
  @Input() items: string[];
  @Input() accountApp: MspAccountApp;

  constructor() {

    console.log(this.person);
   }

  ngOnInit() {
  }

  remove() {
    this.docSelected = null;
  }

}
