import { Component, OnInit, Input } from '@angular/core';
import { AccountChangeOptions, MspAccountApp, UpdateList } from 'app/modules/account/models/account.model';
import { MspAccountMaintenanceDataService } from '../../../services/msp-account-data.service';
import { CanadianStatusStrings, StatusInCanada } from 'app/modules/msp-core/models/canadian-status.enum';
import { SupportDocuments } from 'app/modules/msp-core/models/support-documents.model';
import { nameChangeSupportDocuments } from 'app/modules/msp-core/components/support-documents/support-documents.component';
import { SupportDocumentTypes } from 'app/modules/msp-core/models/support-documents.enum';
import { Base } from 'moh-common-lib';
import { MspPerson } from '../../../../../components/msp/model/msp-person.model';
@Component({
  selector: 'msp-add-spouse',
  templateUrl: './add-spouse.component.html',
  styleUrls: ['./add-spouse.component.scss']
})
export class AddSpouseComponent extends Base implements OnInit {

  @Input() accountChangeOptions: AccountChangeOptions;
  @Input() spouse: MspPerson;
  @Input() accountApp: MspAccountApp;
  status: StatusInCanada[] = [ StatusInCanada.CitizenAdult, StatusInCanada.PermanentResident];
  supportDocList: SupportDocumentTypes[] = [ SupportDocumentTypes.CanadianBirthCertificate , SupportDocumentTypes.CanadianPassport , SupportDocumentTypes.CanadianCitizenCard];


  langStatus = CanadianStatusStrings;
  nameChangeDocList = nameChangeSupportDocuments();

  constructor( public dataService: MspAccountMaintenanceDataService) {

    super();
  }

  ngOnInit() {
    //this.spouse = this.dataService.accountApp.spouse;
    this.accountApp = this.dataService.accountApp;
  }

  onChange($event){
    console.log($event);
    console.log(this.spouse);
    //this.dataService.saveMspAccountApp();
  }


  get items()   {

    return[
      {
        'label': 'Marriage certificate',
        'value': SupportDocumentTypes.MarriageCertificate
      },
      {
        'label': 'Legal Name Change Certificate',
        'value': SupportDocumentTypes.ChangeOfNameCertificate
      }
    ];
  }

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
  }*/

  get hasStatus() {
    // Has to have values
    return this.spouse.status !== undefined;
  }

  get statusDocuments(): SupportDocuments {
    return this.spouse.updateStatusInCanadaDocType;
  }

  set statusDocuments( document: SupportDocuments ) {
    this.spouse.updateStatusInCanadaDocType = document;

    if ( document.images && document.images.length === 0 ) {



      // no status documents remove any name documents
      this.spouse.nameChangeDocs.documentType = null;
      this.spouse.nameChangeDocs.images = [];



    }


  }

/*  get activities(): Activities[] {
    return ActivitiesRules.activitiesForAccountChange(
        this.spouse.relationship,
        this.spouse.status
    );
  }*/

  isPhnUniqueInPI() {
    return this.dataService.accountApp.isUniquePhnsInPI;
  }

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

  get accountUpdateList(): UpdateList[] {

    return [{
        'label': 'Update status in Canada',
        'value': this.spouse.updateStatusInCanada
      },
      {
        'label': 'Update name - due to marriage or other',
        'value': this.spouse.updateNameDueToMarriage
      },
      {
        'label': 'Correct name - due to error',
        'value': this.spouse.updateNameDueToError
      },
      {
        'label': 'Correct birthdate',
        'value': this.spouse.updateBirthdate
      },
      {
        'label': 'Correct gender',
        'value': this.spouse.updateGender
      },
      {
        'label': 'Change gender designation',
        'value': this.spouse.updateGenderDesignation
      }

    ];

  }

  get spouseNameChangedocs(){

    return[
    {
      'label': 'Marriage Certificate',
      'value': SupportDocumentTypes.MarriageCertificate
    },
    {
      'label': 'Legal Name Change Certificate',
      'value': SupportDocumentTypes.ChangeOfNameCertificate
    }
  ]; }

}
