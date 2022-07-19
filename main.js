const searchInput = document.querySelector('#search');
const submitForm = document.querySelector('#submit');
const randomButton = document.querySelector('#random');
const mealElements = document.querySelector('.meals');
const result = document.querySelector('.result');
const mealElement = document.querySelector('.single-meal');
const wrapper = document.querySelector('.search-form-wrapper');

function findFood(e) {
  e.preventDefault();
  mealElement.innerHTML = '';

  const input = searchInput.value;

  if (!input.trim()) {
    if (document.querySelector('.error')) {
      let error = document.querySelector('.error');
      error.remove();
    }
    wrapper.insertAdjacentHTML(
      'afterend',
      `
    <span class='error'>Поле ввода не может быть пустым</span>
    `
    );
  } else {
    if (document.querySelector('.error')) {
      let error = document.querySelector('.error');
      error.remove();
    }
    console.log(input);
    fetch(`https://api.dictionaryapi.dev/api/v2/entries/ru/хлеб`)
      .then((res) => res.json())
      .then((data) => console.log(data));
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${input}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        result.innerHTML = `<h2>Search results for '${input}':</h2>`;

        if (data.meals === null) {
          result.innerHTML = `<p>Ничего не найдено :(</p>`;
        } else {
          mealElements.innerHTML = data.meals
            .map(
              (meal) =>
                `
            <div class='meal'>
             <img src='${meal.strMealThumb}' alt='${meal.strMeal}' />
             <div class='meal-info' data-mealID='${meal.idMeal}'></div>
            </div>
            <h3>${meal.strMeal}</h3> 
            `
            )
            .join('');
        }
      });
  }
}

submitForm.addEventListener('submit', findFood);
