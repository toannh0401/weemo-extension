(function(gj, webNotif, cCometD) {
    SightCallNotification = {
        initCometd: function(eXoUser, eXoToken, contextName) {
            var me = SightCallNotification;
            if (!me.Cometd) me.Cometd = cCometD;
            var loc = window.location;
            me.Cometd.configure({
                url: loc.protocol + '//' + loc.hostname + (loc.port ? ':' + loc.port : '') + '/' + contextName + '/cometd',
                'exoId': eXoUser,
                'exoToken': eXoToken,
                logLevel: 'debug'
            });

            if (me.currentUser !== eXoUser || me.currentUser === '') {
                me.currentUser = eXoUser;
                me.Cometd.subscribe('/eXo/Application/web/SightCall', null, function(eventObj) {
                    var message = JSON.parse(eventObj.data);
                    SightCallNotification.receivingMessage(message);

                });
            }
        },
        sendCalling: function(toUser) {

            this.sendMessage(toUser, "calling", "one");

            callingTimeout = window.setTimeout(function() {
                if (jzGetParam("stFromUser") == undefined && jzGetParam("rvFromUser") == undefined) {
                    SightCallNotification.showNoAnswer();
                }
            }, 15000);

        },
        sendDecline: function(toUser) {
            // Hide imcomming message

            // Update state

            // Send
            this.sendMessage(toUser, "decline", "one");
        },

        sendAccepting: function(toUser) {
            this.sendMessage(toUser, "accepted", "one");

        },
        sendReady: function(toUser) {
            this.sendMessage(toUser, "ready", "one");

        },
        sendBusy: function(toUser) {
            this.sendMessage(toUser, "busy", "one");
        },
        sendMessage: function(toUser, messageType, callMode) {

            // Send message
            gj.ajax("/rest/weemo/sendMessage/" + toUser + "/" + messageType + "/" + callMode)
                .done(function() {
                    SightCallNotification.storeLastSentMessage(SightCallNotification.currentUser, toUser, callMode, messageType);
                })
                .fail(function() {
                    console.log("Cannot send " + toUser + "  " + messageType);
                });

        },
        receivingMessage: function(message) {

            if (jzGetParam("isBusy") === "true" && message.fromUser !== jzGetParam("rvFromUser") && jzGetParam("rvFromUser") !== undefined) {
                this.sendBusy(message.fromUser);
                return;
            }
            if (message.type === "calling") {
                this.receivingCalling(message);
            } else if (message.type === "decline") {
                this.receivingDecline(message);
            } else if (message.type === "busy") {
                this.receivingBusy(message);
            } else if (message.type === "ready") {
                this.receivingReady(message);
            } else if (message.type === "accepted") {
                this.receivingAccepted(message);
            }

            this.storeLastReceivedMessage(message);
        },
        receivingCalling: function(message) {

            // Show incomming
            this.showIncomming(message.fromUser);
        },
        receivingDecline: function(message) {
            window.clearTimeout(callingTimeout);

            SightCallNotification.showNoAnswer();

        },
        receivingAccepted: function(message) {
            window.clearTimeout(callingTimeout);

        },
        receivingReady: function(message) {
            sightcallExtension.createWeemoCall(message.fromUser, message.fromUser);
        },
        receivingBusy: function(message) {
            gj("#sightCallConnectionStatus").text(message.fromUser + " is Busy");

        },
        log: function() {
            console.log("Message type:" + jzGetParam("messageType"));
            console.log("Call Mode:" + jzGetParam("callMode"));
            console.log("To User:" + jzGetParam("toUser"));
            console.log("Is Busy:" + jzGetParam("isBusy"));
        },
        showIncomming: function(fromUser) {
            jzStoreParam("isBusy", true, 15);

            var incommingHtml = '<div id="sightCallIncommingForm" class="rtcc-startcallbox incoming-call" style="cursor: move;">';
            incommingHtml += '    <h4 class="name">' + fromUser + '</h4>';
            incommingHtml += '    <div class="picto"></div>';
            incommingHtml += '    <div class="button-actions">';
            incommingHtml += '        <div class="container">';
            incommingHtml += '            <a class="video" href="#" id ="sightCallAcceptButton">Accept</a>';
            incommingHtml += '        </div>';
            incommingHtml += '        <div class="container">';
            incommingHtml += '            <a class="ignore" href="#" id="sightCallDecleinButton">decline</a>';
            incommingHtml += '        </div>';
            incommingHtml += '        <div class="container">';
            incommingHtml += '            <a class="hangup" href="#"></a>';
            incommingHtml += '        </div>';
            incommingHtml += '    </div>';
            incommingHtml += '</div>';
            gj('body').append(incommingHtml);

            gj("#sightCallDecleinButton").click(function(e) {
                SightCallNotification.sendDecline(fromUser);
                SightCallNotification.hideIncomming();
            });

            gj("#sightCallAcceptButton").click(function(e) {
                window.open('/portal/intranet/videocallpopup?caller=' + fromUser + '&mode=one_callee', "MyWindow", "top=100, left=100,toolbar=no, menubar=no,scrollbars=no,resizable=no,location=no,directories=no,status=no, height=300, width=500");

                SightCallNotification.sendAccepting(fromUser);
                SightCallNotification.hideIncomming();
            });

            window.setTimeout(function() {
                SightCallNotification.hideIncomming();
            }, 15000);

        },
        hideIncomming: function() {
            gj("#sightCallIncommingForm").remove();
            jzStoreParam("isBusy", false, 15);

        },
        showNoAnswer: function() {
            gj("#sightCallConnectionStatus").text("No answer");
        },
        storeLastSentMessage: function(fromUser, toUser, callMode, messageType) {
            jzStoreParam("stCallMode", callMode, 15);
            jzStoreParam("stMessageType", messageType, 15);
            jzStoreParam("stToUser", toUser, 15);
            jzStoreParam("stFromUser", fromUser, 15);
        },
        storeLastReceivedMessage: function(message) {
            jzStoreParam("rvCallMode", message.callMode, 15);
            jzStoreParam("rvMessageType", message.type, 15);
            jzStoreParam("rvToUser", message.toUser, 15);
            jzStoreParam("rvFromUser", message.fromUser, 15);
        }

    };
    return SightCallNotification;
})(gj, webNotifications, cCometD);
