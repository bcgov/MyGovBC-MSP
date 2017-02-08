'use strict'
module.exports = function(_path) {
  return {
    appConstants: {
      serviceName: 'Apply for BC Health Care',
      logBaseUrl: '/api/logging',
      // to test logging api in your localhost dev env, don't change above config. Instead,
      // put following config entry in file ./local.js, which is ignored by git
      // logBaseUrl: 'http://logstash-gcpe-mygovbc-msp-dev.pathfinder.gov.bc.ca',
    }
  }
}
