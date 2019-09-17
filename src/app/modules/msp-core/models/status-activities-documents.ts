import { StatusInCanada, CanadianStatusReason } from './canadian-status.enum';
import { Relationship } from './relationship.enum';

/**
 * Whose MSP Enrollement for ACL
 */
export enum MSPEnrollementMember {
  MyselfOnly, // adult
  AllMembers,
  SpecificMember
}



export enum CancellationReasons {
  NoLongerInFullTimeStudies,
  Deceased,
  OutOfProvinceOrCountry,
  ArmedForces,
  Incarcerated
}

export enum CancellationReasonsForSpouse {
   SeparatedDivorced,
   RemoveFromAccountButStillMarriedOrCommomLaw,
   Deceased,
   OutOfProvinceOrCountry,
   ArmedForces,
   Incarcerated,
}

export class EnrollmentStatusRules {
  static availableStatus(): MSPEnrollementMember[] {
        return [MSPEnrollementMember.MyselfOnly,
            MSPEnrollementMember.AllMembers,
            MSPEnrollementMember.SpecificMember];
      }
}

/**
 * Business rules for activities
 */
export class ActivitiesRules {

  /**
   * TODO: change to function and pass into the canadian_status component - see enrolment
   * personal, spouse or child pages.
   */
  static activitiesForAccountChange(relationship: Relationship, status: StatusInCanada): CanadianStatusReason[] {
    console.log(status);
    console.log(StatusInCanada.CitizenAdult);
    console.log(StatusInCanada.PermanentResident);
    console.log(StatusInCanada.TemporaryResident);

    if (status === StatusInCanada.TemporaryResident) {
      console.log('got it');
      return [CanadianStatusReason.WorkingInBC, CanadianStatusReason.StudyingInBC,
        CanadianStatusReason.ReligiousWorker,
        CanadianStatusReason.Diplomat];
    }
    /*  console.log("1");
      if (relationship === Relationship.Applicant) {
        return [Activities.WorkingInBC, Activities.StudyingInBC, Activities.ReligiousWorker, Activities.Diplomat];
      } else {
        return [Activities.WorkingInBC, Activities.StudyingInBC, Activities.ReligiousWorker, Activities.Diplomat,
          Activities.Visiting];
      }
      console.log("2");
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
