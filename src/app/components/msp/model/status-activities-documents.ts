/**
 * Various relationships
 */
enum Relationship {
  Applicant,
  Spouse,
  ChildUnder19,
  Child19To24,
}


/**
 * Various statuses in Canada
 */
enum StatusInCanada {
  CitizenAdult, // adult
  PermanentResident,
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
  RecordOfLanding,
  PermanentResidentCard,
  WorkPermit,
  StudyPermit,
  VisitorVisa,
  PassportWithDiplomaticFoil,
  MarriageCertificate,
  ChangeOfNameCertificate
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

/**
 * Business rules for activities
 */
class ActivitiesRules {
  static availableActivities(relationship: Relationship, status: StatusInCanada): Activities[] {
    switch (status) {
      case StatusInCanada.CitizenAdult:
      case StatusInCanada.PermanentResident:
        if (relationship === Relationship.Child19To24 ||
            relationship === Relationship.ChildUnder19) {
          return [Activities.Returning, Activities.MovingFromProvince, Activities.MovingFromCountry];
        }
        else {
          return [Activities.Returning, Activities.MovingFromProvince, Activities.MovingFromCountry];
        }
      case StatusInCanada.TemporaryResident:
        if (relationship === Relationship.Applicant) {
          return [Activities.WorkingInBC, Activities.StudyingInBC, Activities.ReligousWorker, Activities.Diplomat]
        } else {
          return [Activities.WorkingInBC, Activities.StudyingInBC, Activities.ReligousWorker, Activities.Diplomat,
            Activities.Visiting]
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
        return [Documents.CanadianBirthCertificate, Documents.CanadianCitizenCard, Documents.CanadianPassport];
      case StatusInCanada.PermanentResident:
        return [Documents.RecordOfLanding, Documents.PermanentResidentCard];
    }
    switch (activity) {
      case Activities.WorkingInBC:
        return [Documents.WorkPermit];
      case Activities.StudyingInBC:
        return [Documents.StudyPermit];
      case Activities.ReligousWorker:
        return [Documents.VisitorVisa];
      case Activities.Diplomat:
        return [Documents.PassportWithDiplomaticFoil]
      case Activities.Visiting:
        return [Documents.VisitorVisa];
    }
  }

  static nameChangeDocument() {
    return [Documents.MarriageCertificate, Documents.ChangeOfNameCertificate]
  }
}

export {Relationship, Activities, StatusInCanada, Documents, ActivitiesRules, StatusRules, DocumentRules};