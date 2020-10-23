const express = require('express');
const mongoose = require('mongoose');
const mealRouter = require('./routes/meal-router');
const recipeRouter = require('./routes/recipe-router');

// Erstellen der Express Anwendung
const app = express();
const port = 3000;

app.use(express.json());

// Bereitstellen der statischen Dateien (HTML, CSS, JS), die für die Darstellung der Webseite genutzt werden
app.use('/', express.static('www'));
app.use('/lib', express.static('node_modules'));

// Bereitstellen der Router
app.use('/api/mealdata', mealRouter);
app.use('/api/recipedata', recipeRouter);

// Verbindung zu MongoDB aufbauen
mongoose.connect('mongodb://admin:secret@localhost/', { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', err => console.error("Couldn't connect to the database. Please check if the database services are running"));
db.once('open', () => console.log('Database connected'));

app.listen(port, () => console.log(`Open http://localhost:${port}`));