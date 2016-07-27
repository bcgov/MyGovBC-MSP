'use strict'

module.exports = function (notificationService) {
  'ngInject'
  notificationService.get(function(list){
    console.log(list.length)
  })
}

