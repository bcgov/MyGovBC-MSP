
var SESSION_DATA_NAME = "assist-session-config";
var DEFAULT_MASKING_COLOR = "black";

var screenData = {};
var observer;

var previousReplicationRenderQueue;
var parser;
var renderer;
var imagePreloader;
var errorList;

// https://tc39.github.io/ecma262/#sec-array.prototype.includes
if (!Array.prototype.includes) {
    Object.defineProperty(Array.prototype, 'includes', {
        value: function(searchElement, fromIndex) {

            // 1. Let O be ? ToObject(this value).
            if (this == null) {
                throw new TypeError('"this" is null or not defined');
            }

            var o = Object(this);

            // 2. Let len be ? ToLength(? Get(O, "length")).
            var len = o.length >>> 0;

            // 3. If len is 0, return false.
            if (len === 0) {
                return false;
            }

            // 4. Let n be ? ToInteger(fromIndex).
            //    (If fromIndex is undefined, this step produces the value 0.)
            var n = fromIndex | 0;

            // 5. If n ≥ 0, then
            //  a. Let k be n.
            // 6. Else n < 0,
            //  a. Let k be len + n.
            //  b. If k < 0, let k be 0.
            var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

            function sameValueZero(x, y) {
                return x === y || (typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y));
            }

            // 7. Repeat, while k < len
            while (k < len) {
                // a. Let elementK be the result of ? Get(O, ! ToString(k)).
                // b. If SameValueZero(searchElement, elementK) is true, return true.
                // c. Increase k by 1.
                if (sameValueZero(o[k], searchElement)) {
                    return true;
                }
                k++;
            }

            // 8. Return false
            return false;
        }
    });
}

function getStackFromParsedNodeQueue(node) {
    if (!previousReplicationRenderQueue) return null;

    var elementsPreviousStackContext = previousReplicationRenderQueue.elementContexts.get(node);
    if (elementsPreviousStackContext) return elementsPreviousStackContext;

    return null;
}

function getElementAssistPermission(element) {
    var permission = (element.dataset) ? element.dataset.assistPermission : undefined;

    if (permission) {
        return permission;
    }

    var assistPermissionAttribute = (element.attributes) ? element.attributes["data-assist-permission"] : undefined;
    return (assistPermissionAttribute) ? assistPermissionAttribute.value : undefined;
}

function hasPermissionToView(element, permissionDefinitions, hasNonViewableAncestor) {
    
    permissionDefinitions = permissionDefinitions || getCommonAgentViewablePermissions();
    
    if (typeof hasNonViewableAncestor == 'undefined') {

        var ancestorPermissions = getAncestorPermissions(element);

        hasNonViewableAncestor = !ancestorPermissions.every(function(ancestorPermission) {
            if (permissionDefinitions.indexOf(ancestorPermission) != -1) { // if the parent is not viewable, then the child isn't.
                return true; 
            }
        });
    }
 
    if (hasNonViewableAncestor === true) {
        return false;
    } else {
        // all ancestors are visible, so not inheriting any non-visible permission
        var permission = getElementAssistPermission(element);
        if (permission) {
            permission = permission.toLowerCase();
            // if all ancestors are visible but this element has a set permission that's not in the defined agent permissions
            // then it's not visible
            if (permissionDefinitions.indexOf(permission) == -1) { 
                return false;
            } else {
                return true;
            }
        }
        // if all our ancestors are visible (hasNonViewableAncestor == false) and this element doesn't have a permission
        // then this element inherits the permission of its parent, which we've already established was visible, so this
        // element is visible
        return true; 
    }
}

function getAncestorPermissions(element) {
    var parent = element;
    var ancestors = [];
    var ancestorPermissions = [];
    
    if (element.tagName != "BODY") {
        while (parent.parentElement) {
            parent = parent.parentElement;
            ancestors.push(parent);
            if (parent.tagName == "BODY") {
                break; // otherwise we go up to HTML element - BODY is considered the root of viewable/interactive things
            }
        }
    } else {
        ancestors.push(element);
    }
    ancestors.reverse();

    var lastAncestorPermission = "default";
    for (var i = 0, len = ancestors.length; i < len; i++) {
        var ancestor = ancestors[i];
        if (ancestor.dataset && ancestor.dataset.assistPermission) {
            var ancestorPermission = ancestor.dataset.assistPermission.toLowerCase();
            ancestorPermissions.push(ancestorPermission);
            lastAncestorPermission = ancestorPermission;
        } else {
            ancestorPermissions.push(lastAncestorPermission);
        }
    }
    
    return ancestorPermissions;
}

function agentHasPermissionToInteract(element, agent) {
    if (!AssistController.cobrowsePaused && isAllowedAgent(agent)) {
        return hasPermissionToInteract(element, getAgentPermissions(agent, "interactive"));
    }
    
    return false;
}

function hasPermissionToInteract(element, permissionDefinitions) {
    
    if (hasPermissionToView(element) == false) {
        return false;
    }
    
    permissionDefinitions = permissionDefinitions || getCommonAgentInteractablePermissions();
    
    var ancestorPermissions = getAncestorPermissions(element).reverse();
    // if we didn't find a parent permission, set to default
    var permission = ((element.dataset) ? element.dataset.assistPermission : undefined) || ancestorPermissions[0] || "default";
    permission = permission.toLowerCase();
    
    if (permissionDefinitions.indexOf(permission) == -1) { // if the child doesn't have a interactive permission, then false
        return false;
    } else {
        return true;
    }
}

function getCommonAgentInteractablePermissions() {
    return getCommonAgentPermissions("interactive");
}

function getCommonAgentViewablePermissions() {
    return getCommonAgentPermissions("viewable");
}

function isAllowedAgent(participant) {
    if (participant.metadata.role == "agent") {
        var screensharePermissions = AssistController.screenShareTopic.permissions;
        if (screensharePermissions[participant.id] == AssistAED.PERMISSIONS.ALLOWED) {
            return true;
        }
    }
    
    return false;
}

function getAgentPermissions(participant, type) {
    var agentPermissions = participant.metadata.permissions;
    
    if (agentPermissions && agentPermissions[type]) {
        var permissionSet = []; // this avoids duplicates from the server, e.g. ['A', 'a']
        for (var j = 0; j < agentPermissions[type].length; j++) {
            var permission = agentPermissions[type][j].toLowerCase();
            permissionSet.push(permission);
        }
        return permissionSet;
    } else if (agentPermissions) {
        return [];
    } else {
       return ["default"];
    }
}

function getCommonAgentPermissions(type) {
            
    if (AssistController.screenShareTopic) {
        var allowedAgentsPermissions = [];
        for (var i = 0; i < AssistController.rootTopic.participants.length; i++) {
            var participant = AssistController.rootTopic.participants[i];
            if (isAllowedAgent(participant)) {
                var agentPermissions = getAgentPermissions(participant, type);
                allowedAgentsPermissions.push(agentPermissions);
            }
        }
        
        // intersect the permission of the first agent to every other agent
        var commonPermissions = (allowedAgentsPermissions.shift() || []).filter(function(permission) {
            return allowedAgentsPermissions.every(function(permissionSet) {
                return permissionSet.indexOf(permission) !== -1;
            });
        });
        
        return commonPermissions;
    }
    
    return [];
}
    
function defaultOnCobrowseActive() {
    if (AssistController.isOnAssistPages) {
        AssistController.cobrowsingBanner = AssistController.sourceWindow.document.createElement("div");
        AssistController.cobrowsingBanner.id = "default-cobrowsing";
        AssistController.cobrowsingBanner.className = "default-cobrowsing";
        AssistController.cobrowsingBanner.appendChild(AssistController.sourceWindow.document.createTextNode(i18n.t("assistI18n:cobrowsing.active")));
    }
    addActiveCobrowseToPage();
};

function addActiveCobrowseToPage() {
    if (AssistController.isOnAssistPages) {
        AssistController.sourceWindow.document.body.appendChild(AssistController.cobrowsingBanner);
    }
};

function defaultOnCobrowseInactive() {
    if (AssistController.cobrowsingBanner && AssistController.isOnAssistPages) {
    	 AssistController.sourceWindow.document.body.removeChild(AssistController.cobrowsingBanner);
    }
    delete AssistController.cobrowsingBanner;
};

function addCobrowsingClass() {
    if (AssistController.isOnAssistPages) {
        AssistController.sourceWindow.document.body.classList.add("assist-cobrowsing");
    }
};

function removeCobrowsingClass() {
    if (AssistController.isOnAssistPages) {
        AssistController.sourceWindow.document.body.classList.remove("assist-cobrowsing");
    }
};

function pageHasCobrowsingClass() {
	return AssistController.sourceWindow.document.body.classList.contains("assist-cobrowsing");
};

function getChangedIframeImage(previousReplicationRenderQueue, changedIframeElement) {
    if (!previousReplicationRenderQueue) return undefined;

    return previousReplicationRenderQueue.iframeImages.get(changedIframeElement)
}

function currentNumberOfCobrowsingAgents() {
	var agentCount = 0;
	for (i = 0; i < AssistController.screenShareTopic.participants.length; i++) {
		if (AssistController.screenShareTopic.participants[i].metadata.role == "agent") {
			agentCount++;
		}
	}
	return agentCount;
};

