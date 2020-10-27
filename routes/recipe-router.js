const express = require('express');
const mongoose = require('mongoose');

// Erstellen einer Express Router Instanz
const router = express.Router();

// Erstellen eines neuen Schemas mit den definierten Feldern
const recipeSchema = new mongoose.Schema({
    id: String,
    name: String,
    directions: String,
    ingredients: String,
    nutritions: String,
    mealTime: String,
    mealOptions: String
});

// Modell wird aus Schema erstellt
const Recipe = mongoose.model('Recipe', recipeSchema);

// ------------------------------------------------------------
// Routenhandler
// ------------------------------------------------------------

// Zurückgeben aller Rezepte
router.get('/', (req, res) => {
    Recipe.find()
        .then(recipe => res.status(200).type("json").send(recipe))
        .catch(err => res.sendStatus(404).send("Rezepte wurde nicht gefunden"))

})

// Zurückgeben der gefilterten Werte
router.get('/:filterValue', (req, res) => {

    // Regex zum Filtern der Werte
    Recipe.find({ "name": { "$regex": req.params.filterValue, "$options": "i" } })
        .then(recipe => res.status(200).type("json").send(recipe))
        .catch(err => res.sendStatus(404).send("Rezepte wurde nicht gefunden"))

})

// Zurückgeben der gefilterten Werte
router.get('/id/:recipeId', (req, res) => {

    // Auslesen des Werts mit der angefragten ID
    Recipe.find({ "id": req.params.recipeId })
        .then(recipe => res.status(200).type("json").send(recipe))
        .catch(err => res.sendStatus(404).send("Rezepte wurde nicht gefunden"))

})

/* Erstellen eines neuen Eintrags */
router.post('/', (req, res) => {
    console.log("Request: " + "Method=" + req.method + ", URL=" + req.originalUrl);

    const recipe = new Recipe({
        "id": newID(),
        "name": req.body.name,
        "directions": req.body.directions,
        "ingredients": req.body.ingredients,
        "nutritions": req.body.nutritions,
        "mealTime": JSON.stringify(req.body.mealTime),
        "mealOptions": JSON.stringify(req.body.mealOptions),
    })

    recipe.save()
        .then(data => res.sendStatus(200))
        .catch(err => res.sendStatus(500))
        .finally(() => console.log("Response: " + "Status=" + res.statusCode))
})

/* TODO -> nicht implementiert */
router.put('/:recipeId', (req, res) => {

    const recipeId = req.params.recipeId;

})

/* Löschen eines Werts */
router.delete('/:recipeId', (req, res) => {

    console.log("Request: " + "Method=" + req.method + ", URL=" + req.originalUrl);

    const recipeId = req.params.recipeId

    Recipe.deleteOne({ "id": recipeId })
        .then(recipe => res.status(200).type("json").send(recipe))
        .catch(err => res.sendStatus(404).end("Konto nicht gefunden"))
        .finally(() => console.log("Response: " + "Status=" + res.statusCode))
})

module.exports = router;

function newID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}