module.exports = function(bot, data, params) {
    var phrase;
    phrase = [
        "Encore du travail ?",
        "Pardon ?",
        "Oui messire !",
        "Qu'il y a-t-il ?"
    ];
    bot.sendMessage({
        to: data.userID,
        message: phrase[(Math.floor(Math.random() * (4 - 0)) + 0)]
    });
    console.log(data.user + ' ping !');
};