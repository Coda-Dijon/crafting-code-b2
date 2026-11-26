# Corriger un bug front-end : Coda Social

> **Ticket #1337 : impossible de publier un message de 280 caractères**
>
> **Signalé par** : Léa M. (utilisatrice)
> **Priorité** : Moyenne
>
> **Description** :
> J'ai écrit un message de **280 caractères pile**. Le compteur affiche « 0 caractère restant », mais le bouton **Publier reste grisé**.
> J'ai dû supprimer un caractère pour pouvoir publier.
>
> **Étapes pour reproduire** :
> 1. Ouvrir la page
> 2. Saisir un message de 280 caractères
> 3. Résultat attendu : le bouton Publier est actif. Résultat obtenu : il est désactivé.

### Règles métier

- Un message fait **au maximum 280 caractères**
- Le compteur affiche le nombre de **caractères restants**
- Le bouton **Publier** est actif si le message n'est pas vide (les espaces seuls ne comptent pas) et ne dépasse pas la limite
- Le compteur passe en **orange** quand il reste **20 caractères ou moins**, en **rouge** quand la limite est dépassée

## À vous de jouer

```bash
npm install
npx playwright install chromium

npm start            # la page sur http://localhost:3002
npm run test:unit    # tests unitaires (Vitest)
npm run test:e2e     # tests E2E (Playwright)
```

```
post-composer/
├── index.html
├── src/
│   ├── message.js     # Règles métier (fonctions pures)
│   ├── main.js        # Branchement sur le DOM
│   └── style.css
└── tests/
    ├── unit/          # Vitest
    └── e2e/           # Playwright
```

## Votre mission

### 1. Reproduire le bug comme l'utilisatrice

1. Lancez les tests : ils passent tous, le bug n'est pas couvert.
2. 🔴 Écrivez un **test E2E** Playwright qui suit les étapes du ticket, avec des sélecteurs ARIA.
3. Vérifiez qu'il **échoue pour la bonne raison** : le bouton est désactivé, pas un problème de sélecteur ou de chargement.

### 2. Descendre au niveau le plus bas

4. Le test E2E est lent et dit seulement *que* ça ne marche pas. Trouvez **la fonction** responsable dans `src/`.
5. 🔴 Écrivez le **test unitaire** qui reproduit le même bug, et voyez-le échouer.
6. 🟢 Corrigez avec la **plus petite modification** possible : les deux tests passent.
7. 🔵 Refactorez si besoin. Gardez-vous le test E2E ? Argumentez.

### 3. Chercher les bugs voisins

8. Écrivez une **test list** sur les valeurs limites de chaque règle (juste avant, pile dessus, juste après).
9. Transformez-la en test paramétré (`it.each`) et traitez chaque échec avec un nouveau cycle Red → Green → Refactor.
10. Notez les cas ambigus comme **questions pour le métier** au lieu de deviner.

> Indice : relisez la règle du compteur orange. Et combien de caractères fait `'😀'` pour JavaScript ?

> La correction est dans [SOLUTION.md](SOLUTION.md) : ne l'ouvrez qu'après avoir essayé.
