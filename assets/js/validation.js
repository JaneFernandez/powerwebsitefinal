// validation.js
// Validation côté client par expressions régulières + envoi asynchrone (fetch).
// Chargé sur toutes les pages qui contiennent un formulaire.
//
// Utilisation : ajouter data-regle="nom|email|motdepasse|message|poids|taille|age"
// sur un champ ; le message d'erreur s'affiche juste en dessous (aria-describedby).

var PW = (function () {
    'use strict';

    // Point d'envoi des formulaires. JSONPlaceholder simule une API : il répond
    // 201 sans rien enregistrer. À remplacer par une vraie URL (Formspree, API...).
    var ENDPOINT = 'https://jsonplaceholder.typicode.com/posts';

    var REGLES = {
        nom: {
            regex: /^[A-Za-zÀ-ÖØ-öø-ÿ][A-Za-zÀ-ÖØ-öø-ÿ' -]{1,49}$/,
            message: 'Entre 2 et 50 lettres (espaces, apostrophes et tirets autorisés).'
        },
        email: {
            regex: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/,
            message: 'Adresse email invalide (exemple : nom@exemple.com).'
        },
        motdepasse: {
            regex: /^.{8,64}$/,
            message: 'Le mot de passe doit contenir au moins 8 caractères.'
        },
        message: {
            regex: /^[\s\S]{10,1000}$/,
            message: 'Le message doit contenir entre 10 et 1000 caractères.'
        },
        poids: {
            regex: /^\d{2,3}([.,]\d)?$/,
            message: 'Indique ton poids en kg (exemple : 72 ou 72,5).'
        },
        taille: {
            regex: /^\d{3}$/,
            message: 'Indique ta taille en cm sur 3 chiffres (exemple : 175).'
        },
        age: {
            regex: /^\d{2}$/,
            message: 'Indique ton âge sur 2 chiffres (exemple : 25).'
        }
    };

    function zoneErreur(champ) {
        var id = champ.id + '-erreur';
        var zone = document.getElementById(id);
        if (!zone) {
            zone = document.createElement('span');
            zone.id = id;
            zone.className = 'champ-erreur';
            champ.insertAdjacentElement('afterend', zone);
            champ.setAttribute('aria-describedby', id);
        }
        return zone;
    }

    function afficherErreur(champ, message) {
        zoneErreur(champ).textContent = message;
        if (message) {
            champ.setAttribute('aria-invalid', 'true');
        } else {
            champ.removeAttribute('aria-invalid');
        }
    }

    /** Valide un champ. Retourne true s'il est valide. */
    function validerChamp(champ) {
        var regle = REGLES[champ.dataset.regle];
        var valeur = champ.dataset.regle === 'motdepasse' ? champ.value : champ.value.trim();
        var message = '';

        if (champ.required && valeur === '') {
            message = 'Ce champ est obligatoire.';
        } else if (valeur !== '' && regle && !regle.regex.test(valeur)) {
            message = regle.message;
        } else if (valeur !== '' && (champ.dataset.min || champ.dataset.max)) {
            var nombre = parseFloat(valeur.replace(',', '.'));
            var min = parseFloat(champ.dataset.min);
            var max = parseFloat(champ.dataset.max);
            if (nombre < min || nombre > max) {
                message = 'La valeur doit être comprise entre ' + min + ' et ' + max + '.';
            }
        }

        afficherErreur(champ, message);
        return message === '';
    }

    function champsAValider(form) {
        return form.querySelectorAll('[data-regle], [required]');
    }

    /** Valide tout le formulaire et met le focus sur le premier champ en erreur. */
    function validerFormulaire(form) {
        var premierInvalide = null;
        Array.prototype.forEach.call(champsAValider(form), function (champ) {
            if (!validerChamp(champ) && !premierInvalide) {
                premierInvalide = champ;
            }
        });
        if (premierInvalide) {
            premierInvalide.focus();
        }
        return premierInvalide === null;
    }

    /** Validation au fil de la saisie : à la sortie du champ, puis à chaque frappe. */
    function validationEnDirect(form) {
        Array.prototype.forEach.call(champsAValider(form), function (champ) {
            champ.addEventListener('blur', function () { validerChamp(champ); });
            champ.addEventListener('input', function () {
                if (champ.getAttribute('aria-invalid') === 'true') {
                    validerChamp(champ);
                }
            });
        });
    }

    function zoneStatut(form) {
        var zone = form.querySelector('.statut-formulaire');
        if (!zone) {
            zone = document.createElement('div');
            zone.className = 'statut-formulaire';
            zone.setAttribute('role', 'status');
            form.appendChild(zone);
        }
        return zone;
    }

    /** Envoi asynchrone (fetch) : la page ne se recharge pas. */
    function envoyer(form, messageSucces) {
        var statut = zoneStatut(form);
        var bouton = form.querySelector('[type="submit"]');
        var donnees = {};

        // On n'envoie jamais un mot de passe à l'API de démonstration.
        Array.prototype.forEach.call(form.elements, function (el) {
            if (el.name && el.type !== 'password' && el.type !== 'submit') {
                donnees[el.name] = el.value;
            }
        });

        statut.className = 'statut-formulaire';
        statut.textContent = 'Envoi en cours…';
        if (bouton) { bouton.disabled = true; }

        return fetch(ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(donnees)
        })
            .then(function (reponse) {
                if (!reponse.ok) { throw new Error('HTTP ' + reponse.status); }
                return reponse.json();
            })
            .then(function () {
                statut.className = 'statut-formulaire succes';
                statut.textContent = messageSucces;
                form.reset();
            })
            .catch(function () {
                statut.className = 'statut-formulaire erreur';
                statut.textContent = 'Une erreur est survenue, merci de réessayer dans un instant.';
            })
            .then(function () {
                if (bouton) { bouton.disabled = false; }
            });
    }

    /**
     * Branche un formulaire : validation regex + envoi asynchrone.
     * @param {HTMLFormElement} form
     * @param {{succes: string}} options
     */
    function initFormulaire(form, options) {
        if (!form) { return; }
        form.noValidate = true; // on remplace les bulles natives par nos messages
        validationEnDirect(form);
        form.addEventListener('submit', function (evenement) {
            evenement.preventDefault();
            if (validerFormulaire(form)) {
                envoyer(form, options.succes);
            }
        });
    }

    return {
        validerChamp: validerChamp,
        validerFormulaire: validerFormulaire,
        validationEnDirect: validationEnDirect,
        initFormulaire: initFormulaire
    };
})();
