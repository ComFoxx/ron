var fs = require('fs');
module.exports = function(bot, data, params) {
    var commandHelp = fs.readFileSync("app/help.json");
    commandHelp = JSON.parse(commandHelp);
    fs.readdir("app/commands/.", function (err, files){
        if (err) { console.error(err); }
        var response = [];
        var currentCommand;
        for (var i = 0; i < files.length; i++) {
            currentCommand = files[i].substr(0, files[i].length-3);
            if (commandHelp.hasOwnProperty(currentCommand)) {
                response.push("**/" + currentCommand + "** " + commandHelp[currentCommand])
            } else {
                response.push("**/" + currentCommand + "**")
            }
        }
        response = "Commandes disponibles:\n\n" + response.join("\n");
        bot.sendMessage({
            to: data.userID,
            message: response
        });
    });
};