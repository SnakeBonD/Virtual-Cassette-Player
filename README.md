## Couleurs vives et relief de la coque — 30 octobre 2026

Six finitions supplémentaires sur le corps complet : bleu électrique, turquoise vif, rouge corail, orange mandarine, violet pop et jaune solaire (14 au total). La recoloration conserve la luminance de la photo pour préserver le grain et le moulage ; un éclairage doux, un reflet de bord et des ombres renforcent le relief. Les vis sont restaurées en métal neutre après la coloration. Ces traitements sont calculés au changement de finition, pas à chaque image de la vidéo.

## Nouveau modèle : transparente fumée

Le menu Corps de cassette propose désormais l’originale et une variante fumée à grande fenêtre, déclinées en huit finitions. La nouvelle fenêtre est dessinée en Canvas : enroulements de bande animés, flasques transparents, guides et reflets. Le cadre texturé provient de la coque originale validée. Cover, texte manuscrit, année, vis métalliques et matériel de la platine sont conservés. Le choix est mémorisé par piste. Les anciens modèles photographiques restent exclus du menu.

Validation : 27 tests, compilation et export navigateur de 3 secondes.

# Version 0.9.1 — accent de l’étiquette et platine épurée

La couleur d’accent pilote les trois bandes de l’étiquette, y compris les actions couleur de pochette et couleur du modèle. La texture est recalculée uniquement au changement de finition ou d’accent. Artiste et titre restent sur la cassette ; ils ne sont plus répétés sur la platine. Waveform, curseur et temps sont remontés et centrés dans la zone supérieure de la platine, au-dessus des commandes.

---

# Version 0.9 — coins coupés, écriture au stylo et année

Étiquette ivoire à quatre coins coupés ; artiste et titre en bleu avec Segoe Print (repli Comic Sans MS/cursive). La police dépend des fontes locales ; le rendu est incorporé au canvas exporté. Autocollant légèrement incliné en bas à droite si une année valide existe.

Priorité au YEAR/date des métadonnées du fichier. Si absent, recherche automatique via le serveur local sur MusicBrainz : seuls artiste et titre sont envoyés, jamais l’audio ni la pochette. Correspondance stricte des noms, exclusion des enregistrements désambiguïsés, première date de sortie parmi les résultats compatibles. Cela représente la première sortie connue dans cette base, pas une garantie discographique absolue. Une source est affichée. En cas d’indisponibilité ou d’absence de résultat, aucune année n’est inventée ; champ manuel et bouton pour réessayer. Les modifications manuelles et résultats sont conservés dans la session, sans réécriture des tags du fichier. Les recherches sont limitées à une par 1,1 seconde et mises en cache dans le processus serveur.

Redémarrer `node server.mjs` pour activer /api/year. Une connexion à musicbrainz.org est nécessaire au serveur pour le repli en ligne. API : https://musicbrainz.org/doc/MusicBrainz_API (service gratuit pour usage non commercial ; conditions à vérifier avant exploitation commerciale).

Vérification : 26 tests passent (tags YEAR et TDRC, absence de date, identité artiste/titre, rééditions). Dans le navigateur : LIORA lit 2026 depuis son tag ; recherche sans année de Daft Punk / Da Funk retourne 1995 avec source. Pas de déploiement.

---

# Correctif 0.8.1 — étiquette claire

Le fond noir de l’étiquette est remplacé par un papier ivoire clair et trois bandes corail rétro. Seule la fenêtre arrondie autour des bobines et de la bande reste sombre. Les huit couleurs de coque sont conservées.

---

# Version 0.8 — étiquette 1990 et huit couleurs

Étiquette inspirée de la référence 1990 : bande supérieure ivoire à lignes, zone centrale sombre et bandeau inférieur avec flèche et durée réelle de la piste. La coque, les axes, les pions noirs, la tête et les vis argentées restent conservés. Quatre nouvelles finitions : vert olive, bleu cobalt, prune, sable. Les huit finitions sont mémorisables par piste et visibles dans la galerie.

---

# Correctif 0.7.4 — vis métalliques

Les cinq têtes de vis sont recomposées après la coloration du plastique, en argent neutre. Le relief et les empreintes cruciformes de la texture sont préservés. La même finition métallique s’applique aux quatre thèmes.

---

# Correctif 0.7.3 — pions de centrage

Les deux orifices rectangulaires centraux montrent maintenant des pions arrondis en plastique noir, avec un reflet discret. Axes extérieurs et tête de lecture conservés.

