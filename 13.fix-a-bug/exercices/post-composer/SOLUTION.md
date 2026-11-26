# Solution : Coda Social

## 1. Reproduire le bug comme l'utilisatrice

### 🔴 Le test E2E

On suit les étapes du ticket, avec les valeurs du ticket :

```js
test('a 280 characters message can be published', async ({ page }) => {
    await page.goto('/');

    await page.getByLabel('Votre message').fill('a'.repeat(280));

    await expect(page.getByRole('status')).toHaveText('0 caractère restant');
    await expect(page.getByRole('button', { name: 'Publier' })).toBeEnabled();
});
```

Il échoue pour la bonne raison : la page est chargée, le compteur affiche bien « 0 caractère restant », mais le bouton est désactivé.

```text
Error: expect(locator).toBeEnabled() failed
Expected: enabled
Received: disabled
```

> La première assertion sur le compteur sert de garde-fou : elle prouve que le message a bien la bonne longueur. Si elle échouait, le test ne reproduirait pas le ticket.

## 2. Descendre au niveau le plus bas

`main.js` ne fait que brancher le DOM : `publishButton.disabled = !canPublish(text)`. La règle est dans `src/message.js` :

```js
export function canPublish(text) {
    return text.trim().length > 0 && text.length < MAX_LENGTH;
}
```

### 🔴 Le test unitaire

```js
it('accepts a message of exactly 280 characters', () => {
    expect(canPublish('a'.repeat(280))).toBe(true);
});
```

Il échoue en quelques millisecondes, sans navigateur.

### 🟢 La plus petite correction

```js
// Avant
text.length < MAX_LENGTH
// Après
text.length <= MAX_LENGTH
```

Le test unitaire et le test E2E passent.

### Garder le test E2E ?

Le test unitaire suffit à verrouiller la règle. Le test E2E vérifie en plus que le bouton est **branché** sur la règle. Une option raisonnable : garder un seul test E2E du type « un message à la limite peut être publié », et tester toutes les limites en unitaire.

## 3. Chercher les bugs voisins

| Message           | Règle testée        | Attendu   |
|-------------------|---------------------|-----------|
| 279 caractères    | publication         | publiable |
| 280 caractères    | publication, limite | publiable |
| 281 caractères    | publication         | refusé    |
| 259 caractères    | compteur (21 restants) | `ok`      |
| 260 caractères    | compteur (20 restants) | `warning` |
| 261 caractères    | compteur (19 restants) | `warning` |
| 280 caractères    | compteur (0 restant)   | `warning` |
| 281 caractères    | compteur (-1)          | `error`   |

```js
it.each([
    [279, true],
    [280, true],
    [281, false],
])('a message of %i characters is publishable: %s', (length, expected) => {
    expect(canPublish('a'.repeat(length))).toBe(expected);
});

it.each([
    [259, 'ok'],
    [260, 'warning'],
    [261, 'warning'],
    [280, 'warning'],
    [281, 'error'],
])('with %i characters the counter is %s', (length, expected) => {
    expect(counterState('a'.repeat(length))).toBe(expected);
});
```

Un cas échoue : avec **20 caractères restants**, le compteur reste `ok` au lieu de passer en `warning`. C'est le même bug, sur une autre limite : la règle dit « 20 caractères ou moins ».

```js
// Avant
if (remaining < WARNING_THRESHOLD) return 'warning';
// Après
if (remaining <= WARNING_THRESHOLD) return 'warning';
```

### Une question pour le métier

```js
'😀'.length // 2
```

Pour JavaScript, un emoji compte souvent pour **2** caractères (paires de substitution UTF-16). Un message de 140 emojis est donc refusé. Est-ce voulu ? Ce n'est pas au développeur de trancher : on note la question, et on ajoute le test une fois la règle clarifiée.

## Ce qu'il faut retenir

- On reproduit d'abord le bug **comme l'utilisateur le vit** (E2E), puis on le **descend** au niveau le plus bas (unitaire).
- La correction est **minimale** : un `<` devient `<=`.
- Un bug sur une limite en cache souvent d'autres : la **test list** sur les valeurs limites trouve le second.
- Garder les règles métier dans des **fonctions pures**, séparées du DOM, rend ce travail rapide.
