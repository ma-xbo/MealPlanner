window.addEventListener('load', evt => {
    //define default hash
    window.location.hash = '#mealplan';

    //Filter der Ansicht 'Mealplan' setzen (Datum in die input Felder eintragen)
    mealplanFilterSetup();

    //Laden der Daten des Backend
    loadContent_mealdata(document.getElementById('filter_startdate').value, document.getElementById('filter_enddate').value);
    loadContent_recipedata();

    // Hashchange Event für hash-basierte Navigation
    // https://developer.mozilla.org/de/docs/Web/API/WindowEventHandlers/onhashchange
    window.addEventListener('hashchange', evt => {
        const views = [
            {
                hash: "mealplan",
                elementID: "meal_section"
            },
            {
                hash: "new-meal",
                elementID: "new_meal_section"
            },
            {
                hash: "recipes",
                elementID: "recipe_section"
            },
            {
                hash: "new-recipe",
                elementID: "new_recipe_section"
            }
        ];

        // Aktuellen Hash auslesen
        const hashNavigationValue = window.location.hash.substring(1); //substring(1) entfernt das '#' Zeichen (erste Zeichen der Zeichenkette) 

        if (hashNavigationValue === "recipes") {
            loadContent_recipedata();
        }

        // Heraussuchen der ElementID basierend auf den Einträgen in "views"
        const activeElementID = views.filter(el => el.hash === hashNavigationValue)[0].elementID;

        for (let index = 0; index < views.length; index++) {
            if (views[index].elementID === activeElementID) {
                //Prüfen ob element bereits activ ist, wenn nicht einblenden
                const element = document.getElementById(views[index].elementID);

                if (element !== null && element.classList.contains("hidden")) {
                    element.classList.remove('hidden');
                }
            }
            else {
                //Prüfen ob element bereits class "hidden" besitzt, wenn nicht -> klasse hinzufügen
                const element = document.getElementById(views[index].elementID);

                if (element !== null && !element.classList.contains("hidden")) {
                    element.classList.add('hidden');
                }
            }
        }
    });

    // Button Click EventListeners
    document.getElementById('filter_refresh_button').addEventListener('click', mealplanFilterRefresh);
    document.getElementById('filter_recipeName').addEventListener('input', filterContent_recipedata);
    document.getElementById('new_item_button').addEventListener('click', showNewMealForm);
    document.getElementById('new_item_submit').addEventListener('click', submitNewMealForm);
    document.getElementById('new_recipe_button').addEventListener('click', showNewRecipeForm);
    document.getElementById('new_recipe_submit').addEventListener('click', submitNewRecipeForm);
    document.getElementById('input_breakfast').addEventListener('input', filterRecipeNewBreakfast);
    document.getElementById('input_lunch').addEventListener('input', filterRecipeNewLunch);
    document.getElementById('input_dinner').addEventListener('input', filterRecipeNewDinner);
});

/* Essensplan Übersicht */
/* ------------------------------------------------------------ */
/* Funktion zum Laden der Meal Informationen -> Was gibt es heute zu essen */
function mealplanFilterSetup() {
    const dateStart = new Date();
    const dateEnd = addDays(dateStart, 7);
    document.getElementById('filter_startdate').value = dateStart.toISOString().slice(0, 10);
    document.getElementById('filter_enddate').value = dateEnd.toISOString().slice(0, 10);

    function addDays(date, days) {
        var result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }
}

/* Funktion zum Laden des Mealplan basierend auf dem Filter */
function mealplanFilterRefresh(evt) {
    evt.preventDefault();

    // Laden der Daten für den ausgewählten Zeitraum
    loadContent_mealdata(document.getElementById('filter_startdate').value, document.getElementById('filter_enddate').value);
}

/* Funktion zum Laden der Meal Informationen -> Was gibt es heute zu essen */
function loadContent_mealdata(startDate, endDate) {
    fetch('api/mealdata/' + startDate + '&' + endDate)
        .then(res => res.json())
        .then(data => {
            /* Anpassungen an den Daten */
            data.map(element => {
                element.date = new Date(element.date);
                element.breakfast = JSON.parse(element.breakfast);
                element.lunch = JSON.parse(element.lunch);
                element.dinner = JSON.parse(element.dinner);
            });
            return data;
        })
        .then(meals => {
            /* Darstellen der Daten */
            if (meals.length > 0) {
                document.getElementById('mealplan_data_out').innerHTML = '';
                meals.map((meal) => createContent_mealdata(meal))
            }
            else {
                document.getElementById('mealplan_data_out').innerHTML = '<p>Es wurden keine Elemente gefunden</p>';
            }
        })
        .catch(err => displayErrorMessage(err))
}

