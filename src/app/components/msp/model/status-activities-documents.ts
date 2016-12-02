/**
 * Various relationships
 */
enum Relationship {
  Applicant,
  Spouse,
  Child
}


/**
 * Various statuses in Canada
 */
enum StatusInCanada {
  CitizenAdult, // adult
  CitizenYoungAdultStudent, //19-24, full-time student
  CitizenYouth, // 0-18
  PermanentResident,
  PermanentResidentAdultStudent, //19-24, full-time student
  PermanentResidentYouth, // 0-18
  TemporaryResident,
}

/**
 * Reasons for returning to Canada
 */
enum Activities {
  Returning,
  MovingFromProvince,
  MovingFromCountry,
  WorkingInBC,
  StudyingInBC,
  ReligousWorker,
  SpouseOrDep,
  Diplomat
}

/**
 * ID documents
 */
enum Documents {
  CanadianBirthCertificate,
  CanadianPassport,
  CanadianCitizenCard,
  RecordOfLanding,
  PermanentResidentCard,
  WorkPermit,
  StudyPermit,
  VisitorVisa,
  PassportWithDiplomaticFoil
}

/**
 * Business rules for status
 */
class StatusRules {
  static availableStatus(relationship: Relationship): StatusInCanada[] {
    switch (relationship) {
      case Relationship.Applicant:
        return [StatusInCanada.CitizenAdult, StatusInCanada.PermanentResident, StatusInCanada.TemporaryResident];
      default:
        return [StatusInCanada.CitizenAdult, StatusInCanada.CitizenYoungAdultStudent, StatusInCanada.CitizenYouth,
          StatusInCanada.PermanentResident, StatusInCanada.PermanentResidentAdultStudent, StatusInCanada.PermanentResidentYouth,
          StatusInCanada.TemporaryResident];
    }
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
        return [Activities.Returning, Activities.MovingFromProvince, Activities.MovingFromCountry];
      case StatusInCanada.CitizenYoungAdultStudent:
      case StatusInCanada.CitizenYouth:
      case StatusInCanada.PermanentResidentAdultStudent:
      case StatusInCanada.PermanentResidentYouth:
        return [Activities.Returning, Activities.MovingFromProvince];
      case StatusInCanada.TemporaryResident:
        if (Relationship.Applicant) {
          return [Activities.WorkingInBC, Activities.StudyingInBC, Activities.ReligousWorker, Activities.Diplomat]
        }
        else {
          return [Activities.WorkingInBC, Activities.StudyingInBC, Activities.ReligousWorker, Activities.SpouseOrDep, Activities.Diplomat]
        }
    }
  }
}

/**
 * Business rules for documents
 */
class DocumentRules {
  static availiableDocuments(status: StatusInCanada, activity: Activities): Documents[] {
    switch (status) {
      case StatusInCanada.CitizenAdult:
      case StatusInCanada.CitizenYoungAdultStudent:
      case StatusInCanada.CitizenYouth:
        return [Documents.CanadianBirthCertificate, Documents.CanadianCitizenCard, Documents.CanadianPassport];
      case StatusInCanada.PermanentResident:
      case StatusInCanada.PermanentResidentAdultStudent:
        return [Documents.RecordOfLanding, Documents.PermanentResidentCard];
    }
    switch (activity) {
      case Activities.WorkingInBC:
        return [Documents.WorkPermit];
      case Activities.StudyingInBC:
        return [Documents.StudyPermit];
      case Activities.SpouseOrDep:
      case Activities.ReligousWorker:
        return [Documents.VisitorVisa];
      case Activities.Diplomat:
        return [Documents.PassportWithDiplomaticFoil]
    }
  }
}

export {Relationship, Activities, StatusInCanada, Documents, ActivitiesRules, StatusRules, DocumentRules};