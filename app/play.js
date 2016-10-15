var mysql = require("mysql");

var play = {
    sound: function(bot, sound, userID, channelID, config) {

        var server = bot.channels[channelID].guild_id;

        var serverMessage = bot.servers[server];
        if (!serverMessage) { return; }

        if (serverMessage.members.hasOwnProperty(userID)) {
            var userMessage = serverMessage.members[userID];
        }

        if (userMessage.hasOwnProperty("voice_channel_id")) {
            console.log(userMessage.voice_channel_id);
            var voiceUser = userMessage.voice_channel_id;
            if (serverMessage.members[bot.id].hasOwnProperty('voice_channel_id')) {
                var voiceBot = serverMessage.members[bot.id].voice_channel_id;
            } else {
                var voiceBot = false;
            }

            var connection = mysql.createPool({
                host: config.mysql_host,
                user: config.mysql_user,
                password: config.mysql_password,
                database: config.mysql_database
            });
            connection.query('SELECT * FROM perm WHERE user_id = ? AND rank = "ban"', [userID], function (err, rows, fields) {
                if (err) console.error(err);
                if (rows.length > 0) {
                    console.log("Cette personne est banni.");
                } else {
                    if (voiceBot == voiceUser) {
                        bot.getAudioContext({channel: voiceUser, stereo: true}, function(err, stream) {
                            stream.playAudioFile(sound);
                            stream.once('fileEnd', function() {
                                stream.stopAudioFile();
                            });
                            if (err) console.error(err);
                        });
                    } else {
                        if (voiceBot) {
                            bot.leaveVoiceChannel(voiceBot);
                        }
                        bot.joinVoiceChannel(voiceUser, function() {
                            bot.getAudioContext({channel: voiceUser, stereo: true}, function(err, stream) {
                                stream.playAudioFile(sound);
                                stream.once('fileEnd', function() {
                                    stream.stopAudioFile();
                                });
                                if (err) console.error(err);
                            });
                        });
                    }
                }
            });
        } else {
            console.error("La personne n'est pas dans un channel vocal !");
        }
    }
};
module.exports = play;
