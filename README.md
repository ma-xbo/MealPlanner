# MealPlanner
Bei der entwickelten Webanwendung handelt es sich um eine Single Page Application, die es dem Nutzer ermöglichen soll, einen Essensplan anzulegen. Dazu wird der gewünschte Tag in Form eines Datums angelegt und das für diesen Tag geplante Frühstück, Mittagessen und Abendessen eingetragen. Zusätzlich hat der Anwender die Möglichkeit Rezepte zu erstellen, diese zu verwalten und in den Essenplan zu integrieren. Der Es-sensplan wird für den vom Nutzer ausgewählten Zeitraum dargestellt. Standardmäßig werden immer die Einträge der nächsten sieben Tage angezeigt. Wurde bei der Essens-planung eines Tages auf ein bereits bestehendes Rezept verwiesen, lässt sich dieses direkt über den Tagesplan öffnen. 
## Anweisungen zum Starten der Anwendung
1. Starten des Docker Container der MongoDB
2. Starten des Webserver mit dem Befehl "npx nodemon index.js"

## Installierte Bibliotheken
- Express.js
- Mongoose
- Bootstrap
- jQuery (wird für manche Bootstrap Funktionalitäten benötigt, bsp. Responsive Navbar)

## Offene Punkte
1. Edit Button für Rezepte --> Sektion Edit Recipe
2. Edit und Delete Button für Tagesplan --> Sektion View Tagesplan mit Edit und Delete?

## Weitere Ideen
### Funktionalität
- Ansicht bezüglich der Auswertung der verschiedenen Rezepte
- Random Button für die Auswahl von Rezepten beim Anlegen eines neuen Tags

### Programmierung
- Aufteilen von app.js in meherere übersichtlere Dateien
- Für jede Zutat einen eigenen Eintrag -> Array aus Zutaten