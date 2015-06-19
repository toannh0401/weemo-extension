(function(gj, webNotif, cCometD){
  SightCallNotification =  {
    initCometd : function(eXoUser, eXoToken, contextName) {
      var me = SightCallNotification;
      if(!me.Cometd) me.Cometd = cCometD;
      var loc = window.location;
      me.Cometd.configure({
        url: loc.protocol + '//' + loc.hostname + (loc.port ? ':' + loc.port : '')  + '/' + contextName + '/cometd',
        'exoId': eXoUser, 'exoToken': eXoToken,
        logLevel: 'debug'
      });

      if (me.currentUser !== eXoUser || me.currentUser === '') {
        me.currentUser = eXoUser;
        me.Cometd.subscribe('/eXo/Application/web/SightCall', null, function(eventObj) {
          var message = JSON.parse(eventObj.data);
          if (message.id === 'Popup') {
            window.open('/weemo-extension/calloneone/callee.html?caller=' + message.from, "MyWindow", "top=100, left=100,toolbar=no, menubar=no,scrollbars=no,resizable=no,location=no,directories=no,status=no, height=300, width=500");

          }

        });
      }//end user
    }//e
  };
  return SightCallNotification;
})(gj, webNotifications, cCometD);