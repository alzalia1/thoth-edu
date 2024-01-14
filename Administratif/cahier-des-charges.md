# Introduction

Faire des petites évaluations, sur des sujets simples tels que du vocabulaire ou de la conjugaison, peut s'avérer chronophage. _Le temps passé à faire ces évaluations simples empiète alors sur du potentiel temps de leçon, ou d'une évaluation plus complexe, et donc sur la quantité de connaissances transmissibles en une année._

Ce projet se veut une solution à ce problème. Il permet à un professeur de créer des évaluations simples, que les élèves peuvent passer chez eux ou sur leur téléphone, et qui sera ensuite automatiquement noté, permettant tant aux élèves qu'aux professeur un gain de temps non négligeable.

Le résultat de se projet sera un site internet accessible par navigateur qui permettra une personnalisation la plus complète possible de sujets d'évaluation de vocabulaire, conjugaison, traductions simples et discrimination auditive.

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
  - [1. Base de donnée](#1-base-de-donnée)
    - [A. Organisation de la base de donnée](#a-organisation-de-la-base-de-donnée)
    - [B. Accès (Écriture/Lecture)](#b-accès-écriturelecture)
  - [2. Respect du RGPD](#2-respect-du-rgpd)
  - [3. Organisation du site internet](#3-organisation-du-site-internet)
  - [4. Interface/Liaison DB-Programme-Site](#4-interfaceliaison-db-programme-site)

# I. Utilisation - Professeur

Cette catégorie abordera les différentes utilisations possibles par un professeur de la plateforme ThothEdu.

## 1. Création d'un compte professeur

## 2. Création de contrôles

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

Un mode de création libre est également mis à disposition des enseignants s'ils souhaitent créer une évaluation à partir de n'importe quel type de champ, et sans configuration au préalable. Il n'y a aucun champ créé à l'origine.

### C. Fonctionnement

1. **Type de champs**

   1. Vérification de texte

      Le champ vérification de texte permet de corriger un texte selon des paramètres plus ou moins complexes. Les points enlevés à chaque erreurs sont personnalisables, plusieurs degré de sévérité sont disponibles.

   2. Audio

      Le champ audio permet de rajouter un fichier audio à écouter, et est accompagné d'un champ de vérification de texte pour mettre les mots attendus dans l'audio.

2. **Paramètres de la vérification de texte**

   1. Accent : Le professeur peut activer la tolérance aux absences d'accents si besoin

   2. Pluriel : Le professeur peut activer ou non la tolérance au pluriel. Si c'est le cas, il devra indiquer le pluriel possible.

   3. Déterminant : Le professeur peut ajouter ou non la nécessité d'un déterminant

   4. Personnes : Le professeur peut choisir quelles personnes sont demandées, et quand ce paramètres est activés, cela est précisé dans la consigne.

   5. Pronoms personnels : Le professeur peut choisir d'accepter ou non les pronoms personnels (ce paramètre sera précisé dans la consigne).

3. **Paramètres du champ audio**

   Le champ audio permet simplement de définir (ou non) un nombre d'écoutes fini et limité.

4. **Création d'une copie**

   Lors de la création d'une copie, le professeur doit tout écrire, que ce soit le mot à traduire ou sa traduction. Il peut à sa guise ajouter ou enlever des champs, ou des consignes. Il peut choisir de régler des paramètres propres à chaque champ ou bien de bien de laisser les paramètres généralisés à toutes les champs d'une copie.

### D. Diffusion

Le professeur, une fois son évaluation créée, peut créer un idenditifiant unique au contrôle, qui pourra être utilisé par les élèves.

De plus le professeur peut définir un temps validité de l'évaluation, après lequel l'identifiant ne sera plus valide.

## 3. Visualisation des résultats

Thoth Edu permet aux professeurs de visualiser les résultats et réponses de chaque élèves dans une page dédiée. Chaque contrôle fait l'objet d'une page, où le professeur voit une liste d'élèves, ainsi que leur note sur le contrôle étudié. Cliquer sur un nom d'élève amène à une page plus détaillée.

Des options d'exports en tableau (csv, ou compatible Excel/LibreOffice Calc) permettent au professeur de stocker sur leur machine soit les notes, soit les notes ainsi que toutes les réponses.

# II. Utilisation - Élèves

Cette catégorie abordera les modalités d'utilisation de la plateforme pour les élèves.

## 1. Participation à un contrôle

Chaque contrôle est associé à un identifiant. Il suffit pour l'élève de rentrer l'identifiant et un pseudonyme, reconnaissable du professeur. Il accédera alors au contrôle.

De là, il réponds aux questions, et peut envoyer son évaluation une fois terminé.

# III. Fonctionnement

## 1. Base de donnée

### A. Organisation de la base de donnée

### B. Accès (Écriture/Lecture)

## 2. Respect du RGPD

## 3. Organisation du site internet

## 4. Interface/Liaison DB-Programme-Site
