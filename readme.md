# FlowDesk project By Esteban PAGIS (espagis@hotmail.fr)

Projet réalisé avec :

- GIT
- Node.js Typescript

Bienvenue dans mon projet ! Ce projet a été créé dans le cadre de la demande technique de l'entreprise FlowDesk.

Description

Ce projet permet de choisir une paire de cryptomonnaie et voir le delta de celle ci quant aux ventes et achats effectués sur le marché. 

Fonctionnalités
Nous pouvons choisir de voir les deltas de toutes les paire de cryptomonnaie
Voir le delta d'une seule paire de cryptomonnaie
Voir les 100 derni-ères transactions qui ont été effectuées.
...
Installation
Clonez le dépôt sur votre machine locale.
Exécutez :
npm init
npm i @types/express
npm i @types/node
npm i axios
npm i body-parser
npm i express
npm i typescript
...
Utilisation
Exécutez la commande node ./src/app.ts
Ouvrez votre navigateur et accédez à l'URL http://localhost:3000.

Problème rencontré : Impossible de séparer en 3 fichier apiRoutes.ts, cryptoFunctions.ts et server.ts (bug)
Impossible de refresh la page en continue pour faire évoluer le delta avec WebSocket.