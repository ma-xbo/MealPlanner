# Meal Planner
Bei der entwickelten Webanwendung handelt es sich um eine Single Page Application, die es dem Nutzer ermöglichen soll, einen Essensplan anzulegen. Dazu wird der gewünschte Tag in Form eines Datums angelegt und das für diesen Tag geplante Frühstück, Mittagessen und Abendessen eingetragen. Zusätzlich hat der Anwender die Möglichkeit Rezepte zu erstellen, diese zu verwalten und in den Essenplan zu integrieren. Der Essensplan wird für den vom Nutzer ausgewählten Zeitraum dargestellt. Standardmäßig werden immer die Einträge der nächsten sieben Tage angezeigt. Wurde bei der Essensplanung eines Tages auf ein bereits bestehendes Rezept verwiesen, lässt sich dieses direkt über den Tagesplan öffnen.

<img src="https://user-images.githubusercontent.com/38072209/176617631-386598e0-0962-4714-b69c-10abc4e4e96d.jpg" height=320>
<img src="https://user-images.githubusercontent.com/38072209/176617644-6157d550-f242-4d1b-975e-6791d4f9a60b.jpg" height=320>
<img src="https://user-images.githubusercontent.com/38072209/176617653-2f7f85a2-1bd1-4ff0-8d71-ecb5395a1571.jpg" height=320>

## Anweisungen zum Starten der Anwendung
1. Starten des Docker Container der MongoDB (`docker run -d --name container_name -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=secret mongo`)
2. Starten des Webserver mit dem Befehl "npx nodemon index.js"

## Installierte Bibliotheken
- Express.js
- Mongoose
- Bootstrap
- jQuery (wird für manche Bootstrap Funktionalitäten benötigt, bsp. Responsive Navbar)

## Offene Punkte
1. Für aktuelle Version keine offenen Punkte

## Weitere Ideen für zukünftige Versionen

### Funktionalität
- Random Button für die Auswahl von Rezepten beim Anlegen eines neuen Tags
- Edit und Delete Button für Tagesplan --> (Klick auf einen Tagesplan öffnet ein Modal zum Editieren und Löschen des Elements)
- Löschen eines Rezepts löscht die Verbindungen zu den jeweiligen Tagesplänen (Beim Löschen müssen alle tagespläne nach der ID des Rezepts durchsucht werden)
- Anmeldung und Registration
- Ansicht bezüglich der Auswertung der verschiedenen Rezepte

### Programmierung
- Aufteilen von app.js in meherere übersichtlere Dateien
- Für jede Zutat einen eigenen Eintrag -> Array aus Zutaten