/*  */
function createContent_mealdata(data) {
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const itemDate = new Date(data.date);

    /* Erstellen der Layout Div's */
    const colDiv = document.createElement('div');
    colDiv.classList.add('col-xl-3');
    colDiv.classList.add('col-lg-4');
    colDiv.classList.add('col-md-6');
    colDiv.classList.add('col-12');

    const cardDiv = document.createElement('div')
    cardDiv.classList.add('card')

    const cardHeaderDiv = document.createElement('div');
    cardHeaderDiv.classList.add('card-header');
    cardHeaderDiv.innerText = itemDate.toLocaleDateString('de-DE', dateOptions);

    const cardBodyDiv = document.createElement('div');
    cardBodyDiv.classList.add('card-body');

    /* Frühstück Content */
    const cardBreakfastTitle = document.createElement('h5');
    cardBreakfastTitle.classList.add('card-title');
    cardBreakfastTitle.innerText = "Frühstück:";

    const cardBreakfastData = document.createElement('p');
    cardBreakfastData.classList.add('card-text');
    cardBreakfastData.innerText = data.breakfast.name;

    /* Mittagessen Content */
    const cardLunchTitle = document.createElement('h5');
    cardLunchTitle.classList.add('card-title');
    cardLunchTitle.innerText = "Mittagessen:";

    const cardLunchData = document.createElement('p');
    cardLunchData.classList.add('card-text');
    cardLunchData.innerText = data.lunch.name;

    /* Abendessen Content */
    const cardDinnerTitle = document.createElement('h5');
    cardDinnerTitle.classList.add('card-title');
    cardDinnerTitle.innerText = "Abendessen:";

    const cardDinnerData = document.createElement('p');
    cardDinnerData.classList.add('card-text');
    cardDinnerData.innerText = data.dinner.name;

    /* "Zusammenbauen" */
    colDiv.appendChild(cardDiv);
    cardDiv.appendChild(cardHeaderDiv);
    cardDiv.appendChild(cardBodyDiv);
    cardBodyDiv.appendChild(cardBreakfastTitle);
    cardBodyDiv.appendChild(cardBreakfastData);
    cardBodyDiv.appendChild(cardLunchTitle);
    cardBodyDiv.appendChild(cardLunchData);
    cardBodyDiv.appendChild(cardDinnerTitle);
    cardBodyDiv.appendChild(cardDinnerData);

    document.getElementById('mealplan_data_out').appendChild(colDiv);
}

/* Funktion zum Einblenden der Form */
function showNewMealForm() {
    // Hash Navigation auf Seite "Neuer Meal Plan"
    window.location.hash = '#new-meal';
}

