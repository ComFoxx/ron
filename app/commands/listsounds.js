//var fileExists = require('file-exists');
var fs = require('fs');
module.exports = function(bot, data, params) {
    fs.readdir("././sound", function (err, files){
        if (err) { console.error(err); }
        var sound = files.join("\n");
        bot.sendMessage({
            to: data.userID,
            message: sound
        });
    });
};