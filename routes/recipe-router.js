const express = require('express');
const mongoose = require('mongoose');

// Erstellen eines neuen Schemas mit den definierten Feldern
const recipeSchema = new mongoose.Schema({
    id: String,
    name: String,
    directions: String,
    ingredients: String,
    nutritions: String,
    mealTime: { breakfast: Boolean, lunch: Boolean, dinner: Boolean },
    mealOptions: { vegan: Boolean, vegetarian: Boolean, glutenFree: Boolean, lactoseFree: Boolean }
});

// Modell wird aus Schema erstellt
const Recipe = mongoose.model('Recipe', recipeSchema);

// Erstellen einer Express Router Instanz
const router = express.Router();

// ------------------------------------------------------------
// Routenhandler
// ------------------------------------------------------------

// Zurückgeben aller Rezepte
router.get('/', (req, res) => {
    Recipe.find()
        .then(recipe => res.status(200).type("json").send(recipe))
        .catch(err => res.status(500).send("Rezepte wurde nicht gefunden"))

})

// Zurückgeben der gefilterten Werte
router.get('/:filterValue', (req, res) => {

    // Regex zum Filtern der Werte
    Recipe.find({ "name": { "$regex": req.params.filterValue, "$options": "i" } })
        .then(recipe => res.status(200).type("json").send(recipe))
        .catch(err => res.status(500).send("Rezepte wurde nicht gefunden"))
})

// Zurückgeben der gefilterten Werte
router.get('/id/:recipeId', (req, res) => {

    // Auslesen des Werts mit der angefragten ID
    Recipe.find({ "id": req.params.recipeId })
        .then(recipe => res.status(200).type("json").send(recipe))
        .catch(err => res.status(500).send("Rezepte wurde nicht gefunden"))

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
        "mealTime": {
            breakfast: req.body.mealTime.breakfast,
            lunch: req.body.mealTime.lunch,
            dinner: req.body.mealTime.dinner
        },
        "mealOptions": {
            vegan: req.body.mealOptions.vegan,
            vegetarian: req.body.mealOptions.vegetarian,
            glutenFree: req.body.mealOptions.glutenFree,
            lactoseFree: req.body.mealOptions.lactoseFree
        }

    })

    recipe.save()
        .then(data => res.sendStatus(200))
        .catch(err => res.status(500).send(err))
        .finally(() => console.log("Response: " + "Status=" + res.statusCode))
})

// Aktualisieren eines Werts 
router.put('/:recipeId', async (req, res) => {
    console.log("Request: " + "Method=" + req.method + ", URL=" + req.originalUrl);

    // Heraussuchen des Dokuments mit der recipeId aus der Anfrage
    Recipe.findOne({ "id": req.params.recipeId })
        .then(recipe => {

            // Wurde ein Rezept mit der angegebenen ID gefunden, müss dessen Daten aktualisiert werden
            recipe.name = req.body.name;
            recipe.directions = req.body.directions;
            recipe.ingredients = req.body.ingredients;
            recipe.nutritions = req.body.nutritions;

            recipe.mealTime.breakfast = req.body.mealTime.breakfast;
            recipe.mealTime.lunch = req.body.mealTime.lunch;
            recipe.mealTime.dinner = req.body.mealTime.dinner;

            recipe.mealOptions.vegan = req.body.mealOptions.vegan;
            recipe.mealOptions.vegetarian = req.body.mealOptions.vegetarian;
            recipe.mealOptions.glutenFree = req.body.mealOptions.glutenFree;
            recipe.mealOptions.lactoseFree = req.body.mealOptions.lactoseFree;

            // Speichern des Dokuments mit den aktualisierten Daten 
            recipe.save()
                .then(() => res.sendStatus(200))
                .catch(() => res.sendStatus(500).end("Das Rezept konnte nicht aktualisiert werden"))
        })
        .catch(() => res.sendStatus(500).end("Das Rezept konnte nicht aktualisiert werden"))
        .finally(() => console.log("Response: " + "Status=" + res.statusCode))

});

/* Löschen eines Werts */
router.delete('/:recipeId', (req, res) => {

    console.log("Request: " + "Method=" + req.method + ", URL=" + req.originalUrl);

    const recipeId = req.params.recipeId

    Recipe.deleteOne({ "id": recipeId })
        .then(() => res.sendStatus(200))
        .catch(() => res.status(500).send("Das Rezept konnte nicht gelöscht werden"))
        .finally(() => console.log("Response: " + "Status=" + res.statusCode))
})

module.exports = router;

function newID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}