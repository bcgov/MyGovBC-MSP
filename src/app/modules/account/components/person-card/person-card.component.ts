import { Component, Input } from '@angular/core';
import { MspPerson } from '../../../../components/msp/model/msp-person.model';
import { Router } from '@angular/router';
import { StatusInCanada, CanadianStatusReason, statusInCanadaStrings, CanadianStatusReasonStrings } from '../../../msp-core/models/canadian-status.enum';
import { getCountryDescription, getProvinceDescription } from 'moh-common-lib';
import { getStatusStrings, getStatusReasonStrings } from '../../../msp-core/components/canadian-status/canadian-status.component';
import { Relationship } from '../../../../models/relationship.enum';
import { format } from 'date-fns';

/* TO BE REPLACED when remaining apps are refactored to have own application  model definitions
 * built off the base classes ( base-person.model, base-application.model, base-msp-data.service,
 * base-msp-api.service)
 */
@Component({
  selector: 'account-person-card',
  templateUrl: './person-card.component.html',
  styleUrls: ['./person-card.component.scss']
})
export class AccountPersonCardComponent {

  public dateFormat = 'MMMM d, yyyy';

  lang = require('./i18n');

  status: string[] = getStatusStrings();

  statusReason: string[] = getStatusReasonStrings();

  @Input() person: MspPerson;
  @Input() editRouterLink: string;
  @Input() customTitle: string;
  @Input() customLinkTitle: string;
  @Input() accountCard: boolean = false;

  constructor(private _router: Router) {
  }

  ngOnInit() {
  }

  editPersonalInfo() {
    this._router.navigate([this.editRouterLink]);
  }

  get statusInCanadaLabel(): string {
    return statusInCanadaStrings[this.person.status];
  }

  get currentActivityLabel(): string {
    if (this.person.currentActivity === undefined){
      return '';
    }
    const currentActivity = '> ';
    switch (this.person.currentActivity) {
      case CanadianStatusReason.LivingInBCWithoutMSP: {
        return currentActivity + CanadianStatusReasonStrings.LivingInBCWithoutMSP;
      }
      case CanadianStatusReason.MovingFromProvince: {
        return currentActivity + CanadianStatusReasonStrings.MovingFromProvince;
      }
      case CanadianStatusReason.MovingFromCountry: {
        return currentActivity + CanadianStatusReasonStrings.MovingFromCountry;
      }
      case CanadianStatusReason.WorkingInBC: {
        return currentActivity + CanadianStatusReasonStrings.WorkingInBC;
      }
      case CanadianStatusReason.StudyingInBC: {
        return currentActivity + CanadianStatusReasonStrings.StudyingInBC;
      }
      case CanadianStatusReason.ReligiousWorker: {
        return currentActivity + CanadianStatusReasonStrings.ReligiousWorker;
      }
      case CanadianStatusReason.Diplomat: {
        return currentActivity + CanadianStatusReasonStrings.Diplomat;
      }
      case CanadianStatusReason.Visiting: {
        return currentActivity + CanadianStatusReasonStrings.Visiting;
      }
    }
  }

  // Check actual document uploads as opposed to which fields they have filled (children and spouses don't have the same fields as AH)
  get hasDocumentAttached(): boolean {
    return (
      this.person.updateStatusInCanadaDocType.images && this.person.updateStatusInCanadaDocType.images.length > 0 ||
      this.person.updateNameDueToMarriageDocType.images && this.person.updateNameDueToMarriageDocType.images.length > 0 ||
      this.person.updateNameDueToNameChangeDocType.images && this.person.updateNameDueToNameChangeDocType.images.length > 0 ||
      this.person.updateGenderDocType.images && this.person.updateGenderDocType.images.length > 0 ||
      this.person.updateNameDueToErrorDocType.images && this.person.updateNameDueToErrorDocType.images.length > 0 ||
      this.person.updateBirthdateDocType.images && this.person.updateBirthdateDocType.images.length > 0 ||
      this.person.updateGenderDesignationDocType.images && this.person.updateGenderDesignationDocType.images.length > 0 ||
      this.person.removedSpouseDueToDivorceDoc.images && this.person.removedSpouseDueToDivorceDoc.images.length > 0
    );
  }

  get documentCountForAccountHolder(): number {
    let count = 0;
    if (this.person.updateStatusInCanadaDocType.images) {
      count = count + this.person.updateStatusInCanadaDocType.images.length;
    }
    if (this.person.updateNameDueToMarriageDocType.images) {
      count = count + this.person.updateNameDueToMarriageDocType.images.length;
    }
    if (this.person.updateNameDueToNameChangeDocType.images) {
      count = count + this.person.updateNameDueToNameChangeDocType.images.length;
    }
    if (this.person.updateGenderDocType.images) {
      count = count + this.person.updateGenderDocType.images.length;
      if (this.person.updateGenderDocType2.images) {
        count = count + this.person.updateGenderDocType2.images.length;
      }
      if (this.person.updateGenderDocType3.images) {
        count = count + this.person.updateGenderDocType3.images.length;
      }
    }
    if (this.person.updateNameDueToErrorDocType.images) {
      count = count + this.person.updateNameDueToErrorDocType.images.length;
    }
    if (this.person.updateBirthdateDocType.images) {
      count = count + this.person.updateBirthdateDocType.images.length;
    }
    if (this.person.updateGenderDesignationDocType.images) {
      count = count + this.person.updateGenderDesignationDocType.images.length;
    }
    if (this.person.removedSpouseDueToDivorceDoc && this.person.removedSpouseDueToDivorceDoc.images) {
      count = count + this.person.removedSpouseDueToDivorceDoc.images.length;
    }
    return count;
  }

  get movedFromLabel(): string {
    if (this.person.status === StatusInCanada.TemporaryResident ||
      this.person.currentActivity === CanadianStatusReason.MovingFromCountry) {
      return 'Moved from country';
    }
    else {
      return 'Moved from province';
    }
  }

  get fileLabel(): string {
    if (this.documentCountForAccountHolder > 1) {
      return 'Files';
    } else if (this.documentCountForAccountHolder === 1) {
      return 'File';
    } else {
      return '';
    }
  }

  get movedFromProvinceOrCountry() {
    if (this.person.currentActivity === CanadianStatusReason.MovingFromCountry) {
      return getCountryDescription(this.person.movedFromProvinceOrCountry);
    }
    return getProvinceDescription(this.person.movedFromProvinceOrCountry);
  }

  formatDateField(dt: Date) {
    return format(dt, this.dateFormat);
  }

  get hasMarriageDate(): boolean {
    return !!this.person.marriageDate && this.person.relationship === Relationship.Spouse;
  }

  get title() {
    return this.customTitle ? this.customTitle :
      this.lang('./en/index.js').relationshipLabel[this.person.relationship] + ' ' + this.lang('./en/index.js').cardSuffix;
  }
}
