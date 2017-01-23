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
                    body: "<ul><li>Include entire page, corner to corner</li><li>Ensure all text is legible and photo is in focus</li></ul>",
                    image: ""
                },
                {
                    document: 1,
                    title: "Canadian Passport",
                    body: "<ul><li>Include entire page, corner to corner</li><li>Ensure all text is legible and photo is in focus</li></ul>",
                    image: require('./images/passport.jpg')
                },
                {
                    document: 2,
                    title: "Canadian Citizenship Card",
                    body: "sample body",
                    image: ""
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
                    image: ""
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
                    image: ""
                },
                {
                    document: 5,
                    title: "Work Permit",
                    body: "Sample body",
                    image: ""
                },
                {
                    document: 6,
                    title: "Study Permit",
                    body: "Sample body",
                    image: ""
                },
                 {
                    document: 7,
                    title: "Visitor Visa",
                    body: "Sample body",
                    image: ""
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
                    image: ""
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
