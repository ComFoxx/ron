const command = require('./command')

module.exports = class ExitVocal extends command {

    static match (message, config) {
        return (message.content.startsWith(config.prefix.exitVocal) && message.guild.voiceConnection && message.guild.voiceConnection.dispatcher)
    }

    static action (message, config) {
        try {
            message.guild.voiceConnection.dispatcher.end()
            message.reply(config.message.exitVocal)
            console.log(message.author.username + ' stop voice connection.')
            message.delete()
        } catch (e) {
            console.error(e)
        }
    }

}
