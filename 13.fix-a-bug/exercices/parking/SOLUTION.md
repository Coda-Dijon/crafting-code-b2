# Solution : le parking qui facture trop

Les exemples sont en Java, la démarche est identique en C#.

## 1. Corriger le ticket #812

### 🔴 Reproduire le bug avec un test

On traduit le ticket en exemple, avec ses valeurs exactes :

```java
@Test
void parking_for_exactly_30_minutes_is_free() {
    assertThat(ParkingFee.compute(Duration.ofMinutes(30))).isZero();
}
```

Le test échoue sur l'assertion, pour la bonne raison :

```text
expected: 0
 but was: 2
```

> Si le test passe du premier coup, il ne reproduit pas le bug : il faut revoir l'exemple, pas le code.

### 🟢 La plus petite correction

La condition exclut la 30e minute :

```java
// Avant
if (minutes < FREE_MINUTES) {
// Après
if (minutes <= FREE_MINUTES) {
```

Tous les tests sont verts. Le test reste dans la suite comme **test de non-régression**.

### 🔵 Refactor

On rend l'intention explicite :

```java
private static boolean isFree(long minutes) {
    return minutes <= FREE_MINUTES;
}
```

## 2. Chercher les bugs voisins

Un `<` à la place d'un `<=` est un bug de **valeur limite**. Les autres limites du code méritent la même attention. On écrit une test list, avec le montant attendu calculé à la main :

| Durée         | Règle testée                     | Attendu  |
|---------------|----------------------------------|----------|
| 0 min         | gratuité                         | 0 €      |
| 29 min        | juste avant la limite            | 0 €      |
| 30 min        | pile sur la limite (ticket #812) | 0 €      |
| 31 min        | juste après la limite            | 2 €      |
| 60 min        | heure entamée, pile              | 2 €      |
| 61 min        | heure suivante entamée           | 4 €      |
| 7 h           | juste avant le plafond           | 14 €     |
| 7 h 01        | le plafond s'applique            | 15 €     |
| 24 h          | fin de la première tranche       | 15 €     |
| 24 h 10       | début de la deuxième tranche     | **17 €** |
| 48 h          | deux tranches complètes          | **30 €** |
| 48 h 10       | début de la troisième tranche    | **32 €** |

On transforme la liste en test paramétré :

```java
@ParameterizedTest(name = "{0} minutes -> {1} euros")
@CsvSource({
        "0, 0", "29, 0", "30, 0", "31, 2",
        "60, 2", "61, 4", "420, 14", "421, 15",
        "1440, 15", "1450, 17", "2880, 30", "2890, 32"
})
void computes_the_fee(long minutes, int expectedFee) {
    assertThat(ParkingFee.compute(Duration.ofMinutes(minutes))).isEqualTo(expectedFee);
}
```

Trois cas échouent : au-delà de 24 heures, le montant reste bloqué à 15 €. Le plafond est appliqué à **toute la durée** au lieu de **chaque tranche de 24 heures**. Ce bug-là fait perdre de l'argent au parking, et personne ne s'en était plaint.

### Une question pour le métier

Pour 24 h 10, faut-il appliquer à nouveau les 30 minutes gratuites ? Ce n'est pas au développeur de trancher. Ici, le métier répond : la gratuité ne s'applique qu'**au début** du stationnement, donc 24 h 10 coûte 15 € + 2 € = 17 €.

### 🟢 Corriger, un cas à la fois

On commence par le cas le plus simple, `48 h → 30 €`, puis on vérifie que `24 h 10` et `48 h 10` passent aussi (triangulation) :

```java
long fullDays = minutes / MINUTES_PER_DAY;
long remainingMinutes = minutes % MINUTES_PER_DAY;

return (int) (fullDays * DAILY_CAP + Math.min(startedHours(remainingMinutes) * HOURLY_RATE, DAILY_CAP));
```

### 🔵 Refactor

```java
public final class ParkingFee {
    private static final int FREE_MINUTES = 30;
    private static final int HOURLY_RATE = 2;
    private static final int DAILY_CAP = 15;
    private static final long MINUTES_PER_DAY = Duration.ofDays(1).toMinutes();

    private ParkingFee() {
    }

    public static int compute(Duration parkingDuration) {
        long minutes = parkingDuration.toMinutes();
        if (isFree(minutes)) return 0;

        long fullDays = minutes / MINUTES_PER_DAY;
        long remainingMinutes = minutes % MINUTES_PER_DAY;

        return (int) (fullDays * DAILY_CAP + feeWithinADay(remainingMinutes));
    }

    private static boolean isFree(long minutes) {
        return minutes <= FREE_MINUTES;
    }

    private static long feeWithinADay(long minutes) {
        return Math.min(startedHours(minutes) * HOURLY_RATE, DAILY_CAP);
    }

    private static long startedHours(long minutes) {
        return (minutes + 59) / 60;
    }
}
```

## Ce qu'il faut retenir

- Un bug est un **test manquant** : on commence par écrire ce test, et on le voit échouer.
- La correction est **minimale** : le refactoring vient après, sur une base verte.
- Un bug sur une limite en cache souvent d'autres : la **test list** sur les valeurs limites les fait apparaître.
- Face à une ambiguïté, on **pose la question au métier** au lieu de deviner.