/* New Mealplan Form*/
/* ------------------------------------------------------------ */
/* Vorgeschlagene Rezepte für den Input Frühstück */
function filterRecipeNewBreakfast(e) {
    if (e.target.value !== "") {

        fetch('api/recipedata/' + e.target.value)
            .then(res => res.json())
            .then(recipes => {

                if (recipes.length > 0) {
                    document.getElementById('input_breakfast_autocomplete').innerHTML = "";
                    recipes.map((recipe) => {
                        recipe.mealOptions = JSON.parse(recipe.mealOptions);
                        recipe.mealTime = JSON.parse(recipe.mealTime);

                        if (recipe.mealTime.breakfast === true) {
                            createAutocompleteElements_breakfast(recipe)
                        }
                    })
                }
                else {
                    document.getElementById('input_breakfast_autocomplete').innerHTML = '<p>Es wurde kein Rezept gefunden</p>';
                }

            })
            .catch(err => displayErrorMessage(err))

    } else {
        document.getElementById('input_breakfast_autocomplete').innerHTML = '';
    }

    function createAutocompleteElements_breakfast(recipe) {
        let mealOptionsString = " ";
        if (recipe.mealOptions.vegan === true) { mealOptionsString = mealOptionsString + "🌱🌱 " }
        if (recipe.mealOptions.vegetarian === true) { mealOptionsString = mealOptionsString + "🌱🥚 " }
        if (recipe.mealOptions.glutenFree === true) { mealOptionsString = mealOptionsString + "🌾🚫 " }
        if (recipe.mealOptions.lactoseFree === true) { mealOptionsString = mealOptionsString + "🥛🚫" }


        const li = document.createElement('li');
        li.classList.add('list-group-item');
        li.classList.add('list-group-item-action');
        li.innerText = recipe.name + mealOptionsString;

        li.addEventListener('click', (evt) => {
            document.getElementById('input_breakfast').value = recipe.name;
            //document.getElementById('input_breakfast_selectedRecipe').innerHTML = '<button>hello</button>'

            //https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes
            document.getElementById('input_breakfast').setAttribute("data-recipeid", recipe.id);

            document.getElementById('input_breakfast_autocomplete').innerHTML = '';
        })

        document.getElementById('input_breakfast_autocomplete').appendChild(li);
    }
}

/* Vorgeschlagene Rezepte für den Input Mittagessen */
function filterRecipeNewLunch(e) {
    if (e.target.value !== "") {

        fetch('api/recipedata/' + e.target.value)
            .then(res => res.json())
            .then(recipes => {

                if (recipes.length > 0) {
                    document.getElementById('input_lunch_autocomplete').innerHTML = "";
                    recipes.map((recipe) => {
                        recipe.mealOptions = JSON.parse(recipe.mealOptions);
                        recipe.mealTime = JSON.parse(recipe.mealTime);

                        if (recipe.mealTime.lunch === true) {
                            createAutocompleteElements_lunch(recipe)
                        }
                    })
                }
                else {
                    document.getElementById('input_lunch_autocomplete').innerHTML = '<p>Es wurde kein Rezept gefunden</p>';
                }

            })
            .catch(err => displayErrorMessage(err))

    } else {
        document.getElementById('input_lunch_autocomplete').innerHTML = '';
    }

    function createAutocompleteElements_lunch(recipe) {
        let mealOptionsString = " ";
        if (recipe.mealOptions.vegan === true) { mealOptionsString = mealOptionsString + "🌱🌱 " }
        if (recipe.mealOptions.vegetarian === true) { mealOptionsString = mealOptionsString + "🌱🥚 " }
        if (recipe.mealOptions.glutenFree === true) { mealOptionsString = mealOptionsString + "🌾🚫 " }
        if (recipe.mealOptions.lactoseFree === true) { mealOptionsString = mealOptionsString + "🥛🚫" }


        const li = document.createElement('li');
        li.classList.add('list-group-item');
        li.classList.add('list-group-item-action');
        li.innerText = recipe.name + mealOptionsString;

        li.addEventListener('click', (evt) => {
            document.getElementById('input_lunch').value = recipe.name;
            //document.getElementById('input_breakfast_selectedRecipe').innerHTML = '<button>hello</button>'

            //https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes
            document.getElementById('input_lunch').setAttribute("data-recipeid", recipe.id);

            document.getElementById('input_lunch_autocomplete').innerHTML = '';
        })

        document.getElementById('input_lunch_autocomplete').appendChild(li);
    }
}

