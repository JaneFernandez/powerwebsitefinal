// connexion.js - formulaire de connexion
// Le site est un front-end statique : il n'y a pas de vraie authentification.
// On valide les champs (regex) et on simule l'appel serveur en asynchrone.

document.addEventListener('DOMContentLoaded', function () {
    PW.initFormulaire(document.getElementById('formulaire-connexion'), {
        succes: 'Connexion simulée (démo sans serveur d\'authentification).'
    });
});
