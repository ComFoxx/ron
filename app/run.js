var run = {

    name: '',
    params: [],

    init: function(commands) {
        var beforeSlash = 0;
        var quote = false;
        var first = true;
        var param = '';

        for (var i = 0; i < commands.length; i += 1) {
            var s = commands[i];
            if (first) {
                if (s === ' ') {
                    first = false;
                } else {
                    run.name += s;
                }
            } else {
                if (beforeSlash > 0) {
                    beforeSlash -= 1;
                }

                if (s === '"' && beforeSlash === 0) {
                    quote = !quote;
                } else if (s === '\\' && beforeSlash === 0) {
                    beforeSlash = 2;
                } else if (s === ' ' && !quote) {
                    run.params.push(param);
                    param = '';
                } else {
                    param += s;
                }
            }
        }

        if (param !== '') {
            run.params.push(param);
        }
    },

    run: function(bot, data) {
        try {
            var command = require('./commands/' + run.name);
            var errors = command(bot, data, run.params);

            if (errors) {
                bot.sendMessage({
                    to: data.userID,
                    message: errors
                }, function(error, response) {
                    if (error) console.log(error);
                });
            } else {
                if (run.name !== 'addsound') {
                    bot.deleteMessage({
                        channelID: data.channelID,
                        messageID: data.rawEvent.d.id
                    });
                }
            }
        } catch (e) {
            console.log(e);
        }
        run.name = '';
        run.params = [];
    }
};

module.exports = run;
