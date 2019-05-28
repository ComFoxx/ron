const command = require('./command')

module.exports = class Role extends command {

    static match (message, config) {
        return message.content.startsWith(config.prefix.role)
    }

    static action (message, config) {
        if (config.role.every(a => {
            if (a.name.toUpperCase() === message.content.substr(config.prefix.role.length).trim().toUpperCase()) {
                if (message.member.roles.get(a.id)) {
                    message.member.removeRole(a.id).catch(e => { message.reply(config.message.error); console.log('Role error :', e) })
                    message.reply(config.message.roleRemoveSuccess.replace(/{role}/, a.name))
                    console.log('Remove role [' + a.name + '] with id [' + a.id + '] to ' + message.author.username)
                } else {
                    message.member.addRole(a.id).catch(e => { message.reply(config.message.error); console.log('Role error :', e) })
                    message.reply(config.message.roleSuccess.replace(/{role}/, a.name))
                    console.log('Add role [' + a.name + '] with id [' + a.id + '] to ' + message.author.username)
                }
                return false;
            }
            return true;
        })) {
            console.log('Failed to add role [' + message.content.substr(config.prefix.role.length).trim() + '] to ' + message.author.username)
            message.reply(config.message.roleError.replace(/{role}/, message.content.substr(config.prefix.role.length).trim()))
        }
    }

}