window.AssistController = {
    sourceWindow : null,
    supportDiv : null,
    video : null,
    fullWidth : 0,
    fullHeight : 0,
    scrollY: 0,
    scrollX: 0,
    glassPane : null,
    socketClosed : true,
    jQuery : null,
    loaded : false,
    cleanUpStack : new Array(),
    rootTopic : null,
    screenShareWindow : null,
    videoWindow : null,
    inputTopic : null,
    inputElements : [],
    screenShareAllowed : false,
    forceNextChange : false,
    reconnect: false,
    browserInfo: null,
    screenshotInProgress: false,
    assistElementViewablePermissions: new AssistElementViewablePermissions(),
    
    // The set of agents to allow in to the co-browse immediately on co-browse subtopic creation
    pendingAllowAgents: [],
    // The set of agents to reject from the co-browse immediately on co-browse subtopic creation
    pendingDisallowAgents: [],

    cobrowsePaused : false,
    forceUpdateOnUnpause : false,
    consumerCursor : {clientX: -1, clientY: -1, moved: false, delay: 1000, id: -1},
    mouseMoveListener: function (e) {
        if (!e.assist_generated) {
            e = e || window.event;
            AssistController.consumerCursor.clientX = e.clientX;
            AssistController.consumerCursor.clientY = e.clientY;
            AssistController.consumerCursor.moved = true;
        }
    },
    addMouseCursorShadowing : function(config) {
        if (config.hasShadowCursor()) {
            if (config.getShadowCursorDelay()) {
                AssistController.consumerCursor.delay = config.getShadowCursorDelay();
            }

            AssistController.sourceWindow.addEventListener('mousemove', AssistController.mouseMoveListener);
            AssistController.consumerCursor.id = setInterval(function () {
                if (AssistController.consumerCursor.moved) {
                    var mouseMessage = new Int16Array(3);
                    mouseMessage[0] = MOUSE_MOVE_MESSAGE;
                    mouseMessage[1] = AssistController.consumerCursor.clientX;
                    mouseMessage[2] = AssistController.consumerCursor.clientY;
                    if (AssistController.screenShareTopic) {
                        AssistController.screenShareTopic.sendMessage(mouseMessage);
                    }
                    AssistController.consumerCursor.moved = false;
                }
            }, AssistController.consumerCursor.delay);
        }
    },

    removeMouseCursorShadowing : function() {
        AssistController.sourceWindow.removeEventListener('mousemove', AssistController.mouseMoveListener);
        if (AssistController.consumerCursor.id > -1) {
            clearInterval(AssistController.consumerCursor.id);
        }
    },

    doError : function(code, payload) {
        AssistController.doSDKCallback("onError", function() {}, [code, payload]);
    },
    
    startSupport : function(config) {
        AssistController.sourceWindow = window.parent;
        AssistController.addMouseCursorShadowing(config);

        var scrollPositions = getScrollPositions(AssistController.sourceWindow);
        AssistController.scrollY = scrollPositions.scrollY;
        AssistController.scrollX = scrollPositions.scrollX;

        var windowDimensions = getWindowDimensions(AssistController.sourceWindow);
        AssistController.fullWidth = scrollPositions.width;
        AssistController.fullHeight = scrollPositions.height;

        AssistController.config = config;

        if (config == false) {
            assistLogger.error("Attempted to call AssistController with corrupt config");
            return;
        }
        
        if (config.getSessionToken()) {
            AssistController.start(config);
        } else {
            var request = new XMLHttpRequest();

            var url = "/assistserver/consumer";
            var postData = "type=create&targetServer=" + config.getTargetServer()
                         + "&originServer=" + config.getOriginServer();

            if (config.getCorrelationId()) {
                postData = postData + "&username=" + config.getCorrelationId();
            } else if (config.getUsername()) {
              postData = postData + "&username=" + config.getUsername();
            }

            if (config.getUUI()) {
                postData = postData + "&uui=" + config.getUUI();
            }
            
            if (config.getDisplayName()) {
                postData = postData + "&displayName=" + config.getDisplayName();
            }
            if (config.getAuditName()) {
                postData = postData + "&auditName=" + config.getAuditName();
            }

            if (config.getUrl()) {
                url = config.getUrl() + url;
            }
            
            assistLogger.log("startSupport(): url = " + url);
            
            request.open("POST", url, true);
            request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

            request.onreadystatechange = function () {
                if (request.readyState == 4) {
                    if (request.status == 200) {
                        var result = JSON.parse(request.responseText);
                        var correlationId = result.address;
                        var sessionToken = result.token;
                        config.setSessionToken(sessionToken);
                        var scaleFactor = result.scaleFactor;
                        if (!config.getScaleFactor()) {
                            config.setScaleFactor(scaleFactor);
                        }
                        AssistController.start(config); 
                    } else if (request.status == 403) {
                        if (typeof window["AssistPopup"] !== 'undefined') {
                            AssistPopup.CSDK.endCall();
                        }
                        AssistController.doError('SESSION_CREATION_FAILURE',
                          {code:AssistController.sourceWindow.AssistSDK.getSessionCreationFailureCode(),
                           message:i18n.t("assistI18n:notice.callFailed")});
                        AssistSDKInterface.supportEnded();
                    }
                }
            };

            request.send(postData);
        }
    },

    shareDocument : function(document, onLoad, onError) {
        AssistController.screenShareWindow.shareDocument(document, onLoad, onError);
    },

    shareMoveableElement : function(element) {
      AssistController.screenShareWindow.closeSubWindowForElement(element);

      element.setAttribute("data-html2canvas-ignore", "true");
      element.classList.add("shared-element");
      AssistController.screenShareWindow.shareSubWindow(element,
        {
          moveable : true,
          name: "draggable-agent-window",
          mustRemainVisibleInPixels : 90,
          mustRemainVisibleBottomPixels : 120
        },
        function(newWindow ,newSubtopic) {
          newSubtopic.participantJoined = function(newParticipant) {
            newWindow.sendSizeAndPosition();
            newWindow.refreshContent(true);
          };
        },
        AssistController.config.getScaleFactor());
    },

    unshareMoveableElement : function(element) {
      AssistController.screenShareWindow.closeSubWindowForElement(element);

    },

    setPopupWindow: function(popupWindow) {
        assistLogger.log("got popup window");
        window.AssistPopup = popupWindow;
    },

    allowScreenShare : function(configuration) {
        // TODO make it clear that this is now part of the default implementation of the agent joined/left/requested cobrowse API
        AssistController.screenShareAllowed = true;
        configuration.setScreenShareAllowed(true);
        if (AssistController.screenShareTopic) {
            var rootTopicParticipants = AssistController.rootTopic.participants;
            rootTopicParticipants.forEach(function(participant){
                if (participant.metadata.role == "agent"
                    && AssistController.screenShareTopic.getPermissionForParticipant(participant) != AssistAED.PERMISSIONS.ALLOWED) {
                    AssistController.allowCobrowseForAgent(new Agent(participant));
                }
            });

        }
        if (AssistController.screenShareAllowed) {
            assistLogger.log("on in support");
            AssistController.doSDKCallback("onInSupport");
        }
    },

    setDynamicElementIdPermissionsMap: function(permissionsMap) {
        AssistController.assistElementViewablePermissions.setDynamicElementIdToPermissionMap(permissionsMap);
        AssistController.ScreenshotQueue.queueScreenshot(2000);
    },

    setIframeDynamicElementIdPermissionsMap: function(updatedIframeDynamicElementIdPermissionsMap) {
        AssistIFrameCaptureHandler.setIframeDynamicElementIdPermissionsMap(updatedIframeDynamicElementIdPermissionsMap);
    },

    start : function(config) {

        AssistController.assistElementViewablePermissions.init(AssistController.sourceWindow.document);

        AssistController.setupInputManager();
        
        if (config.hasDestination()) {
            assistLogger.log("Connecting with the following destination: " + config.getDestination());
            AssistController.connectWithVoiceVideo(config);
        }
        else {
            assistLogger.log("Connecting with following correlation ID: " + config.getCorrelationId());
            AssistController.connectCobrowseOnly(config);
        }

        AssistController.isOnAssistPages = true;
        AssistController.setupIFrameCaptureHandler(config);
    },

    setupInputManager: function() {
        
        assistLogger.log("setup assist input manager");
        AssistInputManager.init(AssistController.config, {
        
            inputTopicHasAgent: function() {
                return (AssistController.inputTopic && AssistUtils.hasAgent(AssistController.inputTopic));
            },
            
            openInputTopic: function(agentJoinedCallback, inputElementsPopulatedCallback) {
            
                // TODO, make this private
                AssistController.rootTopic.openPrivateSubtopic({type: "input"}, function(subtopic) {
                    AssistController.inputTopic = subtopic;
                    subtopic.participantJoined = function(newParticipant) {
                        if (newParticipant.metadata.role == "agent") {
                            agentJoinedCallback();
                        }
                    };
                    subtopic.messageReceived = function(source, message) {
                        var type = new Int16Array(message.buffer, 0, 1)[0];

                        switch (type) {
                            case INPUT_ELEMENTS_POPULATED: {
                                inputElementsPopulatedCallback(message);
                            }
                                   
                            AssistController.ScreenshotQueue.resetScreenshotQueueTimeout();
                            assistLogger.log("Scheduling a screen update (Form filled)");
                            AssistController.ScreenshotQueue.queueScreenshot();
                        }
                    };
                    // Copy the permissions from the cobrowse topic now
                    var cobrowsePermissions = AssistController.screenShareTopic.permissions;
                    var allParticipants = AssistController.rootTopic.participants;
                    for (var i = 0 ;i < allParticipants.length; i++) {
                        if (cobrowsePermissions[allParticipants[i].id] == AssistAED.PERMISSIONS.ALLOWED) {
                            subtopic.updatePermission(AssistAED.PERMISSIONS.ALLOWED, allParticipants[i]);
                        }
                    }
                }, []);
            },
            
            noInputs: function() {
                if (AssistController.inputTopic) {
                    AssistController.inputTopic.leave();
                    AssistController.inputTopic = undefined;
                }
            },

            doRender: function() {
              AssistController.ScreenshotQueue.queueScreenshot(10);
            },
            
            hasInputTopic: function() {
                return (!!AssistController.inputTopic);
            }
        }, 
        function inputElementsPopulated(descriptorString, inputElement) {
            
            var message = new Uint8Array(descriptorString.length + 2);
            var header = new Int16Array(message.buffer, 0, 2);
            header[0] = INPUT_ELEMENTS_POPULATED;
            var payload = new Uint8Array(message.buffer, 2);
            for (var i = 0; i < descriptorString.length; i++) {
                payload[i] = descriptorString.charCodeAt(i);
            }
            
            if (AssistController.inputTopic) {
                AssistController.inputTopic.sendMessage(message);
            }

            AssistController.ScreenshotQueue.resetScreenshotQueueTimeout();
            if (inputElement.type.toUpperCase() !== "RADIO") {
                AssistController.ScreenshotQueue.queueScreenshot(500, false, [inputElement]);
            }
            else {
                AssistController.ScreenshotQueue.queueScreenshot(500);
            }
        },
        function inputElementClicked(descString, left, top) {
                               
            var message = new Uint8Array(descString.length + 6);
            var header = new Int16Array(message.buffer, 0, 3);
            header[0] = INPUT_ELEMENT_CLICKED;

            header[1] = left;
            header[2] = top;
            
            var payload = new Uint8Array(message.buffer, 6);
            for (var i = 0; i < descString.length; i++) {
                payload[i] = descString.charCodeAt(i);
            }
            
            if (AssistController.inputTopic) {
                AssistController.inputTopic.sendMessage(message);
            }
        },
        function inputElementsOnPage(jsonPayload) {
                
            var message = new Uint8Array(jsonPayload.length + 2);
            var header = new Int16Array(message.buffer, 0, 1);
            var payload = new Uint8Array(message.buffer, 2);
            header[0] = INPUT_ELEMENTS_ON_PAGE;
            
            for (var i = 0; i < jsonPayload.length; i++) {
                payload[i] = jsonPayload.charCodeAt(i);
            }
            
            if (AssistController.inputTopic) {
                AssistController.inputTopic.sendMessage(message);
            }
        },
        function selectElementFocusListener(eventType, descriptorString, left, top) {
            var message = new Uint8Array(descriptorString.length + 6);
            var header = new Int16Array(message.buffer, 0, 3);

            switch (eventType) {
                case "focus": header[0] = INPUT_SELECT_FOCUSED; break;
                case "blur": header[0] = INPUT_SELECT_BLURRED; break;
            }

            header[1] = left;
            header[2] = top;

            var payload = new Uint8Array(message.buffer, 6);
            for (var i = 0; i < descriptorString.length; i++) {
                payload[i] = descriptorString.charCodeAt(i);
            }

            if (AssistController.inputTopic) {
                AssistController.inputTopic.sendMessage(message);
            }
        }, hasPermissionToInteract, AssistController.sourceWindow);
    },
 
    setupIFrameCaptureHandler : function(config) {

        AssistIFrameCaptureHandler.init(AssistController.sourceWindow, window, 
            config.getAllowedIframeOrigins(), handler, hasPermissionToView);

        function handler(changedIframeElement) {
            var changedIframeImage = getChangedIframeImage(previousReplicationRenderQueue, changedIframeElement);

            if (changedIframeImage) {
                assistLogger.log("Performing rerender with new iframe image");
                changedIframeImage.onload = function() {
                    var renderResult = renderer( previousReplicationRenderQueue );
                    var actualForce = false;

                    AssistController.screenShareWindow.contentChanged(renderResult.canvas, actualForce);
                    if (renderResult.scaledCanvas) {
                        AssistController.onScaledCanvasRendered(renderResult.scaledCanvas);
                    }
                };

                var cachedIframeCaptureImage = AssistIFrameCaptureHandler.getCachedImg(changedIframeElement);
                changedIframeImage.src = cachedIframeCaptureImage.src;
            }
            else {
                AssistController.ScreenshotQueue.resetScreenshotQueueTimeout();
                AssistController.ScreenshotQueue.queueScreenshot();
            }
        }
    },    
    endSupport : function() {
        assistLogger.log("Unloading assist window");
        AssistController.removeMouseCursorShadowing();
        function destroySession() {
            
            if (assistLogger) {
                assistLogger.log("Making request to destroy session.");
            }

            var request = new XMLHttpRequest();

            var url = "/assistserver/consumer";

            request.open("DELETE", url, true);
            request.setRequestHeader("X-Token", AssistController.config.getSessionToken());

            request.onreadystatechange = function() {
                if (request.readyState == 4) {
                    if (assistLogger) {
                        assistLogger.log("Status: " + request.status + " " + request.statusText);
                    }
                    if (request.status == 200) {
                        if (assistLogger) {
                            assistLogger.log("Response text: " + request.responseText);
                        }
                    }
                }
            };

            request.send(null);
        }

        AssistController.assistElementViewablePermissions.disconnectElementIdChangeMutationObserver();

        if (observer) {
            observer.disconnect();
        }
 
        if (pageHasCobrowsingClass() == true) {
        	AssistController.doSDKCallback("onCobrowseInactive", defaultOnCobrowseInactive);
        	removeCobrowsingClass();
        }
        
        try {
            AssistController.config.unset();
        } catch (e) {
            assistLogger.error("Couldn't remove assist config");
        }
        
        try {
            if (AssistController.screenShareWindow) {
                AssistController.screenShareWindow.closeSharedSubWindows();
            }
        } catch (e) {
            assistLogger.error("Couldn't close shared sub-windows.");
        }
           
        try {
            if (AssistController.rootTopic) {
                AssistController.sendConsumerEndSupportMessage();
                AssistController.rootTopic.leave();
            }
        } catch (e) {
            assistLogger.error("Couldn't close root topic");
        }
        
        try {
            if (AssistController.glassPane.parentNode != undefined) {
                AssistController.glassPane.parentNode.removeChild(AssistController.glassPane);
            }
        } catch (e) {
            assistLogger.log("No glass pane to remove");
        }

        for (var index in AssistController.cleanUpStack) {
            try {
                AssistController.cleanUpStack[index]();
            } catch(e) {
                assistLogger.log(e);
            }
        }
        AssistController.cleanUpStack = new Array();
        
        try {
            AssistIFrameCaptureHandler.destroy();
        } catch (e) {
            assistLogger.log(e);
        }

        destroySession();

        // sdk callback
        try {
            if (AssistController.endSupportCalled == undefined || AssistController.endSupportCalled == false) {
                AssistController.sourceWindow.AssistSDK.supportEnded();
            }
            AssistController.endSupportCalled = true;
        } 
        catch(e) {}
        
        AssistController.doSDKCallback("onEndSupport");
        
        try {
            // finally, send signal up to assist.js to remove iframe
            AssistSDKInterface.supportEnded();
        } catch (e) {
            if (assistLogger) {
                assistLogger.warn("Could not call internal supportEnded, removing iframe manually", e);
            }
            else {
                console.warn("Could not call internal supportEnded, removing iframe manually", e);
            }
            try {
                window.parent.document.body.removeChild(window.frameElement);
            } catch (e) {
                if (assistLogger) {
                    assistLogger.error("Could not remove iframe");
                }
                else {
                    console.error("Could not remove iframe");
                }
            }
        }
    },

    drawAnnotation : function() {
    },

    clearAnnotations : function() {
        for (var i = 0; i < AssistController.screenShareWindow.children.length; i++) {
            var child = AssistController.screenShareWindow.children[i];
            if (child instanceof AnnotationWindow)
                child.clear(true);
        }
    },
    
    getZoomScale : function() {
        var zoomScale = null;
        if(AssistController.screenShareWindow) {
            var zoomWindow = AssistController.screenShareWindow.getChildZoomWindow();
            if(zoomWindow) {
                // Scale to the initial zoom level. We can just explode that image for any further zooming.
                zoomScale = zoomWindow.initialZoomLevel / 100;
            }
        }
        return zoomScale;
    },
    
    onScaledCanvasRendered : function(scaledCanvas) {
        if(AssistController.screenShareWindow) {
            var zoomWindow = AssistController.screenShareWindow.getChildZoomWindow();
            if(zoomWindow) {
                zoomWindow.refreshImage(scaledCanvas, true);
            }
        }
    },

    ChangedInputMonitor: function() {
        var initialValuesOfElements = new Map();

        return {
            getChangedInputElements: function(inputElements) {
                var changedInputs = [];

                inputElements.forEach(function(inputElement) {
                    var initialValue = initialValuesOfElements.get(inputElement);
                    if (initialValue == null || initialValue !== inputElement.value) {
                        changedInputs.push(inputElement);
                        initialValuesOfElements.set(inputElement, inputElement.value);
                    }
                });

                return changedInputs;
            },
            setInitialStateOfElements: function(inputElements) {
                inputElements.forEach(function(inputElement) {
                    initialValuesOfElements.set(inputElement, inputElement.value);
                });
            }
        }
    }(),

    partialParseAndRender: function(config, partialParseElements) {
        if (imagePreloader) {
            imagePreloader({
                complete: function(replicationImages) {
                    for (var elementIdx = 0; elementIdx < partialParseElements.length; elementIdx++) {
                        var partialParseElement = partialParseElements[elementIdx];
                        var stack = getStackFromParsedNodeQueue(partialParseElement);

                        if (!stack || stack.redacted) {
                            continue;
                        }

                        var parentStack = getStackFromParsedNodeQueue(partialParseElement.parentNode);

                        config.elements = [partialParseElement];
                        config.parentStack = parentStack;
                        config.isSubParse = true;

                        var subParse = parser(replicationImages, config);

                        var subStack = subParse.stack;
                        var subElementContexts = subParse.elementContexts;


                        for (var key in subStack) {
                            stack[key] = subStack[key];
                        }

                        //Update the element contexts map with the new contexts from the sub-render
                        subElementContexts.forEach(function(stack, elementKey) {
                            if (elementKey !== partialParseElement) {
                                previousReplicationRenderQueue.elementContexts.set(elementKey, stack);
                            }
                        });
                    }

                    config.onparsed();

                    config.elements = [AssistController.sourceWindow.document.body];
                    var renderResult = renderer( previousReplicationRenderQueue , config);

                    config.onrendered(renderResult.canvas, errorList);

                    if (config.scale && renderResult.scaledCanvas && typeof config.onScaledCanvasRendered === "function") {
                      config.onScaledCanvasRendered(renderResult.scaledCanvas);
                    }
                }
            });
        }
    },

    capture : function(config) {
        try {
            if (AssistController.screenShareTopic) {
                
                config.assistPermissions = {
                    callback: hasPermissionToView,
                    definitions: getCommonAgentViewablePermissions() // agents can't join mid-screenshot, so this should be accurate for this screenshot
                };

                var partialParseElements = config.partialParseElements;
                if (partialParseElements && partialParseElements.length > 0) {
                    var listenedInputElements = AssistInputManager.getListenedInputElements();
                    var changedInputElementsToParse = AssistController.ChangedInputMonitor.getChangedInputElements(listenedInputElements);
                    AssistUtils.mergeUnique(partialParseElements, changedInputElementsToParse);
                    AssistUtils.removeDuplicateNestedNodes(partialParseElements);

                    assistLogger.log("Partial capture screen and send (" + partialParseElements.length + " element(s))");
                    AssistController.partialParseAndRender(config, partialParseElements);
                }
                else {
                    assistLogger.log("Capture screen and send");
                    var listenedInputElements = AssistInputManager.getListenedInputElements();
                    AssistController.ChangedInputMonitor.setInitialStateOfElements(listenedInputElements);
                    var html2CanvasInstance = window.html2canvas(AssistController.sourceWindow.document.body, config);
                    parser = html2CanvasInstance.parse;
                    renderer = html2CanvasInstance.render;
                    imagePreloader = html2CanvasInstance.preload;
                    errorList = html2CanvasInstance.errorList;
                }

            } else {
                AssistController.setScreenshotInProgress(false);
            }
            
        } catch(e) {
            assistLogger.log(e);
            AssistController.setScreenshotInProgress(false);
        }

    },

    updateScreen : function(force, partialParseElements) {
        
        if (window == null) {
            //The connection window has already been closed; can't send the screen
            return;
        }
        if ((typeof AssistController.sourceWindow === 'undefined') || !AssistController.sourceWindow ||
            (typeof AssistController.sourceWindow.document === 'undefined') || !AssistController.sourceWindow.document) {
            // counter slow-page race.
            return;
        }
        if (AssistController.cobrowsePaused) {
            if (force) {
                AssistController.forceUpdateOnUnpause = true;
                if (AssistController.screenShareWindow) {
                    AssistController.screenShareWindow.sendSizeAndPosition();
                }
            }
            // Co-browsing is paused, don't send an update now
            return;
        }
        force = force || AssistController.forceUpdateOnUnpause;
        AssistController.forceUpdateOnUnpause = false;
        if (AssistController.isScreenshotInProgress() == false) {
            AssistController.setScreenshotInProgress(true);
        } else {
            /* if html2canvas does anything async then without mutual exclusion on html2canvas we 
            could end up having multiple overlapping html2canvas calls. This could lead to incorrect 
            state for isScreenshotInProgress, leading us to potentially change an agent's permission to
            allowed mid-screenshot (and thus potentially sending the new screenshot with permissions
            targetted for looser agent permissions). */
            AssistController.pendingScreenshot = { 
                force: force || (AssistController.pendingScreenshot && AssistController.pendingScreenshot.force)
            };
            return;
        }

        if (observer != undefined) {
            if (observer != null) {
                try {
                    observer.disconnect();
                } catch(e) {}
            }
        }
        AssistController.TransitionListener.detach();

        var currentWindowDimensions = getWindowDimensions(AssistController.sourceWindow);
        var previousWindowDimensions = {width: AssistController.fullWidth, height: AssistController.fullHeight};

        var currentScrollPositions = getScrollPositions(AssistController.sourceWindow);
        var previousScrollPositions = {scrollX: AssistController.scrollX, scrollY: AssistController.scrollY};

        if (AssistController.hasScrolled(previousScrollPositions, currentScrollPositions) ||
            AssistController.hasResized(previousWindowDimensions, currentWindowDimensions)) {

            var header = new Int16Array(1);
            header[0] = INPUT_ELEMENTS_MOVED;

            if (AssistController.inputTopic) {
                AssistController.inputTopic.sendMessage(header);
            }

            AssistController.scrollY = currentScrollPositions.scrollY;
            AssistController.scrollX = currentScrollPositions.scrollX;
            AssistController.fullWidth = currentWindowDimensions.width;
            AssistController.fullHeight = currentWindowDimensions.height;
        }

        var ignoredElementsIds = [];

        if (AssistController.config.trace()) {
            var startDate = new Date();
        }

        AssistController.capture({
            partialParseElements: partialParseElements,
            onparsed: function(queue) {
                if (queue) {
                    previousReplicationRenderQueue = queue;
                }
0
                if (AssistController.screenShareWindow) {
                    AssistController.scheduleObserver();
                    AssistController.TransitionListener.attach();
                }
            },
            onrendered : function(canvas, errorList) {
                errorList.forEach(function (error){
                    var code_string = 'PARSE_FAILURE';
                    var code = AssistController.sourceWindow.AssistSDK.getErrorCodes().PARSE_FAILURE;
                    if (error.type == 2) {
                        code_string = 'RENDER_FAILURE';
                        code = AssistController.sourceWindow.AssistSDK.getErrorCodes().RENDER_FAILURE;
                    }
                    AssistController.doError(code_string, {code: code, message: error.message, context: error.context, exception: error.ex});
                });
                if (AssistController.config.trace()) {
                    var endDate   = new Date();
                    var ms = (endDate.getTime() - startDate.getTime());
                    assistLogger.log("Capturing took: " + ms + "ms");
                }
                AssistController.setScreenshotInProgress(false);
                if (AssistController.screenShareWindow) {
                 // In the case when a banner is added, a flag is set to indicate that the very next update MUST trigger
                    // a forced change.
                    var actualForce = force;
                    if (AssistController.forceNextChange) {
                    	actualForce = true;
                    	AssistController.forceNextChange = false;
                    }
                    setTimeout(function() {
                        AssistController.screenShareWindow.contentChanged(canvas, actualForce);
                    });
                }
            },
            width: AssistController.fullWidth,
            height: AssistController.fullHeight,
            useCORS: true,
            ignoredElementCallback: function(element) {
                
                if (element.nodeName == "IFRAME") {
                    assistLogger.log("posting capture to iframe"); 
                    AssistIFrameCaptureHandler.addIFrame(element);
                }
            },
            iframeCacheCallback: function(element) {
                return AssistIFrameCaptureHandler.getCachedImg(element);
            },
            scale: AssistController.getZoomScale(),
            onScaledCanvasRendered : AssistController.onScaledCanvasRendered
        });
    },

    hasScrolled: function(previousScrollPositions, newScrollPositions) {
        return (previousScrollPositions.scrollX !== newScrollPositions.scrollX ||
                previousScrollPositions.scrollY !== newScrollPositions.scrollY);
    },

    hasResized: function(previousWindowDimensions, newWindowDimensions) {
        return (previousWindowDimensions.width !== newWindowDimensions.width ||
                previousWindowDimensions.height !== newWindowDimensions.height);
    },

    scheduleObserver : function() {
        var uiChangingHtmlAttributes = ["class", "style", "src", "rows", "cols", "disabled",
                                    "width", "height", "hidden", "placeholder", "shape",
                                    "span", "srcdoc", "type", "value", "d", "transform"];

        // configuration of the observer:
        var config = {
            attributes : true,
            childList : true,
            characterData : true,
            subtree : true,
            attributeFilter: uiChangingHtmlAttributes
        };

        var isChildOf = function(candidateChild, candidateParent) {
            var parentNode = candidateChild.parentNode;
            if (parentNode) {
                if (parentNode == candidateParent) {
                    return true;
                } else {
                    return isChildOf(parentNode, candidateParent);
                }
            } else {
                return false;
            }
        };

        function hasOwnStackingContext(element) {
            if (!element) {
                return false;
            }

            var computedStyle = element.ownerDocument.defaultView.getComputedStyle(element),
                isPositioned = computedStyle["position"] !== 'static',
                zIndex = isPositioned ? computedStyle["z-index"] : 'auto',
                opacity = computedStyle['opacity'],
                hasTransformation = computedStyle['transform'] !== 'none';

            return (zIndex !== 'auto' || opacity < 1 || hasTransformation);
        };

        function getPartialParseRootNodeOfElement(element) {
            if (!element) {
                return null;
            }

            if (element.nodeType === element.TEXT_NODE || element.nodeName.toUpperCase() === "SVG") {
                return getPartialParseRootNodeOfElement(element.parentNode);
            }

            if (element.nodeName.toUpperCase() === "BODY") {
                return element;
            }

            if (element.style.display === "none") {
                return null;
            }

            if (element.nearestViewportElement) {
                return getPartialParseRootNodeOfElement(element.nearestViewportElement);
            }

            if (hasOwnStackingContext(element)) {
                return element;
            }

            return getPartialParseRootNodeOfElement(element.offsetParent);
        };

        var HighRerenderingThrottler = function() {
            //How many times per second that the element changes before we decide to throttle it
            var CHANGES_PER_SECOND_LIMIT = 10;
            //Duration of time to throttle an element after it is seen to have mutated over the CHANGES_PER_SECOND_LIMIT
            var THROTTLE_TIME = 5000;

            var elementChangeCounters = new Map();
            var highMutationsPerSecondElements = [];

            function setThrottleTimerForElement(element) {
                setTimeout(function() {
                    highMutationsPerSecondElements.splice(highMutationsPerSecondElements.indexOf(element), 1);
                }, THROTTLE_TIME);
            };

            function setChangesPerSecondTimerForElement(element) {
                var ONE_SECOND = 1000;

                setTimeout(function() {
                    var changesPerSecond = elementChangeCounters.get(element);
                    elementChangeCounters.delete(element);

                    if (changesPerSecond > CHANGES_PER_SECOND_LIMIT) {
                        highMutationsPerSecondElements.push(element);
                        setThrottleTimerForElement(element);
                    }
                    else {
                        highMutationsPerSecondElements.splice(highMutationsPerSecondElements.indexOf(element), 1);
                    }
                }, ONE_SECOND);
            };

            return {
                updateElementRerenderRequestCount: function(element) {
                    var elementChangeCount = elementChangeCounters.get(element);
                    elementChangeCount = (elementChangeCount) ? ++elementChangeCount : 1;
                    elementChangeCounters.set(element, elementChangeCount);

                    if (elementChangeCount === 1) {
                        setChangesPerSecondTimerForElement(element);
                    }
                },
                shouldThrottle: function(element) {
                    return (highMutationsPerSecondElements.indexOf(element) > -1);
                }
            }
        }();


        if (observer == null || typeof observer === 'undefined') {
            assistLogger.log("init observer");

            var partialParseRootNodes = [];

            observer = new MutationObserver(function(mutations) {
                var recheckForms = false;
                var rerender = true;
                for (var i = 0; i < mutations.length; i++) {
                    var mutation = mutations[i];

                    var blacklist = AssistController.config.getMutationBlacklist();
                    if (blacklist.includes(mutation.target.id)) {
                        rerender = false;
                        break;
                    }
                    if (mutation.target == AssistController.glassPane || isChildOf(mutation.target, AssistController.glassPane)) {
                        rerender = false;
                        observer.takeRecords();
                        break;
                    }

                    if (AssistController.ScreenshotQueue.mutatingNode === mutation.target || HighRerenderingThrottler.shouldThrottle(mutation.target)) {
                        rerender = false;
                        break;
                    }

                    HighRerenderingThrottler.updateElementRerenderRequestCount(mutation.target);

                    var stack = getStackFromParsedNodeQueue(mutation.target);
                    if (stack) {
                        var partialParseRootNode = getPartialParseRootNodeOfElement(mutation.target);

                        if (partialParseRootNode && partialParseRootNodes.indexOf(partialParseRootNode) === -1) {
                            partialParseRootNodes.push(partialParseRootNode);
                        }
                    }

                    if (AssistUtils.isFormElement(mutation.target) ||
                        AssistUtils.hasFormElement(mutation.target)) {
                        recheckForms = true;
                    }

                    if (mutation.attributeName == "data-assist-permission") {
                        recheckForms = true;
                    }

                    for (var j = 0; (j < mutation.addedNodes.length) && !recheckForms; j++) {
                        if (AssistUtils.isFormElement(mutation.addedNodes[j])) {
                            recheckForms = true;
                        }
                    }
                     for (var j = 0; (j < mutation.removedNodes.length) && !recheckForms; j++) {
                        if (AssistUtils.isFormElement(mutation.removedNodes[j])) {
                            recheckForms = true;
                        }
                    }
                }

                if (rerender == true) {
                    AssistController.ScreenshotQueue.resetScreenshotQueueTimeout();
                    assistLogger.log("do rerender (mutations)");
                    AssistController.ScreenshotQueue.mutatingNode = mutation.target;
                    AssistController.ScreenshotQueue.queueScreenshot(500, false, partialParseRootNodes);
                    partialParseRootNodes = [];
                    if (recheckForms) {
                        if (AssistController.isOnAssistPages && AssistController.screenShareAllowed) {
                            AssistInputManager.mapInputElements(AssistController.sourceWindow.document);
                        }
                    }
                }
            });
        }

        assistLogger.log("scheduling observer");
        // pass in the target node, as well as the observer options
        try {
            observer.observe(AssistController.sourceWindow.document.body, config);
        } catch(e) {
            AssistController.doError('ERROR_OBSERVER_FAILED', {error: e});
        }
    },

    registerScrollListeners : function() {
        var eventTarget;
        var $ = AssistController.jQuery;
        var document = AssistController.sourceWindow.document;
        var window = AssistController.sourceWindow;
        var scroll = "scroll";
        var ns = ".assist";
        var scrollX = -1;
        var scrollY = -1;

        function doRender(event) {
            assistLogger.log("do rerender (listeners)");
            AssistController.ScreenshotQueue.resetScreenshotQueueTimeout();
            AssistController.ScreenshotQueue.queueScreenshot(750);
        }

        function documentScrollCallback(event) {
        	assistLogger.log("In documentScrollCallback()");
            if (event.target == document || event.target == document.body) {
                var newScrollX = window.pageXOffset;
                var newScrollY = window.pageYOffset;

                // this is all a hack to figure out whether the scroll is legitimate or triggered
                // by html2canvas, in which case, the sum scroll will be 0 (without this we loop)
                if (scrollX != newScrollX || scrollY != newScrollY) {
                    scrollX = newScrollX;
                    scrollY = newScrollY;
                    doRender(event);
                }

                assistLogger.log("Clearing annotations...");
                AssistController.clearAnnotations();
            }
        }

        function mousewheelScroll(event) {
            if (AssistController.glassPane.contains(event.target)) {
                return;
            }

            if (event.target !== document && event.target !== document.body) {
                doRender(event);
            }
        }

        function keyDown(event) {
            switch (event.which) {
                case 33: // page up
                case 34: // page down
                case 37: // left
                case 38: // up
                case 39: // right
                case 40: // down
                    doRender(event);
                    return;
                default: return;
            }
        }

        function mouseDown(event) {
            eventTarget = event.target;
            if (event.target !== document && event.target !== document.body) {
                $(eventTarget).on(scroll + ns, function(event) {
                    //$(eventTarget).off(ns);
                    doRender(event);
                });
            }
        }

        function mouseUp(event) {
            $(eventTarget).off(ns);
        }

        $(document).scroll(documentScrollCallback);
        $(document.body).on("mousewheel DOMMouseScroll", mousewheelScroll);
        $(document.body).keydown(keyDown);
        $(document.body).mousedown(mouseDown);
        $(document.body).mouseup(mouseUp);

        (function prepareCleanUp() {
            function doCleanUp() {
                $(document).off("scroll", documentScrollCallback);
                $(document.body).off("mousewheel DOMMouseScroll", mousewheelScroll);
                $(document.body).off("keydown", keyDown);
                $(document.body).off("mousedown", mouseDown);
                $(document.body).off("mouseup", mouseUp);
                $(eventTarget).off(ns);
                AssistController.ScreenshotQueue.resetScreenshotQueueTimeout();
            }

            AssistController.cleanUpStack.push(doCleanUp);
        })();

    },

    TransitionListener: function() {
        var transitionEvent = (function() {
        var t;
        var el = document.createElement('fakeelement');
        var transitions = {
            'transition':'transitionend',
            'OTransition':'oTransitionEnd',
            'MozTransition':'transitionend',
            'WebkitTransition':'webkitTransitionEnd'
        }

        for(t in transitions){
            if( el.style[t] !== undefined ){
                return transitions[t];
            }
        }
        })();

        function transitionEventHandler(event) {
            AssistController.ScreenshotQueue.resetScreenshotQueueTimeout();
            assistLogger.log("do rerender (transition completed)");
            AssistController.ScreenshotQueue.queueScreenshot(750, false);
        }

        return {
            attach: function() {
                if (transitionEvent) {
                    AssistController.sourceWindow.document.addEventListener(transitionEvent, transitionEventHandler);
                }
            },
            detach: function() {
                AssistController.sourceWindow.document.removeEventListener(transitionEvent, transitionEventHandler);
            }
        };
    }(),

    createGlassPane : function() {
        AssistController.jQuery = jQuery;
 
        AssistController.glassPane = AssistController.sourceWindow.document.getElementById("glass-pane");

        if (!AssistController.glassPane) {
            AssistController.glassPane = AssistController.sourceWindow.document.createElement("div");
            AssistController.glassPane.id = "glass-pane";
            AssistController.glassPane.className = "assist-show-glass-pane";
            AssistController.glassPane.style.display = "none";
            AssistController.glassPane.setAttribute("data-html2canvas-ignore", "true");
            assistLogger.log("Creating glass pane");
            AssistController.sourceWindow.document.body.appendChild(AssistController.glassPane);
        }
        
        AssistController.scheduleObserver();
        AssistController.registerScrollListeners();
        
        function resizeUpdate() {
            AssistController.handleWindowResize();
            AssistController.ScreenshotQueue.resetScreenshotQueueTimeout();
            assistLogger.log("do rerender (resize)");
            AssistController.ScreenshotQueue.queueScreenshot();
        }

        // TODO: this might trigger two canvas renders when we only really want one (plus the window render)
        AssistController.sourceWindow.addEventListener("resize", resizeUpdate, false);
        AssistController.TransitionListener.attach();

        function whichAnimationEvent(){
            var t;
            var el = document.createElement('fakeelement');
            var transitions = {
                'animation':'animationend',
                'OAnimation':'oAnimationEnd',
                'MozAnimation':'animationend',
                'WebkitAnimation':'webkitAnimationEnd'
            }

            for(t in transitions){
                if( el.style[t] !== undefined ){
                    return transitions[t];
                }
            }
        }
        var animationEvent = whichAnimationEvent();
        animationEvent && AssistController.sourceWindow.document.addEventListener(animationEvent, function() {
            assistLogger.log('CSS animation completed.');
            AssistController.ScreenshotQueue.queueScreenshot();
        });


        ;(function prepareCleanUp() {
            function doCleanUp() {
                AssistController.sourceWindow.removeEventListener("resize", resizeUpdate, false);
            }

            AssistController.cleanUpStack.push(doCleanUp);
        })();
        
        (function loadCSS() {

            //Define the default masking color.  This is defined in an inline stylesheet so
            //that it takes effect immediately, rather than having to wait for an external
            //file to load.
            if (!AssistController.sourceWindow.document.getElementById("assist-no-show-agent-console-css")) {
                var headElem = AssistController.sourceWindow.document.getElementsByTagName("head")[0];
                var styleElem = AssistController.sourceWindow.document.createElement("style");
                styleElem.id = "assist-no-show-agent-console-css";
                var css = ".assist-no-show-agent-console { color: " + DEFAULT_MASKING_COLOR + "; }";
                if (styleElem.styleSheet) {
                    styleElem.styleSheet.cssText = css;
                } else {
                    styleElem.appendChild(AssistController.sourceWindow.document.createTextNode(css));
                }
                var firstChild = headElem.firstChild;
                if (firstChild == null) {
                    headElem.appendChild(styleElem);
                } else {
                    headElem.insertBefore(styleElem, firstChild);
                }
            }

            AssistUtils.loadCSS(AssistController.sourceWindow.document, AssistUtils.getSdkPath() + "css/assist.css", "ASSIST-CSS");
            AssistUtils.loadCSS(AssistController.sourceWindow.document, AssistUtils.getSdkPath() + "../shared/css/shared-window.css", "assist-sw-css");
            if (typeof i18n !== "undefined" && i18n !== null && AssistUtils.isRTL(i18n.lng())) {
                AssistUtils.loadCSS(AssistController.sourceWindow.document, AssistUtils.getSdkPath() + "css/rtl.css", "assist-rtl-css");
                AssistUtils.loadCSS(AssistController.sourceWindow.document, AssistUtils.getSdkPath() + "../shared/css/shared-window-rtl.css", "assist-sw-rtl-css");
            }
        })();
        
        return AssistController.glassPane;
    },
    
    handleWindowResize : function() {
    	//Make sure agent window is within bounds.
        if (AssistController.screenShareWindow) {
            for (var i = 0; i < AssistController.screenShareWindow.children.length; i++) {
                var win = AssistController.screenShareWindow.children[i];
                if (win.metadata.moveable) {
                    win.adjustPosition(0, 0);
                }
            }
        }
    },

    sendOffAssistPagesMessage : function() {
        var offAssistMessage = new Int16Array(1);
        offAssistMessage[0] = OFF_ASSIST_MESSAGE;
        AssistController.screenShareTopic.sendMessage(offAssistMessage);
    },

    sendOnAssistPagesMessage : function() {
    	var onAssistMessage = new Int16Array(1);
    	onAssistMessage[0] = ON_ASSIST_MESSAGE;
    	AssistController.screenShareTopic.sendMessage(onAssistMessage);
    },

    sendConsumerEndSupportMessage : function() {
        var endSupportMessage =  {type:"consumerEndedSupport"};
        var messageString = stringifyAndEscape(endSupportMessage);
        var messageBytes = new Uint8Array(messageString.length);

        for (var i = 0; i < messageString.length; i++) {
            messageBytes[i] = messageString.charCodeAt(i);
        }
       	AssistController.rootTopic.sendMessage(messageBytes);  
    },

    connectWithVoiceVideo : function(configuration) {

        var glassPane = AssistController.createGlassPane();
        var localWindow = window;
        
        // long-winded way to make sure the click listener is attached to the page not the popup in IE
        // or it gets garbage collected when the popup dies and the modal is still visible (OK button doesn't work)
        var elementsToRemove = [];
        AssistController.sourceWindow.document.addEventListener("click", function(event) {
            for (var i = elementsToRemove.length - 1; i >= 0; i--) {
                if (elementsToRemove[i].clickElement == event.target) {
                    var elementToRemove = elementsToRemove[i].clickElement.ownerDocument.getElementById(elementsToRemove[i].elementToRemoveId);
                    if (elementToRemove && elementToRemove.parentNode) {
                        elementToRemove.parentNode.removeChild(elementToRemove);
                    }
                    elementsToRemove.splice(i, 1);
                }
            }
        }, false);
        
        var AssistControllerInterface = {
            removeOnClick: function(clickElement, elementToRemoveId) {
                elementsToRemove.push({ "clickElement": clickElement, "elementToRemoveId": elementToRemoveId });
            },
            endSupport: AssistController.endSupport,
            doError: AssistController.doError,
            getSessionCreationFailureCode: AssistController.getSessionCreationFailureCode
        };
        
        AssistPopup.CSDK.checkInitRun(function (initRun) {
            if (initRun == true) { // subsequent page/reconnect with csdk path
                assistLogger.log("reconnect csdk");
                AssistPopup.CSDK.reconnect(AssistUtils, AssistController.sourceWindow, AssistControllerInterface, onAgentVideoWindowCreated);
                AssistController.connectWebSocket(configuration);
                
            } else { // initial page/init with csdk path
                AssistPopup.CSDK.init(AssistUtils, AssistController.sourceWindow, AssistControllerInterface, onAgentVideoWindowCreated,
                    function onInCall(returnConfig) { // callback
                        if (returnConfig) {
                            configuration = new Config(returnConfig);
                        }
                        AssistController.connectWebSocket(configuration);
                    }
                );
            }
        });
        
        function onAgentVideoWindowCreated(agentVideoWindow) { // callback
            AssistController.supportDiv = agentVideoWindow;
            glassPane.appendChild(AssistController.supportDiv);
            
            // temp dummy shared window to make draggable before connect web socket
            AssistController.screenShareWindow = new HostSharedWindow(new AssistUtils.fakeTopic(), glassPane);
            AssistController.screenShareWindow.shareSubWindow(AssistController.supportDiv, { 
                moveable: true,
                name:"draggable-agent-window",
                mustRemainVisiblePixels: 90,
                mustRemainVisibleBottomPixels: 120
            }, function() {}, configuration.getScaleFactor());
        }

        // return focus to the original window
        AssistController.sourceWindow.focus();
    },
       
    connectCobrowseOnly : function(configuration) {
        
        // create the UI in the actual window being supported
        AssistController.createGlassPane();
        AssistController.connectWebSocket(configuration);
    },

    doSDKCallback : function(callbackName, defaultImpl, args) {
    	try {
    		if (AssistController.sourceWindow.AssistSDK[callbackName]) {
    			return AssistController.sourceWindow.AssistSDK[callbackName].apply(this, args);
    		} else {
    			if (defaultImpl) {
    				return defaultImpl.apply(this, args);
    			}
    		}
    	} catch (e) {
    		var errorMessage = "Error thrown in callback " + callbackName + ": " + e;
            assistLogger.log(e);
    		return undefined;
    	}
    },
    
    promptToAllowScreenShare: function () {
        var screenshareAllowed = AssistController.doSDKCallback("onScreenshareRequest", function() {
            return AssistController.sourceWindow.confirm(i18n.t("assistI18n:notice.promptToAllowScreenShare"));
        });
        if (screenshareAllowed === undefined)
        	screenshareAllowed = false;
        return screenshareAllowed;
    },

    connectWebSocket : function(configuration) {
        assistLogger.log("In connectWebSocket()");
        AssistController.screenShareAllowed = configuration.isScreenShareAllowed();
        assistLogger.log(configuration.getUrl());
        assistLogger.log(configuration.getCorrelationId());
        AssistAED.setConfig({ "url" : configuration.getUrl() });
        AssistAED.connectRootTopic(configuration.getCorrelationId(), function(rootTopic) {
            // Add the screen share subtopic
            AssistController.rootTopic = rootTopic;

            delete AssistController.screenShareTopic;
            rootTopic.connectionReestablished = function() {
              if (!AssistController.screenShareTopic) {
                  AssistController.startScreenShare(configuration);
              }
            };
            AssistController.startScreenShare(configuration);

            rootTopic.participantJoined = function(newParticipant) {
                if (newParticipant.metadata.role == "agent") {
                    AssistController.doSDKCallback("onAgentJoinedSession", function(agent){
                        // TODO should we check that all the relevant callbacks are overridden?
                        if (AssistController.screenShareAllowed) {
                            AssistController.allowCobrowseForAgent(agent);
                        }
                    }, [new Agent(newParticipant)]);
                    if (typeof window["AssistPopup"] !== 'undefined') {
                        AssistPopup.CSDK.setAgentName(newParticipant.metadata.name);
                        AssistPopup.CSDK.setAgentPicture(newParticipant.metadata.avatar);
                    }
                    var participants = rootTopic.participants;
                    var firstAgent = true;
                    for (var i = 0; i < participants.length; i++) {
                        if (participants[i] != newParticipant && participants[i].metadata.role == "agent") {
                            firstAgent = false;
                            break;
                        }
                    }
                }
            };

            rootTopic.participantLeft = function(removedParticipant) {
                if (removedParticipant.metadata.role == "agent") {
                    AssistController.doSDKCallback("onAgentLeftSession", function (agent) {
                        // TODO should we check that all the relevant callbacks are overridden?
                        // This will generally be redundant, but if an agent joins the root topic and is given co-browse permission automatically
                        // then we need to remove that permission when they leave in case they never joined/left the co-browse
                        AssistController.disallowCobrowseForAgent(agent);
                    }, [new Agent(removedParticipant)]);
                }
            };

            // Listen for pushed urls and zoom messages
            rootTopic.messageReceived = function(source, messageBytes) {
                var messageString = String.fromCharCode.apply(null, messageBytes);
                var message = unescapeAndParse(messageString);
                switch (message.type) {
                    case "url":
                        if (!AssistController.cobrowsePaused) {
                            AssistController.sourceWindow.location.href = message.url;
                        }
                        break;
                    case "startZoom":
                        AssistController.startZoom();
                        break;
                    case "endZoom":
                        AssistController.endZoom();
                        break;
                }
            };
            
            rootTopic.connectionLost = function() {
            	assistLogger.log("Cobrowse connection permanently lost.");
                if (pageHasCobrowsingClass() == true) {
                	AssistController.doSDKCallback("onCobrowseInactive", defaultOnCobrowseInactive);
                	removeCobrowsingClass();
                }
            };
            
            if (configuration.isScreenShareAllowed() == false) { // cobrowse hasn't been accepted yet, so this is first time websocket is connected
                AssistController.doSDKCallback("onConnectionEstablished");
            }
            // TODO This will only be called when screenShareAllowed is set, and that can only happen when the agent
            // joined/left/requested co-browse callbacks have not been overridden. But ideally this code would be elsewhere
            if (AssistController.screenShareAllowed) {
                assistLogger.log("on in support");
                AssistController.doSDKCallback("onInSupport");
            }
        }, configuration.getSessionToken());
   },
   
   rejectScreenShare : function() {
	    var rejectCobrowseMsg =  {type:"rejectScreenShare"};
   		var messageString = stringifyAndEscape(rejectCobrowseMsg);
   		var messageBytes = new Uint8Array(messageString.length);
   		
   		for (var i = 0; i < messageString.length; i++) {
          messageBytes[i] = messageString.charCodeAt(i);
   		}
       	AssistController.rootTopic.sendMessage(messageBytes);  
   },

   defaultOnPushRequest : function(allow, deny) {
	   var result = AssistController.sourceWindow.confirm(i18n.t("assistI18n:notice.promptToAllowPushedDocument"));
	   if (result)
		   allow();
	   else
		   deny();
   },
      
   startScreenShare : function(configuration, initialPermissions) {
       // TODO we might be OK to remove this now
        function unmoveChildren(parent) {
            while( parent.children.length > 0) {
                var sub = parent.children.pop();
                unmoveChildren(sub);
                sub.removeElementEventListeners();
                if (sub.metadata.moveable) {
                    sub.element.classList.remove("moveable");
                    $(sub.element).find('div.move-handle').remove();
                    sub.moveHandle = undefined;
                }
            }
        }

        AssistController.rootTopic.openPrivateSubtopic({"type":"shared-window", "interactive":"true", "scrollable":"true"}, function(newTopic) {
            var glassPaneContainerDiv = AssistController.glassPane;
            AssistController.inputTopic = null;
            
            if (AssistController.screenShareWindow) {            
                unmoveChildren(AssistController.screenShareWindow);
                AssistController.screenShareWindow.removeElementEventListeners();
                AssistController.screenShareWindow = null;
                AssistController.screenShareTopic = null;
                AssistController.videoWindow = null;
            }
                
            AssistController.screenShareWindow = 
                new HostSharedWindow(newTopic, glassPaneContainerDiv, undefined, undefined, undefined, agentHasPermissionToInteract);
                
            AssistController.screenShareWindow.setZoomStartedCallback(function() {
                   AssistController.doSDKCallback("onZoomStarted", function() {
                        assistLogger.log("Zoom started");
                   });
               });
            AssistController.screenShareWindow.setZoomEndedCallback(function() {
                   AssistController.doSDKCallback("onZoomEnded", function() {
                        assistLogger.log("Zoom ended");
                   });
               });

            AssistController.screenShareWindow.setImageQualityScaleFactor(AssistController.config.getScaleFactor());
            AssistController.screenShareWindow.setPushRequestCallback(function(allow, deny) {
            	return AssistController.doSDKCallback("onPushRequest", AssistController.defaultOnPushRequest, 
            			[allow, deny]);
            });
            AssistController.screenShareWindow.setDocumentReceivedSuccessCallback(function(item) {
            	return AssistController.doSDKCallback("onDocumentReceivedSuccess", null, [item]);
            });
            AssistController.screenShareWindow.setDocumentReceivedErrorCallback(function(item) {
            	return AssistController.doSDKCallback("onDocumentReceivedError", null, [item]);
            });
            AssistController.screenShareWindow.setAnnotationAddedCallback(function(item, sourceName) {
            	return AssistController.doSDKCallback("onAnnotationAdded", null, [item, sourceName]);
            });
            AssistController.screenShareWindow.setAnnotationsClearedCallback(function(item) {
            	return AssistController.doSDKCallback("onAnnotationsCleared", null, [item]);
            });
            
            
            AssistController.screenShareTopic = newTopic;

            newTopic.permissionChanged = function(participant, newPermission) {
                if (participant.metadata.role == "agent"
                && newPermission == AssistAED.PERMISSIONS.REQUESTED) {
                    // call back to the SDK to say an agent has requested cobrowse
                    AssistController.doSDKCallback("onAgentRequestedCobrowse", function(agent){
                        if (!AssistController.screenShareAllowed) {
                            AssistController.screenShareAllowed = AssistController.promptToAllowScreenShare()
                        }
                        if (AssistController.screenShareAllowed) {
                            AssistController.allowScreenShare(configuration);
                        } else {
                            AssistController.screenShareTopic.updatePermission(AssistAED.PERMISSIONS.DENIED, agent);
                            AssistController.screenShareTopic.updatePermission(AssistAED.PERMISSIONS.NONE, agent);
                        }

                    }, [new Agent(participant)]);
                }
            };

            newTopic.participantJoined = function(newScreenParticipant) {
            	AssistController.forceNextChange = true;
           	 	// Do co-browse active callback if new participant is first agent.
            	if (!AssistController.sourceWindow.document.body.classList.contains("assist-cobrowsing") && (newScreenParticipant.metadata.role == "agent")) {
                   AssistController.doSDKCallback("onCobrowseActive", defaultOnCobrowseActive);
                   addCobrowsingClass();
                   AssistInputManager.mapInputElements(AssistController.sourceWindow.document.body);
            	}

                if (!AssistController.cobrowsingBanner) {
                    AssistController.cobrowsingBanner = AssistController.sourceWindow.document.getElementById("default-cobrowsing");
                }

                if (newScreenParticipant.metadata.role == "agent") {
                    AssistController.doSDKCallback("onAgentJoinedCobrowse", function (agent) {
                        // TODO should we check that all the relevant callbacks are overridden?
                        // Do nothing by default
                    }, [new Agent(newScreenParticipant)]);
                    
                    // A new participant joined, send a resize event with the current size and a full screen refresh
                    // force the sending of a resized event and a full refresh
                    assistLogger.log("do rerender (new participant), count= " + AssistController.screenShareTopic.participants.length);
                    AssistController.screenShareWindow.sendSizeAndPosition();
                    AssistController.ScreenshotQueue.queueScreenshot(1, true);
                }
               
                if (AssistController.isOnAssistPages && !AssistController.cobrowsePaused) {
                    AssistController.sendOnAssistPagesMessage();
                } else {
                    AssistController.sendOffAssistPagesMessage();
                }
            };
            newTopic.participantLeft = function(removedParticipant) {
                var currentAgents = currentNumberOfCobrowsingAgents();
                assistLogger.log("Participant left, remaining= " + AssistController.screenShareTopic.participants.length);
                AssistController.disallowCobrowseForAgent(removedParticipant);
                if (removedParticipant.metadata.role == "agent") {
                    AssistController.doSDKCallback("onAgentLeftCobrowse", function (agent) {
                        // TODO should we check that all the relevant callbacks are overridden?
                        // Do nothing by default
                    }, [new Agent(removedParticipant)]);
                }

                // Do co-browse inactive callback if no more agents.
                if ((currentAgents == 0) && AssistController.sourceWindow.document.body.classList.contains("assist-cobrowsing")) {
                    AssistController.doSDKCallback("onCobrowseInactive", defaultOnCobrowseInactive);
                    removeCobrowsingClass();
                }
           };
            
            if (AssistController.supportDiv) {
                var scaleFactor = AssistController.config.getScaleFactor();
                assistLogger.log("Creating draggable-agent-window (2) with scaleFactor: " + scaleFactor);
                AssistController.screenShareWindow.shareSubWindow(AssistController.supportDiv, {moveable: true, name:"draggable-agent-window", mustRemainVisiblePixels: 90, mustRemainVisibleBottomPixels: 120
                    //                    , resizeable: true, maintainAspect: true
                }, function(newWindow, newSubtopic) {
                    AssistController.videoWindow = newWindow;
                    
                    newSubtopic.participantJoined = function(newVideoParticipant) {
                        AssistController.videoWindow.sendSizeAndPosition();
                        AssistController.videoWindow.refreshContent(true);
                    };
                }, scaleFactor);
            }

            // Look for and transmit form data
            AssistInputManager.mapInputElements(AssistController.sourceWindow.document.body);

            // Open sub-topic for scrollbar visibility
            AssistController.screenShareWindow.openScrollbarSubTopic();

            // Allow all the pre-allowed agents
            AssistController.handlePendingAgentPermissions();
        }, initialPermissions);
        AssistController.rootTopic.subtopicClosed = function(closedTopic) {
        	if (closedTopic.metadata.type == "shared-window") {
        		assistLogger.log("shared-window topic closed, reopening.");
                var previousPermissions = AssistController.screenShareTopic.permissions;
        		delete AssistController.screenShareTopic;
				AssistController.startScreenShare(undefined, previousPermissions);
        	}
        };
    },

    sendEndSupportMessage : function() {
        AssistController.rootTopic.leave();
	},

    allowCobrowseForAgent : function(agent) {
        var agentIdentifier = agent.name + "(" + agent.id + ")";
        if (AssistController.screenShareTopic && AssistController.screenshotInProgress == false) {
            assistLogger.log("Allowing co-browse for agent " + agentIdentifier);
            AssistController.screenShareTopic.updatePermission(AssistAED.PERMISSIONS.ALLOWED, agent);
        } else {
            assistLogger.log("Co-browse not initialised, deferring allowing co-browse permission for agent " + agentIdentifier);
            AssistController.pendingDisallowAgents.forEach(function(disallowedAgent, index, pendingDisallowedAgents) {
                if (disallowedAgent.id == agent.id) {
                    pendingDisallowedAgents[index] = undefined;
                }
            });
            AssistController.pendingAllowAgents.push(agent);
        }
        if (AssistController.inputTopic) {
            assistLogger.log("Allowing form filling access for agent " + agentIdentifier);
            AssistController.inputTopic.updatePermission(AssistAED.PERMISSIONS.ALLOWED, agent)
        }
        
        if (AssistController.screenShareWindow) {
            AssistController.screenShareWindow.setScrollbarPermissions(agent);
        }

        AssistIFrameCaptureHandler.updateAgentPermissionDefs(getCommonAgentViewablePermissions());
    },

    disallowCobrowseForAgent : function(agent) {
        var agentIdentifier = agent.name + "(" + agent.id + ")";
        if (AssistController.screenShareTopic) {
            assistLogger.log("Rejecting co-browse for agent " + agentIdentifier);
            AssistController.screenShareTopic.updatePermission(AssistAED.PERMISSIONS.DENIED, agent);
        } else {
            assistLogger.log("Co-browse not initialised, deferring rejecting co-browse permission for agent " + agentIdentifier);
            AssistController.pendingAllowAgents.forEach(function(allowedAgent, index, pendingAllowedAgents) {
                if (allowedAgent.id == agent.id) {
                    pendingAllowedAgents[index] = undefined;
                }
            });
            AssistController.pendingDisallowAgents.push(agent);
        }
        if (AssistController.inputTopic) {
            AssistController.inputTopic.updatePermission(AssistAED.PERMISSIONS.DENIED, agent)
        }
    },
    
    isScreenshotInProgress: function() {
        return AssistController.screenshotInProgress;
    },
    
    setScreenshotInProgress: function(inProgress) {
        AssistController.screenshotInProgress = inProgress;
        if (inProgress == false) {
            AssistController.handlePendingAgentPermissions();
            var pendingScreenshot = AssistController.pendingScreenshot;
            if (pendingScreenshot) {
                AssistController.updateScreen(pendingScreenshot.force);
                delete AssistController.pendingScreenshot;
            }
        }
    },
    
        handlePendingAgentPermissions: function() {
        var pendingAgentPermissionChanges = AssistController.pendingAllowAgents.length + AssistController.pendingDisallowAgents.length;
        if (pendingAgentPermissionChanges > 0) {
            assistLogger.log("Setting previously requested co-browse permission for " + pendingAgentPermissionChanges + " agents.");
            var toAllow = AssistController.pendingAllowAgents;
            AssistController.pendingAllowAgents = [];
            while (toAllow.length > 0) {
                var agent = toAllow.pop();
                if (agent) {
                    AssistController.allowCobrowseForAgent(agent);
                }
            }
            var toReject = AssistController.pendingDisallowAgents;
            AssistController.pendingDisallowAgents = [];
            while (toReject.length > 0) {
                var agent = toReject.pop();
                if (agent) {
                    AssistController.disallowCobrowseForAgent(agent);
                }
            }
        }
    },
    ScreenshotQueue: function() {
        var partialRootNodesToParse = [];
        var needsFullParse = false;
        var screenshotQueueTimeout;
        var mutatingNode;

        function requiresFullParse(partialParseElement) {
            if (!partialParseElement) {
                return true;
            }

            if (partialParseElement.tagName.toUpperCase() === "BODY") {
                return true;
            }

            return false;
        };

        function addToParseNodeArray(elementToAdd) {
            if (partialRootNodesToParse.indexOf(elementToAdd) === -1) {
                partialRootNodesToParse.push(elementToAdd);
            }
        };

        return {
            queueScreenshot: function(timeout, force, partialParseElements) {
                timeout = timeout || 500;
                force = force || false;

                if (partialParseElements && partialParseElements.length > 0 && needsFullParse === false) {
                    for (var partialParseElIdx = 0; partialParseElIdx < partialParseElements.length; partialParseElIdx++) {
                        var partialParseElement = partialParseElements[partialParseElIdx];

                        if (requiresFullParse(partialParseElement)) {
                            needsFullParse = true;
                            partialRootNodesToParse = [];
                            break;
                        }
                        else {
                            addToParseNodeArray(partialParseElement);
                        }
                    }
                }
                else {
                    needsFullParse = true;
                    partialRootNodesToParse = [];
                }

                screenshotQueueTimeout = setTimeout(function() {
                   AssistController.updateScreen(force, partialRootNodesToParse);

                   AssistController.ScreenshotQueue.needsFullParse = false;
                   AssistController.ScreenshotQueue.partialRootNodesToParse = [];
                   AssistController.ScreenshotQueue.mutatingNode = null;
               }, timeout);
            },
            resetScreenshotQueueTimeout: function() {
                clearTimeout(screenshotQueueTimeout);
            }
        }
    }(),

    pauseCobrowse : function() {
        assistLogger.log("Co-browse paused.");
        if (!AssistController.cobrowsePaused && AssistController.screenShareTopic) {
            AssistController.sendOffAssistPagesMessage();
        }
        AssistController.cobrowsePaused = true;
    },

    resumeCobrowse : function() {
        assistLogger.log("Co-browse un-paused.");
        if (AssistController.cobrowsePaused && AssistController.screenShareTopic){
            AssistController.sendOnAssistPagesMessage();
            AssistController.ScreenshotQueue.resetScreenshotQueueTimeout();
            AssistController.ScreenshotQueue.queueScreenshot();
        }
        AssistController.cobrowsePaused = false;
    },
    
    startZoom : function() {
        if (AssistController.screenShareWindow.hasAtLeastOneSharedDocument()) {
            assistLogger.log("Cannot zoom when a document is shared.");
        } else if (!AssistController.sourceWindow.document.getElementById("assist-zoom-window")) {
            //Close any existing zoom windows just in case we managed to get in here for a second time:
            AssistController.endZoom();
            var div = AssistController.sourceWindow.document.createElement("div");
            var canvas = AssistController.sourceWindow.document.createElement("canvas");
            div.id='assist-zoom-window';
            div.setAttribute("data-html2canvas-ignore", "true");
            div.classList.add("shared-element");
            div.classList.add("zoom-window");
            AssistController.glassPane.appendChild(div);
            canvas.id ='zoom-canvas';
            canvas.width = div.clientWidth;
            canvas.height = div.clientHeight;
            div.appendChild(canvas);
            AssistController.screenShareWindow.openSharedWindowSubTopic(div,
              {
                moveable : true,
                closeable : true,
                zoomable : true,
                resizeable : true,
                name: "zoom-window",
                type: "zoom-window",
                mustRemainVisiblePixels : 90,
                mustRemainVisibleBottomPixels : 120
              },
              function(newWindow ,newSubtopic) {
                newSubtopic.participantJoined = function(newParticipant) {
                  newWindow.sendSizeAndPosition();
                  newWindow.sendZoomLevelChangedMessage();
                  newWindow.refreshContent(true);
                };
                addZoomFunctionality(newWindow, canvas);
                AssistController.ScreenshotQueue.queueScreenshot();
              },
              AssistController.config.getScaleFactor(),
              true);
        }
    },
    
    endZoom : function() {
        var zoomWindow = AssistController.screenShareWindow.getChildZoomWindow();
        if(zoomWindow) {
            zoomWindow.close();
        }
    },
};

function Agent(participant) {
    this.id = participant.id;
    this.name = participant.metadata.name;
    var permissions = participant.metadata.permissions;
    if (permissions) {
        this.viewablePermissions = permissions.viewable || [];
        this.interactivePermissions = permissions.interactive || [];
    } else {
        this.viewablePermissions = ["default"];
        this.interactivePermissions = ["default"];
    }
    this.metadata = participant.metadata;
}

function getScrollPositions(targetWindow) {
    return {
        scrollY: typeof targetWindow.scrollY === "undefined" ? targetWindow.pageYOffset : targetWindow.scrollY,
        scrollX: typeof targetWindow.scrollX === "undefined" ? targetWindow.pageXOffset : targetWindow.scrollX
    }
}

function getWindowDimensions(targetWindow) {
    return {
        width: Math.min(targetWindow.innerWidth, targetWindow.document.documentElement.clientWidth),
        height: Math.min(targetWindow.innerHeight, targetWindow.document.documentElement.clientHeight)
    }
}
