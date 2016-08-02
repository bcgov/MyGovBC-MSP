'use strict'
import parallel from 'async/parallel'
import _ from 'lodash'
export default function (app) {
  app.factory('notificationService', function (Service, $http) {
    "ngInject"
    let httpTimeout = 10000
    let notifications, pending, cbs = []
    function getNotifications(cb) {
      if (notifications) {
        return cb(null, notifications)
      }
      cbs.push(cb)
      // concurrency control: only fetch notifications once
      if (pending) {
        return
      }
      pending = true
      Service.find({}, function (list) {
          let notificationList = list.filter(function (e, i) {
            return e.notificationRestApiUrl
          }).reduce(function (p, e, i) {
            p[e.notificationRestApiUrl] = p[e.notificationRestApiUrl] || []
            p[e.notificationRestApiUrl].push(e.name)
            return p
          }, {})
          let notificationRequests = _.map(notificationList, function (v, k, c) {
            return function (cb) {
              $http.get(k, {timeout: httpTimeout}).then(response => {
                // TODO: make sure the service attribute in response.data exists in v
                cb(null, response.data.map(function (e) {
                  e.baseUrl = k
                  return e
                }))
              })
            }
          })
          parallel(notificationRequests, function (err, results) {
            let concatenatedResults = results.reduce(function (p, e) {
              return p.concat(e)
            }, [])
            notifications = concatenatedResults
            pending = false
            cbs.forEach(function (e, i) {
              e(null, concatenatedResults)
            })
          })
        }
      )
    }

    return {
      get: getNotifications,
      getUnreadCount: function (cb) {
        function filterUnread(e, i) {
          return e.state === 'new'
        }

        if (notifications) {
          return cb(null, notifications.filter(filterUnread).length)
        }
        getNotifications(function (err, data) {
          return cb(null, data.filter(filterUnread).length)
        })
      },
      delete: function (url, cb) {
        $http.delete(url, {timeout: httpTimeout}).then(function (res) {
          cb && cb(null, res)
        })
      },
      markAsRead: function (url, cb) {
        $http.put(url, {state: 'read'}, {timeout: httpTimeout}).then(function (res) {
          cb && cb(null, res)
        })
      }
    }
  })
}
