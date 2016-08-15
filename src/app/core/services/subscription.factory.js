'use strict'
import parallel from 'async/parallel'
import _ from 'lodash'
export default function (app) {
  app.factory('notificationSubscriptionService', function (Service, $http) {
    "ngInject"
    let httpTimeout = 10000
    return {
      get: function (cb) {
        // todo: get services subscribed by user only
        Service.find({}, function (serviceList) {
            serviceList = serviceList.map(function (e) {
              if (e.allowedNotificationChannels) {
                e.subscriptionData = e.subscriptionData || {}
                e.allowedNotificationChannels.forEach(function (sc) {
                  e.subscriptionData[sc] = {
                    subscribed: false,
                    state: 'unconfirmed'
                  }
                })
              }
              return e
            })
            let notificationSubscriptionList = serviceList.reduce(function (p, e) {
              if (!e.notificationSubscriptionRestApiUrl) return p
              if (!e.allowedNotificationChannels) return p
              p[e.notificationSubscriptionRestApiUrl] = p[e.notificationSubscriptionRestApiUrl] || []
              p[e.notificationSubscriptionRestApiUrl].push(e.name)
              return p
            }, {})
            let notificationSubscriptionRequests = _.map(notificationSubscriptionList, function (v, k) {
              return function (cb) {
                $http.get(k, {timeout: httpTimeout}).then(response => {
                  // make sure the serviceName attribute in response.data exists in v
                  let inServiceNotificationSubscriptions = response.data.filter(function (e, i) {
                    return v.indexOf(e.serviceName) >= 0
                  })
                  cb(null, inServiceNotificationSubscriptions)
                }, err => {
                  cb(null, null)
                })
              }
            })
            parallel(notificationSubscriptionRequests, function (err, results) {
              results.forEach(function (e) {
                e.forEach(function (e) {
                  let serviceItem = serviceList.find(function (se, i) {
                    return se.name === e.serviceName
                  })
                  if (!serviceItem) return
                  e.subscribed = true
                  serviceItem.subscriptionData[e.channel] = e
                })
              })
              cb(null, serviceList)
            })
          }
        )
      },
    }
  })
}
