// index.js - quiz d'objectif (page index.html)
// Aucun onclick inline : écouteurs attachés ici via addEventListener().

document.addEventListener('DOMContentLoaded', function () {
    var boutonsObjectif = document.querySelectorAll('.btn-objectif');
    var champObjectif = document.getElementById('hidden-goal-id');
    var formulaire = document.getElementById('formulaire-email');
    var champNom = document.getElementById('champ-nom');

    /**
     * Affiche le formulaire d'inscription et mémorise l'objectif choisi.
     * @param {string} id - "perte_de_poids", "renforcement_musculaire" ou "nutrition"
     */
    function choisir(id) {
        champObjectif.value = id;
        formulaire.hidden = false;
        champNom.focus();
    }

    boutonsObjectif.forEach(function (bouton) {
        bouton.addEventListener('click', function () {
            choisir(bouton.dataset.objectif);
        });
    });

    PW.initFormulaire(formulaire, {
        succes: 'Merci ! Ton bilan offert arrive par email.'
    });
});
