import { Component, forwardRef, OnInit, Input, AfterViewInit, OnDestroy, ChangeDetectorRef, Injectable , ViewChild, ViewChildren , QueryList, Output, EventEmitter } from '@angular/core';
import { nameChangeSupportDocuments } from '../../../../msp-core/components/support-documents/support-documents.component';
import { AbstractForm } from 'moh-common-lib';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { NgForm, ControlContainer } from '@angular/forms';
import {Router} from '@angular/router';
import {BaseComponent} from '../../../../../models/base.component';
import {ProcessService, ProcessUrls} from '../../../../../services/process.service';
//import { AccountPersonalDetailsComponent}  from './personal-details/personal-details.component';
import { MspPerson } from '../../../models/account.model';
import { MspAccountMaintenanceDataService } from '../../../services/msp-account-data.service';
import {ActivatedRoute} from '@angular/router';
import { MspAccountApp, AccountChangeOptions, UpdateList } from '../../../models/account.model';
import { PersonDocuments } from '../../../../../components/msp/model/person-document.model';

import {
  Gender
} from '../../../../../components/msp/model/msp-person.model';
import { Person } from 'moh-common-lib';
import { SupportDocuments } from 'app/modules/msp-core/models/support-documents.enum';
import { Base, SimpleDate } from 'moh-common-lib';
import { Relationship } from 'app/models/relationship.enum';
import { StatusInCanada } from 'app/modules/msp-core/models/canadian-status.enum';

@Component({
  selector: 'msp-add-child',
  templateUrl: './add-child.component.html',
  styleUrls: ['./add-child.component.scss'],

  viewProviders: [
    { provide: ControlContainer, useExisting: forwardRef(() => NgForm) }
  ]
})


export class AddChildComponent extends Base implements OnInit {
  
  statusLabel: string = 'Child\'s immigration status in Canada';
  relationShip : Relationship;

  childAgeCategory = [
    {label: '0-18 years', value: Relationship.ChildUnder19},
    {label: '19-24 years (must be a full-time student)', value: Relationship.Child19To24},
  ];

  status: StatusInCanada[] = [ StatusInCanada.CitizenAdult, StatusInCanada.PermanentResident , StatusInCanada.TemporaryResident];
  supportDocList: SupportDocuments[] = [ SupportDocuments.CanadianBirthCertificate , SupportDocuments.CanadianPassport , SupportDocuments.CanadianCitizenCard];
  nameChangeDocList = nameChangeSupportDocuments();

 // @Input() accountChangeOptions: AccountChangeOptions;
  @Input() child: MspPerson ;
 // @Input() accountApp: MspAccountApp;
  @Input() index: number;
  @Output() personChange: EventEmitter<MspPerson> = new EventEmitter<MspPerson>();

  constructor( public dataService: MspAccountMaintenanceDataService) {
    super();
  }

  ngOnInit() {
    this.personChange.emit(this.child);
  }

  get childRelationship() {
       return this.child.relationship;
  }

  set childRelationship(val: Relationship) {
    this.child.relationship = val;
    //this.dataService.saveMspAccountApp();
    this.personChange.emit(this.child);
  }

get newlyAdopted() {
    return this.child.newlyAdopted;
}

set newlyAdopted(val: boolean) {
 this.child.newlyAdopted = val;
 this.personChange.emit(this.child);
}

get hasActiveMedicalCoverage() {
  return this.child.hasActiveMedicalServicePlan;
}

set hasActiveMedicalCoverage(val: boolean) {
  this.child.hasActiveMedicalServicePlan = val;
  this.personChange.emit(this.child);
}


get statusDocuments(): PersonDocuments {
  return this.child.updateStatusInCanadaDocType;
}

isPhnUniqueInChild() {
  return this.dataService.accountApp.isUniquePhnsinDependents;
}


set statusDocuments( document: PersonDocuments ) {
  
  this.child.updateStatusInCanadaDocType = document;

  if ( document.images && document.images.length === 0 ) {
    // no status documents remove any name documents
    this.child.nameChangeDocs.documentType = null;
    this.child.nameChangeDocs.images = [];

   

   /* this.child.updateNameDueToMarriageDocType.documentType = null;
    this.child.updateNameDueToMarriageDocType.images = [];

    this.child.updateNameDueToErrorDocType.documentType = null;
    this.child.updateNameDueToErrorDocType.images = [];

    this.child.updateBirthdateDocType.documentType = null;
    this.child.updateBirthdateDocType.images = [];

    this.child.updateGenderDocType.documentType = null;
    this.child.updateGenderDocType.images = [];

    this.child.updateGenderDesignationDocType.documentType = null;
    this.child.updateGenderDesignationDocType.images = [];*/

  }

  
}

 /* get childNameChangedocs() : PersonDocuments {
    return this.child.nameChangeDocs;
  };

  get statusChangeDocList(): SupportDocuments[] {
    return [SupportDocuments.CanadianBirthCertificate, 
          SupportDocuments.CanadianCitizenCard,
          SupportDocuments.CanadianPassport];
  }


   statusDocUpdate($event) {
    this.child[this.index].documents = $event;

    if ( this.child[this.index].documents && this.child[this.index].documents.images.length === 0 ) {
      // no status documents remove any name documents
      this.child[this.index].nameChangeDocs.documentType = null;
      this.child[this.index].nameChangeDocs.images = [];
    }
  }

 displayStatusOpt(index: number): boolean {
    return this.children[index].relationship !== Relationship.Unknown;
  }

  get items()   {

    return[
    { 
      "label": "Canadian birth certificate",
      "value": Documents.CanadianBirthCertificate
    },
    { 
      "label": "Canadian Passport",
      "value": Documents.CanadianPassport
    },
    { 
      "label": "Canadian citizenship card or certificate",
      "value": Documents.CanadianCitizenCard
    }
  ]}; */
}
