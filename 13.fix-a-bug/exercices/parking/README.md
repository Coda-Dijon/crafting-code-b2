# Corriger un bug en TDD : le parking qui facture trop

> **Ticket #812 : facturé pour 30 minutes de stationnement**
>
> **Signalé par** : Karim B. (accueil du parking)
> **Priorité** : Moyenne
>
> **Description** :
> Plusieurs clients se plaignent : ils sont restés **30 minutes pile** et la borne leur a demandé **2 €**.
> Le panneau à l'entrée annonce pourtant « 30 premières minutes gratuites ».
>
> **Étapes pour reproduire** :
> 1. Entrer dans le parking à 14h00
> 2. Sortir à 14h30
> 3. Montant attendu : 0 €, montant demandé : 2 €

### Règles de tarification

- Les **30 premières minutes** de stationnement sont **gratuites**
- Au-delà, chaque **heure entamée** coûte **2 €**
- Le montant est plafonné à **15 € par tranche de 24 heures**

## À vous de jouer

### Java

```bash
cd java
mvn test
```

### C\#

```bash
cd csharp
dotnet test
```

## Votre mission

### 1. Corriger le bug en TDD

1. Lancez les tests : ils passent tous, le bug n'est pas couvert.
2. 🔴 Écrivez **un seul** test qui reproduit le ticket #812, avec les valeurs du ticket.
3. Vérifiez qu'il **échoue pour la bonne raison** : l'assertion, pas une exception ni une erreur de compilation.
4. 🟢 Faites la **plus petite modification** possible pour le faire passer.
5. 🔵 Refactorez si besoin, tous les tests restent verts.

### 2. Chercher les bugs voisins

Un bug sur une limite en cache souvent d'autres. Avant de fermer le ticket :

1. Écrivez une **test list** autour des limites de chaque règle (juste avant, pile dessus, juste après).
2. Pour chaque cas, notez le montant attendu **avant** de lancer le test.
3. Si un cas vous semble ambigu, notez la **question à poser au métier** au lieu de deviner.
4. Transformez la liste en test paramétré, et traitez chaque échec avec un nouveau cycle Red → Green → Refactor.

> Indice : regardez ce qui se passe au-delà de 24 heures.

### Pour débriefer

- Pourquoi ce bug n'avait-il pas été détecté par les tests existants ?
- Quels cas de votre test list auraient évité ces bugs s'ils avaient été écrits dès le départ ?

> La correction est dans [SOLUTION.md](SOLUTION.md) : ne l'ouvrez qu'après avoir essayé.
