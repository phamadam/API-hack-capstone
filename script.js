'use strict';

const apiKey = "f38898caa70c4d1a9a9b14589fd8e362"
const searchURL = "https://api.spoonacular.com/recipes/complexSearch"

//translates user search into url
function formatQueryParams(params) {
    const queryItems = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}
//displays the first set list of recipes
function displayResults(responseJson) {
    let endResult = [];
    var i = 0;
    for (i = 0; i < responseJson.results.length; i++) {
        endResult.push(
        `<div class="group whiteText centered">
            <div class="item">
                <h3><a class="recipeLink" data-id="${responseJson.results[i].id}">${responseJson.results[i].title}</a></h3>
            </div>
            <div class="item">
                <img class="recipeLink" data-id="${responseJson.results[i].id}" src="${responseJson.results[i].image}" width="300">
            </div>
        </div>`)
        $('.results-list').html(endResult);
        $('.results-list').removeClass('hidden');
    }
}

//displays the recipe's information gathered from the data of the click
function displayRecipeInfo(responseJson) {
    //used to loop through the ingredients
    function loopIngredients() {
        let ingredientList = [];
        var i = 0;
        for (i = 0; i < responseJson.extendedIngredients.length; i++) {
            ingredientList.push(`<li>${responseJson.extendedIngredients[i].name} (${responseJson.extendedIngredients[i].amount} ${responseJson.extendedIngredients[i].unit})</li>`)
        }
        return ingredientList.join("");
    }
    //${loopIngredients()} calls the function that loops through the ingredients
    let endResult = [
        `<div class="item whiteText">
            <h2>${responseJson.title}<h2>
        </div>
        <div class="group whiteText">
            <div class="item">
                <h3>Directions</h3>
                <p>${responseJson.instructions}</p>
            </div>
            <div class="item">
                <h3>Cook Time</h3>
                <p>${responseJson.readyInMinutes} Minutes</p>
                <hr>
                <h3>Serving size ${responseJson.servings}</h3>
                <hr>
                <h3>Ingredients</h3>
                <ul>${loopIngredients()}</ul>
            </div>
        </div>`]
        $('.results-list').html(endResult);
        $('.results-list').removeClass('hidden');
}

//collects the data from the click and preforms another fetch request for the recipe information
function getInfo() {
    $('.results-list').on('click', '.recipeLink', function(event) {
        event.preventDefault();
        var id = $(event.currentTarget).data('id')

        const options = {
            headers: new Headers({
                "Content-Type": "application/json"})
          };
        
        fetch(`https://api.spoonacular.com/recipes/${id}/information?includeNutrition=false&apiKey=${apiKey}`, options)
            .then(response => response.json())
            .then(responseJson => displayRecipeInfo(responseJson))
            .catch(error => {
                $('#js-error-message').text(`Something went wrong try again later.`)
            });
    })
}

//proforms the original fetch request for the list of recipes
function getRecipe(query) {
    const params = {
        query: query,
    };
    const queryString = formatQueryParams(params)
    const url = searchURL + '?' + queryString + '&apiKey=' + apiKey;

    const options = {
        headers: new Headers({
            "Content-Type": "application/json"})
      };

    fetch(url, options)
        .then(response => response.json())
        .then(responseJson => displayResults(responseJson))
        .catch(error => {
            $('#js-error-message').text(`Something went wrong try again later.`)
        });
}

function watchForm() {
    $('form').submit(event => {
        event.preventDefault();
        const searchRecipe = $('#js-recipe-search').val();
        getRecipe(searchRecipe);
    });
}

function main() {
    watchForm()
    getInfo()
}

$(main);