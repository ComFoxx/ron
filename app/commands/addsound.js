var exec = require('child_process').exec;

module.exports = function(bot, data, params) {

    var errors = [];

    var file = data.rawEvent.d.attachments[0];
    console.log(file);
    if (file) {
        if (file.filename.substr(-3) === 'ogg' || file.filename.substr(-3) === 'mp3' || file.filename.substr(-3) === 'wav' && file.filename.substr(-4, 1) === '.') {
            var wget = "wget -O sound/" + file.filename.substr(0, file.filename.length-4) + " " + file.url;
            var child = exec(wget, function(err, stdout, stderr) {
                if (err) console.error("ERREUR !" + err + " \n STDOUT " + stdout + "\n STDERR " + stderr);
            });
        } else {
            errors.push("Erreur extension invalide.");
        }
    } else {
        errors.push("Erreur aucun fichier.");
    }

    if (errors.length > 0) {
        return errors;
    }
};