/* Vorgeschlagene Rezepte für den Input Abendessen  */
function filterRecipeNewDinner(e) {
    if (e.target.value !== '') {

        fetch('api/recipedata/' + e.target.value)
            .then(res => res.json())
            .then(recipes => {

                if (recipes.length > 0) {
                    document.getElementById('input_dinner_autocomplete').innerHTML = "";
                    recipes.map((recipe) => {
                        recipe.mealOptions = JSON.parse(recipe.mealOptions);
                        recipe.mealTime = JSON.parse(recipe.mealTime);

                        if (recipe.mealTime.dinner === true) {
                            createAutocompleteElements_dinner(recipe)
                        }
                    })
                }
                else {
                    document.getElementById('input_dinner_autocomplete').innerHTML = '<p>Es wurde kein Rezept gefunden</p>';
                }

            })
            .catch(err => displayErrorMessage(err))

    } else {
        document.getElementById('input_dinner_autocomplete').innerHTML = ''
    }

    function createAutocompleteElements_dinner(recipe) {
        let mealOptionsString = " ";
        if (recipe.mealOptions.vegan === true) { mealOptionsString = mealOptionsString + "🌱🌱 " }
        if (recipe.mealOptions.vegetarian === true) { mealOptionsString = mealOptionsString + "🌱🥚 " }
        if (recipe.mealOptions.glutenFree === true) { mealOptionsString = mealOptionsString + "🌾🚫 " }
        if (recipe.mealOptions.lactoseFree === true) { mealOptionsString = mealOptionsString + "🥛🚫" }


        const li = document.createElement('li');
        li.classList.add('list-group-item');
        li.classList.add('list-group-item-action');
        li.innerText = recipe.name + mealOptionsString;

        li.addEventListener('click', (evt) => {
            document.getElementById('input_dinner').value = recipe.name;
            //document.getElementById('input_breakfast_selectedRecipe').innerHTML = '<button>hello</button>'

            //https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes
            document.getElementById('input_dinner').setAttribute("data-recipeid", recipe.id);

            document.getElementById('input_dinner_autocomplete').innerHTML = '';
        })

        document.getElementById('input_dinner_autocomplete').appendChild(li);
    }
}

/* Rezept Übersicht */
/* ------------------------------------------------------------ */
/*  */
function loadContent_recipedata() {
    fetch('api/recipedata')
        .then(res => res.json())
        .then(recipes => {
            document.getElementById('recipe_list_out').innerHTML = '';
            document.getElementById('recipe_data_out').innerHTML = '<p>Es wurde noch kein Rezept ausgewählt</p>';

            if (recipes.length > 0) {
                document.getElementById('recipe_list_out').innerHTML = "";
                recipes.map((recipe) => {
                    recipe.mealOptions = JSON.parse(recipe.mealOptions);
                    recipe.mealTime = JSON.parse(recipe.mealTime);

                    createContent_recipedata(recipe);
                })
            }
            else {
                document.getElementById('recipe_list_out').innerHTML = '<p>Es wurde kein Rezept gefunden</p>';
            }
        })
        .catch(err => displayErrorMessage(err))
}

/*  */
function filterContent_recipedata(e) {
    fetch('api/recipedata/' + e.target.value)
        .then(res => res.json())
        .then(recipes => {

            if (recipes.length > 0) {
                document.getElementById('recipe_list_out').innerHTML = "";
                recipes.map((recipe) => {
                    recipe.mealOptions = JSON.parse(recipe.mealOptions);
                    recipe.mealTime = JSON.parse(recipe.mealTime);

                    createContent_recipedata(recipe);
                })
            }
            else {
                document.getElementById('recipe_list_out').innerHTML = '<p>Es wurde kein Rezept gefunden</p>';
            }
        })
        .catch(err => displayErrorMessage(err))
}

