'use strict'
import parallel from 'async/parallel'
import _ from 'lodash'
const emailFrom = 'no_reply@gov.bc.ca'
const emailSubject = 'confirmation'
const emailTextBody = 'Please enter {confirmation_code} on the screen.'
const emailHtmlBody = 'Please enter {confirmation_code} on the screen.'

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
                    state: 'unconfirmed',
                    previousState: 'unconfirmed'
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
              results && results.forEach(function (e) {
                e && e.forEach(function (e) {
                  let serviceItem = serviceList.find(function (se, i) {
                    return se.name === e.serviceName
                  })
                  if (!serviceItem) return
                  e.subscribed = true
                  e.previouslySubscribed = true
                  e.previousChannelId = e.channelId
                  e.previousState = e.state
                  serviceItem.subscriptionData[e.channel] = e
                })
              })
              cb(null, serviceList)
            })
          }
        )
      },
      update: function (data, cb) {
        let notificationSubscriptionUpdateRequests = _.reduce(data, function (p1, serviceItem) {
          let newReqsInSerivce = _.reduce(serviceItem.subscriptionData, function (p, e, k) {
            let func
            if (e.previouslySubscribed === e.subscribed && e.previousChannelId === e.channelId) {
              // identical
              return p
            }
            else if (e.previouslySubscribed === false && e.subscribed === true) {
              // subscribe
              e.previouslySubscribed = true
              func = function (cb) {
                let postData = {
                  serviceName: serviceItem.name,
                  channel: k,
                  channelId: e.channelId,
                  confirmationRequest: {
                    from: emailFrom,
                    subject: emailSubject,
                    textBody: emailTextBody,
                    htmlBody: emailHtmlBody,
                    confirmationCodeRegex: "\\d{5}",
                    sendRequest: true,
                  }
                }
                $http.post(serviceItem.notificationSubscriptionRestApiUrl, postData, {timeout: httpTimeout}).then(response => {
                  e.id = response.data.id
                  cb(null, null)
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
                let postData = {
                  channel: e.channel,
                  channelId: e.channelId,
                  confirmationRequest: {
                    from: emailFrom,
                    subject: emailSubject,
                    textBody: emailTextBody,
                    htmlBody: emailHtmlBody,
                    confirmationCodeRegex: "\\d{5}",
                    sendRequest: true,
                  }
                }
                $http.put(serviceItem.notificationSubscriptionRestApiUrl + '/' + e.id, postData, {timeout: httpTimeout}).then(response => {
                  cb(null, response)
                }, err => {
                  cb(null, null)
                })
              }
            }
            p[e.channelId] = p[e.channelId] || []
            p[e.channelId].push(func)
            return p
          }, p1)
          return newReqsInSerivce
        }, {})
        let reqArr = _.reduce(notificationSubscriptionUpdateRequests, function (p, v) {
          return p.concat(v)
        }, [])
        let channelIds = _.reduce(notificationSubscriptionUpdateRequests, function (p, v, i) {
          p[i] = {}
          return p
        }, {})
        parallel(reqArr, function (err, results) {
          cb(err, channelIds)
        })
      },
      confirm: function (confirmationData, serviceSubscriptions, cb) {
        let notificationSubscriptionConfirmationRequests = _.reduce(serviceSubscriptions, function (p1, serviceItem) {
          let newReqsInSerivce = _.reduce(serviceItem.subscriptionData, function (p, e, k) {
            let func
            if (e.previouslySubscribed === e.subscribed && e.previousChannelId === e.channelId) {
              // identical
              return p
            }
            p.push(function (cb) {
                $http.get(serviceItem.notificationSubscriptionRestApiUrl + '/' + e.id + '/verify?confirmationCode=' + confirmationData[e.channelId].confirmationCode, {timeout: httpTimeout}).then(response => {
                  delete confirmationData[e.channelId]
                  e.state = e.previousState = 'confirmed'
                  e.previousChannelId = e.channelId
                  cb(null, null)
                }, err => {
                  confirmationData[e.channelId].confirmationResult = err
                  cb(null, null)
                })
              }
            )
            return p
          }, p1)
          return p1
        }, [])
        parallel(notificationSubscriptionConfirmationRequests, function (err, results) {
          cb(null, null)
        })
      },
    }
  })
}
