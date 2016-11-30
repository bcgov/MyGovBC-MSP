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
  CanadianCitizenCard
}

/**
 * Business rules for status
 */
class StatusRules {
  static availableStatus(relationship: Relationship): StatusInCanada[] {
    switch (relationship) {
      case Relationship.Applicant:
        return [StatusInCanada.CitizenAdult, StatusInCanada.PermanentResident, StatusInCanada.TemporaryResident];
    }
  }
}

/**
 * Business rules for activities
 */
class ActivitiesRules {
  static availableActivities(status: StatusInCanada): Activities[] {
    switch (status) {
      case StatusInCanada.CitizenAdult:
        return [Activities.Returning, Activities.MovingFromProvince, Activities.MovingFromCountry];
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
    }
  }
}

export {Relationship, Activities, StatusInCanada, Documents, ActivitiesRules, StatusRules, DocumentRules};