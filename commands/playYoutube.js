const command = require('./command')
const YoutubeStream = require('ytdl-core')

module.exports = class PlayYoutube extends command {

    static match (message, config) {
        return (message.content.startsWith(config.prefix.playYoutube) && message.member.voiceChannel)
    }

    static action (message, config) {
        message.member.voiceChannel.join()
            .then(connection => {
                try {
                    let stream = YoutubeStream(message.content.substr(config.prefix.playYoutube.length))
                    console.log(message.author.username + ' play ' + message.content.substr(config.prefix.playYoutube.length))
                    connection.playStream(stream)
                        .on('error', e => {
                            throw e
                        })
                        .on('start', () => {
                            message.reply(config.message.playYoutubeSuccess + message.content.substr(config.prefix.playYoutube.length))
                            message.delete()
                        })
                        .on('end', () => {
                            connection.disconnect()
                        })
                } catch (e) {
                    message.reply(config.error)
                    console.log(message.author.username + ' throw an error : \n' + e)
                    connection.disconnect()
                }
            })
    }

}
