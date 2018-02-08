
/**
 * Support starting a co-browse session by sharing generated short code.
 *
 * @type {{startSupport: Window.ShortCodeAssist.startSupport}}
 */
window.ShortCodeAssist = {
    startSupport: function(callback, failure, configuration, shortCode) {
        console.log('ShortCodeAssit startSupport');
        // get a cid/session token via the short code servlet
        var startWithShortCode = function(shortCode) {
            var tokenRequest = new XMLHttpRequest();
            tokenRequest.onreadystatechange = function () {
                if (tokenRequest.readyState == 4) {
                    if (tokenRequest.status == 200) {
                        var tokenResponse = JSON.parse(tokenRequest.responseText);
                        if (typeof (configuration) === 'string' || typeof (configuration) === 'undefined') {
                            configuration = {};
                        }
                        configuration.sessionToken = tokenResponse["session-token"];
                        configuration.correlationId = tokenResponse.cid;
                        delete configuration.destination;

                        if (!configuration.scaleFactor) {
                            configuration.scaleFactor = tokenResponse.scaleFactor;
                        }
                        
                        configuration.allowedIframeOrigins = false; // important: disable iframe messaging if not required for security
                        console.log('Calling startSupport with configuration:', configuration);
                        AssistSDK.startSupport(configuration);
                        callback(shortCode);
                    } else if (tokenRequest.status == 403) {
                        failure();
                    } else {
                        // TODO Report failure to start
                        console.error('START WITH SHORT CODE FAILURE');
                    }
                }
            };
          var url = "/assistserver/shortcode/consumer?appkey=" + shortCode;

          if (configuration.username) {
              url += "&username=" + configuration.username;
          }
          if (configuration.displayName) {
              url += "&displayName=" + configuration.displayName;
          }
          if (configuration.auditName) {
              url += "&auditName=" + configuration.auditName;
          }
          tokenRequest.open("GET", (configuration.url || "") + url, true);
            tokenRequest.send();
        };

        if (shortCode) {
            startWithShortCode(shortCode);
        } else {
            console.log('Making short code request');
            var shortCodeRequest = new XMLHttpRequest();
            shortCodeRequest.onreadystatechange = function () {
                if (shortCodeRequest.readyState == 4) {
                    if (shortCodeRequest.status == 200) {
                        var shortCodeResponse = JSON.parse(shortCodeRequest.responseText);
                        var shortCode = shortCodeResponse.shortCode;
                        startWithShortCode(shortCode);
                    } else {
                        // TODO Report failure to start
                        console.error('SHORT CODE REQUEST FAILURE');
                    }
                }
            };
            var fullUrl = (configuration.url || "") + "/assistserver/shortcode/create";
            if (configuration.auditName) {
              fullUrl += "?auditName=" + configuration.auditName;
            }

            shortCodeRequest.open("PUT", fullUrl, true);
            shortCodeRequest.send();
        }
    }
};
