const express = require('express');
const mongoose = require('mongoose');

// Erstellen einer Express Router Instanz
const router = express.Router();

// Erstellen eines neuen Schemas mit den definierten Feldern
const mealSchema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    breakfast: String,  //Object muss stringified werden
    lunch: String,      //Object muss stringified werden
    dinner: String      //Object muss stringified werden
});

// Modell wird aus Schema erstellt
const Meal = mongoose.model('Meal', mealSchema);

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
        .catch(err => res.sendStatus(404).send(err))

    console.log("Response: " + "Status=" + res.statusCode);
})

/* TODO */
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

        /* TODO -> nur Daten des definierten Zeitraums auslesen */
        // Daten aus der Datenbank auslesen
        Meal.find()
            .then(data => {
                // Senden des Response-Status 200 mit dem Response-Body
                res.status(200).type("json").send(data).end();
            })
            .catch(err => res.sendStatus(404).send(err))
    }
    else {
        console.log("request parameters couldn't be converted to type Date")
        res.status(404).send("Something went wrong...");
    }

    console.log("Response: " + "Status=" + res.statusCode);
});


/* In work */
/* Erstellen eines neuen Tagesplans - Speichern in der Datenbank */
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
                        "breakfast": JSON.stringify(req.body.breakfast),
                        "lunch": JSON.stringify(req.body.lunch),
                        "dinner": JSON.stringify(req.body.dinner),
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

/* ToDo */
router.put('/:date', (req, res) => {
    console.log("MealRouter Put method");
    console.log(req.body);

    const dateString = req.params.date;
    if (Date.parse(dateString)) {
        const date = new Date(dateString);

        //Do something
    }

})

/* ToDo */
router.delete('/:date', (req, res) => {
    console.log("Request: " + "Method=" + req.method + ", URL=" + req.originalUrl);

    const dateString = req.params.date;

    if (Date.parse(dateString)) {
        const date = new Date(dateString);

        //Do something
        //TODO
        Konto.deleteOne({ "kontonummer": kontonummer })
            .then(konto => res.end("Ok"))
            .catch(err => res.sendStatus(404).end("Konto nicht gefunden"))
    }
    else {
        res.sendStatus(404).end("No valid date string");
    }
})

module.exports = router;