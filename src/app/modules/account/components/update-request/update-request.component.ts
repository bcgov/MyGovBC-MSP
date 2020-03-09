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
  viewProviders: [
    { provide: ControlContainer, useExisting: forwardRef(() => NgForm) }
  ]
})
export class UpdateRequestComponent extends Base {

  @Input() person: MspPerson;
  @Input() activitiesTable: any[];
 // @Input() items: string[];
 /* @Input() langStatus: ItemList[] = [{
       "label": "Canadian Citizen",
       "value": StatusInCanada.CitizenAdult
      },
      {
        "label": "Permanent Resident",
        "value": StatusInCanada.PermanentResident
      },
      {
        "label": "Temporary Permit Holder or Diplomat",
        "value": StatusInCanada.TemporaryResident
      }];*/

  @Input() accountApp: MspAccountApp;
  @Input() label: string = 'Update';
  @Input() title: string;
  @Input() subtitle: string;
  @Input() status: boolean;
  @Input() updateList: UpdateList[] ;

  itemList: ItemList[];
  @Output() statusChange: EventEmitter<boolean>; //  = new EventEmitter<boolean>();
  mspAccountApp: MspAccountApp;
  supportDocList: SupportDocumentTypes[] = [ SupportDocumentTypes.CanadianBirthCertificate , SupportDocumentTypes.CanadianPassport , SupportDocumentTypes.CanadianCitizenCard];
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





  /*setStatus(evt: any) {
    console.log(evt);
    //this.statusValue = evt ;
    this.person.status = evt ; //this.statusValue;
    this.person.currentActivity = null;
    this.itemList = this.item(evt);
    console.log(this.itemList);
    if ( this.person.status !== StatusInCanada.CitizenAdult) {
      this.person.institutionWorkHistory = 'No';
    }

   // this.dataService.saveMspAccountApp();

  }

  selectDocStatus(evt: any) {
    this.person.updateNameDueToMarriageDocType = evt;
   // this.accountApp.documents = evt;
    //this.dataService.saveMspAccountApp();
  }

  uploadDocument(evt: Array<any>) {
    console.log(evt);
    this.person.updateNameDueToMarriageDoc = evt;
   // this.dataService.saveMspAccountApp();
  }

  checkStatus(evt : boolean) {
    console.log(evt);
    console.log(this.person.updateStatusInCanada);
   // this.dataService.saveMspAccountApp();
    //this.statusChange.emit(evt);
  } */



