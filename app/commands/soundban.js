var mysql = require('mysql');
module.exports = function(bot, data, params) {
    var connection = mysql.createPool({
        host: data.config.mysql_host,
        user: data.config.mysql_user,
        password: data.config.mysql_password,
        database: data.config.mysql_database
    });

    var errors = [];

    if (typeof data.rawEvent.d.mentions[0] == 'undefined') { errors.push("Il manque un paramêtre !"); }

    connection.query('SELECT * FROM perm WHERE user_id = ? AND rank = "op"', [data.userID], function (err1, rows1, fields) {
        if (err1) console.error(err1);
        if(rows1.length === 1) {
            connection.query('SELECT * FROM perm WHERE user_id = ?', [data.rawEvent.d.mentions[0].id], function (err2, rows2, fields) {
                if (err2) console.error(err2);
                if (rows2.length === 0) {
                    connection.query('INSERT INTO perm (user_id, rank) VALUES (?, "ban")', [data.rawEvent.d.mentions[0].id], function (err3, rows3, fields) {
                        if (err3) console.error(err3);
                    });
                } else {
                    if (rows2[0].rank == "ban") {
                        errors.push("Cette personne est déjà banni !");
                    } else if (rows2[0].rank == "op") {
                        errors.push("Cette personne est opératrice !");
                    } else {
                        errors.push("Erreur inconue");
                    }
                }
            });
        } else {
            errors.push("Vous n'avez  pas les permissions !");
        }
    });

    if (errors.length > 0) {
        return errors;
    }
};