/**
 * The discord event gets a message event from Discord. This event contains the name
 * of the text channel, the user that sent the message in the channel, and the message.
 *
 * This is provided as a simplistic framework. It is not advised to attempt to run 
 * commands from Discord or attempt to call any of the other modules in QuorraBot
 * as those commands are meant to interact specifically with Twitch. Feel free to 
 * access the database, language entries, and items such as that, but do not attempt
 * to utilize any of the commands directly.
 *
 * Messages may be sent back to Discord using the following method:
 *     $.discord.sendMessage({String} channelName, {String} message);
 *
 * Note that the API indicates that there is a rate limit of 10 messages in 10 seconds.
 * The sendMessage() method therefore is rate limited and will only send one message
 * once every second. No burst logic is provided. 
 *
 * If you wish to use Discord, you will need to follow the directions on the following
 * website to register for an application and create a token to place into botlogin.txt.
 *
 *     https://github.com/reactiflux/discord-irc/wiki/Creating-a-discord-bot-&-getting-a-token
 *
 */
var lastStreamOnlineSend = 0;
var discordAnnounce = false;

/*
 * @event discord
 */
$.on('discord', function (event) {
    var discordChannel = event.getDiscordChannel(),
            discordUser = event.getDiscordUser(),
            discordUserMentionAs = event.getDiscordUserMentionAs(),
            discordMessage = event.getDiscordMessage();
});

//Send message to discord channel if streamer is online
if ($.isOnline($.ownerName) == true && discordAnnounce == false) {
    discordAnnounce = true;
    var now = parseInt(java.lang.System.currentTimeMillis());
    if (now - lastStreamOnlineSend > 600e3) {
        lastStreamOnlineSend = now;
        if ($.moduleEnabled('./addonscripts/discordHandler.js')) {
            $.discordSay($.lang.get('net.quorrabot.discord.streamonline', $.username.resolve($.channelName)));
        }
    }
}

$.discordSay = function (message) {
    $.discord.sendMessage($.discordMainChannel, message);
};

$.on('command', function (event) {
    var command = event.getCommand().toString(),
            sender = event.getSender(),
            argsString = event.getArguments().trim(),
            args = argsString.split(" "),
            action = args[0];

    //use discordchat for command so it doesnt interfere with preexisting !discord commands
    if (command.equalsIgnoreCase("discordchat")) {
        if (!$.isModv3(sender)) {
            $.say($.getWhisperString(sender) + $.modmsg);
            return;
        }
        if (args[0] == null) {
            $.say($.getWhisperString(sender) + $.lang.get('net.quorrabot.discord.usage'));
            return
        }
        if (action.equalsIgnoreCase("say")) {
            if (args[1] == null) {
                $.say($.getWhisperString(sender) + $.lang.get('net.quorrabot.discord.nomessage'));
                return
            }
            if ($.moduleEnabled('./addonscripts/discordHandler.js')) {
                var message = argsString.substring(argsString.indexOf(args[1]));
                $.discordSay(message);
                $.say($.getWhisperString(sender) + $.lang.get('net.quorrabot.discord.messagesent'));
            }
        }
    }
});

if ($.moduleEnabled('./addonscripts/discordHandler.js')) {
    $.registerChatCommand("./addonscripts/discordHandler.js", "discordchat");
};