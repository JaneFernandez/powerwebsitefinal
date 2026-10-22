// accueil.js - page d'accueil
//  1) vidéo d'arrière-plan : bouton pause/lecture + chargement économe
//  2) calculateur IMC / besoins caloriques avec graphique Chart.js

document.addEventListener('DOMContentLoaded', function () {

    /* ---------- 1. Vidéo d'arrière-plan ---------- */
    var video = document.getElementById('myVideo');
    var boutonVideo = document.getElementById('bouton-pause-video');

    function majBoutonVideo() {
        var enPause = video.paused;
        boutonVideo.textContent = enPause ? 'Lancer la vidéo' : 'Mettre la vidéo en pause';
        boutonVideo.setAttribute('aria-pressed', enPause ? 'true' : 'false');
    }

    if (video && boutonVideo) {
        var mouvementReduit = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        var petitEcran = window.matchMedia('(max-width: 768px)').matches;
        var economieDonnees = navigator.connection && navigator.connection.saveData;

        // La vidéo n'est téléchargée et lancée que si elle est vraiment utile :
        // pas sur mobile, pas en mode économie de données, pas si l'utilisateur
        // a demandé moins d'animations. Sinon, l'image "poster" suffit.
        if (!mouvementReduit && !petitEcran && !economieDonnees) {
            video.preload = 'auto';
            video.play().catch(function () { /* lecture refusée : on garde le poster */ });
        }

        video.addEventListener('play', majBoutonVideo);
        video.addEventListener('pause', majBoutonVideo);
        boutonVideo.addEventListener('click', function () {
            if (video.paused) {
                video.preload = 'auto';
                video.play();
            } else {
                video.pause();
            }
        });
        majBoutonVideo();
    }

    /* ---------- 2. Calculateur IMC / besoins ---------- */
    var formulaire = document.getElementById('formulaire-calcul');
    var zoneResultat = document.getElementById('resultat-calcul');
    var graphique = null;

    function categorieImc(imc) {
        if (imc < 18.5) { return 'insuffisance pondérale'; }
        if (imc < 25) { return 'corpulence normale'; }
        if (imc < 30) { return 'surpoids'; }
        return 'obésité';
    }

    /**
     * Estimation : métabolisme de base (Mifflin-St Jeor) x 1,55 (activité modérée),
     * ajustée selon l'objectif. Plancher de 1500 kcal par sécurité.
     */
    function calculer(poids, taille, age, sexe, objectif) {
        var base = 10 * poids + 6.25 * taille - 5 * age + (sexe === 'homme' ? 5 : -161);
        var coef = { perte: 0.85, masse: 1.10, forme: 1.0 }[objectif];
        var kcal = Math.max(1500, Math.round(base * 1.55 * coef));
        var proteinesParKg = { perte: 2.0, masse: 1.8, forme: 1.4 }[objectif];
        var proteines = Math.round(proteinesParKg * poids);
        var lipides = Math.round((kcal * 0.25) / 9);
        var glucides = Math.max(0, Math.round((kcal - proteines * 4 - lipides * 9) / 4));
        var imc = poids / Math.pow(taille / 100, 2);
        return { imc: imc, kcal: kcal, proteines: proteines, glucides: glucides, lipides: lipides };
    }

    function dessinerGraphique(resultat) {
        var canvas = document.getElementById('graphique-macros');
        if (typeof Chart === 'undefined' || !canvas) { return; }
        if (graphique) { graphique.destroy(); }

        graphique = new Chart(canvas, {
            type: 'bar',
            data: {
                labels: ['Protéines', 'Glucides', 'Lipides'],
                datasets: [{
                    data: [resultat.proteines, resultat.glucides, resultat.lipides],
                    backgroundColor: '#c99c3a'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { ticks: { color: '#ffffff' }, grid: { color: 'rgba(255,255,255,0.2)' } },
                    y: {
                        beginAtZero: true,
                        title: { display: true, text: 'grammes par jour', color: '#ffffff' },
                        ticks: { color: '#ffffff' },
                        grid: { color: 'rgba(255,255,255,0.2)' }
                    }
                }
            }
        });
    }

    if (formulaire) {
        formulaire.noValidate = true;
        PW.validationEnDirect(formulaire);

        formulaire.addEventListener('submit', function (evenement) {
            evenement.preventDefault();
            if (!PW.validerFormulaire(formulaire)) { return; }

            var lire = function (id) {
                return parseFloat(document.getElementById(id).value.replace(',', '.'));
            };
            var r = calculer(
                lire('calc-poids'),
                lire('calc-taille'),
                lire('calc-age'),
                document.getElementById('calc-sexe').value,
                document.getElementById('calc-objectif').value
            );

            document.getElementById('texte-imc').textContent =
                'Ton IMC est de ' + r.imc.toFixed(1).replace('.', ',') +
                ' (' + categorieImc(r.imc) + ', repères OMS).';
            document.getElementById('texte-calories').textContent =
                'Besoin estimé : environ ' + r.kcal + ' kcal par jour, dont ' +
                r.proteines + ' g de protéines, ' + r.glucides + ' g de glucides et ' +
                r.lipides + ' g de lipides.';
            document.getElementById('graphique-macros').setAttribute(
                'aria-label',
                'Graphique en barres : ' + r.proteines + ' g de protéines, ' +
                r.glucides + ' g de glucides, ' + r.lipides + ' g de lipides par jour.'
            );

            zoneResultat.hidden = false;
            dessinerGraphique(r);
        });
    }
});
