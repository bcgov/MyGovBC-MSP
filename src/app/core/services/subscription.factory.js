'use strict'
export default function (app) {
  app.factory('notificationSubscriptionService', function (Service, $http) {
    "ngInject"
    let httpTimeout = 10000
    function getNotificationSubscriptions(cb) {
      // TOOD: get services subscribed by user only
      Service.find({}, function (serviceList) {
          let notificationSubscriptionList = serviceList.reduce(function (p, e, i) {
            if(!e.notificationSubscriptionRestApiUrl) return p
            p[e.notificationSubscriptionRestApiUrl] = p[e.notificationSubscriptionRestApiUrl] || []
            p[e.notificationSubscriptionRestApiUrl].push(e.name)
            return p
          }, {})
          let notificationSubscriptionRequests = _.map(notificationSubscriptionList, function (v, k, c) {
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
            results.forEach(function(e,i){
              e.forEach(function(e,i){
                let serviceItem = serviceList.find(function(se,i){
                  return se.serviceName === e.serviceName
                })
                if(!serviceItem) return
                serviceItem.subscriptionData = serviceItem.subscriptionData || []
                serviceItem.subscriptionData.push(e)
              })
            })
            cb(null, serviceList)
          })
        }
      )
    }

    return {
      get: getNotificationSubscriptions,
    }
  })
}
