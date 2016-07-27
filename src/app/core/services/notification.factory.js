'use strict'

export default function (app) {
  app.factory('notificationService', function (Service) {
    "ngInject"
    return {
      get: function (cb) {
        Service.find({}, function (list) {
            let notificationList = list.filter(function (e, i) {
              return e.notificationRestApiUrl
            }).reduce(function(p,e,i){
              p[e.notificationRestApiUrl] = p[e.notificationRestApiUrl] || []
              p[e.notificationRestApiUrl].push(e.name)
              return p
            },{})
            cb(notificationList)
          }
        )
      }
    }
  })
}
