# Vérification du Studio V1 — 30 octobre 2026

## Parcours demandé
Importer une ou plusieurs pistes, régler un montage en minutes/secondes, ajouter des fondus, créer et relire une vidéo, conserver les projets localement et enchaîner les pistes avec leur cassette.

## Preuves locales

| Besoin | Vérification | Résultat |
| --- | --- | --- |
| Temps et raccourcis | LIORA, début 0:30 + bouton 60 s | Fin 1:30, durée 1:00 ; tests des bornes et du format |
| Fondus entrée / sortie | Signal sinusoïdal constant, source 1–5 s, fondus 1 s | Audio extrait du MP4 : RMS début 0,0269 / milieu 0,2589 / fin 0,0523 |
| Export standard | Fichier téléchargé et métadonnées du lecteur natif | 720 × 1280, durée 3,944 s pour 4 s sélectionnées |
| Export haute qualité | Deuxième fichier téléchargé, volume d’écoute à zéro | 1080 × 1920, durée 3,968 s ; son présent, RMS milieu 0,2589, fondus conservés |
| Aperçu vidéo | Élément video avec commandes, fichier chargé après export | readyState 4, dimensions et durée décodées avant téléchargement |
| Brouillon | Fermeture effective de tous les onglets puis réouverture | Fichiers WAV locaux, montage, fondus, textes et styles restaurés |
| Projets nommés | Enregistrer, modifier le titre, ouvrir le projet nommé | Texte et apparence enregistrés restaurés |
| Projet sans audio | Décocher conservation, enregistrer puis ouvrir | Audios manquants indiqués, écoute/export désactivés |
| Reconnexion | Choisir A pour la piste B puis le bon B | Mauvais fichier refusé ; bon fichier accepté, titre personnalisé et cassette conservés |
| Playlist | Import multiple de deux WAV (6 et 8 s) | Deux entrées avec styles et montages indépendants |
| Enchaînement | Lecture entière A puis B | Passage automatique à B et à sa cassette Années 80 violette, arrêt à la fin |
| Aléatoire / répétition | Activer les deux options et lire les montages | Lecture active en cycles ; suivant passe à A avec sa coque orange ; pause et arrêt fonctionnent |
| Algorithmes | node --test tests/*.test.mjs | 34 tests réussis : bornes, formats, courbe des fondus/reprise, parcours de playlist, tags, mécanique, styles, année |

## Portée et limites

Vérifications navigateur effectuées dans le navigateur Chromium intégré, sous Windows. Les exports sont réellement générés et téléchargés, puis leur audio est décodé avec FFmpeg dans un répertoire temporaire de contrôle (aucune dépendance ajoutée au site). Les fichiers de test et les outils de contrôle ne sont pas livrés dans public/.

Le stockage est propre au navigateur et à l’origine (localhost et le site public ont des sauvegardes séparées). Les erreurs de quota ou d’indisponibilité sont affichées. Pas de prétention à une sauvegarde cloud, à une exportation hors ligne en arrière-plan ou à une lecture sans aucun intervalle entre morceaux. Les longues vidéos et les autres moteurs de navigateur n’ont pas été testés dans ce contrôle.

Contrôles finaux : saisie de YEAR caractère par caractère (1985), déplacement d’une piste dans les deux sens sans perdre la sélection, annulation d’un export avec déverrouillage des commandes, compilation esbuild et nouvelle exécution des 34 tests réussies.

## Pochettes — 31 octobre 2026

38 tests réussis, dont extraction ALBUM, correspondances artiste/titre/album, refus des homonymes et des identifiants invalides, réponses sans image et validation du type d’image. Recherche réelle Daft Punk / Da Funk / Homework réussie via l’API locale : JPEG et lien d’édition MusicBrainz. Dans le navigateur : lot de pistes synthétiques, absence signalée pour une piste inventée, recherche individuelle réussie, puis recherche groupée réussie sur la dernière pochette absente en conservant les deux pochettes existantes. Après rechargement, album, image et lien source restaurés. Les fichiers audio utilisés restent des signaux de test ; leurs noms et années ont été modifiés pour exercer la recherche, pas pour attester de métadonnées musicales.
