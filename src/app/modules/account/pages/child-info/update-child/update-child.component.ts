import { Component, OnInit, Input } from '@angular/core';
import { MspAccountMaintenanceDataService } from '../../../services/msp-account-data.service';
import { MspAccountApp, AccountChangeOptions, UpdateList } from '../../../models/account.model';
import { MspPerson } from '../../../../../components/msp/model/msp-person.model';
import { Relationship } from '../../../../../models/relationship.enum';
import { StatusInCanada } from '../../../../msp-core/models/canadian-status.enum';
import { SupportDocumentTypes } from 'app/modules/msp-core/models/support-documents.enum';
import {
  nameChangeSupportDocs,
  nameChangeDueToMarriageOrDivorceDocuments,
  genderDesignationChangeDocuments,
  nameChangeDueToErrorDocuments,
  genderBirthDateChangeDocuments
} from '../../../../msp-core/components/support-documents/support-documents.component';

@Component({
  selector: 'msp-update-child',
  templateUrl: './update-child.component.html',
  styleUrls: ['./update-child.component.scss']
})
export class UpdateChildComponent implements OnInit {

  constructor( public dataService: MspAccountMaintenanceDataService) { }

  @Input() accountChangeOptions: AccountChangeOptions;
  @Input() child: MspPerson ;
  @Input() accountApp: MspAccountApp;
  @Input() index: number;
  @Input() phns: string[];
  canadianCitizenDocList: SupportDocumentTypes[] = [
    SupportDocumentTypes.CanadianBirthCertificate,
    SupportDocumentTypes.CanadianCitizenCard,
    SupportDocumentTypes.CanadianPassport
  ];
  permanentResidentDocList: SupportDocumentTypes[] = [
    SupportDocumentTypes.PermanentResidentConfirmation,
    SupportDocumentTypes.RecordOfLanding,
    SupportDocumentTypes.PermanentResidentCard
  ];
  hideStatus: StatusInCanada[] = [
    StatusInCanada.CitizenAdult,
    StatusInCanada.PermanentResident
  ];
  nameChangeDueToNameChangeDocs = nameChangeSupportDocs();
  nameChangeDueToMarriageDocs = nameChangeDueToMarriageOrDivorceDocuments();
  genderChangeDocs = genderDesignationChangeDocuments();
  nameChangeDuetoErrorDocs = nameChangeDueToErrorDocuments();
  genderBirthdateChangeDocs = genderBirthDateChangeDocuments();

  ngOnInit() {
    this.child.relationship = Relationship.Child;
  }

  checkStatus() {
    return (this.child.status === StatusInCanada.CitizenAdult ||
      this.child.status === StatusInCanada.PermanentResident ||
      this.child.currentActivity !== undefined);
    }

    getDocList() {
      if (this.child.status === StatusInCanada.CitizenAdult){
      return this.canadianCitizenDocList;
    }
    else if (this.child.status === StatusInCanada.PermanentResident){
      return this.permanentResidentDocList;
    }
  }

  get accountUpdateList(): UpdateList[] {
    return [
      {
        // tslint:disable-next-line: quotemark
        "label": "Update status in Canada",
        'value': this.child.updateStatusInCanada
      },
      {
        'label': 'Update name - due to marriage or other',
        'value': this.child.updateNameDueToMarriage
      },
      {
        'label': 'Correct name - due to error',
        'value': this.child.updateNameDueToError
      },
      {
        'label': 'Correct birthdate',
        'value': this.child.updateBirthdate
      },
      {
        'label': 'Correct gender',
        'value': this.child.updateGender
      },
      {
        'label': 'Change gender designation',
        'value': this.child.updateGenderDesignation
      }
    ];
  }

  get phnList() {
    const cp = [...this.phns];
    cp.splice(cp.indexOf(this.child.phn), 1);
    return cp;
  }
}
