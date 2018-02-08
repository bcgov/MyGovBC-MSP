//assist-csdk-ui.js

;(function() {
    
    "use strict";
    
    var cqClasses = ["no-call", "call-quality-good", "call-quality-moderate", "call-quality-poor"];   
    var cleanUpListeners = [];
    var browserInfo;
    var targetWindow;
    var targetDocument;
    var localVideoEnabled;
    var agentPictureUrl;
    var agentName;
    var agentVideoWindow;
    var muted = false;
    var videoToggleEnabled = true;
    var isOnRecognizedAssistPage = true;
    var videoWindowX = "20px";
    var videoWindowY = "20px";
    var AssistControllerInterface;
    var configuration;
    var popupWindow;
    var crossDomain = false;
    
    var ASSIST_CSDK_IFRAME_PATH = "assets/assist-csdk-iframe.html";
    
    window.AssistCSDKUI = {
        init: function(aPopupWindow, aTargetWindow, aConfig, aCrossDomain, aAssistControllerInterface, onInitialisedCallback) {
            rewire(aPopupWindow, aTargetWindow, aConfig, aCrossDomain, aAssistControllerInterface);
            createAgentVideoWindow();
            onInitialisedCallback(agentVideoWindow);
        },
 
        setAgentName: function(aAgentName) {
            agentName = aAgentName;
            console.log("Setting agentName to " + agentName);
            
            if (!agentName || agentName == 'undefined') {
                return;
            }
            
            var nameDiv = targetDocument.getElementById("name-div");

            if (nameDiv != null) {
                nameDiv.firstChild.nodeValue = agentName;
            }
        },

        setAgentPicture: function(aAgentPictureUrl) {
            var agentPictureUrl = aAgentPictureUrl;
            console.log("Setting agentPictureUrl to " + agentPictureUrl);
            
            if (!agentPictureUrl || agentPictureUrl == 'undefined') {
                return;
            }
            
            var picture = targetDocument.getElementById("picture");
            if ((picture !== null) && (typeof picture !== "undefined")) {
                picture.setAttribute("src", agentPictureUrl);
            }
        },
        
        endCall: function(callEndSupport) {
            try {
                for (var i = 0, len = cleanUpListeners.length; i < len; i++) {
                    cleanUpListeners[i].window.removeEventListener(cleanUpListeners[i].type, cleanUpListeners[i].method, false);
                }
            } catch (e) {
                console.warn("Couldn't remove all event listeners");
            }
            
            if (callEndSupport) {
                AssistControllerInterface.endSupport();
            }
        },
        
        reconnect: function(aPopupWindow, aTargetWindow, aConfig, aCrossDomain, aAssistControllerInterface, onInitialisedCallback) {
            rewire(aPopupWindow, aTargetWindow, aConfig, aCrossDomain, aAssistControllerInterface);
            agentVideoWindow = targetDocument.getElementById("assist-sdk");
            if (!agentVideoWindow) {
                createAgentVideoWindow();
            }
            onInitialisedCallback(agentVideoWindow);
        },
        connectionQualityChanged: function(quality) {
            if (isOnRecognizedAssistPage) {
                var cqIndicator = targetDocument.getElementById("call-quality-indicator");
                if (cqIndicator == null) {
                    cqIndicator = targetDocument.createElement("div");
                    cqIndicator.id = "call-quality-indicator";
                    
                    // look it up in-place, otherwise closures mean we can end up referencing old supportDiv
                    var supportDiv = targetDocument.getElementById("assist-sdk"); 
                    supportDiv.appendChild(cqIndicator);
                }
                var qualityClass;
                if (quality >= 90) {
                    qualityClass = cqClasses[1];
                } else if (quality >= 70) {
                    qualityClass = cqClasses[2];
                } else {
                    qualityClass = cqClasses[3];
                }
                setCallQuality(cqIndicator, qualityClass);
            }
        },
        displayModal: function(message) {
            var okButtonText = i18n.t("assistI18n:button.ok");
            console.log("seting up support reject modal");

            var modalContainer = targetDocument.createElement("div");
            modalContainer.id = "assist-support-rejected-modal";
            targetDocument.body.appendChild(modalContainer);

            var modal = targetDocument.createElement("div");

            modalContainer.appendChild(modal);

            var p = targetDocument.createElement("p");
            p.innerHTML = message;
            modal.appendChild(p);

            var input = targetDocument.createElement("input");
            input.type = "button";
            input.value = okButtonText;
            p.appendChild(input);
            
            AssistControllerInterface.removeOnClick(input, "assist-support-rejected-modal");
        },
        doSessionCreationFailure: function() {
            AssistControllerInterface.doError('SESSION_CREATION_FAILURE', {
                code:AssistControllerInterface.getSessionCreationFailureCode(),
                message: message
            });
        },
        error: function(type, message) {
            console.log("call was busy or not found");
            displaySupportBusyModal();
            AssistControllerInterface.doError('ERROR_CALL_' + type, {message: message});
            endCall();
        },
        showVideo: function() {
            var statusDiv = targetDocument.getElementById("status-div");
            if (statusDiv) {
                statusDiv.style.visibility = "hidden";
            }
            if (configuration.hasVideo()) {
                var videoContainer = targetDocument.getElementById("video");
                if (videoContainer) {
                    videoContainer.style.visibility = "visible";
                }
            }
        }
    }; // api ends here
    
    function rewire(aPopupWindow, aTargetWindow, aConfig, aCrossDomain, aAssistControllerInterface) {
        popupWindow = aPopupWindow;
        targetWindow = aTargetWindow;
        targetDocument = targetWindow.document;
        AssistControllerInterface = aAssistControllerInterface;
        configuration = new window.Config(aConfig);
        crossDomain = aCrossDomain;
        browserInfo = configuration.getBrowserInfo();
        localVideoEnabled = configuration.hasLocalVideo(); // we may need to toggle this, so track separately from config object.
        
        isOnRecognizedAssistPage = true;
        
        if ("onpagehide" in window) {
            targetWindow.addEventListener("pagehide", handleUnload, false);
            cleanUpListeners.push({ window: targetWindow, type: "pagehide", method: handleUnload });
        } else {
            targetWindow.addEventListener("unload", handleUnload, false);
            cleanUpListeners.push({ window: targetWindow, type: "unload", method: handleUnload });
        }
    }
        
    // if we end support via the popup by closing the popup or pressing end then we need to trigger end on AssistSDK
    // whereas if AssistCSDK.endCall is called directly it's being triggered from an endSupport call from AssistSDK
    function endCall() {
        try {
            popupWindow.CSDK.endCall(true);
        } catch(e) {
            console.warn("Failed end support session");
        }
        // don't need AssistSDK.endCall because endSupport will call up to it
    }
        
    function setCallQuality(cqIndicator, cqClass) {
        for (var i = 0; i < cqClasses.length; i++) {
            if (cqClass != cqClasses[i]) {
                cqIndicator.classList.remove(cqClasses[i])
            } else {
                cqIndicator.classList.add(cqClasses[i]);
            }
        }
    }
    
    function createAgentVideoWindow() {
        var withVideo = configuration.hasVideo();
        
        console.log("with video: " + withVideo);
        var className;
        if (withVideo == false) {
            className = "without-video audio-only";
        } else {
            className = "with-video";
        }

        agentVideoWindow = targetDocument.createElement("div");
        agentVideoWindow.id = "assist-sdk";
        agentVideoWindow.className = className;
        
        try {
            if (agentVideoWindow && !browserInfo.ie) {
                videoWindowX = agentVideoWindow.style.left;
                videoWindowY = agentVideoWindow.style.top;
            }
        } catch (e) {
        }
        agentVideoWindow.style.top = videoWindowY;
        agentVideoWindow.style.left = videoWindowX;

        var videoContainer = targetDocument.createElement("div");
        videoContainer.id = "video";
        videoContainer.className = "assist-video-container";
        agentVideoWindow.appendChild(videoContainer);
        
        var nameDiv = targetDocument.createElement("div");
        nameDiv.id = "name-div";

        console.log("agentName is " + agentName);
        if (agentName == null) {
            agentName = "";
        }
        
        var agentNameNode = targetDocument.createTextNode(agentName);
        nameDiv.appendChild(agentNameNode);
        agentVideoWindow.appendChild(nameDiv);
        
        if (withVideo) {
            var menuButton = targetDocument.createElement("div");
            menuButton.id = "menu-button";
            menuButton.classList.add("button");
            menuButton.onclick = function() {
                menuDiv.style.visibility = (menuDiv.style.visibility == "hidden") ? "visible" : "hidden";
            };
            agentVideoWindow.appendChild(menuButton);
            
            var menuDiv = targetDocument.createElement("div");
            menuDiv.id = "menu";
            menuDiv.style.visibility = "hidden";
            agentVideoWindow.appendChild(menuDiv);
            
            var mute = targetDocument.createElement("div");
            mute.id = "mute-button";
            mute.classList.add("unmuted");
            mute.classList.add("button");
            mute.onclick = toggleMute;
            menuDiv.appendChild(mute);
            
            var br = targetDocument.createElement("br");
            menuDiv.appendChild(br);
            
            var videoToggleButton = targetDocument.createElement("div");
            videoToggleButton.id = "video-toggle-button";
            videoToggleButton.classList.add(localVideoEnabled ? "unmuted" : "muted");
            videoToggleButton.classList.add(videoToggleEnabled ? "enabled" : "disabled");
            videoToggleButton.classList.add("button");
            videoToggleButton.onclick = toggleVideo;
            menuDiv.appendChild(videoToggleButton);
            
            var br = targetDocument.createElement("br");
            menuDiv.appendChild(br);
            
        } else {
            var mute = targetDocument.createElement("div");
            mute.id = "mute-button";
            mute.classList.add("unmuted");
            mute.classList.add("button");
            mute.onclick = toggleMute;
            agentVideoWindow.appendChild(mute);
        }
        
        if (!withVideo) {
            var picture = targetDocument.createElement("img"); // todo: find out if this is still necessary
            picture.id = "picture";
            var agentPictureUrl = agentPictureUrl;
            console.log("agentPictureUrl is " + agentPictureUrl);
            if (agentPictureUrl != null) {
                    picture.setAttribute("src", agentPictureUrl);
            }
                           
            agentVideoWindow.appendChild(picture);
        }
        
        var end = targetDocument.createElement("div");
        end.id = "end-button";
        end.onclick = endCall;
        end.classList.add("button");
        agentVideoWindow.appendChild(end);
    
        var statusDiv = targetDocument.createElement("div");
        statusDiv.id = "status-div";
        statusDiv.innerHTML =  "<center>" + i18n.t("assistI18n:popup.status.connecting") + "</center>";
        agentVideoWindow.appendChild(statusDiv);
        statusDiv.style.visibility = "visible";
        
        if (withVideo) {
            // This will become visible when the call is established.
            videoContainer.style.visibility = "hidden";
        }
        
        if (crossDomain) {
            var iframe = targetDocument.createElement("iframe");
            iframe.id = "assist-csdk-iframe";
            iframe.src = AssistUtils.getSdkPath() + ASSIST_CSDK_IFRAME_PATH;
            iframe.width = "100%";
            iframe.height = "100%";
            iframe.style.border = 0;
            iframe.style.overflow = "hidden";
            videoContainer.appendChild(iframe);
        }
    }
    
    function displaySupportBusyModal() {
    	 AssistCSDKUI.displayModal(i18n.t("assistI18n:notice.noAgents"));
    }
    
    function handleUnload() {
        // Tell the popup that we're moving away from Live Assist
        isOnRecognizedAssistPage = false;
        popupWindow.handleUnload();
    }

    function toggleMute() {
        var muteButton = targetDocument.getElementById("mute-button");
        var videoToggleButton = targetDocument.getElementById("video-toggle-button");
        
        if (muted == false) {
            muted = true;
            muteButton.classList.remove("unmuted");
            muteButton.classList.add("muted");
            if (videoToggleButton != null) {
                videoToggleEnabled = false;
            	videoToggleButton.classList.remove("enabled");
            	videoToggleButton.classList.add("disabled");
            }
            enableOrDisableLocalVideoAndAudio();
            
        } else {
            muted = false;
            enableOrDisableLocalVideoAndAudio();
            muteButton.classList.remove("muted");
            muteButton.classList.add("unmuted");
            
            if (videoToggleButton != null) {
            	videoToggleEnabled = true;
            	videoToggleButton.classList.remove("disabled");
            	videoToggleButton.classList.add("enabled");
            }
        }
    }
    
    function toggleVideo() {
        var videoToggleButton = targetDocument.getElementById("video-toggle-button");
        
    	if (videoToggleEnabled == false) {
    		return;
        }
        
    	if (localVideoEnabled == false) {
    		localVideoEnabled = true;
    		videoToggleButton.classList.remove("muted");
    		videoToggleButton.classList.add("unmuted");
    		enableOrDisableLocalVideoAndAudio();
    	} else {
    		localVideoEnabled = false;
    		videoToggleButton.classList.remove("unmuted");
    		videoToggleButton.classList.add("muted");
    		enableOrDisableLocalVideoAndAudio();
    	}
    }
    
    function enableOrDisableLocalVideoAndAudio() {
    	var enablingVideo = localVideoEnabled && !muted;
    	var enablingAudio = !muted;
    	console.log("Setting video to " + ((enablingVideo) ? "enabled" : "disabled") + ".");
    	console.log("Setting audio to " + ((enablingAudio) ? "enabled" : "disabled") + ".");
        popupWindow.setLocalMediaEnabled(enablingVideo, enablingAudio, localVideoEnabled);
    }
    
})();
