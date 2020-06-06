/*-----selecting elements--------*/
const search = document.getElementById('search');
const submitBtn = document.getElementById('submit');
const randomBtn = document.getElementById('random-btn');
const meals = document.getElementById('meals');
const singleMeal = document.getElementById('single-meal');
const resultHeading = document.getElementById('result-heading');
const searchAlert = document.getElementById('alert');
const searchBtn = document.querySelector('.search-btn');



//---------search meal and fetch from api---------//
function searchMeal(e){
   e.preventDefault();

   singleMeal.innerHTML = '';  //clear single meal
   const searchTerm = search.value; //get search term

   //check for empty search
   if(searchTerm.trim()){
      fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`)
       .then(res => res.json())
        .then(data => {
           console.log(data);
           resultHeading.innerHTML = `<h3>Search results for '${searchTerm}':</h3>`;
           if(data.meals === null){
              resultHeading.innerHTML = `<h3>There are no results for '${searchTerm}', try again!</h3>`; 
              meals.innerHTML ='';
           }
           else{
              meals.innerHTML = data.meals.map(meal =>
              `<div class="results-grid-item">
                  <img src="${meal.strMealThumb}"  alt="${meal.strMeal}" />
               <div class="meal-info" data-mealID = "${meal.idMeal}">
               <h3>${meal.strMeal}</h3>
               </div> 
              </div>`
                 )
               .join('');
            }
         });   
         search.value = '';   // clear search bar
   }
   else{
      searchAlert.style.display='block';

      setTimeout(() =>{
         searchAlert.style.display='none';
      },1000);
   }
}

//----to show the single meal ------//
function addMealtoDOM(meal){
   resultHeading.innerHTML = '';
   meals.innerHTML = '';
  const ingredients = [];

  for(let i = 0 ; i <= 20 ;i++){
     if(meal[`strIngredient${i}`]){
        ingredients.push(`${meal[`strIngredient${i}`]} : ${meal[`strMeasure${i}`]}`);
     }
     else{
        continue;
     }
  }

  singleMeal.innerHTML = `
                         <div class="single-meal">
                             <h2>${meal.strMeal}</h2>
                             <img src=${meal.strMealThumb} alt=${meal.strMeal} />
                             <div class="single-meal-info">
                             ${meal.strCategory ? `<p>Meal Type: ${meal.strCategory}</p>` : ''}
                             ${meal.strArea ? `<p>Area: ${meal.strArea}</p>` : ''}
                             </div>
                             <div class="main">
                             <p>${meal.strInstructions}</p>
                             <h3>Ingredients</h3>
                             <ul>
                             ${ingredients.map(ing =>`<li>${ing}</li>`).join('')}
                             </ul>
                             </div>
                           </div>
                           
  `;
}

//----to show the random meal----//
function getRandomMeal(){
    //clear meal and heading
    meals.innerHTML = '';
    resultHeading.innerHTML = '';

    fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
     .then(res => res.json())
       .then(data => {
             const meal = data.meals[0];

             addMealtoDOM(meal);
       });
   }

//----to fetch meal by its id-----//
function getMealByID(mealid){
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealid}`)
      .then(res => res.json())
        .then(data => {
           const theMeal = data.meals[0];
            addMealtoDOM(theMeal);
        });
}

/*---------Event Listeners--------*/
submitBtn.addEventListener('submit',searchMeal);
searchBtn.addEventListener('click',searchMeal);
randomBtn.addEventListener('click',getRandomMeal);
meals.addEventListener('click',e =>{
      const mealInfo = e.path.find(item =>{
        if(item.classList){
           return item.classList.contains('meal-info');
        }
        else{
           return false;
        }
      });
      if(mealInfo){
         const mealID = mealInfo.getAttribute('data-mealid');
         getMealByID(mealID);
      }
});

window.addEventListener('load',() =>{
   fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=Chocolate`)
    .then(response => response.json())
      .then(data =>{
         resultHeading.innerHTML =`<h3>Search results for 'Chocolate':</h3>`;
         meals.innerHTML = data.meals.map(meal =>
            `<div class="results-grid-item">
                <img src="${meal.strMealThumb}"  alt="${meal.strMeal}" />
             <div class="meal-info" data-mealID = "${meal.idMeal}">
             <h3>${meal.strMeal}</h3>
             </div> 
            </div>`
               )
             .join('');
      });
});