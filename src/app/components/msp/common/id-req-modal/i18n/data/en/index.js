module.exports = {
    titleEnrollment: 'ID Requirements for MSP Enrolment',
    titleAccount: 'ID Requirements for Account Maintanence',

    intro: '',

    /*
    module.exports = {
    0: 'Canadian birth certificate',
    1: 'Canadian passport',
    2: 'Canadian citizenship card or certificate',
    3: 'Record of Landing',
    4: 'Permanent Resident Card (front and back)',
    5: 'Work Permit',
    6: 'Study Permit',
    7: 'Visitor Visa',
    8: 'Passport with diplomatic foil',
    9: 'Marriage Certificate',
    10: 'Legal Name Change Certificate'
}*/
    idRequirementContentList: [
        {
            residency: "Canadian Citizens",

            documentContentList: [
                {
                    document: 0,
                    title: "Canadian Birth Certificate",
                    body: "<ul><li>Include front and back</li><li>Ensure all text is legible and photo is in focus</li></ul>",
                    image: require('./images/canadian_birth_certs.jpg'),
                    imageAlt: 'Pictures of various sample Canadian Birth Certificates'
                },
                {
                    document: 1,
                    title: "Canadian Passport",
                    body: "<ul><li>Must include your full legal name</li><li>Include entire page, corner to corner</li><li>Ensure all text is legible and photo is in focus</li></ul>",
                    image: require('./images/Data_Page_of_Canadian_Passport.jpg'),
                    imageAlt: 'A picture of a sample Canadian Passport'
                },
                {
                    document: 2,
                    title: "Canadian Citizenship Card or Certificate",
                    body: "<ul><li>Include front and back, corner to corner</li><li>Ensure all text is legible and photo is in focus</li></ul>",
                    image: require('./images/canadian_cit_card-cert.jpg'),
                    imageAlt: 'Picture of a sample Canadian Citizenship Card and a Certificate'

                }
            ]
        },
        {
            residency: "Permanent Residents",

            documentContentList: [
                {
                    document: 3,
                    title: "Record of Landing",
                    body: "<ul><li>Must include full legal document, corner to corner, including date and signature</li><li>Must be signed by Canadian Immigration</li><li>Ensure all text is legible and photo is in focus</li></ul>",
                    image: "",
                    imageAlt: ""
                },
                {
                    document: 4,
                    title: "Permanent Resident Card",
                    body: "<ul><li>Include front and back, corner to corner</li><li>Date on back of card must be fully legible</li></ul>",
                    image: require('./images/pr_card.jpg'),
                    imageAlt: "A picture of a sample Permanent Resident Card front and back"
                }
            ]
        },
        {
            residency: "Temporary Permit Holders",

            documentContentList: [
                {
                    document: 5,
                    title: "Work Permit",
                    body: "<ul><li>Must be valid for six months or longer</li><li>Include entire page, corner to corner</li><li>Ensure all text is legible and photo is in focus</li></ul>",
                    image: require('./images/work-permit.jpg'),
                    imageAlt: "A picture of a sample Work Permit"
                },
                {
                    document: 6,
                    title: "Study Permit",
                    body: "<ul><li>Must be valid for six months or longer</li><li>Include entire page, corner to corner</li><li>Ensure all text is legible and photo is in focus</li></ul>",
                    image: require('./images/SP-new2013.jpg'),
                    imageAlt: "A picture of a sample Study Permit"
                },
                {
                    document: 7,
                    title: "Visitor Permit",
                    body: "<ul><li>If you are the main applicant, must be case type 13, or case type 10 with remarks stating that you are a religious worker</li><li>Include entire page, corner to corner</li><li>Ensure all text is legible and photo is in focus</li></ul>",
                    image: require('./images/visitor-permit.jpg'),
                    imageAlt: "A picture of a sample Visitor Permit"
                }
            ]
        },
        {
            residency: "Diplomats",

            documentContentList: [
                {
                    document: 8,
                    title: "Valid Passport With Entry Stamps and Acceptance Foils",
                    body: "<li>Include both passport and acceptance foil</li><li>Ensure all text is legible and photo is in focus</li>",
                    image: require('./images/acceptance-foil.jpg'),
                    imageAlt: "A picture of a sample Acceptance Foil"
                }
            ]
        },
        {
            residency: "Supporting Documents",

            documentContentList: [
                {
                    document: 9,
                    title: "Marriage Certificate",
                    body: "<ul><li>Include entire page, corner to corner</li><li>Ensure all text is legible and in focus</li></ul>",
                    image: require('./images/large-marriage-cert-big.jpg'),
                    imageAlt: "A picture of a sample B.C. Marriage Certificate"
                },
                {
                    document: 10,
                    title: "Legal Name Change Certificate",
                    body: "<ul><li>Include entire page, corner to corner</li><li>Ensure all text is legible and in focus</li></ul>",
                    image: require('./images/name-change-cert.jpg'),
                    imageAlt: "A picture of a sample Legal Name Change Certificate"
                }
            ]
        },
    ],
    // account mmaintenance has different list
    idRequirementContentListAccountMaintanence: [
        {
            residency: "",

            documentContentList: [
                {
                    document: 0,
                    title: "Canadian Birth Certificate",
                    body: "<ul><li>Include front and back</li><li>Ensure all text is legible and photo is in focus</li></ul>",
                    image: require('./images/canadian_birth_certs.jpg'),
                    imageAlt: 'Pictures of various sample Canadian Birth Certificates'
                },
                {
                    document: 1,
                    title: "Canadian Passport",
                    body: "<ul><li>Must include your full legal name</li><li>Include entire page, corner to corner</li><li>Ensure all text is legible and photo is in focus</li></ul>",
                    image: require('./images/Data_Page_of_Canadian_Passport.jpg'),
                    imageAlt: 'A picture of a sample Canadian Passport'
                },
                {
                    document: 2,
                    title: "Canadian Citizenship Card or Certificate",
                    body: "<ul><li>Include front and back, corner to corner</li><li>Ensure all text is legible and photo is in focus</li></ul>",
                    image: require('./images/canadian_cit_card-cert.jpg'),
                    imageAlt: 'Picture of a sample Canadian Citizenship Card and a Certificate'

                },


                {
                    document: 4,
                    title: "Permanent Resident Card",
                    body: "<ul><li>Include front and back, corner to corner</li><li>Date on back of card must be fully legible</li></ul>",
                    image: require('./images/pr_card.jpg'),
                    imageAlt: "A picture of a sample Permanent Resident Card front and back"
                }
                ,
                {
                    document: 5,
                    title: "Work Permit",
                    body: "<ul><li>Must be valid for six months or longer</li><li>Include entire page, corner to corner</li><li>Ensure all text is legible and photo is in focus</li></ul>",
                    image: require('./images/work-permit.jpg'),
                    imageAlt: "A picture of a sample Work Permit"
                },
                {
                    document: 6,
                    title: "Study Permit",
                    body: "<ul><li>Must be valid for six months or longer</li><li>Include entire page, corner to corner</li><li>Ensure all text is legible and photo is in focus</li></ul>",
                    image: require('./images/SP-new2013.jpg'),
                    imageAlt: "A picture of a sample Study Permit"
                },
                {
                    document: 7,
                    title: "Visitor Permit",
                    body: "<ul><li>If you are the main applicant, must be case type 13, or case type 10 with remarks stating that you are a religious worker</li><li>Include entire page, corner to corner</li><li>Ensure all text is legible and photo is in focus</li></ul>",
                    image: require('./images/visitor-permit.jpg'),
                    imageAlt: "A picture of a sample Visitor Permit"
                }
                ,
                {
                    document: 8,
                    title: "Valid Passport With Entry Stamps and Acceptance Foils",
                    body: "<li>Include both passport and acceptance foil</li><li>Ensure all text is legible and photo is in focus</li>",
                    image: require('./images/acceptance-foil.jpg'),
                    imageAlt: "A picture of a sample Acceptance Foil"
                }
                ,
                {
                    document: 9,
                    title: "Marriage Certificate",
                    body: "<ul><li>Include entire page, corner to corner</li><li>Ensure all text is legible and in focus</li></ul>",
                    image: require('./images/large-marriage-cert-big.jpg'),
                    imageAlt: "A picture of a sample B.C. Marriage Certificate"
                },
                {
                    document: 10,
                    title: "Legal Name Change Certificate",
                    body: "<ul><li>Include entire page, corner to corner</li><li>Ensure all text is legible and in focus</li></ul>",
                    image: require('./images/name-change-cert.jpg'),
                    imageAlt: "A picture of a sample Legal Name Change Certificate"
                },// Number jumped to 13 because no document for divorce decree and sep agreement


                {
                    document: 13,
                    title: "Landed Immigration Documents",
                    body: "<ul><li>Include entire page, corner to corner</li><li>Ensure all text is legible and in focus</li></ul>",
                    image: require('./images/record-of-landing.jpg'),
                    imageAlt: "A picture of a sample Landed Immigration Documents"
                },
                {
                    document: 19,
                    title: "BC Driver’s License",
                    body: "<ul><li>Include entire page, corner to corner</li><li>Ensure all text is legible and in focus</li></ul>",
                    image: require('./images/BC_driving_license.jpg'),
                    imageAlt: "A picture of a sample BC Driver’s License"
                },
                {
                    document: 20,
                    title: "Application for Change of Gender Designation (Adult)",
                    body: "<ul><li>Include entire page, corner to corner</li><li>Ensure all text is legible and in focus</li></ul>",
                    image: require('./images/Application-Change-Gender-Designation-Adult.jpg'),
                    imageAlt: "A picture of a sample Application for Change of Gender Designation (Adult) "
                },
                {
                    document: 21,
                    title: "Application for Change of Gender Designation (Minor)",
                    body: "<ul><li>Include entire page, corner to corner</li><li>Ensure all text is legible and in focus</li></ul>",
                    image: require('./images/Application-Change-Gender-Designation-Minor.jpg'),
                    imageAlt: "A picture of a sample Application for Change of Gender Designation (Minor)"
                },
                {
                    document: 22,
                    title: "Request for Waiver of Parental Consent (Minor) (for under 19 years )",
                    body: "<ul><li>Include entire page, corner to corner</li><li>Ensure all text is legible and in focus</li></ul>",
                    image: require('./images/Request-Waiver-Parental-Consent.jpg'),
                    imageAlt: "A picture of a sample Request for Waiver of Parental Consent (Minor) (for under 19 years )"
                },
                {
                    document: 23,
                    title: "Physician’s or Psychologist’s Confirmation of Change of Gender Designation form",
                    body: "<ul><li>Include entire page, corner to corner</li><li>Ensure all text is legible and in focus</li></ul>",
                    image: require('./images/Physician-Confirmation-GenderDesignation.jpg'),
                    imageAlt: "A picture of a sample Physician’s or Psychologist’s Confirmation of Change of Gender Designation form"
                },

            ]
        },
    ]
};
