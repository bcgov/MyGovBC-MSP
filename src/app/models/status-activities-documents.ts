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
  'Separated/Divorced',
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
    /* if (relationship === Relationship.Applicant) {
        return [Activities.WorkingInBC, Activities.StudyingInBC, Activities.ReligiousWorker, Activities.Diplomat];
      } else {
        return [Activities.WorkingInBC, Activities.StudyingInBC, Activities.ReligiousWorker, Activities.Diplomat,
          Activities.Visiting];
      }
       /* if (relationship === Relationship.Child19To24 ||
            relationship === Relationship.ChildUnder19 || relationship === Relationship.ChildUnder24) {
          return [Activities.MovingFromProvince, Activities.MovingFromCountry, Activities.LivingInBCWithoutMSP];
        }
        else {
          return [Activities.MovingFromProvince, Activities.MovingFromCountry, Activities.LivingInBCWithoutMSP];
        }
      case StatusInCanada.TemporaryResident:
        if (relationship === Relationship.Applicant) {
          return [Activities.WorkingInBC, Activities.StudyingInBC, Activities.ReligiousWorker, Activities.Diplomat];
        } else {
          return [Activities.WorkingInBC, Activities.StudyingInBC, Activities.ReligiousWorker, Activities.Diplomat,
            Activities.Visiting];
        }
    }*/
  }
}
