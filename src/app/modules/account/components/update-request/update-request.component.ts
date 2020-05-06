import {EventEmitter, Output, Component, Input, forwardRef } from '@angular/core';
import { MspAccountApp, UpdateList, ItemList } from '../../models/account.model';
import {
  nameChangeSupportDocuments,
  nameChangeDueToMarriageOrDivorceDocuments,
  genderDesignationChangeDocuments,
  nameChangeDueToErrorDocuments,
  genderBirthDateChangeDocuments
} from '../../../msp-core/components/support-documents/support-documents.component';
import { SupportDocumentTypes } from 'app/modules/msp-core/models/support-documents.enum';
import { Base } from 'moh-common-lib';
import { ControlContainer, NgForm } from '@angular/forms';
import { StatusInCanada } from 'app/modules/msp-core/models/canadian-status.enum';
import { MspPerson } from '../../../../components/msp/model/msp-person.model';
import { SupportDocuments } from '../../../msp-core/models/support-documents.model';

@Component({
  selector: 'msp-update-request',
  templateUrl: './update-request.component.html',
  styleUrls: ['./update-request.component.scss'],
  viewProviders: [{
    provide: ControlContainer,
    useExisting: forwardRef(() => NgForm)
  }]
})

export class UpdateRequestComponent extends Base {

  @Input() person: MspPerson;
  @Input() activitiesTable: any[];
  @Input() accountApp: MspAccountApp;
  @Input() label: string = 'Update';
  @Input() title: string;
  @Input() subtitle: string;
  @Input() status: boolean;
  @Input() updateList: UpdateList[] ;

  itemList: ItemList[];
  @Output() statusChange: EventEmitter<boolean>; //  = new EventEmitter<boolean>();
  mspAccountApp: MspAccountApp;
  canadianCitizenDocList: SupportDocumentTypes[] = [ SupportDocumentTypes.CanadianBirthCertificate , SupportDocumentTypes.CanadianPassport , SupportDocumentTypes.CanadianCitizenCard];
  permanentResidentDocList: SupportDocumentTypes[] = [ SupportDocumentTypes.PermanentResidentConfirmation , SupportDocumentTypes.RecordOfLanding , SupportDocumentTypes.PermanentResidentCard];
  hideStatus: StatusInCanada[] = [ StatusInCanada.CitizenAdult, StatusInCanada.PermanentResident];

  nameChangeDocs = nameChangeSupportDocuments();
  nameChangeDueToMarriageDocs = nameChangeDueToMarriageOrDivorceDocuments();
  nameChangeDueToNameChangeDocs = nameChangeDueToErrorDocuments();
  genderChangeDocs = genderDesignationChangeDocuments();
  nameChangeDuetoErrorDocs = nameChangeDueToErrorDocuments();
  genderBirthdateChangeDocs = genderBirthDateChangeDocuments();

  //statusValue: number;
 //  = legalStatus;
  constructor() {
    super();
    //this.mspAccountApp = dataService.getMspAccountApp();
    console.log(this.person);
  }

  ngOnInit() {
    //this.person = this.dataService.getMspAccountApp().applicant ;
    if (this.person.status >= 0 &&  this.person.status !== undefined) {
      //this.itemList = this.item(this.person.status);
    }
  }

  get hasStatus() {
    // Has to have values
    return this.person.status !== undefined;
  }

  get statusDocuments(): SupportDocuments {
    return this.person.updateStatusInCanadaDocType;
  }

  set statusDocuments( document: SupportDocuments ) {
    this.person.updateStatusInCanadaDocType = document;

    if ( document.images && document.images.length === 0 ) {
      // no status documents remove any name documents
      this.person.nameChangeDocs.documentType = null;
      this.person.nameChangeDocs.images = [];

      this.person.updateNameDueToMarriageRequestedLastName = null;
      this.person.updateNameDueToMarriageDocType.documentType = null;
      this.person.updateNameDueToMarriageDocType.images = [];

      this.person.updateNameDueToNameChangeDocType.documentType = null;
      this.person.updateNameDueToNameChangeDocType.images = [];

      this.person.updateNameDueToErrorDocType.documentType = null;
      this.person.updateNameDueToErrorDocType.images = [];

      this.person.updateBirthdateDocType.documentType = null;
      this.person.updateBirthdateDocType.images = [];

      this.person.updateGenderDocType.documentType = null;
      this.person.updateGenderDocType.images = [];

      this.person.updateGenderDesignationDocType.documentType = null;
      this.person.updateGenderDesignationDocType.images = [];
    }
  }

  getDocList() {
    if (this.person.status === StatusInCanada.CitizenAdult){
      return this.canadianCitizenDocList;
    }
    else if (this.person.status === StatusInCanada.PermanentResident){
      return this.permanentResidentDocList;
    }
  }

  checkStatus() {
    return (this.person.status === StatusInCanada.CitizenAdult ||
      this.person.status === StatusInCanada.PermanentResident ||
      this.person.currentActivity !== undefined);
  }
}
