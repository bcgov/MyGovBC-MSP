import { Component, forwardRef, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { nameChangeSupportDocs } from '../../../../msp-core/components/support-documents/support-documents.component';
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
  viewProviders: [{
    provide: ControlContainer,
    useExisting: forwardRef(() => NgForm)
  }]
})

export class AddChildComponent extends Base implements OnInit {

  statusLabel: string = "Child's immigration status in Canada";
  relationShip: Relationship;

  childAgeCategory = [
    {label: '0-18 years', value: Relationship.ChildUnder19},
    {label: '19-24 years (must be a full-time student)', value: Relationship.Child19To24},
  ];

  status: StatusInCanada[] = [
    StatusInCanada.CitizenAdult,
    StatusInCanada.PermanentResident,
    StatusInCanada.TemporaryResident
  ];

  supportDocList: SupportDocumentTypes[] = [
    SupportDocumentTypes.CanadianBirthCertificate,
    SupportDocumentTypes.CanadianPassport,
    SupportDocumentTypes.CanadianCitizenCard
  ];

  nameChangeDocList = nameChangeSupportDocs();

  // @Input() accountChangeOptions: AccountChangeOptions;
  @Input() child: MspPerson ;
  // @Input() accountApp: MspAccountApp;
  @Input() index: number;
  @Output() personChange: EventEmitter<MspPerson> = new EventEmitter<MspPerson>();

  constructor(public dataService: MspAccountMaintenanceDataService) {
    super();
  }

  ngOnInit() {
    this.personChange.emit(this.child);
  }

  get childRelationship() {
    this.child.fullTimeStudent = ( this.child.relationship === Relationship.Child19To24 ) ? true : false;
    this.personChange.emit(this.child);
    return this.child.relationship;
  }

  set childRelationship(val: Relationship) {
    this.child.relationship = val;
    this.personChange.emit(this.child);
  }

  setChildRelationship(val: Relationship) {
    this.child.relationship = val;
    this.personChange.emit(this.child);
  }

  // TODO: Is this setter method necessary?
  set gender(evt: any) {
    this.child.gender = evt;
    this.personChange.emit(evt);
  }

  setGender(evt: any) {
    this.child.gender = evt;
    this.personChange.emit(evt);
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

  set statusDocuments(document: SupportDocuments) {
    this.child.updateStatusInCanadaDocType = document;
    if (document.images && document.images.length === 0) {
      // no status documents remove any name documents
      this.child.nameChangeDocs.documentType = null;
      this.child.nameChangeDocs.images = [];
    }
  }

  isPhnUniqueInChild() {
    return this.dataService.accountApp.isUniquePhnsinDependents;
  }
}
