# Introduction

Faire des petites évaluations, sur des sujets simples tels que du vocabulaire ou de la conjugaison, peut s'avérer chronophage.

Ce projet se veut une solution à ce problème. Il permet au professeur de créer des évaluations simples sur des compétences ou des connaissances nécessaires à des activités langagières plus larges (compréhension ou expression) L'élève peut ainsi appréhender son degré de maîtrise de ces notions en fonction de la note qu'il obtient et peut alors décider de les approfondir (ayant mieux ciblé les difficultés auxquelles il s'est heurté). Il devient alors acteur de sa progression et peut décider d'améliorer ses résultats en retravaillant les notions non acquises.

Ces évaluations pourront être passées à la maison (évaluations formatives) ou en classe.

Le résultat de ce projet sera un site internet accessible par navigateur qui permettra une personnalisation la plus complète possible de sujets d'évaluation de vocabulaire, conjugaison, traductions simples et discrimination auditive.

# Table des matières

- [Introduction](#introduction)
- [Table des matières](#table-des-matières)
- [I. Utilisation - Professeur](#i-utilisation---professeur)
  - [1. Création d'un compte professeur](#1-création-dun-compte-professeur)
  - [2. Création de contrôles](#2-création-de-contrôles)
    - [A. Modèles](#a-modèles)
    - [B. Création libre](#b-création-libre)
    - [C. Fonctionnement](#c-fonctionnement)
    - [D. Diffusion](#d-diffusion)
  - [3. Visualisation des résultats](#3-visualisation-des-résultats)
- [II. Utilisation - Élèves](#ii-utilisation---élèves)
  - [1. Participation à un contrôle](#1-participation-à-un-contrôle)
- [III. Fonctionnement](#iii-fonctionnement)
  - [1. Organisation de la base de donnée](#1-organisation-de-la-base-de-donnée)
    - [A. Professeurs](#a-professeurs)
    - [B. Evaluation](#b-evaluation)
    - [C. Accès élève](#c-accès-élève)
  - [2. Respect du RGPD](#2-respect-du-rgpd)

# I. Utilisation - Professeur

Cette catégorie abordera les différentes utilisations possibles par un professeur de la plateforme ThothEdu.

## 1. Création d'un compte professeur

Afin de bénéficier d'un statut d'enseignant, les professeurs pourront créer leur compte. Seront demandés un pseudonyme et un mot de passe.

## 2. Création de contrôles

ThothEdu permet la création de contrôles de la part du professeur. Voici les caractéristiques et le fonctionnement de cette création.

### A. Modèles

Plusieurs modèles sont accessibles au professeur, qui peuvent ensuite être aisément modifiés, mais qui restent centrés sur une notion particulière.

Les champs sub-mentionnés sont expliqués dans [I.2.C. Fonctionnement](#c-fonctionnement) et ont des caractéristiques propres à leur utilisation.

1. **Vocabulaire :**

   Le modèle "Vocabulaire" propose des fonctionnalités de vérification de texte : un mot est proposé, et une réponse est attendue de l'élève. Le modèle est constitué de 20 champs à la base, mais le professeur a le choix d'ajouter ou supprimer le nombre de champs. Ce modèle est basé sur un type de champ "vérification de texte".

2. **Conjugaison :**

   Le modèle "Conjugaison" propose des fonctionnalités de vérification de texte, basées sur le type de champ "vérification de texte". Il y a 20 champs lors de l'initialisation, mais ils peuvent être ajoutés/supprimés à la suite.

3. **Discrimination auditive :**

   Le modèle "Discrimination auditive" propose 10 champs de type "audio" accompagnés chacun de leur champ "vérification de texte". Il faudra donc fournir l'audio et le texte à trouver.

4. **Traduction de phrase :**

   Le modèle "Traduction de phrase" propose d'origine 10 champs de type "vérification de texte".

### B. Création libre

Un mode de création libre est également mit à disposition des enseignants s'ils souhaitent créer une évaluation à partir de n'importe quel type de champ, et sans configuration au préalable. Il n'y a aucun champ créé à l'origine.

### C. Fonctionnement

1. **Type de champs**

   1. Vérification de texte

      Le champ vérification de texte permet de corriger un texte selon des paramètres plus ou moins complexes. Les points enlevés à chaque erreur sont personnalisables, plusieurs degrés de sévérité sont disponibles.

   2. Audio

      Le champ audio permet de rajouter un fichier audio à écouter, et est accompagné d'un champ de vérification de texte pour mettre les mots entendus dans l'audio.

2. **Paramètres de la vérification de texte**

   1. Accent : Le professeur peut activer la tolérance aux absences d'accents si besoin

   2. Pluriel : Le professeur peut activer ou non la tolérance au pluriel. Si c'est le cas, il devra indiquer le.s pluriel.s possible.s.

   3. Déterminant : Le professeur peut ajouter ou non la nécessité d'un déterminant

   4. Personnes : Le professeur peut choisir quelles personnes (je/tu/nous/etc.) sont demandées (ce paramètre sera précisé dans la consigne).

   5. Pronoms personnels : Le professeur peut choisir d'accepter ou non les pronoms personnels (ce paramètre sera précisé dans la consigne).

3. **Paramètres du champ audio**

   Le champ audio permet simplement de définir (ou non) un nombre d'écoutes fini et limité.

4. **Création d'une copie**

   Lors de la création d'une copie, le professeur doit tout écrire, que ce soit le mot à traduire ou sa traduction. Il peut à sa guise ajouter ou enlever des champs, ou des consignes. Il peut choisir de régler des paramètres propres à chaque champ ou bien de laisser les paramètres généralisés à tous les champs d'une copie.

### D. Diffusion

Le professeur, une fois son évaluation créée, peut créer un identifiant unique au contrôle, qui pourra être utilisé par les élèves.

De plus le professeur peut définir un temps de validité de l'évaluation, après lequel l'identifiant ne sera plus valide.

## 3. Visualisation des résultats

Thoth Edu permet aux professeurs de visualiser les résultats et réponses de chaque élève dans une page dédiée. Chaque contrôle fait l'objet d'une page, où le professeur voit une liste d'élèves, ainsi que leur note sur le contrôle étudié. Cliquer sur un nom d'élève amène à une page plus détaillée.

Des options d'exports en tableau (csv, donc compatible Excel/LibreOffice Calc) permettent au professeur de stocker sur leur machine soit les notes, soit les notes ainsi que toutes les réponses.

# II. Utilisation - Élèves

Cette catégorie abordera les modalités d'utilisation de la plateforme pour les élèves.

## 1. Participation à un contrôle

Chaque contrôle est associé à un identifiant. Il suffit pour l'élève de rentrer l'identifiant du contrôle, puis un pseudonyme, reconnaissable du professeur. Il accédera alors au contrôle.

De là, il répond aux questions, et peut envoyer son évaluation une fois qu'il a terminé.

# III. Fonctionnement

Cette catégorie aborde tous les aspects fonctionnels du site sur un aspect plus technique.

## 1. Organisation de la base de donnée

![Schéma relationnel de base de donnée](schemaBDD.svg)

### A. Professeurs

La table "Professeur" est composée de deux champs :

- **Pseudonyme** (_TEXT_) [Clé primaire unique] : Ce champ correspond au pseudonyme du professeur, soit le nom de son compte.
- **MdP** (_TEXT_) : Le mot de passe associé au compte

### B. Evaluation

La table "Evaluation" est composée de quatre champs :

- **Nom** (_TEXT_) [Clé primaire] : Le nom du contrôle, donné par le professeur
- **Chemin HTML** (_TEXT_) : Chemin vers le fichier html du contrôle
- **Chemin CSV** (_TEXT_) : Chemin vers le fichier csv, comprenant les résultats du contrôle
- **Professeur** (_TEXT_) [Clé étrangère] : Ce champ relie un contrôle au professeur qui l'a créé

### C. Accès élève

La table "Accès élève" est composée de quatre champs :

- **Identifiant** (_Text_) [Clé primaire unique] : Ce champ correspond à l'identifiant que les élèves doivent entrer pour accéder à l'évaluation
- **Modèle** (_TEXT_) [Clé étrangère] : Ce champ fait référence au modèle de l'évaluation qui sera utilisé pour cet accès
- **Date début** / **Date fin** (_DATE_) : Respectivement la date de début et de fin d'accès à l'évaluation. Avant/après ces dates, le contrôle n'est pas accessible des élèves.

## 2. Respect du RGPD

Pour respecter cela, le minimum d'informations personnelles sera demandé. En effet, pour reconnaître les élèves, le procédé est déjà écrit plus haut et chaque professeur aura un pseudonyme.

Par ailleurs, les données sensibles (ici le mot de passe) seront encryptées.
