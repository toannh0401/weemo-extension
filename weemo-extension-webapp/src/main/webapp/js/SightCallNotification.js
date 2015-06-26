(function (gj, webNotif, cCometD) {
  SightCallNotification = {
    initCometd: function (eXoUser, eXoToken, contextName) {
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
        me.Cometd.subscribe('/eXo/Application/web/SightCall', null, function (eventObj) {
          var message = JSON.parse(eventObj.data);
          console.log("Receiving Message");
          console.log("Message type:" + message.type);
          console.log("Call Mode:" + message.callMode);
          console.log("From User:" + message.fromUser);
          console.log("To User:" + message.toUser);
        });
      }
    },
    sendMessage: function (toUser, messageType, callMode) {
      gj.ajax("/rest/weemo/sendMessage/" + toUser + "/" + messageType + "/" + callMode)
        .done(function () {
          console.log("Sending Message");
          console.log("Message type:" + messageType);
          console.log("Call Mode:" + callMode);
          console.log("From User:" + eXo.env.portal.userName);
          console.log("To User:" + toUser);
        })
        .fail(function () {
          console.log("Cannot send " + toUser + "  " + messageType);
        });
    }
  };
  return SightCallNotification;
})(gj, webNotifications, cCometD);
