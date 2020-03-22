Exemple git flow (v1.0.0)
----------------

Un repository git mettant en oeuvre git-flow.

git-flow est un ensemble d'extensions git permettant des opérations de haut niveau sur un dépôt pour appliquer le 
modèle de branches de Vincent Driessen.


Conventional Commits
--------------------
Avant de parler de git-flow, commençons par parler de la structure de nos messages de commit.

On utilisera la convention [Conventional Commits 1.0.0](https://www.conventionalcommits.org/fr/v1.0.0/) pour rédiger 
chaque message de commit.

Pour respecter cette convention facilement, vous pouvez utiliser le plugin Jetbrains [Git Commit Template](https://plugins.jetbrains.com/plugin/9861-git-commit-template), 
ou bien [Commitizen](https://github.com/commitizen/cz-cli) si vous êtes plutôt habitué à la ligne de commande (Nécessite NodeJS).

Les types de branches de git-flow
---------------------------------

Git flow est structuré via différent type de branche.

- **develop**: Il s'agit de la version en cours de développement. Notre intégration doit refléter cette branche en permance.

- **master**: Il s'agit de la dernière version livrée au client. Cette branche doit refleter la recette du client.

- **feature/***: Les fonctionnalités sont dévelopées dans des branches séparées nommées **feature**. Ces branches doivent 
être crées à partir de develop, et ne doivent pas être crées pour corriger un bug. Ces branches doivent être rebasées
régulièrement sur **develop** en cours de développement afin de bénéficier de la dernière version de l'application.

- **hotfix/***: Les correction de bug sont dévelopées dans des branches nommées **hotfix**. Ces branches doivent être 
crées à partir de **master**, et doivent se contenter de fixer le bug.

- **release/***: Lors de la livraison d'une nouvelle version, une branche release peut être crée afin de réaliser le
packaging et de corriger les éventuels problème liés au build. Cette branche est temporaire et n'a pas vocation à 
accueillir les correctifs associés à la version livrée.

- **support/***: Suite à la livraison d'une nouvelle version, une branch support peut être crée à partir du tag de la
version afin de garantir un suivi sur une ancienne version. Cela peut être utile si plusieurs versions sont disponibles
sur différents environnements.