  /*get activitiesTable() {
    console.log(this.activities);
		if (!this.activities) return;
		return this.activities.map(itm => {
      const label = this.activityStatus[itm];
      console.log(itm);
      console.log(label);
		  return {
			label,
			value: itm
		  };
		});
  }

  get activities(): Activities[] {
    console.log( this.person.relationship);
    console.log( this.person.status);
    // todo review correctness, had to modify after merge.
    return CanadianStatusRules.statusesForRelationship(
        this.person.relationship,
        this.person.status
    );
  }



  // get activities(): CanadianStatusReason[] {
  //   console.log( this.person.relationship);
  //   console.log( this.person.status);
  //   return ActivitiesRules.availableActivities(
  //       this.person.relationship,
  //       this.person.status
  //   );
  // }

activityStatus  =  {
  0: 'Not new to B.C. but need to apply for MSP',
  1: 'Moved to B.C. from another province',
  2: 'Moved to B.C. from another country',
  3: 'Working in B.C.',
  4: 'Studying in B.C.',
  5: 'Religious worker',
  6: 'Diplomat',
  7: 'Visiting'
};

public item(status: any)   {
  console.log(status);
  if(status === 0) {
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
    ]
  } else  if(status === 1) {
    return [
      {
        "label": "Confirmation Of Permanent Residence",
        "value": Documents.PermanentResidentConfirmation
      },
      {
        "label": "Permanent Resident Card (front and back)",
        "value": Documents.PermanentResidentCard
      },
      {
        "label": "Record Of Landing",
        "value": Documents.RecordOfLanding
      }
    ]
  }

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
]};

get nameChangeitems(){

  return[
  {
    "label": "Marriage certificate",
    "value": Documents.MarriageCertificate
  },
  {
    "label": "Legal Name change certificate",
    "value": Documents.ChangeOfNameCertificate
  },
  {
    "label": "Divorce Decree",
    "value": Documents.DivorceDecree
  }
]};

get correctNameDocs(){

  return[
  {
    "label": "Canadian Birth certificate",
    "value": Documents.CanadianBirthCertificate
  },
  {
    "label": "Canadian Citizenship card or certificate",
    "value": Documents.CanadianCitizenCard
  },
  {
    "label": "Canadian Passport",
    "value": Documents.CanadianPassport
  },
  {
    "label": "Permanent Resident Card",
    "value": Documents.PermanentResidentCard
  },
  {
    "label": "Confirmation of permanent residence",
    "value": Documents.PermanentResidentConfirmation
  },
  {
    "label": "Record of landing",
    "value": Documents.RecordOfLanding
  },
  {
    "label": "Study Permit",
    "value": Documents.StudyPermit
  },
  {
    "label": "Work Permit",
    "value": Documents.WorkPermit
  },
  {
    "label": "Visitor Permit",
    "value": Documents.VisitorVisa
  },
]};

get correctBirthDateDocs(){

  return[
  {
    "label": "BC Driver's License",
    "value": Documents.DriverLicense
  },
  {
    "label": "Canadian birth certificate",
    "value": Documents.CanadianBirthCertificate
  },
  {
    "label": "Canadian citizenship card or certificate",
    "value": Documents.CanadianCitizenCard
  },
  {
    "label": "Canadian passport",
    "value": Documents.CanadianPassport
  },
  {
    "label": "Permanent Resident Card",
    "value": Documents.PermanentResidentCard
  },
  {
    "label": "Confirmation of Permanent Residence",
    "value": Documents.PermanentResidentConfirmation
  },
  {
    "label": "Record Of Landing",
    "value": Documents.RecordOfLanding
  },
  {
    "label": "Study Permit",
    "value": Documents.StudyPermit
  },
  {
    "label": "Work Permit",
    "value": Documents.WorkPermit
  },
  {
    "label": "Visitor Permit",
    "value": Documents.VisitorVisa
  },
]};

get changeGenderDesignationDocs(){

  return[
  {
    "label": "Canadian Birth certificate",
    "value": Documents.MarriageCertificate
  },
  {
    "label": "Application for change of gender designation (Adult)",
    "value": Documents.ChangeGenderAdultApplication
  },
  {
    "label": "Application for change of gender designation (Child)",
    "value": Documents.ChangeGenderChildApplication
  },
  {
    "label": "Physician's or Psychologist confirmation of change of gender designation form",
    "value": Documents.ChangeGenderPhyscianConfirmation
  },
  {
    "label": "Request for waiver of parental consent (minor)",
    "value": Documents.ParentalConsentWaiver
  }
]};


get permanentResidentDocs() {
  return [
    {
      "label": "Confirmation Of Permanent Residence",
      "value": Documents.PermanentResidentConfirmation
    },
    {
      "label": "Permanent Resident Card (front and back)",
      "value": Documents.PermanentResidentCard
    },
    {
      "label": "Record Of Landing",
      "value": Documents.RecordOfLanding
    }
]};

get workPermitDocs() {
  return [
    {
      "label": "Work Permit",
      "value": Documents.WorkPermit
    },
    {
      "label": "Study Permit",
      "value": Documents.StudyPermit
    },
    {
      "label": "Acceptance to work in Canada",
      "value": Documents.WorkInCanadaAcceptance
    },
    {
      "label": "Acceptance foil from your Diplomatic Passport",
      "value": Documents.DiplomaticPassportAcceptance
    },
    {
      "label": "Notice of Decision",
      "value": Documents.NoticeOfDecision
    },
    {
      "label": "Permit indicating Religious Worker",
      "value": Documents.ReligiousWorker
    }
]};



 */

}

 /*
 * Various statuses in Canada

enum canadaStatus {
  CitizenAdult, // adult
  PermanentResident,
  TemporaryResident

}
*/
