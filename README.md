# 🌍 Le Tour du Monde — jeux de géographie pour enfants

Cinq petits jeux en français pour apprendre les **pays**, leurs **capitales** et leurs **drapeaux** en s'amusant.
Ils sont pensés pour un enfant d'environ 8 ans et se jouent aussi bien sur ordinateur que sur téléphone.

👉 **Jouer en ligne : https://alefauch.github.io/edu_games/**

## Les jeux

| Jeu | Principe |
| --- | --- |
| 🏛️ **1. Trouve la capitale** | Un pays s'affiche : choisis sa capitale parmi 3 réponses. |
| 🗺️ **2. Trouve le pays** | Une capitale s'affiche : choisis son pays parmi 3 réponses. |
| 🏃‍♀️ **3. La course des capitales** | Une capitale s'affiche et chaque couloir de la piste porte un nom de pays. Place la coureuse dans le bon couloir avant la haie : elle accélère à chaque bonne réponse et tombe à la première erreur. ⚡ **Sprint** : appui long sur un couloir, toucher le nom d'un pays en haut de l'écran (ou flèche ↑) fait foncer la coureuse jusqu'à la haie ; si c'est la bonne réponse, elle gagne des points bonus (plus le sprint est lancé tôt, plus il rapporte). Le score est la distance parcourue plus les bonus. |
| 🚩 **4. Quel est ce drapeau ?** | Un drapeau s'affiche : trouve le pays. *Facile* : 3 choix · *Moyen* : 8 choix · *Difficile* : écrire le nom (avec autocomplétion). |
| 🎌 **5. Trouve le drapeau** | Un pays s'affiche : touche son drapeau. *Facile* : 3 drapeaux · *Moyen* : 8 · *Difficile* : 20. |

### Règles des jeux chronométrés (1, 2, 4 et 5)

- La partie dure **1 minute**.
- Une bonne réponse rapporte les points du **combo** : +1, puis +2, +3… tant qu'on enchaîne les bonnes réponses.
- Une erreur coûte **1 point** (le score ne descend jamais sous zéro) et remet le combo à zéro.
- À la fin, une liste **« À retenir »** rappelle les réponses manquées.

### Réglages

- **Continents** : Europe, Asie, Amérique, Afrique (et Océanie pour les drapeaux). On peut n'en garder qu'un pour s'entraîner.
- **Difficulté** pour les jeux de drapeaux.
- Les **records** sont enregistrés dans le navigateur, sur l'appareil utilisé.

### Choix des pays

- Les pays les plus connus, et en particulier les pays européens, reviennent plus souvent.
- Le Caucase et l'Afrique centrale ne sont pas inclus.
- Les jeux de drapeaux couvrent toute l'Europe et les grands pays des autres continents.

## Organisation du dépôt

```
games/
├── index.html                    Menu principal
├── jeu1-capitales.html           Jeu 1
├── jeu2-pays.html                Jeu 2
├── jeu3-course.html              Jeu 3
├── jeu4-drapeaux.html            Jeu 4
├── jeu5-trouve-le-drapeau.html   Jeu 5
├── assets/
│   ├── data.js                   Liste des pays, capitales, continents
│   ├── common.js                 Code partagé (minuteur, score, sons…)
│   └── style.css                 Styles communs
└── flags/                        Drapeaux (SVG) stockés localement
.github/workflows/pages.yml       Publication automatique sur GitHub Pages
```

Le site est en HTML, CSS et JavaScript, sans dépendance ni étape de compilation.

**Modifier les pays ou les capitales :** tout se trouve dans [`games/assets/data.js`](games/assets/data.js).

**Ajouter un pays au jeu de drapeaux :** il faut aussi ajouter son fichier `flags/<code>.svg`.

## Jouer en local

Ouvrir directement `games/index.html` dans un navigateur suffit.

Pour y jouer depuis un téléphone sur le même réseau Wi-Fi, lancer depuis le dossier `games/` :

```sh
python -m http.server 8000
```

Ouvrir ensuite `http://<adresse-ip-du-pc>:8000` sur le téléphone.

## Publication

Chaque modification du dossier `games/` poussée sur la branche `main` est publiée automatiquement sur GitHub Pages par le workflow [`pages.yml`](.github/workflows/pages.yml).

## Crédits

- Drapeaux : [flagcdn.com](https://flagcdn.com) (domaine public).
- Police : [Fredoka](https://fonts.google.com/specimen/Fredoka) (Google Fonts).