/* TODO -> Edit Button? */
function createContent_recipedata(data) {
    const li = document.createElement('li');
    li.classList.add('list-group-item');
    li.classList.add('list-group-item-action');
    li.innerText = data.name;
    li.addEventListener('click', (evt) => {
        createContent_recipeDataDetail(data);

        // Lösche die CSS Klass 'active' für alle childNodes der Liste aller Rezepte
        const recipeListItems = document.getElementById('recipe_list_out').childNodes;
        for (let index = 0; index < recipeListItems.length; index++) {
            recipeListItems[index].classList.remove('active')
        }

        // Füge die CSS Klass 'active' dem angeklickten Listenelement hinzu 
        evt.target.classList.add('active')
    })

    document.getElementById('recipe_list_out').appendChild(li);

    function createContent_recipeDataDetail(recipe) {
        const cardDiv = document.createElement('div');
        cardDiv.classList.add('card');

        const cardTitle_recipe = document.createElement('div');
        cardTitle_recipe.classList.add('card-header');
        cardTitle_recipe.innerText = recipe.name;


        const list = document.createElement('ul');
        list.classList.add('list-group');
        list.classList.add('list-group-flush');

        /*  Ingredients */
        const listItem_ingredients = document.createElement('li');
        listItem_ingredients.classList.add('list-group-item');

        const listItemDiv_ingredients = document.createElement('div');

        const listItemTitle_ingredients = document.createElement('h5');
        listItemTitle_ingredients.innerText = 'Zutaten:';

        const listItemText_ingredients = document.createElement('p');
        listItemText_ingredients.innerText = recipe.ingredients;

        listItemDiv_ingredients.appendChild(listItemTitle_ingredients);
        listItemDiv_ingredients.appendChild(listItemText_ingredients);

        listItem_ingredients.appendChild(listItemDiv_ingredients);

        /*  Directions */
        const listItem_directions = document.createElement('li');
        listItem_directions.classList.add('list-group-item');

        const listItemDiv_directions = document.createElement('div');

        const listItemTitle_directions = document.createElement('h5');
        listItemTitle_directions.innerText = 'Zubereitung:';

        const listItemText_directions = document.createElement('p');
        listItemText_directions.innerText = recipe.directions;

        listItemDiv_directions.appendChild(listItemTitle_directions);
        listItemDiv_directions.appendChild(listItemText_directions);

        listItem_directions.appendChild(listItemDiv_directions);

        /*  Nutritions */
        const listItem_nutritions = document.createElement('li');
        listItem_nutritions.classList.add('list-group-item');

        const listItemDiv_nutritions = document.createElement('div');

        const listItemTitle_nutritions = document.createElement('h5');
        listItemTitle_nutritions.innerText = 'Nährstoffe:';

        const listItemText_nutritions = document.createElement('p');
        listItemText_nutritions.innerText = recipe.nutritions;

        listItemDiv_nutritions.appendChild(listItemTitle_nutritions);
        listItemDiv_nutritions.appendChild(listItemText_nutritions);

        listItem_nutritions.appendChild(listItemDiv_nutritions);

        /* Options */
        const listItem_options = document.createElement('li');
        listItem_options.classList.add('list-group-item');

        const listItemDiv_options = document.createElement('div');
        listItemDiv_options.classList.add('float-right'); // Bootstrap Klasse


        const listItem_deleteButton = document.createElement('button');
        listItem_deleteButton.classList.add('mx-1'); // Bootstrap Klasse: "set the margin or padding to $spacer * .25"
        listItem_deleteButton.classList.add('btn');
        listItem_deleteButton.classList.add('btn-outline-danger');
        listItem_deleteButton.addEventListener('click', () => {
            fetch('api/recipedata/' + recipe.id, {
                method: 'DELETE'
            })
                .then(res => {
                    // Ansicht neu aufbauen
                    loadContent_recipedata();
                })
                .catch(err => displayErrorMessage(err))
        })
        listItem_deleteButton.innerText = "Delete";

        /*         const listItem_editButton = document.createElement('button');
                listItem_editButton.classList.add('mx-1');
                listItem_editButton.classList.add('btn');
                listItem_editButton.classList.add('btn-outline-secondary');
                listItem_editButton.addEventListener('click', () => {
                    alert('' + recipe.id)
                })
                listItem_editButton.innerText = "Edit"; 
        
                listItemDiv_options.appendChild(listItem_editButton);*/
        listItemDiv_options.appendChild(listItem_deleteButton);

        listItem_options.appendChild(listItemDiv_options)


        /* End */
        list.appendChild(listItem_ingredients);
        list.appendChild(listItem_directions);
        list.appendChild(listItem_nutritions);
        list.appendChild(listItem_options);

        cardDiv.appendChild(cardTitle_recipe);
        cardDiv.appendChild(list);

        const recipeDataDiv = document.getElementById('recipe_data_out');
        recipeDataDiv.innerHTML = '';
        recipeDataDiv.appendChild(cardDiv);
    }
}

/* Zusatzfunktionen */
/* ------------------------------------------------------------ */
/* Funktion zum Erstellen und Einblenden einer Fehlermeldung */
function displayErrorMessage(errorMessage) {
    console.log(errorMessage)
    const err_out = document.getElementById('error_out');
    const div = document.createElement('div');
    div.classList.add('alert');
    div.classList.add('alert-danger');
    div.setAttribute('role', 'alert');
    div.innerText = errorMessage;
    err_out.appendChild(div);

    setTimeout(() => err_out.removeChild(div), 5000)
}

