---
layout: section
number: 3
part: Pair Programming
---

# Pair <mark>Programming</mark>

Deux personnes, un seul clavier, et des angles morts qui disparaissent.

---

<span class="kicker">Connexion · seul, puis en groupe</span>

# Pour ou contre ?

<div class="cols cols--wide-left">
<div>

En solo, listez tous les **avantages** et **inconvénients** que vous associez au `Pair Programming`.

Mettez ensuite en commun vos réponses avec le reste du groupe.

</div>
<div>

<img src="./img/kim.webp" alt="Kim en pair programming" />

</div>
</div>

---

<span class="kicker">Concepts</span>

# Qu'est-ce que le Pair Programming ?

<div class="cols">
<div>

<a href="https://youtu.be/ET3Q6zNK3Io" target="_blank"><img src="./img/pair-programming-explained.webp" alt="Pair Programming explained (vidéo)" /></a>

</div>
<div v-click>

Après la vidéo :

- Qu'avez-vous observé ?
- Qu'en pensez-vous ?
- Quels sont les **2 rôles** présentés ?

</div>
</div>

---

<span class="kicker">Concepts</span>

# Avantages et inconvénients

| Avantages                                             | Inconvénients            |
|-------------------------------------------------------|--------------------------|
| Partage instantané des bonnes pratiques et du savoir  | Fatigant                 |
| Meilleure conception / meilleure qualité de code      | Peut créer des frictions |
| Moins d'erreurs                                       |                          |
| Intégration plus rapide des nouveaux membres          |                          |
| Augmente le moral / la confiance                      |                          |
| Renforce la cohésion d'équipe / l'ownership collectif |                          |
| Code reviews instantanées (boucle de feedback courte) |                          |

---

<span class="kicker">Concepts</span>

# Ce que ce n'est pas... et quand c'est utile

<div class="cols">
<div>

Ce n'est **pas** une personne qui dort pendant qu'une autre travaille.

<img src="./img/sleeping.gif" alt="Une personne dort pendant que l'autre code" />

</div>
<div v-click>

### Quand le Pair Programming est utile

- Améliorer l'efficacité
- Développer les compétences techniques
- Faciliter le transfert de connaissance
- Améliorer la communication
- Renforcer la résolution de problèmes
- Simplifier la base de code existante

</div>
</div>

---

<span class="kicker">Concepts · les différents styles</span>

# Driver-Navigator

<div class="cols cols--wide-right">
<div>

Le **Driver** tape le code, le **Navigator** pense la direction, relit et anticipe.

> Quand changer de rôle ?

</div>
<div>

<img src="./img/driver-navigator.webp" alt="Driver-Navigator" />

</div>
</div>

---

<span class="kicker">Concepts · les différents styles</span>

# Strong Style et Ping-Pong

<div class="cols">
<div>

### Strong Style

<img src="./img/strong-style.webp" alt="Strong Style" />

</div>
<div v-click>

### Ping-Pong

<img src="./img/ping-pong.webp" alt="Ping-Pong" />

</div>
</div>

---

<span class="kicker">Concepts · les différents styles</span>

# Les styles à éviter (ou à doser)

<div class="cols" style="grid-template-columns: 1fr 1fr 1fr">
<div>

### Unstructured

<img src="./img/unstructured-pairing.webp" alt="Unstructured pairing" />

</div>
<div v-click>

### Backseat Navigator

<img src="./img/backseat-navigator.webp" alt="Backseat Navigator" />

</div>
<div v-click>

### Tour Guide

<img src="./img/tour-guide.webp" alt="Tour Guide" />

</div>
</div>

> Pour démarrer, utilisez un **minuteur**. Plus de détails : [The different styles of pair programming](https://www.drovio.com/blog/the-different-styles-of-pair-programming/).

---

<span class="kicker">Concepts</span>

# Le coût du Pair Programming

<div class="cols">
<div>

D'après [The Costs and Benefits of Pair Programming](https://www.researchgate.net/publication/2333697_The_Costs_and_Benefits_of_Pair_Programming) (Cockburn & Williams), le coût de développement est environ **15 % plus élevé**...

</div>
<div>

<img src="./img/costs.webp" alt="Coût de développement" />

</div>
</div>

---

<span class="kicker">Concepts</span>

# ... mais un coût compensé

<div class="cols">
<div>

- Des phases de test plus courtes et moins coûteuses
- Une meilleure assurance qualité

<img src="./img/test-cases.webp" alt="Cas de test" style="max-height: 300px" />

</div>
<div v-click>

- Un code moins complexe
- Moins de support en production

<img src="./img/lines-of-code.webp" alt="Lignes de code" style="max-height: 300px" />

</div>
</div>

---
class: dense
---

<span class="kicker">Concepts</span>

# Bonnes pratiques

<div class="cols">
<div>

- **Prendre des notes** : points de décision, avantages / inconvénients
- **Construire la confiance** : `committer` souvent, écrire des tests unitaires de qualité
- **Prendre du recul** en fin de session : mini-rétro, qu'avons-nous appris, que peut-on améliorer ?
- **Vider sa tasse** : comme dans les arts martiaux, videz votre esprit, soyez prêt à apprendre, soyez humble

</div>
<div v-click>

### Communiquer, sans violence

- Proposer une idée : *"Je pense que..."*
- Confirmer un accord : *"On est d'accord pour dire que..."*
- Évoquer la progression : *"On a décidé que..."*
- Éviter "Non" / "Mais", essayer plutôt : *"Oui, et..."*
- En désaccord : *"Qu'est-ce qu'il faudrait pour te convaincre ?"*

</div>
</div>

---

<span class="kicker">Pratique concrète · en binôme · 2 × 30'</span>

# Yatzy

<div class="cols cols--wide-left">
<div>

- Trouvez un binôme
  - Découvrez ensemble le code et les règles du `Yatzy`
  - Choisissez un langage : Java, C#, TypeScript ou PHP
- Faites **2 itérations de 30 minutes** : 25 minutes de code, 5 minutes de rétrospective
- **Changez de binôme** à chaque itération
- Utilisez le style **Strong Style**, avec un minuteur : 5 minutes pour commencer, puis adaptez

</div>
<div>

<img src="./img/game.webp" alt="Soirée jeux" />

</div>
</div>

<Exercise path="03.pair-programming/exercices/yatzy" />

---
layout: center
---

<img class="full" src="./img/pair-programming-reflect.webp" alt="La carte reflect pour la rétrospective" />

---

<span class="kicker">Conclusions · en groupe</span>

# Qu'avez-vous appris ?

<div class="cols">
<div>

- Qu'avez-vous fait **plus vite** qu'à l'habitude en pair ?
- Qu'avez-vous fait **plus lentement** ?
- Comment s'est passée la **communication** ?
- Quels autres avantages ou inconvénients avez-vous découverts ?

</div>
<div v-click>

### Comment se lancer ?

<img src="./img/pairing-matrix.webp" alt="Pairing matrix" />

> Le Pair Programming vous aide à identifier vos angles morts.

</div>
</div>

---

<span class="kicker">Ressources</span>

# Pour aller plus loin

- [The Different Styles of Pair Programming](https://www.drovio.com/blog/the-different-styles-of-pair-programming/), Drovio
- [The Costs and Benefits of Pair Programming](https://www.researchgate.net/publication/2333697_The_Costs_and_Benefits_of_Pair_Programming), Cockburn & Williams
- [Livre "Software Craft : TDD, Clean Code et autres pratiques essentielles"](https://www.dunod.com/sciences-techniques/software-craft-tdd-clean-code-et-autres-pratiques-essentielles-0)
