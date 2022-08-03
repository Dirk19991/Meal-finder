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

    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${input}`)
      .then((res) => res.json())
      .then((data) => {
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
             <div class='meal-info' data-mealID='${meal.idMeal}'>
              <h3>${meal.strMeal}</h3>
             </div>
            </div>
            
            `
            )
            .join('');
        }
        searchInput.value = '';
      });
  }
}

function getMealByID(mealID) {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
    .then((res) => res.json())
    .then((data) => {
      const meal = data.meals[0];
      addMealToDOM(meal);
    });
}

function addMealToDOM(meal) {
  const ingredients = [];

  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(
        `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]} `
      );
    } else {
      break;
    }
  }

  mealElement.innerHTML = `
  <div class='single-meal'>
   <h1>${meal.strMeal}</h1>
   <img src='${meal.strMealThumb}' alt='${meal.strMeal}' />
   <div class='single-meal-info'>
    ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ''}
    ${meal.strArea ? `<p>${meal.strArea}</p>` : ''}
   </div>

   <div class='main'>
    <p>${meal.strInstructions}</p>
    <h2>Ingredients</h2>
    <ul>
      ${ingredients.map((ing) => `<li>${ing}</ing>`).join('')}
    </ul>
   </div> 

  </div> 
  `;
}

function randomMeal() {
  mealElements.innerHTML = '';
  result.innerHTML = '';

  fetch('https://www.themealdb.com/api/json/v1/1/random.php')
    .then((res) => res.json())
    .then((data) => {
      const meal = data.meals[0];
      addMealToDOM(meal);
    });
}

submitForm.addEventListener('submit', findFood);

randomButton.addEventListener('click', randomMeal);

mealElements.addEventListener('click', (e) => {
  const mealInfo = e.path.find((item) => {
    if (item.classList) {
      return item.classList.contains('meal-info');
    } else {
      return false;
    }
  });

  if (mealInfo) {
    const mealID = mealInfo.getAttribute('data-mealid');

    getMealByID(mealID);
  }
});
