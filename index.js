const Discord = require('discord.js')
const bot = new Discord.Client()

const fs = require('fs')
const token = fs.readFileSync(process.argv[2] == null ? 'TOKEN' : process.argv[2]).toString()
const config = JSON.parse(fs.readFileSync(process.argv[3] == null ? 'config.json' : process.argv[3]))

const PlayYoutube = require('./commands/playYoutube')
const ExitVocal = require('./commands/exitVocal')

bot.on('ready', () => {
    console.log('Connected with the id : ' + bot.user.id + ', and the username : ' + bot.user.username)
})

bot.on('guildMemberAdd', member => {
    console.log(member.displayName + ' join the guild ' + member.guild.name)
    member.guild.channels
      .filter(ch => ch.name === config.joinChannel)
      .first()
      .send(config.message.join.replace(/{member}/, member).replace(/{guild}/, member.guild.name))
})

bot.on('guildMemberRemove', member => {
    console.log(member.displayName + ' quit the guild ' + member.guild.name)
    member.guild.channels
      .filter(ch => ch.name === config.leftChannel)
      .first()
      .send(config.message.left.replace(/{member}/, member).replace(/{guild}/, member.guild.name))
})

bot.on('message', message => {

    PlayYoutube.parse(message, config) || ExitVocal.parse(message, config)

})

bot.login(token)
