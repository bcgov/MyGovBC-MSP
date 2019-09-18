import {ChangeDetectorRef, Component, Injectable , ViewChild, ViewChildren , QueryList, Input, Output, EventEmitter } from '@angular/core';
import {NgForm} from '@angular/forms';
import {Router} from '@angular/router';
import {BaseComponent} from '../../../../../models/base.component';
import {ProcessService, ProcessUrls} from '../../../../../services/process.service';
import { MspPerson, ItemList } from '../../../models/account.model';
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
import { MspImage } from '../../../../../models/msp-image';



@Component({
  selector: 'msp-account-file-uploader',
  templateUrl: './account-file-uploader.component.html',
  styleUrls: ['./account-file-uploader.component.scss']
})


export class AccountFileUploaderComponent extends BaseComponent {

  @Input() title: string;
  @Input() subtitle: string;

  @Input() doc: MspImage[] = [];
  @Input() docStatus: Documents;
  @Input() items:  ItemList[];

  @Input() accountApp: MspAccountApp;

  @Output() documentStatus: EventEmitter<Documents> = new EventEmitter<Documents>();
  @Output() onChange: EventEmitter<any> = new EventEmitter<any>();

  constructor(cd: ChangeDetectorRef) {
    super(cd);
   }

  ngOnInit() {
  }

  remove() {
    this.doc = [];
    this.docStatus = null;
    this.onChange.emit(this.doc);
    this.documentStatus.emit(this.docStatus);
  }


  addDoc(doc: Array<any>) {
    this.accountApp.documents = doc;
    this.doc = doc;
    this.onChange.emit(doc);
  }

  setDocType(evt: any) {
    this.documentStatus.emit(evt);
    //this.dataService.saveMspAccountApp();
  }

  get getdocStatusTitle() {
    if(this.docStatus === Documents.CanadianBirthCertificate) {
      return 'Canadian Birth Certificate';
    } else if(this.docStatus === Documents.CanadianPassport) {

      return "Canadian Passport";
    }else if(this.docStatus === Documents.CanadianCitizenCard) {

      return "Canadian CitizenCard";
    }else if(this.docStatus === Documents.RecordOfLanding) {

      return "Record Of Landing";
    }else if(this.docStatus === Documents.PermanentResidentCard) {

      return "Permanent Resident Card";
    }else if(this.docStatus === Documents.PermanentResidentConfirmation) {

      return "Permanent Resident Confirmation";
    }else if(this.docStatus === Documents.WorkPermit) {

      return "Work Permit";
    }else if(this.docStatus === Documents.StudyPermit) {

      return "Study Permit";
    }else if(this.docStatus === Documents.VisitorVisa) {

      return "Visitor Visa";
    } else if(this.docStatus === Documents.PassportWithDiplomaticFoil) {

      return "Passport With Diplomatic Foil";
    }
    else if(this.docStatus === Documents.MarriageCertificate) {

      return "Marriage Certificate";
    }else if(this.docStatus === Documents.ChangeOfNameCertificate) {

      return "Change Of Name Certificate";
    }else if(this.docStatus === Documents.ReligiousWorker) {

      return "Religious Worker";
    }else if(this.docStatus === Documents.NoticeOfDecision) {

      return "Notice Of Decision";
    }else if(this.docStatus === Documents.DiplomaticPassportAcceptance) {

      return "Diplomatic Passport Acceptance";
    }else if(this.docStatus === Documents.WorkInCanadaAcceptance) {

      return "Work In Canada Acceptance";
    } else if(this.docStatus === Documents.DivorceDecree) {

      return "Divorcee Decree";
    } else {
      return "Canadian Passport";
    }
  }

}
