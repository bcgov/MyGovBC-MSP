'use strict'
import parallel from 'async/parallel'
import _ from 'lodash'
export default function (app) {
  app.factory('notificationService', function (Service, $http) {
    "ngInject"
    return {
      get: function (cb) {
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
                $http.get(k).then(response => {
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
              cb(concatenatedResults)
            })
          }
        )
      },
      delete: function (url, cb) {
        $http.delete(url).then(function (res) {
          cb && cb(null, res)
        })
      },
      markAsRead: function (url, cb) {
        $http.put(url, {state: 'read'}).then(function (res) {
          cb && cb(null, res)
        })
      }
    }
  })
}