---

# Version 0.7.2 — mécanique visible et liste simplifiée

Ajout des axes métalliques dans les ouvertures inférieures de la coque originale et de la couronne de la tête de lecture légèrement visible sous son bord inférieur. Ces détails sont dessinés par le canvas commun à l’aperçu et aux exports, indépendamment de la finition.

Les anciens corps ont été retirés du sélecteur et de la galerie. Les anciennes préférences de corps sont migrées vers original au chargement audio, en conservant la finition. Les fichiers historiques restent sur disque. Le bouton « Changer de finition » parcourt les quatre finitions de la nouvelle coque. Vérification navigateur : PNG, chargement LIORA, liste limitée à original et changement de finition mémorisé. Aucun nouvel export vidéo testé pour cette correction visuelle.

---

# Version 0.7.1 — coque originale et quatre finitions

La première plaque est remplacée par une vraie coque originale générée : vis, fenêtre encastrée, logements de moyeux et ouvertures de guidage. Asset : public/assets/cassettes/original-v2.png. Les moyeux et la bande restent animés par le studio et leurs coordonnées ont été ajustées à cette coque.

Quatre finitions dans « Finition de la cassette » lorsque « SnakeBonD originale · intégrée » est sélectionnée : noir/ivoire, argent, bordeaux, bleu pétrole. Ce sont des traitements locaux de la même coque, pas quatre géométries différentes. Les textures sont préparées une fois au chargement pour éviter de les recalculer pendant l’export. Le choix est mémorisé par piste avec le mécanisme existant. La création IA à chaque chanson n’est pas implémentée.

---

# Version 0.7 — première coque originale générée

Une base photoréaliste originale a été créée avec l’outil imagegen intégré, sans reprendre les photos de cassettes fournies. Texture plein cadre sans contour extérieur, puis intégration canvas aux dimensions du logement (880 × 573), moyeux et bande animés séparément. Le modèle « SnakeBonD originale · intégrée » est sélectionné au démarrage. Une préférence de piste enregistrée auparavant reste prioritaire au chargement ; sélectionner le nouveau modèle pour la remplacer.

Il existe pour le moment une seule nouvelle base générée, en plus des sept références précédentes. Le studio ne lance pas une génération IA à chaque import. Cette première coque établit le gabarit pour les prochaines créations. La génération automatique de nouvelles coques par chanson reste à implémenter. Les références anciennes restent sélectionnables.

Asset : public/assets/cassettes/original.png. Prompt exact : IMAGEGEN-PROMPT.md. Vérification visuelle de l’intégration et du PNG ; pas de nouveau test d’export vidéo à cette étape.

---

# Correctif 0.6.1 — intégration des corps

La zone remplacée couvre désormais toute la coque photographique d’origine, ses quatre vis et sa lèvre inférieure. Chaque nouveau corps est centré dans le logement avec une échelle uniforme, sur un fond sombre. Le même remplacement s’applique aux images de cassette importées. La galerie utilise les nouvelles dimensions. Vérification visuelle des PNG bleu et blanc : plus de coque d’origine autour du modèle choisi. Le lecteur extérieur reste inchangé.

---

# Version 0.6 — corps de cassette par morceau

Sept corps complets issus des références fournies : métal noir, papier bleu, graphite vintage, bleu translucide, chrome fumé, mécanisme apparent et métal blanc. Les coques, fenêtres et dimensions des moyeux varient ; le lecteur validé reste fixe.

Un corps est attribué automatiquement à chaque fichier audio (SHA-256), avec évitement des corps déjà utilisés dans la session tant que les sept choix ne sont pas épuisés. Le choix manuel et l’accent sont mémorisés localement. « Créer une autre cassette » passe au corps suivant ; « Voir les sept corps » ouvre la galerie. Le modèle Studio antérieur reste disponible.

Il s’agit de compositions locales à partir des sept images, pas de nouvelles images générées par IA ni d’une collection illimitée. Les sources font 289 à 468 pixels de large : leur finesse limite les gros plans. Les zones de texte sont recouvertes, les moyeux remplacés par une géométrie animée ; les détails de bande photographiés hors de la fenêtre centrale restent statiques sur les coques transparentes. Ce point reste à améliorer pour un mécanisme entièrement visible.

Validation : 21 tests automatiques passent. Chargement LIORA, attribution automatique, changement de coque et création d’une vidéo de 3 secondes vérifiés dans le navigateur. Pas de validation d’un export long pour cette version. Aucun déploiement.

