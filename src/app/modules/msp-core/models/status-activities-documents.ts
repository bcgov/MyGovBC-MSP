import { Documents } from './msp-document.constants';
import { StatusInCanada } from './canadian-status.enum';

/**
 * Various relationships
 */
export enum Relationship {
  Applicant,
  Spouse,
  ChildUnder19,
  Child19To24,
  ChildUnder24,
  AllAgeApplicant,
}


// TODO: Remove when all modules use the canadian-status.component
export const LangStatus = {
  CitizenAdult: 'Canadian citizen',
  PermanentResident: 'Permanent resident',
  TemporaryResident: 'Temporary permit holder or diplomat'
};


/**
 * Whose MSP Enrollement for ACL
 */
export enum MSPEnrollementMember {
  MyselfOnly, // adult
  AllMembers,
  SpecificMember
}



/**
 * Reasons for returning to Canada
 */
export enum Activities {
  LivingInBCWithoutMSP,
  MovingFromProvince,
  MovingFromCountry,
  WorkingInBC,
  StudyingInBC,
  ReligiousWorker,
  Diplomat,
  Visiting
}

export const LangActivities = {
  LivingInBCWithoutMSP: 'Not new to B.C. but need to apply for Medical Services Plan',
  MovingFromProvince: 'Moved to B.C. from another province',
  MovingFromCountry: 'Moved to B.C. from another country',
  WorkingInBC: 'Working in B.C.',
  StudyingInBC: 'Studying in B.C.',
  ReligiousWorker: 'Religious worker',
  Diplomat: 'Diplomat',
  Visiting: 'Visiting'
};


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

/**
 * Business rules for status
 * TODO: Remove as all relationships use the same status rules -
 * If need change - modify canadian-status component in msp-core
 */
/*
export class StatusRules {
  static availableStatus(relationship: Relationship): StatusInCanada[] {
    switch (relationship) {
      default:
        return [StatusInCanada.CitizenAdult,
          StatusInCanada.PermanentResident,
          StatusInCanada.TemporaryResident];
    }
  }
}
*/

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
  static availableActivities(relationship: Relationship, status: StatusInCanada): Activities[] {
    switch (status) {
      case StatusInCanada.CitizenAdult:
      case StatusInCanada.PermanentResident:
        if (relationship === Relationship.Child19To24 ||
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
    }
  }

  static activitiesForAccountChange(relationship: Relationship, status: StatusInCanada): Activities[] {
    console.log(status);
    console.log(StatusInCanada.CitizenAdult);
    console.log(StatusInCanada.PermanentResident);
    console.log(StatusInCanada.TemporaryResident);

    if (status === StatusInCanada.TemporaryResident) {
      console.log('got it');
      return [Activities.WorkingInBC, Activities.StudyingInBC,
                Activities.ReligiousWorker,
                Activities.Diplomat];
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
        }*/
    /*  return [Activities.WorkingInBC, Activities.StudyingInBC, Activities.ReligiousWorker, Activities.Diplomat,
          Activities.Visiting];*/


  }
}

/**
 * Business rules for documents
 */
export class DocumentRules {
  static availiableDocuments(status: StatusInCanada, activity: Activities): Documents[] {
    switch (status) {
      case StatusInCanada.CitizenAdult:
        return [Documents.CanadianBirthCertificate, Documents.CanadianCitizenCard, Documents.CanadianPassport];
      case StatusInCanada.PermanentResident:
        return [Documents.RecordOfLanding, Documents.PermanentResidentCard];
    }
    switch (activity) {
      case Activities.WorkingInBC:
        return [Documents.WorkPermit];
      case Activities.StudyingInBC:
        return [Documents.StudyPermit];
      case Activities.ReligiousWorker:
        return [Documents.VisitorVisa];
      case Activities.Diplomat:
        return [Documents.PassportWithDiplomaticFoil];
      case Activities.Visiting:
        return [Documents.VisitorVisa];
    }
  }

  static nameChangeDocument() {
    return [Documents.MarriageCertificate, Documents.ChangeOfNameCertificate];
  }
}


// Yes/no button labels
// TODO: figure out where to keeps common items like these
export const yesNoLabels = [{ 'label': 'No', 'value': false}, {'label': 'Yes', 'value': true} ];
export const genderLabels = [{'label': 'Female', 'value': 'F'}, { 'label': 'Male', 'value': 'M'}];
