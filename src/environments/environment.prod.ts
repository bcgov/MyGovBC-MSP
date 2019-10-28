// var NODE_ENV = process.env.NODE_ENV ||

export const environment = {
    runtimeEnv: 'production',
    logHTTPRequestsToConsole: true,
    appConstants: {
        coreApiBaseUrl: 'http://localhost:9000/api',
        serviceName: 'Medical Services Plan',
        enableLogging: true,
        logBaseUrl: '/msp/api/logging',
        apiBaseUrl: '/msp/api',
        envServerBaseUrl: '/msp/api/env',
        aclContextPath: '/accLetterIntegration/',
        attachment: '/submit-attachment/',
        suppBenefitAPIUrl: '/submit-application/',
        captchaApiBaseUrl: '/msp/api/captcha',
        addressChangeBCUrl: 'https://www.addresschange.gov.bc.ca/',
        images: {
            maxImagesPerPerson: 50,
            maxWidth: 2600,
            maxHeight: 3300,
            minWidth: 0,
            minHeight: 0,
            maxSizeBytes: 1048576,
            reductionScaleFactor: 0.8,
            acceptMimeType: 'image/*',
            convertToMimeType: 'image/jpeg',
            jpegQuality: 0.5,
            pdfScaleFactor: 2.0
        }
        // general state of the app, if unavailable, display Unavailable message and don't continue
        // mspIsInMaintenanceFlag: false,
        // mspIsInMaintenanceText: 'This Application is not available due to scheduled maintenance.',
        // mspIsInMaintenanceTimes: 'between 9:00pm and 7:00am'
    },
    /** Link used in app */
    links: {
        FAQ: 'https://www2.gov.bc.ca/gov/content/health/health-drug-coverage/msp/bc-residents/managing-your-msp-account/msp-account-change-faqs',
        HIBC: 'http://www2.gov.bc.ca/gov/content/health/health-drug-coverage/msp/bc-residents-contact-us',
        MSP_ELIGIBILITY: 'http://www2.gov.bc.ca/gov/content/health/health-drug-coverage/msp/bc-residents/eligibility-and-enrolment/are-you-eligible',
        MSP_ASSISTANCE: 'http://www2.gov.bc.ca/gov/content/health/health-drug-coverage/msp/bc-residents/premiums/regular-premium-assistance',
        MSP_WAIT_PERIOD: 'http://www2.gov.bc.ca/gov/content/health/health-drug-coverage/msp/bc-residents/eligibility-and-enrolment/how-to-enrol/coverage-wait-period',
        FPCARE: 'http://www2.gov.bc.ca/gov/content/health/health-drug-coverage/pharmacare-for-bc-residents/who-we-cover/fair-pharmacare-plan',
        ICBC: 'http://www.icbc.com/',
        BCSC_UPDATE: 'http://www2.gov.bc.ca/gov/content/governments/government-id/bc-services-card/change-your-personal-information',
        ACBC: 'https://www.addresschange.gov.bc.ca',
        MGMT_MSP_ACCOUNT: 'https://www2.gov.bc.ca/gov/content/health/health-drug-coverage/msp/bc-residents/managing-your-msp-account'
    },
    bypassGuards: false,
    useMockBackend: false
};