---

# Version 0.5 — plein cadre 9:16

Le cadrage par défaut est désormais « Plein cadre · sans marges ». Le lecteur remplit le canvas 1080 × 1920 avec une mise à l'échelle uniforme : les bobines restent rondes. L'écart infinitésimal de ratio de la source 941 × 1672 est absorbé par un recadrage centré de moins d'un pixel en largeur. Aucune marge de sécurité ajoutée. Le cadrage précédent reste disponible dans « Cadrage 9:16 → Avec marges de sécurité ».

L'aperçu, le PNG et la vidéo utilisent le même canvas et donc le même cadrage. Le choix est verrouillé pendant l'export. Les couleurs, tags et mécanique ne changent pas. Les bordures physiques du lecteur font toujours partie de son habillage.

---

# Correctif 0.4.1 — 27 octobre 2026

Les couronnes photographiques réintroduisaient des fragments fixes des anciennes dents sous les six dents animées, surtout à gauche. Elles ont été remplacées par des couronnes concentriques propres. Les six dents s'étendent désormais jusqu'à la couronne et sous le moyeu, supprimant les coupures visibles. Rotation antihoraire, synchronisation et modèles conservés.

18 tests passent, dont un contrôle empêchant le retour du fragment photographique dans le mécanisme. Cette correction remplace la mention des couronnes photographiques de v0.4.

---

# Version 0.4 — sens de rotation et modèles de cassette

- Transfert gauche vers droite : deux rotations antihoraires (angles négatifs canvas), vitesse selon rayon. L'état continue à dépendre de la position réelle de la piste. Aucun changement de sens automatique en fin de chanson.
- Quatre modèles : crème/bordeaux, noir/argent, ivoire/orange, effet fumé. Palette, bandes et typographie varient ; lecteur, vumètres et disposition restent fixes.
- Accent modifiable, couleur suggérée depuis la pochette, retour à la couleur du modèle. Le contraste des petites inscriptions s'adapte à l'accent.
- Agrandissement de la pochette sur l'étiquette ; grain plastique issu de la photo d'origine, reflets fixes, bordures d'étiquette et couronnes photographiques des bobines. Les parties mobiles restent concentriques. Il s'agit d'un rendu hybride photo/canvas amélioré, pas de quatre nouvelles photographies ni d'une transparence physique de la coque.
- Modèle et accent enregistrés dans le stockage local, par empreinte SHA-256 du fichier audio. Ils reviennent après rechargement et réimport du même fichier, même renommé. Modifier les tags du fichier change l'empreinte. Aucun fichier audio n'est conservé après rechargement ; les images personnalisées et retouches de tags restent en mémoire pour cette session. Si le stockage est bloqué, le studio prévient et garde les choix en session.

Validation automatique : 17 tests passent, dont sens antihoraire à plusieurs positions, vitesse selon rayon, centres fixes, conservation de bande, isolation des styles par piste, récupération des préférences et repli sur stockage indisponible. Les sections antérieures ci-dessous décrivent l'historique ; ce correctif remplace notamment le sens de rotation erroné de v0.3.

---

# Correction v0.3 — transport de bande

Le transport utilise la position absolue et la durée complète du morceau. Le rouleau de gauche se vide pendant que celui de droite se remplit ; la somme des surfaces de bande reste constante. La vitesse angulaire dépend du rayon du rouleau. Les angles sont calculés analytiquement depuis le temps audio : pause, recherche et export utilisent le même état, sans accumulation par image.

Les anciens disques photographiques tournants ont été remplacés par des moyeux circulaires concentriques. Seules leurs six branches tournent ; axe, bordure et éclairage restent fixes, ce qui supprime l'orbite excentrée. La fenêtre centrale montre les deux masses de bande. Ce modèle représente un passage complet par chanson, pas la longueur physique d'une C90. Les images de cassettes personnalisées importées restent statiques, comme avant.

13 tests réussis : tests précédents plus début/milieu/fin, conservation de bande, recherche déterministe, bornes, vitesse angulaire et centres de rotation constants sans transformation elliptique. Les notes de versions antérieures ci-dessous sont remplacées par ces corrections lorsqu'elles concernent les bobines.

---

# Corrections v0.2 — 26 octobre 2026

