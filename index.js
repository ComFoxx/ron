var Discord = require('discord.io');
var run = require('./app/run');
var play = require('./app/play');
var fs = require('fs');
var configFile = fs.readFileSync("config.json");
var config = JSON.parse(configFile);
var bot = new Discord.Client({
    autorun: true,
    token: config.token
});
bot.on('ready', function() {
    console.log(bot.username + " - (" + bot.id + ")");
});

bot.on('message', function(user, userID, channelID, message, rawEvent) {

    var data = {
        user: user,
        userID: userID,
        channelID: channelID,
        message: message,
        rawEvent: rawEvent,
        config: config
    };

    if (message.substr(0, 1) === config.prefix_sound) {
        console.log(user + " lance le son: \"" + message + "\"");
        sound = "./sound/" + message.substr(1);
        try {
            play.sound(bot, sound, userID, channelID, config);
            bot.deleteMessage({
                channelID: channelID,
                messageID: rawEvent.d.id
            });
        } catch (e) {
            console.log(e)
        }
    }
    if (message.substr(0, 1) === config.prefix_command) {
        console.log(user + " lance la commande: \"" + message + "\"");
        command = message.substr(1);
        run.init(command);
        run.run(bot, data);
    }
});

bot.on('disconnect', function() {
    console.log('Reconnection du bot ...');
    bot.connect();
});