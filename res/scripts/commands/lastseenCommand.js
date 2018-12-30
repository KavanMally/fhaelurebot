$.on('command', function (event) {
    var command = event.getCommand();
    var sender = event.getSender();
    var args = event.getArgs();
    var lastTarget = $.inidb.get('lastseen', args[0]);
    
    if (command.equalsIgnoreCase("lastseen")) {
        if (lastTarget == null) {
            lastTarget = $.lang.get("net.quorrabot.lastseencommand.error-no-data");
        }
        
        if (args.length >= 1) {
            $.say ($.getWhisperString(sender) + $.lang.get("net.quorrabot.lastseencommand.say", $.username.resolve(args[0]), lastTarget));
            return;
        } else {
            $.say($.getWhisperString(sender) + $.lang.get("net.quorrabot.lastseencommand.usage"));
            return;
        }
    }
});

$.on('ircChannelJoin', function(event) {
    var username = event.getUser().toLowerCase();
    
    var datefmt = new java.text.SimpleDateFormat("MM-dd-yyyy @ HH:mm:ss Z");
    datefmt.setTimeZone(java.util.TimeZone.getTimeZone($.timezone));
    
    var timestamp = datefmt.format(new java.util.Date());
    
    $.inidb.set("lastseen", username, timestamp);
});

$.on('ircChannelLeave', function(event) {
    var username = event.getUser().toLowerCase();
    
    var datefmt = new java.text.SimpleDateFormat("MM-dd-yyyy @ HH:mm:ss Z");
    datefmt.setTimeZone(java.util.TimeZone.getTimeZone($.timezone));
    
    var timestamp = datefmt.format(new java.util.Date());
    
    $.inidb.set("lastseen", username, timestamp);
});


    if ($.moduleEnabled('./commands/lastseenCommand.js')) {
        $.registerChatCommand("./commands/lastseenCommand.js", "lastseen");
    }
