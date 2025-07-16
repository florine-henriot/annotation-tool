# 📌 User Stories

Ce document regroupe les user stories du projet, organisées par thème et priorisées en :
- ✅ MVP (Minimum Commercialisable Produit / Minimum Viable Product)
- 💡 Évolutions futures



## 🔐 Authentification & gestion des utilisateurs

### ✅ MVP
- En tant qu’administrateur, je veux pouvoir créer des comptes annotateurs pour organiser le travail de l’équipe.
- En tant qu’annotateur, je veux pouvoir me connecter et accéder uniquement à mes données et annotations.

### 💡 Évolutions futures
- En tant qu’administrateur, je veux définir des rôles différents (annotateur, relecteur, chef de projet) pour mieux répartir les responsabilités.
- En tant qu’administrateur, je veux pouvoir désactiver ou supprimer un compte.
En tant qu’administrateur, je veux pouvoir fixer des objectifs de volume et de temps d’annotation pour chaque membre de l’équipe.


## 📝 Annotation

### ✅ MVP
- En tant qu’annotateur, je veux voir une phrase à annoter dans une interface claire et simple.
- En tant qu’annotateur, je veux pouvoir sélectionner une catégorie pour chaque phrase.
- En tant qu’annotateur, je veux voir le nombre de phrases qu’il me reste à annoter pour suivre ma progression.

### 💡 Évolutions futures
- En tant qu’annotateur, je veux pouvoir annoter des phrases avec plusieurs catégories (multi-label).
- En tant qu’annotateur, je veux pouvoir annoter des spans de texte (début / fin).
- En tant qu’annotateur, je veux pouvoir annoter des relations entre entités.
- En tant qu’administrateur, je veux pouvoir ajouter des consignes d’annotation visibles pendant l’annotation.
- En tant qu'administrateur, je veux pouvoir définir si l'annotation est à l'échelle du texte ou de la phase (pour lancer une découpe automatique du corpus en phrase ou non.)


## 📊 Analyse & qualité

### ✅ MVP
- En tant qu’administrateur, je veux calculer automatiquement l’accord inter-annotateurs (ex: Cohen’s kappa, Fleiss’ kappa) pour évaluer la fiabilité des annotations.

### 💡 Évolutions futures
- En tant qu’administrateur, je veux voir un dashboard avec des statistiques globales sur les annotations.
- En tant qu’annotateur, je veux comparer mes annotations à celles d’autres annotateurs pour m’améliorer.


## 📦 Export & import

### ✅ MVP
- En tant qu’administrateur, je veux pouvoir exporter les annotations au format CSV ou JSON.

### 💡 Évolutions futures
- En tant qu’administrateur, je veux pouvoir importer un corpus de phrases à annoter depuis un fichier CSV ou JSON.
- En tant qu’administrateur, je veux planifier la répartition automatique du corpus entre les annotateurs.


## 🛠 Collaboration & communication

### 💡 Évolutions futures
- En tant qu’annotateur, je veux pouvoir chatter avec les autres annotateurs pour poser des questions.
- En tant qu’administrateur, je veux organiser des ateliers pour définir les guidelines d’annotation en collaboration.


## 🤖 Automatisation

### 💡 Évolutions futures
- En tant qu’administrateur, je veux pré-annoter automatiquement des phrases avec un modèle de machine learning pour gagner du temps.
- En tant qu’administrateur, je veux utiliser l’apprentissage actif pour proposer en priorité les phrases les plus difficiles à annoter.


## 📱 Interface & UX

### 💡 Évolutions futures
- En tant qu’annotateur, je veux personnaliser l’apparence de l’interface (mode sombre, police, etc.).
- En tant qu’administrateur, je veux configurer les catégories et guidelines directement depuis l’interface.