- Les champs Artiste et Titre sont lus depuis les métadonnées embarquées. Les tags priment sur le nom du fichier ; les tags absents déclenchent un secours explicite par nom de fichier (numéro de piste et suffixe kbps retirés). Un artiste inconnu reste vide, modifiable par l'utilisateur.
- La pochette embarquée est extraite automatiquement (priorité à la front cover). Une image importée manuellement reste prioritaire pour cette piste. Recharger une piste du jukebox conserve les modifications manuelles.
- Étiquette rétro crème/bordeaux, typographie sobre, face A et C—90 ; boîtier, fenêtre de bande et bobines photographiques conservés. L'exemple Prince n'était pas joint : ce style années 80 reste une interprétation, pas une reproduction de cette référence.
- La plaque complète des informations et commandes est reconstruite avec une texture de métal continue. Aucun rectangle dégradé derrière les titres/waveform.

Validation : 8 tests passent, couvrant les tags ID3v1, ID3v2.3 UTF-16, ID3v2.4 UTF-8, accents, tags prioritaires, tags absents/corrompus, pochette LIORA, bornes audio, waveform et RMS. Import testé dans le navigateur sur une copie de LIORA dont le nom est volontairement incorrect : artiste et titre sont correctement récupérés depuis les tags. Rendu PNG inspecté visuellement. Le fichier utilisateur Daft Punk des captures n'a pas été fourni ; son contenu exact n'a pas été testé.

