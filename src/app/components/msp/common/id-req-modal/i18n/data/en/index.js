module.exports = {
    title: 'ID Requirements for MSP Enrolment',
    intro: 'Providing the correct ID is essential to having your eligibility confirmed and your application processed. Please see the instructions below for details on what to include in your scan or photo.',

    idRequirementContentList: [
        {
            residency: "Canadian Citizens",

            documentContentList: [
                {
                    document: "CanadianPassport",
                    title: "Canadian Passport",
                    body: "<ul><li>Include entire page, corner to corner</li><li>Ensure all text is legible and photo is in focus</li></ul>",
                    image: "passport.jpg"
                },
                {
                    document: "CanadianCitizenshipCard",
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
                    document: "ConfirmationOfPermanentResidence",
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
                    document: "",
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
                    document: "",
                    title: "Canadian Passport with diplomatic foil",
                    body: "Sample body",
                    image: "sampleUrl"
                }
            ]
        }
    ]
};