import { Documents } from './msp-document.constants';
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
        }*/
    /*  return [Activities.WorkingInBC, Activities.StudyingInBC, Activities.ReligiousWorker, Activities.Diplomat,
          Activities.Visiting];*/


  }
}

/**
 * Business rules for documents
 */
export class DocumentRules {
  static availiableDocuments(status: StatusInCanada, activity: CanadianStatusReason): Documents[] {
    switch (status) {
      case StatusInCanada.CitizenAdult:
        return [Documents.CanadianBirthCertificate, Documents.CanadianCitizenCard, Documents.CanadianPassport];
      case StatusInCanada.PermanentResident:
        return [Documents.RecordOfLanding, Documents.PermanentResidentCard];
    }
    switch (activity) {
      case CanadianStatusReason.WorkingInBC:
        return [Documents.WorkPermit];
      case CanadianStatusReason.StudyingInBC:
        return [Documents.StudyPermit];
      case CanadianStatusReason.ReligiousWorker:
        return [Documents.VisitorVisa];
      case CanadianStatusReason.Diplomat:
        return [Documents.PassportWithDiplomaticFoil];
      case CanadianStatusReason.Visiting:
        return [Documents.VisitorVisa];
    }
  }

  static nameChangeDocument() {
    return [Documents.MarriageCertificate, Documents.ChangeOfNameCertificate];
  }
}
