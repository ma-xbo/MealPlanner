const express = require('express');
const mongoose = require('mongoose');

// Erstellen eines neuen Schemas mit den definierten Feldern
const mealSchema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    breakfast: { name: String, recipeId: String },
    lunch: { name: String, recipeId: String },
    dinner: { name: String, recipeId: String }
});

// Modell wird aus Schema erstellt
const Meal = mongoose.model('Meal', mealSchema);

// Erstellen einer Express Router Instanz
const router = express.Router();

// ------------------------------------------------------------
// Routenhandler
// ------------------------------------------------------------

// Zurückgeben aller Ergebnisse
router.get('/', (req, res) => {
    console.log("Request: " + "Method=" + req.method + ", URL=" + req.originalUrl);

    // Daten aus der Datenbank auslesen
    Meal.find()
        .then(data => {
            // Senden des Response-Status 200 mit dem Response-Body
            res.status(200).type("json").send(data).end();
        })
        .catch(err => res.status(500).send(err))

    console.log("Response: " + "Status=" + res.statusCode);
})

// Zurückgeben aller Einträge in der definierten Zeitspanne
router.get('/:startDate&:endDate/', (req, res) => {
    console.log("Request: " + "Method=" + req.method + ", URL=" + req.originalUrl);

    const startDateString = req.params.startDate;
    const endDateString = req.params.endDate;

    // Prüfen, ob string params in den Typ 'Date' überführt werden können
    if (Date.parse(startDateString) & Date.parse(endDateString)) {

        // Umwandlung der Strings in Date Objekte
        const startDate = new Date(startDateString);
        const endDate = new Date(endDateString);

        // Daten aus der Datenbank auslesen
        Meal.find()
            .then(data => {
                const returnArray = [];

                // Überprüfen, ob Elemente innerhalb des angefragten Zeitraums liegen
                data.forEach(element => {
                    if (element.date >= startDate && element.date <= endDate) {
                        returnArray.push(element);
                    }
                });

                // Senden des Response-Status 200 mit dem Response-Body
                res.status(200).type("json").send(returnArray).end();
            })
            .catch(err => res.status(500).send(err))
    }
    else {
        console.log("request parameters couldn't be converted to type Date")
        res.status(500).send("Something went wrong...");
    }

    console.log("Response: " + "Status=" + res.statusCode);
});

// Erstellen eines neuen Tagesplans - Speichern in der Datenbank
router.post('/', (req, res) => {
    console.log("Request: " + "Method=" + req.method + ", URL=" + req.originalUrl);

    const requestDate = new Date(req.body.date);

    if (Date.parse(requestDate)) {

        Meal.exists({ date: requestDate }, function (err, doc) {
            if (err) {
                console.log(err)
            } else {
                if (!doc) {
                    const meal = new Meal({
                        "date": requestDate,
                        "breakfast": { name: req.body.breakfast.name, recipeId: req.body.breakfast.recipeId },
                        "lunch": { name: req.body.lunch.name, recipeId: req.body.lunch.recipeId },
                        "dinner": { name: req.body.dinner.name, recipeId: req.body.dinner.recipeId },
                    })

                    meal.save()
                        .then(() => res.sendStatus(200))
                        .catch(err => res.status(500).send(err))
                        .finally(() => console.log("Response: " + "Status=" + res.statusCode))
                }
                else {
                    res.status(500).send('Dieser Tag wurde bereits angelegt');
                }
            }
        });

    }
})

module.exports = router;