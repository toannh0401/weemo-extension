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
        },
        sendDecline: function(toUser) {
            // Hide imcomming message

            // Update state
            this.updateStatus(false, "", "", "", "");

            // Send
            this.sendMessage(toUser, "decline", "one");
        },
        sendBusy: function(toUser) {
            this.sendMessage(toUser, "busy", "one");
        },
        sendMessage: function(toUser, messageType, callMode) {
            this.updateStatus(true, callMode, messageType, toUser);

            // Send message
            gj.ajax("/rest/weemo/sendMessage/" + toUser + "/" + messageType + "/" + callMode)
                .done(function() {})
                .fail(function() {
                    console.log("Cannot send " + toUser + "  " + messageType);
                });
        },
        receivingMessage: function(message) {
            if (jzGetParam("isBusy") === "true" && (message.fromUser !== jzGetParam("toUser") || message.type === "calling")) {
                this.sendBusy(message.fromUser);
                return;
            }
            if (message.type === "calling") {
                this.receivingCalling(message);
            } else if (message.type === "decline") {
                this.receivingDecline(message);
            } else if (message.type === "busy") {
                this.receivingBusy(message);
            }
        },
        receivingCalling: function(message) {
            jzStoreParam("isBusy", true, 14400);

            // Show incomming
            this.showIncomming(message.fromUser);
        },
        receivingDecline: function(message) {
            // Update screen reject

            // Update status
            this.updateStatus(false, "", "", "", "");

        },
        receivingBusy: function(message) {
            this.updateStatus(false, "", "", "", "");

        },
        updateStatus: function(isBusy, callMode, messageType, toUser) {
            // Reset status
            jzStoreParam("isBusy", isBusy, 14400);
            jzStoreParam("callMode", callMode, 14400);
            jzStoreParam("messageType", messageType, 14400);
            jzStoreParam("toUser", toUser, 14400);
            SightCallNotification.log();
        },
        log: function() {
            console.log("Message type:" + jzGetParam("messageType"));
            console.log("Call Mode:" + jzGetParam("callMode"));
            console.log("To User:" + jzGetParam("toUser"));
            console.log("Is Busy:" + jzGetParam("isBusy"));
        },
        showIncomming: function(fromUser) {
        	gj("#sightCallIncommingForm").remove();
            var incommingHtml = '<div id="sightCallIncommingForm" class="rtcc-startcallbox incoming-call" style="cursor: move;">';
            incommingHtml += '    <h4 class="name">' + fromUser + '</h4>';
            incommingHtml += '    <div class="picto"></div>';
            incommingHtml += '    <div class="button-actions">';
            incommingHtml += '        <div class="container">';
            incommingHtml += '            <a class="video" href="#" id ="sightCallAcceptButton"></a>';
            incommingHtml += '        </div>';
            incommingHtml += '        <div class="container">';
            incommingHtml += '            <a class="ignore" href="#" id="sightCallDecleinButton"></a>';
            incommingHtml += '        </div>';
            incommingHtml += '        <div class="container">';
            incommingHtml += '            <a class="hangup" href="#"></a>';
            incommingHtml += '        </div>';
            incommingHtml += '    </div>';
            incommingHtml += '</div>';
            gj('body').append(incommingHtml);
            gj("#sightCallDecleinButton").click(function(e){
            	SightCallNotification.sendDecline(fromUser);
            	gj("#sightCallIncommingForm").hide();
            });
        }

    };
    return SightCallNotification;
})(gj, webNotifications, cCometD);
