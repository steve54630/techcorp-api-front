# 🎯 Aperçu du Projet

Ce projet est une application web moderne de type "Software Asset Management" (SAM) construite avec Angular pour les besoins d'un challenge de développement de 3 jours. L'objectif était de créer un tableau de bord permettant de visualiser, filtrer, et analyser l'utilisation et les coûts des outils numériques d'une entreprise.

# 🚀 Quick Start

Ce projet est une application Angular. Assurez-vous d'avoir Node.js et Angular CLI installés.

# Installation

## Clonez le dépôt

```
git clone [URL_DU_DEPOT]
```

## Naviguez vers le répertoire du projet

```
cd [NOM_DU_PROJET]
```

## Installez les dépendances

```
npm install
```

## Lancement de l'Application Angular (Frontend) :

```
ng serve
```

L'application sera accessible dans votre navigateur à l'adresse http://localhost:4200/.


# 🏗️ Architecture

L'architecture est construite autour du principe du "Modular Monolith" et de l'approche Reactive Programming (RxJS).

## Structure Projet

| Répertoire | Description |
|------------|-------------|
| src/app/components | Composants réutilisables dans l'application |
| src/app/pages | Pages de l'application |
| src/app/pages/dashboard | Module de la page d'accueil (synthèse) |
| src/app/pages/tools | Module principal de gestion des outils (filtrage, tri, tableau) |
| src/app/pages/analytics | Module de visualisation des données (charts) |
| src/app/services | Modules de gestion de l'accès aux données |
| src/app/styles | Fichiers css global de l'application |
| src/app/types | Fichier pour donner le typage de TS |
| src/app/utils | Fonctions réutilisables dans l'application |

## Organisation du Code

Observable-Driven Services : L'état global est géré via des services utilisant des BehaviorSubject (e.g., UserService, ToolService).

Smart/Dumb Components : Séparation stricte entre les composants "intelligents" (pages, qui gèrent la logique et la souscription aux données) et les composants "muets" (présentation, qui reçoivent les données via Input et émettent les événements via Output).

Typed Data : Utilisation d'interfaces TypeScript (Tool, Department, etc.) pour garantir la robustesse et l'autocomplétion.

# 🎨 Design System Evolution

Le Design System a été construit et maintenu rapidement sur une période courte de 3 jours grâce à l'utilisation combinée de Tailwind CSS et Angular Material.