Le lecteur de tags est [music-metadata](https://github.com/Borewit/music-metadata), compilé pour le navigateur et livré dans public/metadata.js. Aucun CDN, aucune transmission des fichiers. Le studio déjà compilé démarre toujours avec `node server.mjs`, sans installation. Pour développer/recompiler : installer les dépendances du package puis `node build.mjs`. Le fichier pnpm-lock.yaml verrouille les versions. Les dépendances sont nécessaires pour relancer les tests de métadonnées.

Les notes v0.1 ci-dessous décrivent l'étape précédente ; les points corrigés ci-dessus les remplacent.

---

# SnakeBonD Retro Cassette Studio — étape 1

Studio local initialisé le 26 octobre 2026. Aucun déploiement, aucun dépôt distant configuré.

## Démarrer

Ouvrir un terminal dans ce dossier puis `npm start` (ou `node server.mjs`). Ouvrir http://127.0.0.1:4173. Node.js est la seule dépendance du serveur. L'application utilise les fonctions audio et vidéo du navigateur. Ne pas ouvrir index.html directement.

1. Charger LIORA AIOVA ou importer un fichier audio.
2. Modifier artiste, titre, cover et éventuellement image de cassette.
3. Choisir début/fin en secondes ; la durée affichée vient du fichier audio.
4. Créer la vidéo, garder l'onglet visible, puis télécharger le résultat.

Le volume règle uniquement l'écoute : l'export conserve le niveau original. Les exports sont à 1080 × 1920, cadence demandée 30 fps. MP4 H.264/AAC si disponible ; sinon WebM VP9/VP8 et Opus. Ne pas renommer un WebM en MP4. L'export s'effectue en temps réel et consomme de la mémoire, surtout pour de longues pistes. Il s'annule si l'onglet passe en arrière-plan. Les imports restent en mémoire et disparaissent au rechargement. Le bouton PNG exporte l'image courante.

## Existant retrouvé et référence

Le dossier A:\[INFORMATIQUE]\[SITES — Projets Web]\Retro Cassette Visualizer contenait trois PNG et un preset Slovo JSON, sans sources applicatives ni dossier Git. Les originaux n'ont pas été modifiés. La recherche GitHub par nom n'a pas identifié de dépôt pertinent ; elle ne prouve pas l'absence d'un dépôt privé autrement nommé.

La conversation accessible confirme l'habillage fixe, la zone de sécurité invisible et les variables cassette/artiste/titre/durée. Le cahier des charges V1.2 complet et la dernière image explicitement validée ne sont pas exposés par l'historique disponible. La base choisie est le fichier local « Lecteur cassette rétro Amber Soul.png », daté le plus récemment, avec la maquette de safe zone comme référence de marges. Ce choix reste à confronter à l'image finale validée. Il ne constitue pas une certification de conformité exacte à V1.2.

L'exemple LIORA contient l'audio et la cover récupérés en pièces jointes. L'audio est intitulé « LIORA AIOVA — Liora » ; l'ancienne mention « Amber Soul » de la maquette n'a pas été reprise comme titre audio.

## Fonctionnel

- Import/décodage audio via Web Audio ; import PNG/JPEG/WebP pour cover et cassette.
- Recadrage central carré de la cover ; artiste et titre modifiables, plafonnés et ajustés à l'espace.
- Habillage photographique fixe ; zones dynamiques redessinées sur le modèle aplati.
- Vumètres L/R alimentés par le RMS des canaux audio, waveform calculée sur toute la piste, curseur et bobines animés selon l'horloge audio.
- Lecture/pause, recherche temporelle, volume d'écoute.
- Extrait avec validation des bornes ; export audio et vidéo par MediaRecorder, progression, annulation, lien de téléchargement.
- Jukebox de session : sélectionner les pistes précédemment importées, retrouver leurs textes et images.

## Limites visuelles et produit

Les commandes dessinées dans la photo font partie de l'habillage : la lecture se commande dans le panneau du studio. Shuffle, repeat et suivant/précédent du visuel ne sont pas encore interactifs. Une cassette importée est ajustée au rectangle de la cassette ; elle doit donc avoir les proportions attendues. Les bobines de cette image importée ne sont pas animées.

La source est une image aplatie : les surfaces des vumètres, le cartouche et l'écran ont été reconstruits en canvas. Leur texture n'est pas une restitution pixel à pixel du visuel d'origine. L'intégration d'une cover dans le modèle remplace une portion du papier ; des calques séparés seraient préférables pour la finition.

Le lecteur est placé à x=60, y=180, largeur=840, hauteur≈1493 dans 1080 × 1920. Marges restantes : droite 180, bas≈247. Aucun guide ni aplat rouge n'est rendu. Ce sont des marges internes prudentes, pas une garantie universelle contre les interfaces TikTok : vérifier le résultat dans l'interface cible avant publication.

## Vérifications réalisées

`npm test` : 3 tests réussis (bornes d'extrait, waveform/transitoires/silence, RMS et fin de buffer). Analyse syntaxique JavaScript réussie.

Essai réel dans le navigateur intégré : chargement de LIORA, durée 4:09, stéréo, rendu visible ; création et téléchargement d'un MP4 de 3 secondes. Analyse du conteneur : H.264 1080 × 1920, 90 échantillons vidéo, piste AAC avec 138 échantillons audio. Les durées des fragments sont environ 3,000 s vidéo et 2,942 s audio ; l'écart initial d'environ 58 ms n'est pas une mesure perceptive de synchronisation. La durée mdhd initiale seule ne décrit pas ce MP4 fragmenté.

Non vérifié : écoute humaine du résultat, absence de dérive sur une piste complète, export long, toutes les variantes de navigateur, WebM de repli, précision frame par frame et rendu final dans TikTok. Les exports utilisent une horloge audio commune, mais ne sont pas un rendu hors ligne déterministe. FFmpeg n'est pas présent dans l'environnement inspecté.

## Étapes suivantes

1. Retrouver le texte V1.2 et confirmer la maquette finale ; obtenir si possible les calques séparés.
2. Rendu hors ligne MP4 H.264/AAC et tests de synchronisation sur piste complète, gestion mémoire et file d'exports.
3. Sauvegarde/rechargement de projets et bibliothèque persistante, jukebox complet (enchaînement, répétition, aléatoire).
4. Vérifier hébergement, paramètres et autorisation avant tout déploiement.

Aucun service externe ne reçoit l'audio ou les images dans cette version. Le serveur écoute uniquement 127.0.0.1.

Contrôles UI supplémentaires : un extrait dépassant la durée est refusé. L'annulation a révélé un message de progression qui pouvait écraser « Export annulé » ; le message est désormais fixé après l'arrêt effectif de l'enregistreur.

## Paramètres à valider avant hébergement

Pas de .vercel ni .openai/hosting.json ; pas de configuration cloud récupérée. Le fichier exemple est livré avec le studio local pour démonstration. Avant de publier, décider si ces médias peuvent être distribués, choisir le projet d'hébergement, l'audience et le stockage. Aucun lancement automatique ni service système n'a été installé.

Dernier contrôle : export LIORA de 15 secondes téléchargé (13,1 Mo), H.264 1080 × 1920, 449 images et audio AAC. Les sommes des durées d'échantillons des fragments sont 14,968 s vidéo / 14,943 s audio. Cadence proche de 30 fps, pas de garantie de 450 images exactes avec MediaRecorder. Annulation corrigée retestée : message « Export annulé. » confirmé. Les détails du conteneur sont dans le rapport export-verification.json livré à côté du projet.
