'use strict'
module.exports = function (notificationSubscriptionService) {
  'ngInject'
  notificationSubscriptionService.get(function (err, data) {
    console.log(data)
  })
}

