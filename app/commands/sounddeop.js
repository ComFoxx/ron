var mysql = require('mysql');
module.exports = function(bot, data, params) {
    var connection = mysql.createPool({
        host: data.config.mysql_host,
        user: data.config.mysql_user,
        password: data.config.mysql_password,
        database: data.config.mysql_database
    });

    var errors = [];

    if (typeof data.rawEvent.d.mentions[0] == 'undefined') { errors.push("Il manque un paramêtre !"); return errors; }

    connection.query('SELECT * FROM perm WHERE user_id = ? AND rank = "op"', [data.userID], function (err1, rows1, a) {
        if (err1) console.error(err1);
        if(rows1.length === 1) {
            connection.query('SELECT * FROM perm WHERE user_id = ? AND rank = "op"', [data.rawEvent.d.mentions[0].id], function (err2, rows2, b) {
                if (err2) console.error(err2);
                if (rows2.length === 1) {
                    connection.query('DELETE FROM perm WHERE id = ?', [rows2[0].id], function (err3, rows3, c) {
                        if (err3) console.error(err3);
                    });
                } else {
                    errors.push("Cette personne n'est pas opératrice");
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