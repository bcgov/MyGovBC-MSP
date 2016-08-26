describe("Notification Factory", function () {
  "use strict";

  var service;

  beforeEach(function() {
    module('myGov-core-client');
  })

  beforeEach(inject(function(notificationService) {
    service = notificationService;
  }));

  it("should be loadable", function() {
      expect(service).not.toBeNull();
  });

  if("should call get", function () {
      var testError = function (error, data) {
        expect(error).toBeNull();
      }
      var testData = function (error, data) {
        expect(data).not.toBeNull();
        expect(data.length > 0).toBe(true);
      }
      var failTest = function(error) {
        expect(error).toBeUndefined();
      };

      service.get().then(testError).then(testData).catch(failTest).finally(done);
  });
})