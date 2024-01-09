# Introduction

Faire des petites évaluations, sur des sujets simples tels que du vocabulaire ou de la conjugaison, peut s'avérer chronophage. _Le temps passé à faire ces évaluations simples empiète alors sur du potentiel temps de leçon, ou d'une évaluation plus complexe, et donc sur la quantité de connaissances transmissibles en une année._

Ce projet se veut une solution à ce problème. Il permet à un professeur de créer des évaluations simples, que les élèves peuvent passer chez eux ou sur leur téléphone, et qui sera ensuite automatiquement noté, permettant tant aux élèves qu'aux professeur un gain de temps non négligeable.

Le résultat de se projet sera un site internet accessible par navigateur qui permettra une personnalisation la plus complète possible de sujets d'évaluation de vocabulaire, conjugaison, traductions simples et discrimination auditive.

# Table des matières

- [Introduction](#introduction)
- [Table des matières](#table-des-matières)
- [I. Utilisation - Professeur](#i-utilisation---professeur)
  - [1. Création de contrôles](#1-création-de-contrôles)
    - [A. Modèles](#a-modèles)
    - [B. Création libre](#b-création-libre)
    - [C. Fonctionnement](#c-fonctionnement)
  - [2. Visualisation des résultats](#2-visualisation-des-résultats)
    - [A. Interface de résultats](#a-interface-de-résultats)
- [II. Utilisation - Élèves](#ii-utilisation---élèves)
  - [1. Participation à un contrôle](#1-participation-à-un-contrôle)
- [III. Fonctionnement](#iii-fonctionnement)
  - [1. Base de donnée](#1-base-de-donnée)
    - [A. Organisation de la base de donnée](#a-organisation-de-la-base-de-donnée)
    - [B. Accès (Écriture/Lecture)](#b-accès-écriturelecture)
  - [2. Correction automatique](#2-correction-automatique)
    - [A. Barème](#a-barème)
    - [B. Programme](#b-programme)
  - [3. Respect du RGPD](#3-respect-du-rgpd)
  - [4. Organisation du site internet](#4-organisation-du-site-internet)
  - [5. Interface/Liaison DB-Programme-Site](#5-interfaceliaison-db-programme-site)

# I. Utilisation - Professeur

Cette catégorie abordera les différentes utilisations possibles par un professeur de la plateforme ThothEdu.

## 1. Création de contrôles

ThothEdu permet la création de contrôles de la part du professeur. Voici les caractéristiques et le fonctionnement de cette création.

### A. Modèles

Plusieurs modèles sont accessibles au professeur, qui peuvent ensuite être aisément modifiés, mais qui restent centrés sur une notion particulière.

Les champs sub-mentionnés sont expliqués dans [I.1.C. Fonctionnement](#c-fonctionnement) et ont des caractéristiques propres à leur utilisation.

1. **Vocabulaire :**

   Le modèle "Vocabulaire" propose des fonctionnalités de vérification de texte : un mot est proposé, et une réponse est attendue de l'élève. Le modèle est constitué de 20 mots à la base, mais le professeur a le choix d'ajouter ou supprimer le nombre de mots. Ce modèle est basé sur un type de champ "vérification de texte".

2. **Conjugaison :**

   Le modèle "Conjugaison" propose des fonctionnalités de vérification de texte, basées sur le type de champ "vérification de texte". Il y a 20 champs lors de l'initialisation, mais ils peuvent être ajoutés/supprimés à la suite.

3. **Discrimination auditive :**

   Le modèle "Discrimination auditive" propose 10 champs de type "audio" accompagnés chacun de leur champ "vérification de texte". Il faudra donc fournir l'audio et le texte à trouver.

4. **Traduction de phrase :**

   Le modèle "Traduction de phrase" propose des champs de type "vérification de texte".

### B. Création libre

### C. Fonctionnement

## 2. Visualisation des résultats

### A. Interface de résultats

# II. Utilisation - Élèves

## 1. Participation à un contrôle

# III. Fonctionnement

## 1. Base de donnée

### A. Organisation de la base de donnée

### B. Accès (Écriture/Lecture)

## 2. Correction automatique

### A. Barème

### B. Programme

## 3. Respect du RGPD

## 4. Organisation du site internet

## 5. Interface/Liaison DB-Programme-Site
