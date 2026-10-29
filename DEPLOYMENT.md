# Publication

Dépôt : https://github.com/SnakeBonD/Virtual-Cassette-Player

Suivi : https://app.notion.com/p/4077458666978145be92ddcfc56e49c3

Domaine prévu : https://cassette.snakebond.net (publication non encore vérifiée).

## Configuration Vercel

- Racine : ce répertoire ; framework : Other.
- Construction : `npm run build` ; sortie statique : `public`.
- La fonction Node `api/year.js` fournit `/api/year` et importe `year-service.mjs`.
- Aucun secret requis par cette version. Ne jamais publier `.env` ou `.vercel`.
- Le DNS est chez Gandi : ajouter uniquement l’enregistrement du sous-domaine `cassette` avec la valeur fournie par Vercel après association du domaine.

## Validation avant livraison

`npm test` puis `npm run build`. Vérifier sur le déploiement : chargement LIORA, import des tags, lecture, recherche d’année, export d’un extrait avec audio, HTTPS et ressources du domaine final.

Les 26 tests et la construction locale passent. Le déploiement n’est pas encore validé. L’accès Vercel utilisé a refusé la création de projet (403), et le CLI n’a pas accès à l’équipe `snakebond`.

## Limites

L’export s’effectue en temps réel dans l’onglet actif. MP4 ou WebM dépend du navigateur. Les préférences restent locales ; les imports audio ne sont pas envoyés au serveur. La recherche MusicBrainz possède un cache et une file par processus, non partagés entre instances : elle peut échouer sous charge ou en cas de limitation du service, sans inventer d’année.
