# Trip Service Kata

## Contexte

Vous héritez du service suivant. Il calcule les voyages d'un utilisateur visibles par la personne connectée :

```scala
class TripServiceBackup {
  def getTripsByUser(user: User): List[Trip] = {
    var tripList: List[Trip] = List()
    val loggedInUser = UserSession getLoggedUser ()
    var isFriend = false
    if (loggedInUser != null) {
      breakable {
        for (friend <- user.friends()) {
          if (friend == loggedInUser) {
            isFriend = true
            break
          }
        }
      }
      if (isFriend) {
        tripList = TripDAO.findTripsByUser(user)
      }
      tripList
    } else {
      throw new UserNotLoggedInException
    }
  }
}
```

## Objectif

Refactorer ce code pour qu'il respecte les principes du Clean Code / SOLID : **sans jamais modifier du code non couvert par des tests**.

## Conseils

- Commencez les tests **de la branche la plus courte à la plus profonde**
- Commencez le refactoring **de la branche la plus profonde à la plus courte**


## Étape 1 : Identifier les code smells

Avant tout, lisez le code et identifiez les problèmes :

- Quels code smells voyez-vous ?
- Qu'est-ce qui rend ce code difficile à tester ?
- Quelles sont les dépendances problématiques ?

<details>
<summary>Code smells identifiés</summary>

- `UserSession.getLoggedUser()` : Singleton global, impossible à remplacer en test
- `TripDAO.findTripsByUser(user)` : appel statique sur une classe DAO, dépendance dure
- Boucle `for` avec `breakable` : **Feature Envy** : la logique d'amitié appartient à `User`, pas à `TripService`
- `var tripList` et `var isFriend` : état mutable inutile
- `null` check sur `loggedInUser` : contrat implicite, non exprimé dans le type

</details>


## Étape 2 : Écrire un premier test naïf

Essayez d'écrire un test pour `getTripsByUser`. Que se passe-t-il ?

```scala
class TripServiceSpec extends AnyFlatSpec {
  it should "throw when user is not logged in" in {
    val tripService = new TripServiceBackup()
    // Que se passe-t-il quand on appelle getTripsByUser ?
  }
}
```

> `UserSession.getLoggedUser()` sera appelé : et en dehors d'un contexte HTTP, il explose.


## Étape 3 : Créer un Seam avec Extract Method

On ne peut pas modifier le code directement. On utilise un **refactoring automatique** :

1. Sélectionner `UserSession getLoggedUser()` dans l'IDE
2. **Extract Method** → `getLoggedUser`
3. Passer la méthode de `private` à `protected`

```scala
protected def getLoggedUser: User = UserSession.getLoggedUser()
```

De même pour le TripDAO :

```scala
protected def findTripsByUser(user: User): List[Trip] = TripDAO.findTripsByUser(user)
```


## Étape 4 : Sous-classer pour les tests

```scala
class TestableTripService(
  loggedUser: User,
  tripsForUser: List[Trip]
) extends TripServiceBackup {
  override protected def getLoggedUser: User = loggedUser
  override protected def findTripsByUser(user: User): List[Trip] = tripsForUser
}
```

On peut maintenant écrire des tests :

```scala
it should "throw UserNotLoggedInException when no user is logged in" in {
  val tripService = new TestableTripService(loggedUser = null, tripsForUser = List())
  assertThrows[UserNotLoggedInException] {
    tripService.getTripsByUser(anyUser)
  }
}
```


## Étape 5 : Utiliser la couverture comme pilote

Lancer la couverture de code et identifier les branches non couvertes.

Cas de test à couvrir :

```text
Utilisateur non connecté → lancer UserNotLoggedInException
Utilisateur connecté, pas ami avec l'utilisateur cible → retourner une liste vide
Utilisateur connecté, ami avec l'utilisateur cible → retourner les voyages
```


## Étape 6 : Test Data Builders

Les setups de tests deviennent vite illisibles :

```scala
val aUserWithTrips = new User()
aUserWithTrips.addTrip(toPortugal)
aUserWithTrips.addTrip(toSpringfield)
aUserWithTrips.addFriend(anotherUser)
aUserWithTrips.addFriend(loggedInUser)
```

On utilise le pattern **Test Data Builder** pour les rendre expressifs :

```scala
UserBuilder.aUser()
  .friendsWith(loggedInUser)
  .withTrips(toPortugal, toSpringfield)
  .build()
```


## Étape 7 : Refactoring : Feature Envy & Sprout Technique

La logique d'amitié n'appartient pas à `TripService`, elle appartient à `User`.

C'est une application de la **Sprout Technique** (Feathers) : plutôt que de modifier du code legacy non couvert, on **pousse le nouveau comportement dans une nouvelle méthode testable** : ici sur `User`. On écrit les tests d'abord, puis on branche.

> La Sprout Technique permet d'ajouter du comportement propre sans contaminer le code legacy existant.
> : [Nicolas Carlo, Understanding Legacy Code](https://understandlegacycode.com/blog/key-points-of-working-effectively-with-legacy-code/#identify-seams-to-break-your-code-dependencies)

On applique le TDD pour ajouter ce comportement sur `User` :

```scala
// Test
"User" should "inform when users are not friends" in {
  val user = UserBuilder.aUser().build()
  val stranger = UserBuilder.aUser().build()
  user.isFriendWith(stranger) mustBe false
}

it should "inform when users are friends" in {
  val loggedUser = UserBuilder.aUser().build()
  val user = UserBuilder.aUser().friendsWith(loggedUser).build()
  user.isFriendWith(loggedUser) mustBe true
}
```

On peut ensuite simplifier `TripService` :

```scala
if (user.isFriendWith(loggedInUser)) findTripsByUser(user) else emptyTrips
```


## Étape 8 : Rendre les contrats explicites

Remplacer le `throw` implicite par un type explicite avec `Try` :

```scala
def getTripsByUser(user: User): Try[List[Trip]] =
  checkUser(getLoggedUser) { loggedUser =>
    if (user.isFriendWith(loggedUser)) findTripsByUser(user) else emptyTrips
  }
```


## Étape 9 : Injecter les dépendances

Avec le **Change Signature** de l'IDE :

1. Injecter `loggedUser` en paramètre de méthode (supprimer le Singleton)
2. Injecter `TripDAO` en paramètre du constructeur

```scala
class TripService(val tripDAO: TripDAO) {
  def getFriendTrips(user: User, loggedUser: User): Try[List[Trip]] = ...
}
```


## [Bonus] Mutation Testing

Une fois le code couvert, validez la qualité de vos tests avec **Stryker** ou **PiTest**.

Exemples de mutants typiques à tuer :
- Supprimer la vérification `loggedInUser == null`
- Inverser la condition `isFriendWith`
- Retourner une liste vide au lieu de `findTripsByUser(user)`

> Si un mutant survit, votre test ne prouve pas ce qu'il prétend prouver.

Le code est disponible en [C#](csharp), [Java](java) et [TypeScript](ts). Un guide pas à pas (en Scala) est disponible [ici](https://github.com/ythirion/scala-kata-logs/blob/main/TripServiceKata/solution/step-by-step.md).
