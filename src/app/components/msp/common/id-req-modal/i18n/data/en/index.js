module.exports = {
    title: 'ID Requirements for MSP Enrolment',
    intro: 'Providing the correct ID is essential to having your eligibility confirmed and your application processed. Please see the instructions below for details on what to include in your scan or photo.',

    /*
     0 CanadianBirthCertificate,
     1 CanadianPassport,
     2 CanadianCitizenCard,
     3 RecordOfLanding,
     4 PermanentResidentCard,
     5 WorkPermit,
     6 StudyPermit,
     7 VisitorVisa,
     8 PassportWithDiplomaticFoil
     */
    idRequirementContentList: [
        {
            residency: "Canadian Citizens",

            documentContentList: [
                {
                    document: 1,
                    title: "Canadian Passport",
                    body: "<ul><li>Include entire page, corner to corner</li><li>Ensure all text is legible and photo is in focus</li></ul>",
                    image: "passport.jpg"
                },
                {
                    document: 2,
                    title: "Canadian Citizenship Card",
                    body: "sample body",
                    image: "sampleUrl2"
                }
            ]
        },
        {
            residency: "Permanent Residents",

            documentContentList: [
                {
                    document: 4,
                    title: "Confirmation of Permanent Residence",
                    body: "Sample body",
                    image: "sampleUrl"
                }
            ]
        },
        {
            residency: "Temporary Permit Holders",

            documentContentList: [
                {
                    document: 3,
                    title: "Record of Landing",
                    body: "Sample body",
                    image: "sampleUrl"
                }
            ]
        },
        {
            residency: "Diplomats",

            documentContentList: [
                {
                    document: 8,
                    title: "Canadian Passport with diplomatic foil",
                    body: "Sample body",
                    image: "sampleUrl"
                }
            ]
        }
    ]
};