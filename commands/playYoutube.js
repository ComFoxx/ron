const command = require('./command')
const YoutubeStream = require('ytdl-core')
const YoutubeSearch = require('youtube-search')

const opts = {
    maxResults: 1,
    regionCode: 'FR',
    relevanceLanguage: 'FR-fr'
}

module.exports = class PlayYoutube extends command {

    static async play (url, connection) {
        try {
            if (/^https:\/\//.test(url) || /^http:\/\//.test(url)) {
                var stream = YoutubeStream(url)
            } else {
                let search = await YoutubeSearch(url, opts).catch((e) => { throw e });
                if (search.hasOwnProperty('results') && search.results.length > 0 && search.results[0].hasOwnProperty('link')) {
                    var link = search.results[0].link;
                } else {
                    throw 'Search fail'
                }
                console.log(link)
                var stream = YoutubeStream(link);
            }
            connection.playStream(stream)
                .on('error', e => {
                    throw e
                })
                .on('end', async () => {
                    if (this.list.length < 1) {
                        connection.disconnect()
                        return;
                    }
                    let error;
                    do {
                        error = !(await (this.play(this.list.shift(), connection).catch((e) => { throw e })))
                    } while (error && this.list.length > 0)
                    if (error && this.list.length < 1) {
                        connection.disconnect()
                    }
                })
            return true
        } catch (e) {
            console.error(e)
            return false
        }
    }

    static match (message, config) {
        return (message.content.startsWith(config.prefix.playYoutube) && message.member.voiceChannel)
    }

    static action (message, config) {
        if (!opts.hasOwnProperty('key')) {
            opts.key = config.youtubeKey
        }
        if (message.guild.voiceConnection && message.guild.voiceConnection.dispatcher) {
            this.list.push(message.content.substr(config.prefix.playYoutube.length))
            console.log(message.author.username + ' add ' + message.content.substr(config.prefix.playYoutube.length) + ' to the list')
            message.reply(config.message.playYoutubeAddList + message.content.substr(config.prefix.playYoutube.length))
            message.delete()
        } else {
            this.list = []
            message.member.voiceChannel.join()
                .then(connection => {
                    this.play(message.content.substr(config.prefix.playYoutube.length), connection).then((good) => {
                        if (good) {
                            console.log(message.author.username + ' play ' + message.content.substr(config.prefix.playYoutube.length))
                            message.reply(config.message.playYoutubeSuccess + message.content.substr(config.prefix.playYoutube.length))
                            message.delete()
                        } else {
                            message.reply(config.message.error)
                            connection.disconnect()
                        }
                    })
                })
        }
    }

}
