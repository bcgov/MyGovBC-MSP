module.exports = {
    title: 'ID Requirements for MSP Enrolment',
    intro: 'Providing the correct ID is essential to having your eligibility confirmed and your application processed. Please see the instructions below for details on what to include in your scan or photo.',

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
                    image: require('./images/canadian_birth_certs.jpg')
                },
                {
                    document: 1,
                    title: "Canadian Passport",
                    body: "<ul><li>Include entire page, corner to corner</li><li>Ensure all text is legible and photo is in focus</li></ul>",
                    image: require('./images/passport.jpg')
                },
                {
                    document: 2,
                    title: "Canadian Citizenship Card or Certificate",
                    body: "<ul><li>Include front and back, corner to corner</li></ul>",
                    image: require('./images/canadian_cit_card.jpg')
                }
            ]
        },
        {
            residency: "Permanent Residents",

            documentContentList: [
                {
                    document: 4,
                    title: "Permanent Resident Card",
                    body: "<ul><li>Must include full legal document including date and signature.</li><li>Must be signed by Canadian Immigration</li></ul>",
                    image: require('./images/pr_card.jpg')
                }
            ]
        },
        {
            residency: "Temporary Permit Holders",

            documentContentList: [
                {
                    document: 3,
                    title: "Record of Landing",
                    body: "<ul><li>Must include full legal document including date and signature.</li><li>Must be signed by Canadian Immigration</li></ul>",
                    image: ""
                },
                {
                    document: 5,
                    title: "Work Permit",
                    body: "<ul><li>Must be valid for six months or longer</li></ul>",
                    image: ""
                },
                {
                    document: 6,
                    title: "Study Permit",
                    body: "<ul><li>Must be valid for six months or longer</li></ul>",
                    image: require('./images/study-permit.jpg')
                },
                 {
                    document: 7,
                    title: "Visitor Visa",
                    body: "<ul><li>Must state religious worker on document under remarks</li></ul>",
                    image: ""
                }
            ]
        },
        {
            residency: "Diplomats",

            documentContentList: [
                {
                    document: 8,
                    title: "Valid Passport With Entry Stamps and Acceptance Foils",
                    body: "Sample body",
                    image: ""
                }
            ]
        },
        {
            residency: "Supporting Documents",

            documentContentList: [
                {
                    document: 9,
                    title: "Marriage Certificate",
                    body: "<ul><li>Include entire page, corner to corner</li><li>Ensure all text is legible and photo is in focus</li></ul>",
                    image: require('./images/large-marriage-cert-big.jpg')
                },
                {
                    document: 10,
                    title: "Legal Name Change Certificate",
                    body: "sample body",
                    image: ""
                }
            ]
        },
    ]
};
