import { Component, forwardRef, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { nameChangeSupportDocuments } from '../../../../msp-core/components/support-documents/support-documents.component';
import { NgForm, ControlContainer } from '@angular/forms';
import { MspAccountMaintenanceDataService } from '../../../services/msp-account-data.service';
import { Base } from 'moh-common-lib';
import { Relationship } from 'app/models/relationship.enum';
import { StatusInCanada } from 'app/modules/msp-core/models/canadian-status.enum';
import { MspPerson } from '../../../../../components/msp/model/msp-person.model';
import { SupportDocumentTypes } from '../../../../msp-core/models/support-documents.enum';
import { SupportDocuments } from '../../../../msp-core/models/support-documents.model';

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
  relationShip: Relationship;

  childAgeCategory = [
    {label: '0-18 years', value: Relationship.ChildUnder19},
    {label: '19-24 years (must be a full-time student)', value: Relationship.Child19To24},
  ];

  status: StatusInCanada[] = [ StatusInCanada.CitizenAdult, StatusInCanada.PermanentResident , StatusInCanada.TemporaryResident];
  supportDocList: SupportDocumentTypes[] = [ SupportDocumentTypes.CanadianBirthCertificate , SupportDocumentTypes.CanadianPassport , SupportDocumentTypes.CanadianCitizenCard];
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


get statusDocuments(): SupportDocuments {
  return this.child.updateStatusInCanadaDocType;
}

isPhnUniqueInChild() {
  return this.dataService.accountApp.isUniquePhnsinDependents;
}


set statusDocuments( document: SupportDocuments ) {

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

  get statusChangeDocList(): SupportDocumentTypes[] {
    return [SupportDocumentTypes.CanadianBirthCertificate,
          SupportDocumentTypes.CanadianCitizenCard,
          SupportDocumentTypes.CanadianPassport];
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
