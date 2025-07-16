# Cahier des charges

## 1️⃣ Contexte et objectifs

Développement d'une interface web d'annotation textuelle collaborative, avec calcul automatique de l'accord inter-annotateurs.
Dans un premier temps, l'outil servira à annoter des phrases par classification simple (une seule catégorie).

L'objectif est de : 
- Faciliter l'annotation en équipe de corpus textuels.
- Fiabiliser les annotations grâce au calul automatique de métriques d'accord.
- Créer un outil évolutif, à terme commercialisable ou open source.


## 2️⃣ Public visé

- **Annotateurs** : équipes de recherche, data scientists, linguistes, spécialistes du NLP.
- **Administrateurs** : responsables de projet ou chercheurs principaux, charger de superviser l'annotation et d'analyser les résultats.


## 3️⃣ Besoins fonctionnels

- Annotation de phrases en classification simple.
- Interface web simple et ergonomique.
- Authentification des utilisateurs.
- Collaboration multi-annotateurs sur le même corpus, avec possibilité de répartir les documents.
- Calcul automatique des métriques d'accord inter-annotateurs (Cohen's kappa, Fleiss' kappa, etc.).
- Export des annotations (formats CSV et JSON).
- Suivi du progrès d’annotation par utilisateur et par corpus.

## 4️⃣ Besoins techniques

- Développement et déploiement local dans un premier temps.
- Application web découpée :
  - Backend : Python (FastAPI ou Flask).
  - Frontend : React.js.
- Base de données relationnelle pour stocker utilisateurs et annotations (ex : SQLite ou PostgreSQL).
- Versionnement du code source sur GitHub (repo privé au départ).
- Licence à définir ultérieurement (open source ou commercialisation).

## 5️⃣ Planning prévisionnel

| Étape | Durée estimée | Description |
|------|:-------------:|-------------|
| Étude des besoins et cadrage | 1 semaine | Définir les fonctionnalités, le workflow, les maquettes, choisir les technologies et établir un plan d’action |
| Prototype MVP local | 2 à 3 semaines | Authentification, interface d'annotation, export des résultats |
| Calculs d’accord inter-annotateurs | 1 semaine | Scripts backend et intégration |
| Tests et améliorations | 1 à 2 semaines | Débogage, retours utilisateurs et ajustements |
| Documentation | 1 semaine | Rédaction du README, guide utilisateur et installation |

## 6️⃣ Contraintes et limites

- Déploiement uniquement local au départ (pas encore prévu pour le cloud).
- Priorité à la simplicité et à l’ergonomie.
- Projet en phase de prototype, pouvant évoluer vers une version plus robuste et scalable.
- Fonctionnalités initiales centrées sur la classification simple de phrases.

## 7️⃣ Evolutions possibles

- Dashboard statistique avec suivi du nombre d’annotations, métriques d’accord et visualisations.
- Support de l’annotation multi-label (plusieurs catégories par phrase).
- Annotation de spans (sélection de passages) et de relations entre entités.
- Gestion avancée des rôles utilisateurs (chef de projet, validateur métier, annotateur).
- Validation métier et validation semi-automatique basée sur l’accord inter-annotateurs.
- Chat ou messagerie instantanée entre annotateurs.
- Intégration des guidelines d’annotation directement dans l’interface.
- Outil collaboratif pour créer et réviser les guidelines.
- Pré-annotation automatique avec modèle NLP (active learning, reinforcement learning, etc.).
- Déploiement SaaS pour annotation en ligne.
- Intégration d’API externes ou plugins (ex : vérification orthographique, analyse de sentiments).

✏️ *Document évolutif à compléter au fil de l’avancement du projet.*