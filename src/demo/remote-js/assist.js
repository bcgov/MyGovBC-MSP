;(function() {

    var SESSION_STORAGE_DATA_NAME = "assist-session-config";
    var LOCAL_STORAGE_DATA_NAME = "assist-localstorage-config";

    var POPUP_NAME = "assist-sdk";
    var ASSIST_CSDK_PATH = "assets/assist-csdk.html";
    var CONTROLLER_PATH = "assets/assist-controller.html";
    var POPUP_WIDTH = "300";
    var POPUP_HEIGHT = "100";

    var sdkPath;
    var controllerWindow;
    var popupWindow;
    var popupWindowTimeout;

    var ERROR_CODE = {
        CONNECTION_LOST: 0,
        PERMISSION: 1,
        SOCKET: 2,
        CALL_FAIL: 3,
        POPUP: 4,
        SESSION_IN_PROGRESS: 5,
        SESSION_CREATION_FAILURE: 6,
        PARSE_FAILURE: 7,
        RENDER_FAILURE: 8
    };

    function getOverriddenFunctions(global, funcName) {
        if (global && global[funcName]) {
            return global[funcName];
        }

        return null;
    }

    // to be exposed in some better format in future
    function canUseApiNow() {
        if (controllerWindow
            && controllerWindow.AssistController
            && controllerWindow.AssistController.screenShareTopic
            && controllerWindow.AssistController.screenShareWindow) {
            return true;
        } else {
            return false;
        }
    }

    var onConnectionEstablishedCallback = getOverriddenFunctions(window.AssistSDK, "onConnectionEstablished");
    var onInSupportCallback = getOverriddenFunctions(window.AssistSDK, "onInSupport");
    var onWebcamUseAcceptedCallback = getOverriddenFunctions(window.AssistSDK, "onWebcamUseAccepted");
    var onEndSupportCallback = getOverriddenFunctions(window.AssistSDK, "onEndSupport");
    var onScreenshareRequestCallback = getOverriddenFunctions(window.AssistSDK, "onScreenshareRequest");
    var onPushRequestCallback = getOverriddenFunctions(window.AssistSDK, "onPushRequest");
    var onDocumentReceivedSuccessCallback = getOverriddenFunctions(window.AssistSDK, "onDocumentReceivedSuccess");
    var onDocumentReceivedErrorCallback = getOverriddenFunctions(window.AssistSDK, "onDocumentReceivedError");
    var onAnnotationAddedCallback = getOverriddenFunctions(window.AssistSDK, "onAnnotationAdded");
    var onAnnotationsClearedCallback = getOverriddenFunctions(window.AssistSDK, "onAnnotationsCleared");
    var onErrorCallback = getOverriddenFunctions(window.AssistSDK, "onError");
    var onCobrowseActiveCallback = getOverriddenFunctions(window.AssistSDK, "onCobrowseActive");
    var onCobrowseInactiveCallback = getOverriddenFunctions(window.AssistSDK, "onCobrowseInactive");

    var onAgentJoinedSessionCallback  = getOverriddenFunctions(window.AssistSDK, "onAgentJoinedSession");
    var onAgentJoinedCobrowseCallback  = getOverriddenFunctions(window.AssistSDK, "onAgentJoinedCobrowse");
    var onAgentRequestedCobrowseCallback  = getOverriddenFunctions(window.AssistSDK, "onAgentRequestedCobrowse");
    var onAgentLeftCobrowseCallback  = getOverriddenFunctions(window.AssistSDK, "onAgentLeftCobrowse");
    var onAgentLeftSessionCallback  = getOverriddenFunctions(window.AssistSDK, "onAgentLeftSession");

    var onZoomStartedCallback  = getOverriddenFunctions(window.AssistSDK, "onZoomStarted");
    var onZoomEndedCallback  = getOverriddenFunctions(window.AssistSDK, "onZoomEnded");

    var dynamicElementIdToPermissionMap = {};
    var dynamicIframeElementIdToPermissionMap = new Map();

    // We can't use the real assistLogger here because it is not created until shared-windows is loaded.
    var assistLogger = {
        warn: console.warn.bind(console),
        error: console.error.bind(console),
        log: console.log.bind(console),
        info: console.info.bind(console)
    };

    var disableAssistLogging = function() {
        assistLogger.warn = function() {};
        assistLogger.log = function() {};
        assistLogger.error = function() {};
        assistLogger.info = function() {};
    };

    if (window.name == '') {
        window.name = "AssistWindow";
    }

  /**
   * The Live Assist SDK.
   *
   * @exports AssistSDK
   */
  window.AssistSDK = {

    /**
     * Starts a support session configured by the supplied configuration.
     *
     * @param {map} [configuration] parameters needed to start a support session. Such as the <code>url</code> and
     * <code>port</code> of the support server.
     */
    startSupport: function(configuration) {
      if (configuration && configuration.disableLogging) {
          disableAssistLogging();
      }

      if (!getLocalStorageData()) {
        if (isObject(configuration) == false) {
          configuration = {"destination": configuration};
        }

        if (!configuration.url) { // if no url param present, use path SDK (this file) was loaded from
          var sdkPath = getSDKPath(configuration);

          var tmp = document.createElement("a");
          tmp.href = sdkPath;

          var port = (tmp.port) ? ":" + tmp.port : "";

          configuration.url = tmp.protocol + "//" + tmp.hostname + port; // even if proto/port aren't specified, we
                                                                         // should get the defaults
        }

        try {
          configuration.browserInfo = {};
          configuration.browserInfo[getBrowser().toLowerCase()] = true;
        } catch (e) {
          assistLogger.warn("Could not determine browser information");
        }

        setSessionStorageData(configuration);
        window.addEventListener("storage", localStorageChanged, false);

        onDocumentReady(document, function() {
          start(configuration);
        });
      } else {
        // not a critical issue, just already in call
        if (!controllerWindow) {
          assistLogger.log("Removing orphaned session and starting support, in one second.");
          removeAllStorageData();

          setTimeout(function() {
            if (!getLocalStorageData()) {
              AssistSDK.startSupport(configuration);
            }
          }, 1000);
        } else {
            assistLogger.log("Connected to the orphaned session. You will first need to call endSupport before starting a new support session.");
        }
        doError(createErrorMessage(ERROR_CODE.SESSION_IN_PROGRESS, "There is already a session in use."));
      }
    },

    /**
     * Set an agent access permission on an element. If permission logically equates to false (e.g. is null) then the
     * existing permission set on the supplied element is removed.
     *
     * @param {string} permission the permission being set on the element.
     * @param {Element} element the DOM element the permission will be set on.
     */
    setPermissionForElement: function(permission, element) {
      if (!permission) {
        delete element.dataset.assistPermission;
        return;
      }
      element.dataset.assistPermission = permission;
    },

    /**
     *
     * Set an agent access permission on an element that may not currently exist. The element is identified by its
     * identifier. If the permission logically equates to false (e.g. is null), then the permission will NOT be set on
     * the element if and when it becomes available.
     *
     * @param {string} permission the permission that will be set on the element.
     * @param {string} elementId the id of the element on which the permission will be set.
     */
    setPermissionForElementWithId: function(permission, elementId) {
        dynamicElementIdToPermissionMap[elementId] = permission;

        if (controllerWindow && controllerWindow.AssistController) {
            controllerWindow.AssistController.setDynamicElementIdPermissionsMap(dynamicElementIdToPermissionMap);
        }

        var el = document.getElementById(elementId);
        if (el !== null) {
            AssistSDK.setPermissionForElement(permission, el);
        }
    },

    /**
     *
     * Set an agent access permission on an element that is within a given iframe that may not currently exist. The element is identified by its
     * identifier. If the permission logically equates to false (e.g. is null), then the permission will NOT be set on
     * the element if and when it becomes available.
     *
     * @param {string} permission the permission that will be set on the element.
     * @param {string} elementId the id of the element on which the permission will be set.
     * @param {HTMLIFrameElement} iframe the LA-enabled iframe element that may contain the given elementId.
     */
    setPermissionForElementInIframeWithId: function(permission, elementId, iframe) {
        var dynamicElementIdToPermissionForIframeMap = dynamicIframeElementIdToPermissionMap.get(iframe);

        if (dynamicElementIdToPermissionForIframeMap) {
            dynamicElementIdToPermissionForIframeMap[elementId] = permission;
        }
        else {
            dynamicElementIdToPermissionForIframeMap = {};
            dynamicElementIdToPermissionForIframeMap[elementId] = permission;
            dynamicIframeElementIdToPermissionMap.set(iframe, dynamicElementIdToPermissionForIframeMap);
        }
        if (controllerWindow && controllerWindow.AssistController) {
            controllerWindow.AssistController.setIframeDynamicElementIdPermissionsMap(dynamicIframeElementIdToPermissionMap);
        }
    },

   /**
    * Allow app to check if an error failed because of session creation failure.
    * @return the code used to indicate session creation failure.
    */
    getSessionCreationFailureCode: function() {
        return ERROR_CODE.SESSION_CREATION_FAILURE;
    },
    getErrorCodes: function() {
          return ERROR_CODE;
    },
    /**
     * A check that can be used to see if the browser being used is supported by Live Assist.
     *
     * @return {boolean} <code>true</code> if running on Chrome 33 and above. <code>true</code> if running on Firefox 28 and above. <code>true</code> if
     * running on IE 11 and above. <code>true</code> if running on Safari 8 and above. <code>true</code> if running on Opera 37 and above.
     * <code>false</code> otherwise.
     */
    isBrowserSupported: function() {
      var browser = getBrowser();
      var version = getBrowserVersion();

      if (browser == "Chrome") {
        return version >= 33;
      }
      if (browser == "Firefox") {
        return version >= 28;
      }
      if (browser == "IE") {
        return version >= 11;
      }
      if (browser == "Safari") {
        return version >= 8;
      }
      if (browser == "Opera") {
        return version >= 37;
      }
      if (browser == "Edge") {
        return version >= 12;
      }
      return false;
    },

    /**
     * Stops a support session if one is active.
     */
    endSupport: function() {
      if (controllerWindow && controllerWindow.AssistController) {
        controllerWindow.AssistController.endSupport();
      }
    },

    /**
     * Check if a video session can be started in this browser.
     *
     * @return {boolean} <code>true</code> if running in IE or Safari. <code>true</code> if the browser has the feature
     * UserMedia. <code>false</code> otherwise.
     */
    isVideoSupported: function() {
      if (isIE() || getBrowser() == "Safari") {
        return true; // known limitation, no way to know
      }
      if (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia ||
          navigator.msGetUserMedia) {
        return true;
      }
      return false;
    },

    /**
     * Will allow this agent to join the co-browse session if the session is active.
     *
     * @param {map} agent descriptor of an agent which must contain an <code>id</code> and <code>name</code> for the
     * agent.
     */
    allowCobrowseForAgent: function(agent) {
      if (canUseApiNow()) {
        controllerWindow.AssistController.allowCobrowseForAgent(agent);
      } else {
        doError(createErrorMessage(ERROR_CODE.CALL_FAIL,
            "Unable to allow co-browsing for an agent when support is not active."));
      }
    },

    /**
     * Will stop this agent joining the co-browse session if the session is active.
     *
     * @param {map} agent descriptor of an agent which must contain an <code>id</code> and <code>name</code> for the
     * agent.
     */
    disallowCobrowseForAgent: function(agent) {
      if (canUseApiNow()) {
        controllerWindow.AssistController.disallowCobrowseForAgent(agent);
      } else {
        doError(createErrorMessage(ERROR_CODE.CALL_FAIL,
            "Unable to disallow co-browsing for an agent when support is not active."));
      }
    },

    /**
     * What to do after the document is loaded.
     *
     * @callback onLoad
     */
    /**
     * What to do if there is an error loading the document.
     *
     * @callback onError
     * @param {map} consisting of <code>errorCode</code> and <code>message</code>
     */
     /**
     * Share consumer side document or a uri reference to a document with the agent.
     *
     * @param {File|string} document either the bytes of the document or a uri pointing to the document.
     * @param {onLoad} onLoad callback if document is successfully shared.
     * @param {onError} onError callback if document fails to share.
     */
    shareDocument: function(document, onLoad, onError) {

      if (canUseApiNow()) {
        // if something goes wrong this will throw some error,
        // but it won't be 'wrong time to use api' related due to
        // above check covering that and throwing specific exception
        // for that case
        controllerWindow.AssistController.shareDocument(document, onLoad, onError);
      } else {
        doError(createErrorMessage(ERROR_CODE.CALL_FAIL, "Unable to share a document when co-browsing is not active."));
      }
    },


    /**
     * Pause the co-browse session.
     */
    pauseCobrowse: function() {
      if (controllerWindow && controllerWindow.AssistController) {
        controllerWindow.AssistController.pauseCobrowse();
      } else {
        assistLogger.log("Unable to pause co-browse, not in a support session.")
      }
    },

    /**
     * Resume the co-browse session.
     */
    resumeCobrowse: function() {
      if (controllerWindow && controllerWindow.AssistController) {
        controllerWindow.AssistController.resumeCobrowse();
      } else {
        assistLogger.log("Unable to un-pause co-browse, not in a support session.")
      }
    },


      /**
       * Override callbacks used during connection re-connection.
       */
      setConnectionCallbacks: function(callbacks) {
          if (controllerWindow && controllerWindow.AssistAED) {
              controllerWindow.AssistAED.setSocketCallbacks(callbacks);
          } else {
              assistLogger.log("Unable set connection callbacks while not in co-browse session.")
          }
      },

    /**
     * Called when a websocket is first established.
     *
     * @callback onConnectionEstablished
     */
    onConnectionEstablished: onConnectionEstablishedCallback,
    /**
     * Called after a screen share has been accepted and the agent has been added to the co-browse.
     *
     * @callback onInSupport
     */
    onInSupport: onInSupportCallback,
    /**
     * Called while starting a voice video call after the camera has been acquired.
     *
     * @callback onWebcamUseAccepted
     */
    onWebcamUseAccepted: onWebcamUseAcceptedCallback,
    /**
     * Called after the support session is ended.
     *
     * @callback onEndSupport
     */
    onEndSupport: onEndSupportCallback,
    /**
     * Code to handle the request to perform a screen share.
     *
     * @callback onScreenshareRequest
     * @return {boolean} <code>true<code> to accept the screen.
     */
    onScreenshareRequest: onScreenshareRequestCallback,
    /**
     * Handle the acceptance of a document share request.
     *
     * @callback allow
     */
    /**
     * Handle the rejection of a document share request.
     *
     * @callback deny
     */
    /**
     * @callback onPushRequest
     * @param {allow} allow callback used if push request is accepted.
     * @param {deny} deny callback used if push request is rejected.
     */
    onPushRequest: onPushRequestCallback,
    /**
     * Called after a document has been received from an agent.
     *
     * @callback onDocumentReceivedSuccess
     * @param {SharedItem} item closable container
     */
    onDocumentReceivedSuccess: onDocumentReceivedSuccessCallback,
    /**
     *
     */
    onDocumentReceivedError: onDocumentReceivedErrorCallback,
    /**
     *
     */
    onAnnotationAdded: onAnnotationAddedCallback,
    /**
     *
     */
    onAnnotationsCleared: onAnnotationsClearedCallback,
    /**
     *
     */
    onCobrowseActive: onCobrowseActiveCallback,
    /**
     *
     */
    onCobrowseInactive: onCobrowseInactiveCallback,

    onAgentJoinedSession: onAgentJoinedSessionCallback,
    /**
     *
     */
    onAgentJoinedCobrowse: onAgentJoinedCobrowseCallback,
    /**
     *
     */
    onAgentRequestedCobrowse: onAgentRequestedCobrowseCallback,
    /**
     *
     */
    onAgentLeftCobrowse: onAgentLeftCobrowseCallback,
    /**
     *
     */
    onAgentLeftSession: onAgentLeftSessionCallback,

    /**
     * Callback for when zoom has started.
     */
    onZoomStarted: onZoomStartedCallback,

    /**
     * Callback for when zoom has ended.
     */
    onZoomEnded: onZoomEndedCallback,
 
    /**
     *
     */
    onError: onErrorCallback || function() {
    },

     shareMoveableElement : function(element) {
       if (canUseApiNow()) {
         controllerWindow.AssistController.shareMoveableElement(element);
       } else {
         doError(createErrorMessage(ERROR_CODE.CALL_FAIL, "Unable to share element when co-browsing is not active."));
       }
     },

     unshareMoveableElement : function(element) {
       if (canUseApiNow()) {
         controllerWindow.AssistController.unshareMoveableElement(element);
       } else {
         doError(createErrorMessage(ERROR_CODE.CALL_FAIL, "Unable to unshare element when co-browsing is not active."));
       }
     },
     
    startZoom: function() {
      if (controllerWindow && controllerWindow.AssistController) {
        controllerWindow.AssistController.startZoom();
      }
    },
    
    endZoom: function() {
      if (controllerWindow && controllerWindow.AssistController) {
        controllerWindow.AssistController.endZoom();
      }
    },

    Exceptions: {
      AssistException: function(message) {
        this.getMessage = function() {
          return message;
        }
      }
    }
  };
    
    var assistInitialised = false;
    
    function initAssist() {
        if (!assistInitialised) {
            assistInitialised = true;
            setSDKPath();

            var storageData;
            if (isIE()) {
                storageData = getLocalStorageData();
            } else {
                storageData = getSessionStorageData();
            }
            if (storageData) {

                if (storageData.disableLogging) {
                    disableAssistLogging();
                }

                reconnectController(storageData, function(success) {
                    if (success == false) {
                        removeAllStorageData();
                    }
                });
            }
        }
    }

    initAssist();

    if (getBrowser() == 'Safari') {
        // need to add this after load, as otherwise it fires onload causing us to call reconnect twice
        window.addEventListener("pageshow", function(event) {
            initAssist();
        });
    }

    function createErrorMessage(code, message) {
        return { code: code, message: message }
    }

    function doError(error) {
        assistLogger.error(error);

        if (typeof AssistSDK['onError'] !== 'undefined') {
            AssistSDK.onError(error.code,error);
        }
    }

    function isIE() {
        var userAgent = window.navigator.userAgent;

        if ((userAgent.indexOf('MSIE') > -1) || (userAgent.indexOf('Trident/') > -1)) {
            return true;
        }
        return false;
    }

    function onDocumentReady(document, callback) {
        ;(function waitForDocument() {
            // better to go on interactive as this will be quicker but some browser impls may not do 'interactive'
            if (document.readyState === "interactive" || document.readyState === "complete") {
                assistLogger.log("document complete");
                callback();
            } else {
                assistLogger.log("document not complete, waiting");
                setTimeout(waitForDocument, 50);
            }
        })();
    }

    function start(configuration) {

        // need to load popup first so that it's synchronous, otherwise we trigger the popup blocker
        if (typeof configuration['destination'] !== 'undefined') {
            loadPopup(configuration, function(popupWindow) {
                loadIFrame(configuration, false, popupWindow);
            });
        } else {
            loadIFrame(configuration, false);
        }
    }

    function loadIFrame(configuration, reconnect, popupWindow, callback) {
        // todo: we've sort of got two 'ready' callbacks for the iframe (1 & 2), which could perhaps be improved
        createIFrame(configuration, "assist-iframe", CONTROLLER_PATH, function (iframe) { // <- 1)
            if (iframe) {
                controllerWindow = iframe.contentWindow;

                controllerWindow.AssistController.setDynamicElementIdPermissionsMap(dynamicElementIdToPermissionMap);
                controllerWindow.AssistController.setIframeDynamicElementIdPermissionsMap(dynamicIframeElementIdToPermissionMap);
                controllerWindow.AssistController.browser = getBrowser();

                var terminateCallback = function () {
                    controllerWindow.AssistController.endSupport();
                };

                controllerWindow.AssistAED.setSocketConnectionConfiguration(configuration, terminateCallback);

                controllerWindow.AssistAED.setErrorCallback(function(error){
                    doError(error);
                });


                var connect = (reconnect == true) ? controllerWindow.reconnect : controllerWindow.init;

                connect(configuration, function () { // <- 2)
                    if (popupWindow) {
                        controllerWindow.AssistController.setPopupWindow(popupWindow);
                    }

                    if (callback) {
                        callback(iframe, controllerWindow);
                    }
                });
            }
        });
    }

    function loadPopup(configuration, callback) {
        popupWindow = new AssistPopup(configuration,
            function onSuccess() {
                callback(popupWindow);
            },
            function onError(msg) {
                doError(createErrorMessage(ERROR_CODE.SESSION_CREATION_FAILURE, msg));
            }
        );
        
        if (popupWindow.popupBlocked) {
            if (configuration.popupBlocked != null) {
                configuration.popupBlocked();
            } else {
                popupBlockedDefaultHandler(configuration);
            }
            removeAllStorageData();
        }
    }

    function createIFrame(configuration, id, src, callback) {
        var iframe;

        var oldFrame = document.getElementById(id);
        if (oldFrame) {
            oldFrame.parentNode.removeChild(oldFrame);
        }

        iframe = document.createElement("iframe");
        iframe.style.visibility = 'hidden';
        iframe.style.position = 'absolute';
        iframe.style.height = '0px';
        iframe.style.width = '0px';
        iframe.id = id;

        ajaxGetDOM(configuration, getSDKPath(configuration) + src, function(xmlDoc) {

            iframe.contentWindow.document.open("text/html", "replace");
            iframe.contentWindow.document.write("<!DOCTYPE html>\n" + xmlDoc.documentElement.outerHTML);
            iframe.contentWindow.AssistSDKInterface = {
                "ready": function() {
                    callback(iframe);
                },
                "supportEnded": function() {
                    cleanup();
                }
            };

            iframe.contentWindow.document.close();
        }, function error(statusCode) {
            cleanup();
            var msg = "Error connecting to server for url " + src;
            doError(createErrorMessage(ERROR_CODE.SESSION_CREATION_FAILURE,msg));
        });

        function cleanup() {
            if (iframe.parentNode) {
                iframe.parentNode.removeChild(iframe);
            }
            removeAllStorageData();
            if (popupWindow) {
                popupWindow.close();
                popupWindow = null;
            }
            controllerWindow = null;
        }

        document.body.appendChild(iframe);
    }

    function ajaxGetDOM(configuration, url, successCallback, errorCallback) {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function() {
            if (xmlHttp.readyState == 4) {
                if (xmlHttp.status == 200) {

                    var xmlDoc = new DOMParser().parseFromString(xmlHttp.responseText, "text/html");
                    xmlDoc.getElementsByTagName("base")[0].href = getSDKPath(configuration);

                    successCallback(xmlDoc);
                } else {
                    errorCallback(xmlHttp.status);
                }
            }
        }

        xmlHttp.open("GET", url, true);
        xmlHttp.send();
    }

    function setSessionStorageData(val, undefined) {
        if (typeof val === 'object' && val != undefined) {
            if (sessionStorage) {
                sessionStorage.setItem(SESSION_STORAGE_DATA_NAME, JSON.stringify(val));
            }

            setLocalStorageData(val);
        }
    }

    function setLocalStorageData(val, undefined) {
        // local storage doesn't strictly need the whole config, it's more of a flag for other tabs
        // but it might be useful to have the whole config in future
        if (localStorage) {
            localStorage.setItem(LOCAL_STORAGE_DATA_NAME, JSON.stringify(val));
        }
    }

    function removeAllStorageData() {
        if (localStorage) {
            localStorage.removeItem(LOCAL_STORAGE_DATA_NAME);
        }

        if (sessionStorage) {
            sessionStorage.removeItem(SESSION_STORAGE_DATA_NAME);
        }
    }

    function getLocalStorageData() {
        return getStorageItem(localStorage, LOCAL_STORAGE_DATA_NAME);
    }

    function localStorageChanged(event) {
        if (!getLocalStorageData() && controllerWindow) {
            setLocalStorageData(JSON.parse(event.oldValue));
        }
    }

    function getSessionStorageData() {
        return getStorageItem(sessionStorage, SESSION_STORAGE_DATA_NAME);
    }

    function getStorageItem(storage, name) {
        if (storage) {
            var val = storage.getItem(name);
            if (val) {
                try {
                    return JSON.parse(val);
                } catch (err) {
                    assistLogger.log("Non-JSON payload found in storage [" + val + "]");
                    storage.removeItem(name);
                }
            }
        }

        return false;
    }

    function reconnectController(configuration, callback) {

        assistLogger.log("reconnect called");
        assistLogger.log("waiting for document ready");

        var existingPopupWindow;
        var iframe;
        if (typeof configuration['destination'] !== 'undefined') {

            existingPopupWindow = window.open("", POPUP_NAME);

            if (!existingPopupWindow) { // popup doesn't exist, can't reconnect
                var msg = "couldn't reconnect to popup";
                doError(createErrorMessage(ERROR_CODE.POPUP,msg));
                error();
                return;
            }
        }

        function isIE() {
            var userAgent = window.navigator.userAgent;

            if ((userAgent.indexOf('MSIE') > -1) || (userAgent.indexOf('Trident/') > -1)) {
                return true;
            }
            return false;
        }

        onDocumentReady(document, function() {
            function initIframe() {
                loadIFrame(configuration, true, popupWindow, function(aIframe) {
                    iframe = aIframe;
                    window.addEventListener("storage", localStorageChanged, false);
                    try {
                        callback(true);
                    } catch (e) {
                        error(e);
                    }
                });
            };
            assistLogger.log("document ready");
            if (typeof configuration['destination'] !== 'undefined') {
                popupWindow = new AssistPopup(configuration,
                    function onSuccess() {
                        initIframe();
                    },
                    function onError() {
                        var msg = "couldn't reconnect to popup";
                        doError(createErrorMessage(ERROR_CODE.POPUP,msg));
                        error();
                    },
                    existingPopupWindow
                );
            } else {
                initIframe();
            }

        });

        function error(e) {
            try {
                if (popupWindow) {
                    popupWindow.close(true);
                }

                if (iframe) {
                    iframe.parentNode.removeChild(iframe);
                }
            } catch (x) {
                assistLogger.error(x);
            }
            assistLogger.warn(e);
            controllerWindow = null;
            removeAllStorageData();
            doError(createErrorMessage(ERROR_CODE.SESSION_CREATION_FAILURE,e));
            callback(false);
        }
    }

    function setSDKPath() {
        try {
            var scripts = document.getElementsByTagName('script');
            var src = scripts[scripts.length - 1].src; // last script should be us
            var path = src.substring(0, src.lastIndexOf("/") + 1);
            var file = src.substring(src.lastIndexOf("/") + 1, src.length);

            if (file == "assist.js") { // need this check in case we've been uglified into some other script loader
                sdkPath = path;
            }

        } catch (e) {
        }
    }

    function getSDKPath(configuration) {
        if (configuration.sdkPath) {
            return configuration.sdkPath + "/";
        } else if (sdkPath) {
            return sdkPath;
        } else {
            return "assistsdk/"; // assume local
        }
    }

    function isObject(config) {
        if (typeof config === 'string') {
            return false;
        } else {
            return true;
        }
    }

    function popupBlockedDefaultHandler(configuration) {
        var sdkPath = getSDKPath(configuration);
        loadCSS(document, sdkPath + "css/failure.css", "ASSIST-CSS");

        var assistNS = 'assistI18n';
        // TODO: renniks to review this
        if (typeof i18n === "undefined" || i18n === null) {
            var script = document.createElement("script");
            script.type = "text/javascript";
            script.src = sdkPath + "../shared/js/thirdparty/i18next-1.7.4.min.js";
            document.body.appendChild(script);
            addAlertDiv(true, sdkPath);
        } else {
            var lang = getLocale();
            var langParts = lang.split("-");
            loadI18n(lang, langParts.length == 1);
            if (langParts.length > 1) {
                loadI18n(langParts[0], langParts[0] == "en");
            }
            if (langParts[0] != "en") {
                loadI18n("en", true);
            }
            addAlertDiv(false);
        }

        function addAlertDiv(initI18n, sdkPath) {
            if (typeof i18n !== "undefined" && i18n !== null) {
                if (initI18n) {
                    var lang = getLocale();
                    i18n.init({useCookie: false, ns:{namespaces:['assistI18n']}, lng:lang, fallbackLng: 'en', resGetPath: sdkPath + '../shared/locales/__ns__.__lng__.json'},
                        function(){addAlertDiv(false)});
                } else {
                    var div = document.createElement("div");
                    div.id = "popup-blocked-alert";
                    div.innerHTML = i18n.t("assistI18n:error.popupBlocked");
                    document.body.appendChild(div);
                }
            } else {
                setTimeout(function(){addAlertDiv(initI18n, sdkPath);}, 1000);
            }
        }

        function getLocale() {
            var lang = "en";
            if (typeof configuration.locale !== "undefined" && configuration.locale !== null) {
                lang = configuration.locale;
            }
            return lang;
        }

        function loadI18n(lang, addAlert) {
            var xmlHttp = new XMLHttpRequest();
            xmlHttp.onreadystatechange = function() {
                if (xmlHttp.readyState == 4) {
                    if (xmlHttp.status == 200) {
                        var extraResources = JSON.parse(xmlHttp.responseText);
                        i18n.addResourceBundle(lang, assistNS, extraResources);
                    }
                    if (addAlert) {
                        addAlertDiv(false);
                    }
                }
            }

            xmlHttp.open("GET", getSDKPath(configuration) + '../shared/locales/' + assistNS + '.' + lang + '.json', true);
            xmlHttp.send();
        }
    }

    function loadCSS(document, url, id) {
        var link = document.createElement("link");

        if (id) {
            link.id = id;
        }

        link.setAttribute("rel", "stylesheet");
        link.setAttribute("type", "text/css");
        link.setAttribute("href", url);
        document.getElementsByTagName("head")[0].appendChild(link);
    }

    //This method adapted from code at http://stackoverflow.com/questions/5916900/detect-version-of-browser
    function getBrowser() {
        var ua=navigator.userAgent,tem,M=ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
        if(/trident/i.test(M[1])){
            return 'IE';
        }
        if(M[1]==='Chrome'){
            tem=ua.match(/\bOPR\/(\d+)/)
            if(tem!=null)   {return 'Opera';}
            tem=ua.match(/\bEdge\/(\d+)/)
            if(tem!=null)   {return 'Edge';}
        }
        M=M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
        if((tem=ua.match(/version\/(\d+)/i))!=null) {M.splice(1,1,tem[1]);}
        return M[0];
    }

    //This method adapted from code at http://stackoverflow.com/questions/5916900/detect-version-of-browser
    function getBrowserVersion() {
        var ua=navigator.userAgent,tem,M=ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
        if(/trident/i.test(M[1])){
            tem=/\brv[ :]+(\d+)/g.exec(ua) || [];
            return (tem[1]||'');
        }
        if(M[1]==='Chrome'){
            tem=ua.match(/\bOPR\/(\d+)/)
            if(tem!=null)   {return tem[1];}
            tem=ua.match(/\Edge\/(\d+)/)
            if(tem!=null)   {return tem[1];}
        }
        M=M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
        if((tem=ua.match(/version\/(\d+)/i))!=null) {M.splice(1,1,tem[1]);}
        return M[1];
    }
    
    function AssistPopup(configuration, successCallback, errorCallback, existingPopup) {
        var _self = this;
        var crossDomain = (getBrowser() != "IE" && getBrowser() != "Safari");
        var popup = existingPopup;
 
        if (!popup) {
            var popupPositionString = getPopupInitialPositionString(configuration);
            var windowFeatures = "width=" + POPUP_WIDTH + ",height=" + POPUP_HEIGHT + ",resizable=yes,scrollbars=yes" + popupPositionString;
            var popupURL = "about:blank";
            if (crossDomain) {
                popupURL = getSDKPath(configuration) + ASSIST_CSDK_PATH + "?crossDomain=true";
                if (typeof configuration.locale !== "undefined" && configuration.locale !== null) {
                    popupURL += "&locale=" + encodeURIComponent(configuration.locale);
                }
                if (configuration.popupCssUrl != null) {
                    popupURL += "&popupCssUrl=" + encodeURIComponent(configuration.popupCssUrl);
                }
            }
            popup = window.open(popupURL, POPUP_NAME, windowFeatures);
            //  It may be enough to just check for popup.document
            if (popup && popup.document) {
                if (!crossDomain) {
                    fillPopup();
                }
            }
            else {
                _self.popupBlocked = true;
            }
            
            function getPopupInitialPositionString() {
                var popupInitialPosition = configuration.popupInitialPosition;
                var popupPositionString = "";

                if (popupInitialPosition) {
                    var configLeft = parseInt(popupInitialPosition.left);
                    popupPositionString += (isNaN(configLeft)) ? "" : ",left=" + configLeft;

                    var configTop = parseInt(popupInitialPosition.top);
                    popupPositionString += (isNaN(configTop)) ? "" : ",top=" + configTop;
                }

                return popupPositionString;
            }
            
            function fillPopup() {
                popup.document.write("<!DOCTYPE html><head><script>window.AssistSDKOpening = true;</script></head><body></body>");
                popup.document.close();
                if (popup.AssistSDKOpening) {
                    popup.document.open();

                    ajaxGetDOM(configuration, getSDKPath(configuration) + ASSIST_CSDK_PATH, function (xmlDoc) {
                        if (typeof configuration.locale !== "undefined" && configuration.locale !== null) {
                            xmlDoc.getElementById("lang").textContent = "var lang='" + configuration.locale + "';";
                        }

                        if (configuration.popupCssUrl != null) {
                            xmlDoc.getElementById("Assist-popup-CSS").setAttribute("href", configuration.popupCssUrl);
                        }

                        popup.document.write("<!DOCTYPE html>\n" + xmlDoc.documentElement.outerHTML);

                        popup.document.close();
                        popup.configuration = configuration;

                        popup.AssistSDKInterface = {
                            "ready": function () {
                                successCallback();
                            }
                        };
                    }, function error(statusCode) {
                        removeAllStorageData();
                        try {
                            popup.close();
                        } catch (e) {
                        }
                        var msg = "Error connecting to server for url " + getSDKPath(configuration) + ASSIST_CSDK_PATH;
                        errorCallback(msg);
                    });
                }
                else {
                    _self.popupBlocked = true;
                }
            }
        }
        
        var messageHandler = new AssistMessageHandler(popup, crossDomain);
        
        messageHandler.addHandler(messageHandler.messages.POPUP_READY, function(messageDetails) {
            successCallback();
        });
        messageHandler.addHandler(messageHandler.messages.CONSOLE_LOG, function(messageDetails) {
            if (assistLogger) {
                assistLogger[messageDetails.data.logType](messageDetails.data.message);
            }
            else {
                console[messageDetails.data.logType](messageDetails.data.message);
            }
        });
        messageHandler.addHandler(messageHandler.messages.ON_WEBCAM_USE_ACCEPTED, function(messageDetails) {
            AssistSDK.onWebcamUseAccepted();
        });
        messageHandler.addHandler(messageHandler.messages.END_CALL, function(messageDetails) {
            if (controllerWindow && controllerWindow.AssistCSDKUI) {
                controllerWindow.AssistCSDKUI.endCall(true);
            }
        });
        messageHandler.addHandler(messageHandler.messages.SHOW_VIDEO, function(messageDetails) {
            if (controllerWindow && controllerWindow.AssistCSDKUI) {
                controllerWindow.AssistCSDKUI.showVideo();
            }
        });
        messageHandler.addHandler(messageHandler.messages.ERROR, function(messageDetails) {
            if (controllerWindow && controllerWindow.AssistCSDKUI) {
                controllerWindow.AssistCSDKUI.error(messageDetails.data.type, messageDetails.data.message);
            }
        });
        messageHandler.addHandler(messageHandler.messages.CONNECTION_QUALITY_CHANGED, function(messageDetails) {
            if (controllerWindow && controllerWindow.AssistCSDKUI) {
                controllerWindow.AssistCSDKUI.connectionQualityChanged(messageDetails.data);
            }
        });
        messageHandler.addHandler(messageHandler.messages.DISPLAY_MODAL, function(messageDetails) {
            if (controllerWindow && controllerWindow.AssistCSDKUI) {
                controllerWindow.AssistCSDKUI.displayModal(messageDetails.data);
            }
        });
        messageHandler.addHandler(messageHandler.messages.SESSION_CREATION_FAILURE, function(messageDetails) {
            if (controllerWindow && controllerWindow.AssistCSDKUI) {
                controllerWindow.AssistCSDKUI.doSessionCreationFailure();
            }
        });
        
        if (existingPopup) {
            // Give the popup a few seconds to respond.
            if (popupWindowTimeout) {
                clearTimeout(popupWindowTimeout);
            }
            popupWindowTimeout = setTimeout(errorCallback, 5000);
            messageHandler.sendMessageGetResponse(messageHandler.messages.HANDLE_RELOAD, null, function() {
                if (popupWindowTimeout) {
                    clearTimeout(popupWindowTimeout);
                }
                successCallback();
            });
        }
        
        function initialiseCSDK(aAssistUtils, agentVideoWindow, messageType, onAgentVideoWindowCreatedCallback, onInCallCallback) {
            if (crossDomain) {
                // Wait for the video iframe to load before initialising AssistCSDK.
                var iframe = agentVideoWindow.getElementsByTagName("iframe")[0];
                iframe.onload = function() {
                    messageHandler.sendMessageGetResponse(messageType, configuration, onInCallCallback);
                    // Make sure we are set as the popup opener.
                    window.open("", POPUP_NAME);
                };
            }
            else {
                popup.AssistCSDK.setVideoContainer(agentVideoWindow.getElementsByClassName("assist-video-container")[0]);
                popup.AssistUtils = aAssistUtils;
                messageHandler.sendMessageGetResponse(messageType, configuration, onInCallCallback);
            }
            onAgentVideoWindowCreatedCallback(agentVideoWindow);
        }
        
        _self.close = function(force) {
            try {
                if (force) {
                    popup.close();
                }
                else {
                    messageHandler.send(messageHandler.messages.CLOSE_POPUP);
                }
            }
            catch(e) {
                // The popup was probably already in the process of closing.
            }
        };
        
        // Interface to AssistCSDK
        _self.CSDK = {
            checkInitRun: function (callback) {
                messageHandler.sendMessageGetResponse(messageHandler.messages.CHECK_INIT_RUN, null, callback);
            },
            init: function (aAssistUtils, aTargetWindow, aAssistControllerInterface, onAgentVideoWindowCreatedCallback, onInCallCallback) {
                controllerWindow.AssistCSDKUI.init(_self, aTargetWindow, configuration, crossDomain, aAssistControllerInterface, function(agentVideoWindow) {
                    initialiseCSDK(aAssistUtils, agentVideoWindow, messageHandler.messages.INIT, onAgentVideoWindowCreatedCallback, function onInCall(returnConfig) {
                        setSessionStorageData(returnConfig);
                        onInCallCallback(returnConfig);
                    });
                });
            },
            reconnect: function (aAssistUtils, aTargetWindow, aAssistControllerInterface, onAgentVideoWindowCreatedCallback) {
                controllerWindow.AssistCSDKUI.reconnect(_self, aTargetWindow, configuration, crossDomain, aAssistControllerInterface, function(agentVideoWindow) {
                    initialiseCSDK(aAssistUtils, agentVideoWindow, messageHandler.messages.RECONNECT, onAgentVideoWindowCreatedCallback, function(){});
                });
            },
            endCall: function(callEndSupport) {
                messageHandler.send(messageHandler.messages.END_CALL);
                controllerWindow.AssistCSDKUI.endCall(callEndSupport);
            },
            setAgentName: function(aAgentName) {
                controllerWindow.AssistCSDKUI.setAgentName(aAgentName);
            },
            setAgentPicture: function(aAgentPictureUrl) {
                controllerWindow.AssistCSDKUI.setAgentPicture(aAgentPictureUrl);
            }
        };
        
        // called from AssistCSDKUI
        _self.handleUnload = function() {
            messageHandler.send(messageHandler.messages.HANDLE_UNLOAD);
        };
        _self.setLocalMediaEnabled = function(enablingVideo, enablingAudio, localVideoEnabled) {
            messageHandler.send(messageHandler.messages.SET_LOCAL_MEDIA_ENABLED, {
                "enablingVideo": enablingVideo,
                "enablingAudio": enablingAudio,
                "localVideoEnabled": localVideoEnabled
            });
        };
    }
    
    // AssistMessageHandler - inserted as part of the build process
    function AssistMessageHandler(destinationWindow, crossDomain) {
        var _self = this;
        var requestId = 1;
        var requestCallbacks = {};
        var handlers = {};
        var knownOrigins = {};
        
        function sendMessage(messageType, data, requestId) {
            if (destinationWindow) {
                var message = {
                    "type": messageType,
                    "data": data || "",
                    "requestId": requestId || ""
                };
                
                if (crossDomain) {
                    destinationWindow.postMessage(JSON.stringify(message), "*");
                }
                else if (destinationWindow.handleDirectMessage && !destinationWindow.closed) {
                    destinationWindow.handleDirectMessage(message, window);
                }
            }
        }
        function receiveMessage(event) {
            if (checkMessageOrigin(event)) {
                var messageDetails = JSON.parse(event.data);
                handleReceivedMessage(messageDetails, event.source);
            }
        }
        function checkMessageOrigin(event) {
            // If the user has navigated away from LA, there may not be an event source.
            // In that case, only allow the origin if we have allowed it before.
            if (event.source && (event.source == destinationWindow)) {
                knownOrigins[event.origin] = true;
            }
            return knownOrigins[event.origin];
        }
        function handleReceivedMessage(messageDetails, sourceWindow) {
            if (messageDetails.type && handlers[messageDetails.type]) {
                handlers[messageDetails.type](messageDetails, sourceWindow);
            }
        }
        
        _self.messages = {
            RESPONSE: "response",
            POPUP_READY: "popupReady",
            CHECK_INIT_RUN: "checkInitRun",
            INIT: "init",
            RECONNECT: "reconnect",
            END_CALL: "endCall",
            CONSOLE_LOG: "consoleLog",
            HANDLE_UNLOAD: "handleUnload",
            HANDLE_RELOAD: "handleReload",
            ON_WEBCAM_USE_ACCEPTED: "onWebcamUseAccepted",
            SHOW_VIDEO: "showVideo",
            ERROR: "error",
            CONNECTION_QUALITY_CHANGED: "connectionQualityChanged",
            DISPLAY_MODAL: "displayModal",
            SET_LOCAL_MEDIA_ENABLED: "setLocalMediaEnabled",
            SESSION_CREATION_FAILURE: "sessionCreationFailure",
            CLOSE_POPUP: "closePopup"
        };
        
        _self.addHandler = function(messageType, handlerFunction) {
            handlers[messageType] = handlerFunction;
        };
        
        _self.send = function(messageType, data) {
            sendMessage(messageType, data);
        };
        
        _self.respond = function(requestId, data) {
            sendMessage(_self.messages.RESPONSE, data, requestId);
        };
        
        _self.sendMessageGetResponse = function(type, data, callback) {
            requestCallbacks[requestId] = callback;
            sendMessage(type, data, requestId++);
        }
        
        _self.setDestinationWindow = function (newDestinationWindow) {
            destinationWindow = newDestinationWindow;
        };
        
        // Default response handler
        _self.addHandler(_self.messages.RESPONSE, function(messageDetails) {
            var callback = requestCallbacks[messageDetails.requestId];
            delete requestCallbacks[messageDetails.requestId];
            if (callback) {
                callback(messageDetails.data);
            }
        });
        
        if (crossDomain) {
            window.addEventListener("message", receiveMessage, false);
        }
        else {
            window.handleDirectMessage = function(messageDetails, sourceWindow) {
                setTimeout(function() {
                    handleReceivedMessage(messageDetails, sourceWindow)
                },0);
            };
        }
    }
})();
