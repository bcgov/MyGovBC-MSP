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
                    previouslySubscribed: false,
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
                  e.previouslySubscribed = true
                  e.previousChannelId = e.channelId
                  serviceItem.subscriptionData[e.channel] = e
                })
              })
              cb(null, serviceList)
            })
          }
        )
      },
      update: function (data, cb) {
        let notificationSubscriptionUpdateRequest = _.reduce(data, function (p, serviceItem) {
          let newReqsInSerivce = _.reduce(serviceItem.subscriptionData, function (p, e, k) {
            let func
            if (e.previouslySubscribed === e.subscribed && e.previousChannelId === e.channelId) {
              // identical
              return p
            }
            else if (e.previouslySubscribed === false && e.subscribed === true) {
              // subscribe
              func = function (cb) {
                let postData = {
                  serviceName: serviceItem.name,
                  channel: k,
                  channelId: e.channelId,
                  state: e.state
                }
                $http.post(serviceItem.notificationSubscriptionRestApiUrl, postData, {timeout: httpTimeout}).then(response => {
                  cb(null, response)
                }, err => {
                  cb(null, null)
                })
              }
            }
            else if (e.previouslySubscribed === true && e.subscribed === false) {
              // un-subscribe
              func = function (cb) {
                $http.delete(serviceItem.notificationSubscriptionRestApiUrl + '/' + e.id, {timeout: httpTimeout}).then(response => {
                  cb(null, response)
                }, err => {
                  cb(null, null)
                })
              }
            }
            else {
              // update
              func = function (cb) {
                $http.put(serviceItem.notificationSubscriptionRestApiUrl + '/' + e.id, {channelId: e.channelId}, {timeout: httpTimeout}).then(response => {
                  cb(null, response)
                }, err => {
                  cb(null, null)
                })
              }
            }
            p.push(func)
            return p
          }, [])
          return p.concat(newReqsInSerivce)
        }, [])
        parallel(notificationSubscriptionUpdateRequest, function (err, results) {
          cb(err, results)
        })
      },
    }
  })
}
