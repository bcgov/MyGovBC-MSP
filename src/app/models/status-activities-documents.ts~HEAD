import { Relationship } from "app/modules/msp-core/models/relationship.enum";

/**
 * Various relationships
 */


/**
 * Various statuses in Canada
 */
enum StatusInCanada {
  CitizenAdult, // adult
  PermanentResident,
  TemporaryResident
  
}

/**
 * Whose MSP Enrollement for ACL
 */
enum MSPEnrollementMember {
  MyselfOnly, // adult
  AllMembers,
  SpecificMember
}



/**
 * Reasons for returning to Canada
 */
enum Activities {
  LivingInBCWithoutMSP,
  MovingFromProvince,
  MovingFromCountry,
  WorkingInBC,
  StudyingInBC,
  ReligiousWorker,
  Diplomat,
  Visiting
}

/**
 * ID documents
 */
enum Documents {
  CanadianBirthCertificate,
  CanadianPassport,
  CanadianCitizenCard,
  DriverLicense,
  RecordOfLanding,
  PermanentResidentCard,
  PermanentResidentConfirmation,
  WorkPermit,
  StudyPermit,
  VisitorVisa,
  PassportWithDiplomaticFoil,
  MarriageCertificate,
  ChangeOfNameCertificate,
  ReligiousWorker,
  NoticeOfDecision,
  DiplomaticPassportAcceptance,
  WorkInCanadaAcceptance,
  DivorceDecree,
  ChangeGenderAdultApplication,
  ChangeGenderChildApplication,
  ChangeGenderPhyscianConfirmation,
  ParentalConsentWaiver,
  SeperationAgreement,
  NotrizedStatementOrAffidavit,
  Other,

}

enum CancellationReasons {
  NoLongerInFullTimeStudies,
  DivorcedOrSeperated,
  Deceased,
  RemovedFromAccountButMarried,
  OutOfProvinceOrCountry,
  ArmedForces,
  Incarcerated
}

enum CancellationReasonsForSpouse {
   SeparatedDivorced,
   RemoveFromAccountButStillMarriedOrCommomLaw,
   Deceased,
    OutOfProvinceOrCountry,
    ArmedForces,
   Incarcerated,
}

/**
 * Business rules for status
 */
class StatusRules {
  static availableStatus(relationship: Relationship): StatusInCanada[] {
    switch (relationship) {
      default:
        return [StatusInCanada.CitizenAdult,
          StatusInCanada.PermanentResident,
          StatusInCanada.TemporaryResident];
    }
  }
}

class EnrollmentStatusRules {
  static availableStatus(): MSPEnrollementMember[] {
        return [MSPEnrollementMember.MyselfOnly,
            MSPEnrollementMember.AllMembers,
            MSPEnrollementMember.SpecificMember];
      }
}

/**
 * Business rules for activities
 */
class ActivitiesRules {
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
      console.log("got it");
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
class DocumentRules {
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

export {MSPEnrollementMember, EnrollmentStatusRules, Relationship, Activities, StatusInCanada, Documents, ActivitiesRules, StatusRules, DocumentRules, CancellationReasons , CancellationReasonsForSpouse};
