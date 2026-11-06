---
layout: section
number: 2
part: Qualité
---

# Et si on parlait <mark>qualité</mark> ?

Comment sait-on qu'un logiciel est de qualité ?

---

<span class="kicker">Connexion · 3' seul, 5' en groupe de 3, 5' en commun</span>

# Le dashboard du CTO

> Imagine que tu es CTO. Tu dois prouver au CEO que ton logiciel est de qualité.
> **Quels indicateurs mets-tu dans ton dashboard ?**

1. **Individuel** : liste tes indicateurs
2. **En groupe de 3** : mise en commun, fusion des idées, choix de **5 indicateurs maximum**
3. **Mise en commun** : on regroupe au tableau par catégories

<div class="tags"><span>Vitesse</span><span>Bugs</span><span>Tests</span><span>Incidents</span><span>Satisfaction utilisateur / impact business</span></div>

> "Est-ce que toutes ces métriques mesurent vraiment la qualité ? Ou seulement une partie ?"

---

<span class="kicker">Concepts · les couches de la qualité</span>

# Les dimensions de la qualité

<div class="cols" style="grid-template-columns: 1fr 1fr 1fr">
<div>

### Qualité interne

- Lisibilité du code
- Maintenabilité
- Modularité
- Complexité
- Dette technique
- Testabilité

</div>
<div v-click>

### Qualité externe

- Fiabilité
- Performance
- Sécurité
- UX / UI
- Compatibilité

</div>
<div v-click>

### Qualité perçue

- Satisfaction utilisateur
- Confiance
- Stabilité ressentie

</div>
</div>

> La qualité ne se limite pas aux bugs : c'est un système mesurable à plusieurs niveaux.

---

<span class="kicker">Concepts · mesurer la performance organisationnelle</span>

# Accelerate

<div class="cols">
<div>

<a href="https://itrevolution.com/product/accelerate/" target="_blank"><img src="./img/accelerate.webp" alt="Couverture du livre Accelerate" /></a>

</div>
<div>

<img src="./img/4-metrics.webp" alt="Les 4 métriques clés" />

</div>
</div>

---
layout: center
---

<img class="full" src="./img/performance.webp" alt="Performance des équipes" />

---
layout: center
---

<img class="full" src="./img/5-familles.webp" alt="Les 5 familles d'aptitudes" />

---
layout: center
---

<img class="full" src="./img/24-aptitudes.webp" alt="Les 24 aptitudes" />

---
layout: center
---

<img class="full" src="./img/agir.webp" alt="Agir sur les aptitudes" />

---
layout: center
---

<img class="full" src="./img/dora-core.webp" alt="DORA Core" />

---

<span class="kicker">Concepts · garantir la qualité</span>

# Du Waterfall à XP

<div class="cols">
<div>

<a href="https://martinfowler.com/bliki/WaterfallProcess.html" target="_blank"><img src="./img/waterfall.webp" alt="Waterfall process" /></a>

</div>
<div>

<img src="./img/xp.webp" alt="eXtreme Programming" />

</div>
</div>

---
layout: center
---

<img class="full" src="./img/testing-manifesto.webp" alt="Testing Manifesto" />

---

<span class="kicker">Concepts · garantir la qualité</span>

# Agile testing

<div class="cols">
<div>

<img src="./img/agile-testing.webp" alt="Agile testing" />

- Le test commence **dès la définition du besoin**
- Responsabilité **collective**
- Collaboration `PO` / `Dev` / `QA`
- Le test comme **activité continue**

</div>
<div>

<img src="./img/test-pyramid.webp" alt="Pyramide de tests" />

</div>
</div>

---

<span class="kicker">Concepts · garantir la qualité</span>

# Les quadrants de test

<div class="cols cols--wide-right">
<div>

<img src="./img/agile-quadrants1.webp" alt="Quadrants de test agiles" />

</div>
<div v-click>

| Quadrant | Rôle                                   | Exemples                                     |
|----------|----------------------------------------|----------------------------------------------|
| Q1       | Tests techniques supportant le dev     | Unitaires, intégration                       |
| Q2       | Tests business supportant le dev       | BDD, tests d'acceptation, exemples concrets  |
| Q3       | Tests business critiquant le produit   | Exploratoire, UAT, feedback utilisateur      |
| Q4       | Tests techniques critiquant le produit | Performance, sécurité, robustesse            |

> Tous les tests ne servent pas la même finalité.

</div>
</div>

---
layout: center
---

<img class="full" src="./img/agile-quadrants2.webp" alt="Quadrants de test détaillés" />

---

<span class="kicker">Concepts</span>

# Les limites des métriques classiques

- Couverture de code **≠** qualité
- Nombre de bugs **≠** maturité
- Story points **≠** valeur

> **Que se passe-t-il quand on optimise une mauvaise métrique ?**

Voir la [loi de Goodhart](https://fr.wikipedia.org/wiki/Loi_de_Goodhart) et l'[effet Cobra](https://fr.wikipedia.org/wiki/Effet_cobra).

---

<span class="kicker">Pratique concrète · en groupe</span>

# 50 nuances de tests

On travaille sur une application de **Yams** en ligne : lancer 5 dés, garder certains dés, scorer des combinaisons. L'application expose une API REST et persiste les scores en base.

Pour chaque snippet de test :

1. Identifiez le **type de test**
2. **Justifiez** votre réponse (dépendances, périmètre, rapidité, place dans la pyramide)

<Exercise path="02.code-quality/exercices/identifier-les-tests" />

---

<span class="kicker">Conclusions · seul, puis en binôme</span>

# Et dans mon contexte ?

<div class="cols cols--wide-left">
<div>

Au vu de ce que nous venons de voir :

- Qu'est-ce qui ferait sens d'**expérimenter** ou d'introduire dans mon contexte ?
- Quelle est la **première action** que je peux lancer pour tendre vers un mieux ?

</div>
<div>

<img src="./img/hdd.webp" alt="Hypothesis Driven Development" />

</div>
</div>

---

<span class="kicker">Ressources</span>

# Pour aller plus loin

- [Livre Accelerate](https://itrevolution.com/product/accelerate/) · [DORA](https://dora.dev/)
- [The practical test pyramid](https://martinfowler.com/articles/practical-test-pyramid.html)
- [Integration test : Narrow vs Broad](https://martinfowler.com/bliki/IntegrationTest.html)
- [Test Desiderata par Kent Beck](https://testdesiderata.com/)
- [Loi de Goodhart](https://fr.wikipedia.org/wiki/Loi_de_Goodhart) · [Effet Cobra](https://fr.wikipedia.org/wiki/Effet_cobra)
