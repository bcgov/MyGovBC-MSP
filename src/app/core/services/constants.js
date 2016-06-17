'use strict';

export default function (app) {
  app
    .constant('ROUTE_ERRORS', {
      auth: 'Authorization has been denied.',
    })
    .constant('appConfig', __APP_CONSTANTS__)
}
