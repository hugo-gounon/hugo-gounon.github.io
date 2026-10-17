# Portfolio de Hugo Gounon — médias et édition

## Examiner le site

Ouvrez index.html directement dans un navigateur. Les six cartes ouvrent les pages HTML du dossier projects. Les fichiers fonctionnent aussi sur GitHub Pages sans compilation. Aucune publication n’a été lancée.

## Médias disponibles et fichiers à fournir

11 images personnelles sont désormais intégrées : CUBIK (2), SLIDER 3 AXES (2), CAMERA CAR (4), CONTRÔLEUR FOC (2) et BOÎTE AUTOMATIQUE (1). Les couvertures alimentent les cartes et les médias principaux ; les autres images alimentent les diaporamas et les galeries. L’accueil utilise la vue d’ensemble de CAMERA CAR. Le dossier du vélo cargo reste vide : sa carte conserve un fond sobre. Aucune vidéo locale n’est présente.

Les quatre photos de CAMERA CAR disposent de copies JPEG plus légères dans assets/projects/camera-car/web/ (grand côté limité à 2 000 pixels). Tous les originaux sont conservés ; le site utilise les copies optimisées. Les anciennes illustrations orbite.svg, circuit.svg et signal.svg ne sont pas utilisées comme photos des projets.

Les dossiers suivants sont prêts et contiennent un .gitkeep pour être conservés par Git :
- assets/projects/cubik/
- assets/projects/slider/
- assets/projects/camera-car/
- assets/projects/foc/
- assets/projects/cargo/
- assets/projects/boite-auto/

Pour de futurs ajouts, cover.jpg, demo.mp4 et les noms des photos de galerie sont des suggestions : les noms actuels ont été conservés et leurs chemins sont déjà renseignés dans script.js. Il reste à ajouter les photos du vélo cargo et, si vous le souhaitez, des vidéos locales. Une autre couverture d’accueil et un CV restent facultatifs.

## Configuration centrale

Modifiez PROJECT_MEDIA au début de script.js. Tous les chemins sont écrits depuis la racine du site : le script les résout correctement depuis index.html et depuis les six pages projects/*.html, y compris dans un sous-dossier GitHub Pages et en ouverture locale.

Exemple pour CUBIK, à utiliser uniquement après avoir ajouté les fichiers :

```js
cubik: {
  cover: 'assets/projects/cubik/cover.jpg',
  coverAlt: 'Décrivez précisément le cube et la situation visibles sur votre photo',
  video: 'assets/projects/cubik/demo.mp4',
  gallery: [
    {
      src: 'assets/projects/cubik/detail-01.jpg',
      alt: 'Décrivez précisément le détail visible sur cette photo',
      caption: 'Légende facultative'
    },
    {
      src: 'assets/projects/cubik/detail-02.jpg',
      alt: 'Description de la seconde photo',
      caption: ''
    }
  ],
  position: 'center'
}
```

Laissez les valeurs vides en l’absence de fichiers. Les titres des cartes et les textes éditoriaux restent dans les fichiers HTML ; aucun chargement de JSON ni serveur n’est nécessaire.

### Photos

La couverture est le média principal. Sans couverture, la première photo de galerie peut être utilisée. Sur les cartes, la couverture et les autres photos défilent toutes les 6 secondes avec un fondu de 1,4 seconde. Une photo unique reste fixe. Le bouton pause dispose d’un nom accessible.

Les images sont chargées et décodées avant d’être insérées. Les images introuvables ne sont pas affichées ; une galerie sans image valide est masquée. Sur les cartes, object-fit: cover remplit la case sans déformer le média. Ajustez position pour le cadrage. Sur les pages détaillées, le média principal et les images de galerie préservent la vue entière avec object-fit: contain.

Les fonds des cartes sont décoratifs ; les couvertures détaillées et les galeries utilisent coverAlt et alt. Renseignez ces descriptions d’après vos images réelles. Les éventuelles légendes sont facultatives et restent dans la galerie.

### Vidéos locales

Utilisez un vrai fichier MP4, WebM ou OGV, jamais l’URL d’une page web. Sur les cartes, la vidéo est muette, en boucle et jouée dans la page. Elle n’est créée qu’au premier passage visible si la lecture est autorisée. Elle s’arrête hors écran, lorsque l’onglet est masqué et lorsqu’un panneau est ouvert. La couverture reste disponible en cas de refus de lecture automatique ou d’erreur.

Sur une page de projet, le lecteur natif dispose de ses propres commandes et démarre uniquement sur demande. preload=none évite le chargement initial de la vidéo. La réduction des animations et l’économiseur de données empêchent le démarrage automatique des cartes ; les fondus et le zoom sont désactivés lorsque les animations sont réduites.

Les liens INSA et Instagram fournis restent des liens « Voir la démonstration » : ce sont des pages web et ils ne sont pas employés comme sources MP4. Aucun lecteur tiers n’est chargé automatiquement.

## Contenu et coordonnées

Les six projets remplacent les deux anciens emplacements. Chaque page reprend le sous-titre, l’accroche, les paragraphes, les repères et les liens fournis. Les contributions collectives de CUBIK et de la boîte automatique sont conservées. La boîte automatique est explicitement en cours ; les essais sous charge sont à venir. La puissance de 1 kW n’est pas publiée pour le contrôleur FOC. Aucune capacité de transport ou homologation n’est annoncée pour le vélo cargo.

L’adresse confirmée est hugo.gounon@gmail.com. Elle figure dans le panneau Contact de l’accueil. Les liens Contact des pages détaillées y ramènent. Les textes provisoires, l’ancienne adresse d’exemple et les consignes de préparation ont été retirés des pages publiques.

Restent facultatifs : un CV, des informations complémentaires sur le parcours, et des liens de présentation ou dépôts de code pour FOC, vélo cargo et boîte automatique s’ils existent. Aucun de ces éléments n’a été inventé.

## Publication ultérieure

Placez index.html, style.css, script.js, le dossier projects et le dossier assets à la racine du dépôt. Dans GitHub Pages, sélectionnez la branche et le dossier racine. Respectez la casse des noms de fichiers. La présente intervention prépare uniquement les fichiers locaux.

## Vérification

Les contrôles portent sur la syntaxe, les liens internes, les textes et attributions, la résolution des médias depuis les pages, les interactions simulées et les calculs de la grille. Aucun navigateur de contrôle n’est connecté dans cette session : la lisibilité et les cadrages doivent encore être examinés visuellement sur ordinateur et téléphone, notamment après l’ajout des vrais médias.
