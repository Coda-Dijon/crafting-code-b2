# Test it or Die Trying : Grades API

Une API de gestion des notes étudiantes, avec deux endpoints :

| Méthode | URL                                                 | Description         |
|---------|-----------------------------------------------------|---------------------|
| `GET`   | `/students/{studentId}/grades?subject=&assignment=` | Consulter les notes |
| `POST`  | `/students/{studentId}/grades`                      | Créer une note      |

Écrivez des tests d'intégration selon les deux approches vues en cours (avec un mock, puis avec un fake).

Choisissez votre langage :
- [Java](java/README.md)
- [C#](csharp/README.md)

> Que se passe-t-il si le contrat de `GradeRepository` change ? Lequel de vos deux jeux de tests le détecte ?

La solution pas à pas est disponible [ici](SOLUTION.md).
