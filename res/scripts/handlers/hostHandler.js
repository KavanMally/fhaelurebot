$.hostreward = parseInt($.inidb.get('settings', 'hostreward'));
$.hosttimeout = parseInt($.inidb.get('settings', 'hosttimeout'));

if ($.hostlist == null || $.hostlist == undefined) {
    $.hostlist = new Array();
}

if ($.hosttimeout == null || $.hosttimeout == undefined || isNaN($.hosttimeout)) {
    $.hosttimeout =  60 * 60 * 1000;
} else {
    $.hosttimeout =  $.hosttimeout * 60 * 1000;
}

if ($.hostreward == null || $.hostreward == undefined) {
    $.hostreward = 0;
}



$.on('twitchHosted', function(event) {
    var username = $.username.resolve(event.getHoster());
    
    if ($.announceHosts && $.moduleEnabled("./handlers/hostHandler.js")
        && ($.hostlist[event.getHoster()] == null || $.hostlist[event.getHoster()] == undefined
            || $.hostlist[event.getHoster()] < System.currentTimeMillis())) {
        var s = $.inidb.get('settings', 'hostmessage');
            
        if (s == null || s == undefined || $.strlen(s) == 0) {
            if ($.hostreward < 1) {
                s = "Thanks for the host (name)!";
            } else if ($.hostreward > 0) {
                s = "Thanks for the host (name)! you're rewarded " + $.hostreward + " " + $.pointname + ".";
                $.inidb.incr('points', username.toLowerCase(), $.hostreward);
            }
        }
            
        while (s.indexOf('(name)') != -1) {
            s = s.replace('(name)', username);
        }
        $.inidb.set("temphostgroup", username.toLowerCase(), $.inidb.get("group",username.toLowerCase()));
        $.inidb.set("group", username.toLowerCase(), 5);
        $.say(s);
    }
    
    $.hostlist[event.getHoster()] = System.currentTimeMillis() + $.hosttimeout;
    
    $.hostlist.push(username);
});

$.on('twitchUnhosted', function(event) {
    var username = $.username.resolve(event.getHoster());
    
    $.hostlist[event.getHoster()] = System.currentTimeMillis() + $.hosttimeout;
    
    for (var i = 0; i < $.hostlist.length; i++) {
        if ($.hostlist[i].equalsIgnoreCase(username)) {
            $.hostlist.splice(i, 1);
            $.inidb.set("group", username.toLowerCase(), $.inidb.get("temphostgroup", username.toLowerCase()));
            break;
        }
    }
});

$.on('twitchHostsInitialized', function(event) {
    println(">>Enabling new hoster announcements");
    
    $.announceHosts = true;
});

$.on('command', function(event) {
    var sender = event.getSender();
    var username = $.username.resolve(sender, event.getTags());
    var command = event.getCommand();
    var argsString = event.getArguments().trim();
    var args = event.getArgs();
    
    if (command.equalsIgnoreCase("hostmessage")) {
        if (!$.isAdmin(sender)) {
            $.say($.adminmsg);
            return;
        }
        
        if ($.strlen(argsString) == 0) {
            $.say("The current new hoster message is: " + $.inidb.get('settings', 'hostmessage'));
            
            var s = "To change it use '!hostmessage <message>'. You can also add the string '(name)' to put the hosters name";
            
            $.say(s);
        } else {
            $.logEvent("hostHandler.js", 73, username + " changed the new hoster message to: " + argsString);
            
            $.inidb.set('settings', 'hostmessage', argsString);
            
            $.say("New host message set!");
        }
    }
    if (command.equalsIgnoreCase("hostreward")) {
        if (!$.isAdmin(sender)) {
            $.say($.adminmsg);
            return;
        }
        
        if ($.strlen(argsString) == 0) {
            if ($.inidb.exists('settings', 'hostreward')) {
                $.say("The current host reward is " + $.inidb.get('settings', 'hostreward') + " " + $.pointname + "! To change it use '!hostreward <amount>'");
            } else {
                $.say("The current host reward is " + $.hostreward + " " + $.pointname + "! To change it use '!hostreward (amount)'");
            }
        } else {
            if (!parseInt(argsString) < 0) {
                $.say("Please put a valid reward greater than or equal to 0!");
                return;
            }
            
            $.logEvent("hostHandler.js", 134, username + " changed the host points reward to: " + argsString);
            
            $.inidb.set('settings', 'hostreward', argsString);
            $.hostreward = parseInt(argsString);
            $.say("New hoster reward set to: " + argsString);
        }
    }
	
    if (command.equalsIgnoreCase("hostcount")) {
        $.say("This channel is currently being hosted by " + $.hostlist.length + " channels!");
    }
    
    if (command.equalsIgnoreCase("hosttime")) {
        if (args.length < 1) {
            $.say("Host timeout duration is currently set to: " + parseInt($.inidb.get('settings', 'hosttimeout')) + " minutes!");
        } else if (args.length >= 1){
            if (!$.isAdmin(sender)) {
                $.say($.adminmsg);
                return;
            }
            if (parseInt(args[0]) < 30) {
                $.say("Host timeout duration can't be less than 30 minutes!");
                return;
            } else {
                $.inidb.set('settings', 'hosttimeout', parseInt(args[0]));
                $.hosttimeout = parseInt(args[0]);
                $.say("Host timeout duration is now set to: " + parseInt(args[0]) + " minutes!");
            }
        }
    }
    if (command.equalsIgnoreCase("hostlist")) {
        var m = "";
        
        for (var b = 0; b < Math.ceil($.hostlist.length / 30); b++) {
            m = "";
            
            for (var i = (b * 30); i < Math.min($.hostlist.length, ((b + 1) * 30)); i++) {
                if ($.strlen(m) > 0) {
                    m += ", ";
                }
            
                m += $.hostlist[i];
            }
        
            if (b == 0) {
                $.say("This channel is currently being hosted by the hosting " + $.hostlist.length + " channels: " + m);
            } else {
                $.say(">>" + m);
            }
        }
    }
	
});
setTimeout(function(){ 
    if ($.moduleEnabled('./handlers/hostHandler.js')) {
        $.registerChatCommand("./handlers/hostHandler.js", "hostmessage", "admin");
        $.registerChatCommand("./handlers/hostHandler.js", "hostreward");
        $.registerChatCommand("./handlers/hostHandler.js", "hosttime");
        $.registerChatCommand("./handlers/hostHandler.js", "hostcount");
        $.registerChatCommand("./handlers/hostHandler.js", "hostlist");
    }
},10*1000);