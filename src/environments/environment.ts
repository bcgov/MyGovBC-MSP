/**
 * The file contents for the current environment will overwrite these during
 * build. Importantly, unlike previous environment setup the environment files
 * do not merge. Each environment file must standalone.
 * 
 * The build system defaults to the dev environment which uses `environment.ts`,
 * but if you do `ng build --env=prod` then `environment.prod.ts` will be used
 * instead. The list of which env maps to which file can be found in
 * `.angular-cli.json`.
 * 
 * https://github.com/angular/angular-cli/wiki/build
 */

// var NODE_ENV = process.env.NODE_ENV || "production"

export const environment = {
    appConstants: {
        runtimeEnv: "development", // run-time env. by default same as build-time node env
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
          minSizeBytes: 20000,
          maxSizeBytes: 1048576,
          reductionScaleFactor: 0.8,
          acceptMimeType: "image/*",
          convertToMimeType: "image/jpeg",
          jpegQuality: 0.5
        },
        // general state of the app, if unavailable, display Unavailable message and don't continue
        mspIsInMaintenanceFlag: process.env.mspIsInMaintenanceFlag,
        mspIsInMaintenanceText: process.env.mspIsInMaintenanceText,
        mspIsInMaintenanceTimes: process.env.mspIsInMaintenanceTimes,
      }
}