// contact.js - formulaire de contact
//
// 1) Pré-remplit le sujet quand on arrive depuis un bouton "DÉCOUVRIR"
//    (contact.html?sujet=programme).
// 2) Valide le formulaire (regex) et l'envoie sans recharger la page.

document.addEventListener('DOMContentLoaded', function () {
    var parametres = new URLSearchParams(window.location.search);
    var sujet = parametres.get('sujet');
    var champSujet = document.getElementById('champ-sujet');

    if (sujet && champSujet) {
        var optionExiste = Array.prototype.some.call(
            champSujet.options,
            function (option) { return option.value === sujet; }
        );
        if (optionExiste) {
            champSujet.value = sujet;
        }
    }

    PW.initFormulaire(document.getElementById('formulaire-contact'), {
        succes: 'Merci ! Ton message a bien été envoyé, un coach te répond rapidement.'
    });
});
