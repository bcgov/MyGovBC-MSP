// var NODE_ENV = process.env.NODE_ENV || 

export const environment = {
    runtimeEnv: "production",
    appConstants: {
        coreApiBaseUrl: 'http://localhost:9000/api',
        serviceName: 'Apply for BC Health Care',
        logBaseUrl: '/msp/api/logging',
        apiBaseUrl: '/msp/api',
        // apiBaseUrl: 'https://mygovbc-msp-dev.pathfinder.gov.bc.ca/api',
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
          acceptMimeType: "image/*",
          convertToMimeType: "image/jpeg",
          jpegQuality: 0.5,
          pdfScaleFactor: 2.0
        },
        // general state of the app, if unavailable, display Unavailable message and don't continue
        mspIsInMaintenanceFlag: false,
        mspIsInMaintenanceText: 'This Application is not available due to scheduled maintenance.',
        mspIsInMaintenanceTimes: 'between 9:00pm and 7:00am'
      }
}
