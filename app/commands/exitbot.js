module.exports = function(bot, data, params) {

    var server = bot.channels[data.channelID].guild_id;

    var serverMessage = bot.servers[server];

    if (serverMessage.members[bot.id].hasOwnProperty('voice_channel_id')) {
        var voiceBot = serverMessage.members[bot.id].voice_channel_id;
    }

    bot.leaveVoiceChannel(voiceBot);

};