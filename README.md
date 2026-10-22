# Power Website

Site vitrine de coaching sportif en ligne : quiz d'objectif, programmes, abonnements, calculateur IMC / besoins, contact et connexion.

**Site en ligne : _à compléter avec l'URL de déploiement_**

## Structure

```
index.html              Quiz d'objectif (page d'entrée)
pages/                  accueil, programmes, contact, connexion
assets/css/             common.css (règles partagées) + un CSS par page
assets/js/              common.js, validation.js + un JS par page
assets/images/ video/   médias optimisés
sitemap.xml, robots.txt référencement

```

## Choix techniques

**Cohérence.** Mêmes liens de navigation (même ordre), même pied de page (`.pied-de-page`) et même charte noir / or sur toutes les pages sauf sur index.html . Aucun style inline : tout passe par des classes. Les règles répétées (boutons or, champs, pages « simples », erreurs de formulaire) sont dans `common.css`.

**Responsive.** `box-sizing: border-box` global, champs fluides, titres en `clamp()`, grille Bootstrap, vérifié sans défilement horizontal du mobile au desktop.

**Accessibilité (RGAA).**

- Contrastes : texte noir sur fond or (≈ 8:1) à la place du blanc (≈ 2,3:1) ; placeholders éclaircis (critère 3.2).
- Vidéo d'arrière-plan avec bouton pause/lecture, non lancée en mode « mouvement réduit » (critères 4.10, 13.8).
- Chaque champ a un `<label>` visible et un `autocomplete` ; erreurs liées par `aria-describedby` / `aria-invalid` (11.1, 11.10, 11.13).
- Un seul `h1` par page, hiérarchie h1 > h2 > h3 sans saut (9.1).
- Lien d'évitement, focus visible, `aria-current`, police OpenDyslexic activable, alternative textuelle du graphique (1.1).

**SEO et poids.** Balises sémantiques, title et description uniques, canonical, Open Graph, schema.org. `sitemap.xml` et `robots.txt` ; la page de connexion est en `noindex` et absente du sitemap (on ne la bloque pas dans robots.txt, sinon les moteurs ne verraient pas le `noindex`). Images redimensionnées à 800 px, `loading="lazy"`, `width`/`height` renseignés.

**JavaScript.**

- `validation.js` : validation par expressions régulières (nom, email, mot de passe, message, poids, taille, âge) avec messages d'erreur clairs.
- Envoi des formulaires en `fetch`, sans rechargement, vers une API de démonstration (JSONPlaceholder). Le mot de passe n'est jamais envoyé.
- `accueil.js` : calculateur IMC / besoins (Mifflin-St Jeor) avec graphique **Chart.js**, choisi pour éviter de coder à la main un graphique responsive et accessible.

## Lancer en local

Servir le dossier avec un serveur statique (ex. extension Live Server de VS Code) et ouvrir `index.html`.

## Déploiement (GitHub Pages)

Settings > Pages > Deploy from a branch > `main` / root. Remplacer ensuite `https://www.powerwebsite.fr` par l'URL réelle dans les `canonical`, les balises Open Graph, `sitemap.xml` et `robots.txt`.
