module.exports = function(bot, data, params) {
    var server = bot.channels[data.channelID].guild_id;

    var serverMessage = bot.servers[server];
    if (!serverMessage) { return; }

    var voiceBot = serverMessage.members[bot.id].voice_channel_id;

    bot.leaveVoiceChannel(voiceBot);
    bot.getAudioContext({channel: voiceBot, stereo: true}, function(err, stream) {
        stream.stopAudioFile();
        if (err) console.error(err);
    });
};