/*  TODO -> recipeId einbinden */
/* Funktion zum Absenden des Formulars */
function submitNewMealForm(evt) {
    evt.preventDefault();

    // Senden des Einträge an das Backend
    const dateValue = document.getElementById('input_date').value;
    const breakfastValue = document.getElementById('input_breakfast').value;
    const lunchValue = document.getElementById('input_lunch').value;
    const dinnerValue = document.getElementById('input_dinner').value;

    fetch('api/mealdata', {
        method: 'POST',
        body: JSON.stringify({
            "date": dateValue,
            "breakfast": {
                "recipeId": "",
                "name": breakfastValue
            },
            "lunch": {
                "recipeId": "",
                "name": lunchValue

            },
            "dinner": {
                "recipeId": "",
                "name": dinnerValue
            }
        }),
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(res => {
            if (res.status === 200) {
                // Zurücksetzen der Eingabefelder
                document.getElementById('input_date').value = '';
                document.getElementById('input_breakfast').value = '';
                document.getElementById('input_lunch').value = '';
                document.getElementById('input_dinner').value = '';

                // Hash Navigation auf Seite "Meal Plan"
                window.location.hash = '#mealplan';
            }
            else {
                res.text()
                    .then(responseText => displayErrorMessage('Response: [' + res.status + '] ' + res.statusText + ' - ' + responseText))
            }
        })
        .catch(err => displayErrorMessage(err))
}

/* Funktion zum Einblenden der Form NewRecipe*/
function showNewRecipeForm() {
    // Hash Navigation nach "#new-recipe"
    window.location.hash = '#new-recipe';
}

/* Funktion zum Absenden des Formulars */
function submitNewRecipeForm(evt) {
    evt.preventDefault();

    // Senden des Einträge an das Backend
    const titleValue = document.getElementById('input_recipe_title').value;
    const ingredientsValue = document.getElementById('input_recipe_ingredients').value;
    const directionsValue = document.getElementById('input_recipe_directions').value;
    const nutritionsValue = document.getElementById('input_recipe_nutritions').value;

    const breakfastBool = document.getElementById('input_check_breakfast').checked;
    const lunchBool = document.getElementById('input_check_lunch').checked;
    const dinnerBool = document.getElementById('input_check_dinner').checked;

    const veganBool = document.getElementById('input_check_vegan').checked;
    const vegetarianBool = document.getElementById('input_check_vegetarian').checked;
    const glutenFreeBool = document.getElementById('input_check_glutenFree').checked;
    const lactoseFreeBool = document.getElementById('input_check_lactoseFree').checked;

    fetch('api/recipedata', {
        method: 'POST',
        body: JSON.stringify({
            "name": titleValue,
            "ingredients": ingredientsValue,
            "directions": directionsValue,
            "nutritions": nutritionsValue,
            "mealTime": {
                "breakfast": breakfastBool,
                "lunch": lunchBool,
                "dinner": dinnerBool
            },
            "mealOptions": {
                "vegan": veganBool,
                "vegetarian": vegetarianBool,
                "glutenFree": glutenFreeBool,
                "lactoseFree": lactoseFreeBool,
            }
        }),
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(res => {
            if (res.status === 200) {
                // Zurücksetzen der Eingabefelder
                document.getElementById('input_recipe_title').value = '';
                document.getElementById('input_recipe_ingredients').value = '';
                document.getElementById('input_recipe_directions').value = '';
                document.getElementById('input_recipe_nutritions').value = '';
                document.getElementById('input_check_breakfast').checked = false;
                document.getElementById('input_check_lunch').checked = false;
                document.getElementById('input_check_dinner').checked = false;
                document.getElementById('input_check_vegan').checked = false;
                document.getElementById('input_check_vegetarian').checked = false;
                document.getElementById('input_check_glutenFree').checked = false;
                document.getElementById('input_check_lactoseFree').checked = false;

                // Hash Navigation auf Seite "Recipes"
                window.location.hash = '#recipes';
            } else {
                res.text()
                    .then(responseText => displayErrorMessage('Response: [' + res.status + '] ' + res.statusText + ' - ' + responseText))
            }
        })
        .catch(err => displayErrorMessage(err))
}