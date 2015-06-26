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
                    console.log("Message type:" + message.type);
                });
            }
        },
        sendMessage: function(toUser, messageType) {
            gj.ajax("/rest/weemo/sendMessage/" + toUser + "/" + messageType)
                .done(function() {
                    console.log("Sent " + toUser + "  " + messageType);
                })
                .fail(function() {
                    console.log("Cannot send " + toUser + "  " + messageType);
                });
        }
    };
    return SightCallNotification;
})(gj, webNotifications, cCometD);
