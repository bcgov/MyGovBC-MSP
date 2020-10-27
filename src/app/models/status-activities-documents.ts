import {
  StatusInCanada,
  CanadianStatusReason,
} from '../modules/msp-core/models/canadian-status.enum';
import { Relationship } from './relationship.enum';

export enum CancellationReasons {
  SeparatedDivorced,
  RemoveFromAccountButStillMarriedOrCommomLaw,
  NoLongerInFullTimeStudies,
  Deceased,
  OutOfProvinceOrCountry,
  ArmedForces,
  Incarcerated,
}

export enum CancellationReasonsStrings {
  'Separated / Divorced',
  'Remove from Account but still married/common-law',
  'No longer in full time studies',
  'Deceased',
  'Out of province / Out of Country move',
  'Armed Forces',
  'Incarcerated',
}

export enum CancellationReasonsForSpouse {
  SeparatedDivorced,
  RemoveFromAccountButStillMarriedOrCommomLaw,
  Deceased,
  OutOfProvinceOrCountry,
  ArmedForces,
  Incarcerated,
}

/**
 * Business rules for activities
 */
export class ActivitiesRules {
  /**
   * TODO: change to function and pass into the canadian_status component - see enrolment
   * personal, spouse or child pages.
   */
  static activitiesForAccountChange(
    relationship: Relationship,
    status: StatusInCanada
  ): CanadianStatusReason[] {
    if (status === StatusInCanada.TemporaryResident) {
      return [
        CanadianStatusReason.WorkingInBC,
        CanadianStatusReason.StudyingInBC,
        CanadianStatusReason.ReligiousWorker,
        CanadianStatusReason.Diplomat,
      ];
    }
  }
}
