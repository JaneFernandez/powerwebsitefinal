// common.js
// Comportement partagé par toutes les pages du site.
//
// Rôle : permettre à l'utilisateur d'activer/désactiver la police
// OpenDyslexic (Cr 1.c.2) depuis n'importe quelle page, et mémoriser
// son choix d'une page à l'autre via localStorage.

document.addEventListener('DOMContentLoaded', function () {
    var CLE_STOCKAGE = 'pw-police-dyslexie';
    var bouton = document.getElementById('bouton-police-dyslexie');

    function appliquerPreference(active) {
        document.body.classList.toggle('police-dyslexie', active);
        if (bouton) {
            bouton.setAttribute('aria-pressed', active ? 'true' : 'false');
            bouton.textContent = active
                ? 'Police standard'
                : 'Police dyslexie';
        }
    }

    // Applique la préférence enregistrée au chargement de chaque page.
    var preferenceEnregistree = window.localStorage.getItem(CLE_STOCKAGE) === 'true';
    appliquerPreference(preferenceEnregistree);

    if (bouton) {
        bouton.addEventListener('click', function () {
            var estActive = document.body.classList.contains('police-dyslexie');
            var nouvelEtat = !estActive;
            appliquerPreference(nouvelEtat);
            window.localStorage.setItem(CLE_STOCKAGE, String(nouvelEtat));
        });
    }
});
