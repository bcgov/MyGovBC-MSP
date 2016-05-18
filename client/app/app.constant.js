(function(angular, undefined) {
  angular.module("myBCGovApp.constants", [])

.constant("appConfig", {
	"userRoles": [
		"guest",
		"user",
		"admin"
	]
})

;
})(angular);
