(function(angular, undefined) {
  angular.module("myBCGovApp.constants", [])

.constant("appConfig", {
	"userRoles": [
		"guest",
		"user",
		"admin"
	],
	"headerFooterSvcUrl": "https://bcgov-www2-layout-service.pathfinder.gov.bc.ca/v1/theme1/",
	"rootUrlPath": "/ext"
})

;
})(angular);