| Jour | Objectif |
|------|----------|
| Jour 1 | (Fondations) : Mise en place de la palette de couleurs (Indigo pour l'action), de la typographie (sans-serif par défaut) et des utilitaires de base via Tailwind (espacement, ombres, flex/grid) |
| Jour 2 | (Composants Riches) : Intégration d'Angular Material pour les éléments complexes du formulaire de filtre (mat-select, mat-slider, mat-form-field) et du tableau (mat-table). Ces composants ont été personnalisés uniquement via les classes utilitaires de Tailwind pour minimiser l'écriture de CSS brut |
| Jour 3 | (Finalisation) : Finalisation des états (hover, focus) et garantie de la cohérence des cartes et des boutons à travers les deux pages crées

# 🔗 Navigation & User Journey

L'expérience utilisateur est conçue autour d'un flow de découverte et d'analyse :

Dashboard (Vue d'ensemble) : L'utilisateur arrive sur une synthèse agrégée des données clés (coût total, nombre d'outils actifs, alertes). C'est la vue "Que se passe-t-il ?".

Tools (Gestion et Filtrage) : L'utilisateur navigue vers la page Tools pour manipuler les données brutes. Il peut filtrer par statut, département, catégorie, et une plage de coût mensuel (via le mat-slider). C'est la vue "Où est le détail ?".

Analytics (Analyse Approfondie) : L'utilisateur se dirige vers Analytics pour voir des visualisations (e.g., répartition des coûts par département ou catégorie). C'est la vue "Pourquoi cela se passe-t-il ?".

L'application utilise le RouterModule d'Angular pour un routage simple et des chargements différés par page (lazy loading, si implémenté) pour optimiser le temps de chargement initial.

# 📊 Data Integration Strategy

La stratégie d'intégration des données repose sur la réactivité et la centralisation des sources.

## Source de Données

Le backend est un serveur JSON en ligne stable, permettant d'interroger la ressource principale /tools et les ressources secondaires /departments et /categories.

## Gestion des Filtres (RxJS)

La page Tools utilise la combinaison d'Observables suivante :

| Observable | Utilisation |
|------------|-------------|
| searchForm.valueChanges | L'Observable émet à chaque changement de formulaire. Il est crucialement pipé avec debounceTime(300) pour éviter de surcharger le système de filtrage pendant que l'utilisateur glisse le slider ou tape. |
| combineLatest | Il synchronise les valeurs du formulaire (filters) avec la source de données des outils (allTools$) et l'état du tri (currentSort) |
| Opérateur map | Il applique séquentiellement les fonctions applyFilters() et applySorting() aux données brutes pour produire l'filteredTools$ |

Cette approche garantit que l'interface utilisateur ne réagit qu'une fois la saisie stabilisée, tout en assurant une source unique de vérité pour l'affichage du tableau.

# 📱 Progressive Responsive Design

L'application a été développée en utilisant une approche mobile-first via les utilitaires de Tailwind CSS.

Structure de Base : Utilisation du flex et grid par défaut (mobile).

Adaptation (Breakpoint md) : Les filtres du formulaire passent de colonnes empilées (1x4) à une grille plus dense (1x4 ou 2x2) via les préfixes responsives (md:grid-cols-4, md:col-span-2).

Tableau (app-tools-table) : Le tableau est le point le plus critique. Sur mobile, chaque ligne est transformé en carte plus lisible et un select a été ajouté
pour trier par colonne

Cette méthode garantit une performance et une lisibilité optimales sur tous les appareils.

# 🧪 Testing Strategy

Étant donné le temps limité, la stratégie de test se concentre sur les unités critiques de logique métier :

## Tests Unitaires (Focus)

Service de Filtrage : Tester la méthode applyFilters pour garantir que la logique de prix (bornes minPrice/maxPrice) et les filtres de statut/catégorie fonctionnent correctement dans tous les scénarios.

Service de Tri : Tester la fonction applySorting pour valider le tri principal et, surtout, le tri stable basé sur l'id comme critère de départage secondaire (pour corriger le problème de l'ID 1 qui restait en tête).

## Stratégie QA

Visual Regression : Vérification manuelle de la cohérence visuelle des composants Material (slider, select) après l'application des classes Tailwind.

Flux Réactif : Vérification des logs de console pour s'assurer que les appels de filtrage ne se déclenchent qu'une seule fois après le debounceTime lorsque l'utilisateur interagit avec le slider.

# ⚡ Performance Optimizations

Plusieurs techniques ont été utilisées pour assurer une application 3-pages rapide :

RxJS Debounce : Comme mentionné, l'utilisation de debounceTime(300) sur les formulaires est l'optimisation la plus importante pour les interactions utilisateur, réduisant les calculs et les rendus.

Change Detection (Implicite) : En utilisant majoritairement les pipes async dans les templates et en s'appuyant sur les Observables, Angular est capable d'optimiser le cycle de détection de changement, visant implicitement un comportement similaire au OnPush.

Template Pragmatique : L'utilisation de blocs @if pour le rendu conditionnel (comme pour le mat-slider qui n'est affiché qu'après le chargement des bornes minValue et maxValue) prévient le rendu d'éléments non nécessaires ou incomplets.

Date Pipe : Le formatage des dates se fait côté template avec le date pipe d'Angular, ce qui décharge le composant de la logique de formatage, facilitant la maintenance et l'internationalisation.

# 🎯 Design Consistency Approach

La cohérence du design a été maintenue sans mockups J7-J8 grâce à l'adhérence à un ensemble de règles simples :

Conteneurs : Tous les blocs principaux (filtres, tableau, cartes du dashboard) utilisent bg-white, rounded-xl et shadow-lg.

Espacement Vertical : Utilisation d'une échelle d'espacement uniforme basée sur les utilitaires Tailwind (mb-6, p-6) pour assurer une densité d'information gérable.

Iconographie : Utilisation exclusive de la librairie Lucide Icons pour maintenir un style d'icône vectoriel cohérent et moderne.

# 📈 Data Visualization Philosophy

La philosophie de visualisation était de fournir des informations pertinentes et contextuelles :

Choix de la Librairie : Utilisation de Chart.js (ou une librairie similaire) pour sa polyvalence et son faible encombrement.

Intégration au Design System : Les couleurs des charts sont mappées sur la palette de couleurs définie par Tailwind (Indigo, Gray, etc.) pour une intégration visuelle transparente.

Visualisations Clés : Les graphiques se concentrent sur la répartition des coûts (Diagramme circulaire ou à barres) par owner_department et l'évolution temporelle des dépenses (Diagramme linéaire).

# 🔮 Next Steps / Complete App Vision

Pour transformer cette application en une solution SaaS Tools complète, les prochaines étapes incluraient :

Authentification/Autorisation : Implémentation d'un service d'authentification réel (Firebase Auth, Auth0, etc.) et de règles d'accès pour masquer ou modifier des outils selon le rôle de l'utilisateur.

CRUD Opérations : Ajout des fonctionnalités Créer, Mettre à Jour, Supprimer les outils, rendant le tableau de bord interactif pour la gestion réelle du cycle de vie des outils.

État Global Centralisé : Utilisation d'un véritable outil de gestion d'état (NGRX, NGXS ou Signals dans un service) pour gérer les données, les filtres et les chargements de manière plus formelle et prédictible.

Internationalisation (i18n) : Implémentation complète de la traduction des libellés et des messages.

Notifications en Temps Réel : Utilisation de WebSockets ou de Firestore pour alerter les utilisateurs des changements de statut ou des dépassements de budget.