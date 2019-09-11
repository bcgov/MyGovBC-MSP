import {ChangeDetectorRef, Component, Injectable , ViewChild, ViewChildren , QueryList } from '@angular/core';
import {NgForm} from '@angular/forms';
import {Router} from '@angular/router';
import {BaseComponent} from '../../../../models/base.component';
import {ProcessService, ProcessUrls} from '../../../../services/process.service';
import {AccountPersonalDetailsComponent} from '../personal-info/personal-details/personal-details.component';
import { MspPerson } from '../../models/account.model';
import { Relationship } from '../../../../models/status-activities-documents';
import { MspAccountMaintenanceDataService } from '../../services/msp-account-data.service';
import {ActivatedRoute} from '@angular/router';
import { MspAccountApp, AccountChangeOptions, UpdateList } from '../../models/account.model';
import { legalStatus } from '../../../../models/msp.contants';
import {
  StatusRules,
  ActivitiesRules,
  StatusInCanada,
  Activities,
  DocumentRules,
  Documents
} from '../../../../models/status-activities-documents';

import { Gender } from '../../../../components/msp/model/msp-person.model';
import { Person } from 'moh-common-lib';



@Component({
  selector: 'msp-spouse-info',
  templateUrl: './spouse-info.component.html',
  styleUrls: ['./spouse-info.component.scss']
})
export class SpouseInfoComponent {

  constructor() { }

 /* ngOnInit() {
  }*/

}
