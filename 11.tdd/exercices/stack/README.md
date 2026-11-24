# Stack Kata

Implémentez une **pile** (stack) en TDD, sans utiliser les collections du langage (`Stack`, `Deque`, `ArrayList`...) : un simple tableau suffit.

Une pile fonctionne en **LIFO** (*Last In, First Out*) : le dernier élément empilé est le premier dépilé.

## Le contrat

| Opération            | Comportement                                                       |
|----------------------|--------------------------------------------------------------------|
| `withCapacity(n)`    | Crée une pile pouvant contenir au plus `n` éléments               |
| `push(element)`      | Empile un élément                                                  |
| `pop()`              | Dépile et retourne le dernier élément empilé                       |
| `top()`              | Retourne le dernier élément empilé, **sans** le dépiler           |
| `isEmpty()`, `size()` | Indiquent l'état de la pile                                       |

## La test list

Les tests sont donnés dans un ordre qui fait **émerger** l'implémentation, un baby step à la fois. Prenez-les **un par un**, et ne passez au suivant qu'après Red → Green → Refactor.

```text
1.  Une nouvelle pile est vide
2.  Après un push, la pile n'est pas vide
3.  Après un push et un pop, la pile est vide
4.  Après deux push et un pop, la pile n'est pas vide
5.  Empiler au-delà de la capacité lève une exception (overflow)
6.  Dépiler une pile vide lève une exception (underflow)
7.  Après avoir empilé X, pop retourne X
8.  Après avoir empilé X puis Y, pop retourne Y puis X
9.  top retourne le dernier élément sans le dépiler
10. top sur une pile vide lève une exception (underflow)
11. Une pile ne peut pas avoir une capacité négative
12. Tout push sur une pile de capacité 0 lève une exception (overflow)
```

## Ce qu'on veut observer

- **Fake it** : les premiers tests passent avec des valeurs en dur (`return true`), c'est voulu
- **Triangulation** : c'est le test suivant qui force à généraliser (un booléen devient un compteur, le compteur devient un tableau)
- **Refactor** : à chaque vert, on nettoie le code **et** les tests (setup commun, nommage)

> Résistez à l'envie d'écrire la pile complète dès le premier test : laissez les tests vous **forcer** à la faire évoluer.

## Trop facile ?

- Rendez la pile **générique** (`Stack<T>`)
- Remplacez la capacité fixe par une pile qui **grandit** quand elle est pleine : quels tests changent ?
- Recommencez en **ping-pong** : l'un écrit le test rouge, l'autre le fait passer et refactore
- Faites-le dans un langage que vous ne connaissez pas

Step-by-step disponible [ici](SOLUTION.md).
