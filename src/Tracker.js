import Storage from './Storage';

class CalorieTracker {

    // With private properties we do not need a constructor anymore but if we would like to trigger some private methods we have to use this.
    constructor(){
        this.#displayCaloriesTotal();
        this.#displayCaloriesLimit(); 
        this.#displayCaloriesConsumed();
        this.#displayCaloriesBurned();
        this.#displayCaloriesRemaining();
        this.#displayCaloriesProgress();

        document.getElementById('limit').value = this.#calorieLimit;
    }

    #calorieLimit = Storage.getCalorieLimit(); 
    #totalCalories = Storage.getTotalCalories(0);
    #meals = Storage.getMeals();
    #workouts = Storage.getWorkouts();;

    // Public Methods/API //

    addMeal(meal) {
        this.#meals.push(meal);
        this.#totalCalories += meal.calories;
        Storage.updateTotalCalories(this.#totalCalories);
        Storage.saveMeal(meal);
        this.#displayNewMeal(meal);
        this.#render();
    }

    removeMeal(id){
        const index = this.#meals.findIndex((meal) => meal.id === id);

        if (index !== -1){
            const meal = this.#meals[index];
            this.#totalCalories -= meal.calories;
            Storage.updateTotalCalories(this.#totalCalories);
            this.#meals.splice(index,1);
            Storage.removeMeal(id);
            this.#render();
        }
    }

    addWorkout(workout) {
        this.#workouts.push(workout);
        this.#totalCalories -= workout.calories;
        Storage.updateTotalCalories(this.#totalCalories);
        Storage.saveWorkout(workout);
        this.#displayNewWorkout(workout);
        this.#render();
    }

    removeWorkout(id){
        const index = this.#workouts.findIndex((workout) => workout.id === id);

        if (index !== -1){
            const workout = this.#workouts[index];
            this.#totalCalories += workout.calories;
            Storage.updateTotalCalories(this.#totalCalories);
            this.#workouts.splice(index,1);
            Storage.removeWorkout(id);
            this.#render();
        }
    }

    reset(){
        this.#totalCalories = 0;
        this.#meals = [];
        this.#workouts = [];
        Storage.clearAll();
        this.#render();
    }

    setLimit(calorieLimit){
        this.#calorieLimit = calorieLimit;
        Storage.setCalorieLimit(calorieLimit);
        this.#displayCaloriesLimit();
        this.#render();
    }

    loadItems(){
        this.#meals.forEach(meal => this.#displayNewMeal(meal));
        this.#workouts.forEach(workout => this.#displayNewWorkout(workout));
    }
    
    // Private Methods //

    #displayCaloriesTotal(){
        const totalCaloriesEl = document.getElementById('calories-total');
        totalCaloriesEl.innerHTML = this.#totalCalories;
    }

    #displayCaloriesLimit(){
        const calorieLimitEl = document.getElementById('calories-limit');
        calorieLimitEl.innerHTML = this.#calorieLimit;
    }

    #displayCaloriesConsumed(){
        const caloriesConsumedEl = document.getElementById('calories-consumed');

        const consumed = this.#meals.reduce((total, meal) => total + meal.calories, 0);

        caloriesConsumedEl.innerHTML = consumed;
    }

    #displayCaloriesBurned(){
        const caloriesBurnedEl = document.getElementById('calories-burned');

        const burned = this.#workouts.reduce((total, workout) => total + workout.calories, 0);

        caloriesBurnedEl.innerHTML = burned;
    }

    #displayCaloriesRemaining(){
        const caloriesRemainingEl = document.getElementById('calories-remaining');
        const progressEl = document.getElementById('calorie-progress');

        const remaining = this.#calorieLimit - this.#totalCalories;

        caloriesRemainingEl.innerHTML = remaining
        
        if (remaining <= 0) {
            caloriesRemainingEl.parentElement.parentElement.classList.remove('bg-light');
            caloriesRemainingEl.parentElement.parentElement.classList.add('bg-danger');
            progressEl.classList.remove('bg-success');
            progressEl.classList.add('bg-danger');
        } else {
            caloriesRemainingEl.parentElement.parentElement.classList.add('bg-light');
            caloriesRemainingEl.parentElement.parentElement.classList.remove('bg-danger');
            progressEl.classList.add('bg-success');
            progressEl.classList.remove('bg-danger');
        }
    }

    #displayCaloriesProgress(){
        const progressEl = document.getElementById('calorie-progress');
        const percentage = (this.#totalCalories / this.#calorieLimit)*100;
        const width = Math.min(percentage,100);
        progressEl.style.width = `${width}%`;
    }

    #displayNewMeal(meal){
        const mealsEl = document.getElementById('meal-items');
        const mealEl = document.createElement('div');
        mealEl.classList.add('card', 'my-2');
        mealEl.setAttribute('data-id', meal.id);
        mealEl.innerHTML = `
        <div class="card-body">
          <div class="d-flex align-items-center justify-content-between">
            <h4 class="mx-1">${meal.name}</h4>
            <div
              class="fs-1 bg-primary text-white text-center rounded-2 px-2 px-sm-5"
            >
              ${meal.calories}
            </div>
            <button class="delete btn btn-danger btn-sm mx-2">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
        </div> 
        `;

        mealsEl.appendChild(mealEl);
    }

    #displayNewWorkout(workout){
        const workoutsEl = document.getElementById('workout-items');
        const workoutEl = document.createElement('div');
        workoutEl.classList.add('card', 'my-2');
        workoutEl.setAttribute('data-id', workout.id);
        workoutEl.innerHTML = `
        <div class="card-body">
            <div class="d-flex align-items-center justify-content-between">
                <h4 class="mx-1">${workout.name}</h4>
                    <div
                        class="fs-1 bg-secondary text-white text-center rounded-2 px-2 px-sm-5"
                    >
                    ${workout.calories}
                    </div>
                    <button class="delete btn btn-danger btn-sm mx-2">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
            </div>
        </div>
        `;

        workoutsEl.appendChild(workoutEl);
    }

    // We have to do the rendering everytime we change the dom so we call this method //
    #render(){
        this.#displayCaloriesProgress();
        this.#displayCaloriesTotal();
        this.#displayCaloriesConsumed();
        this.#displayCaloriesBurned();
        this.#displayCaloriesRemaining();
    }

}

export default CalorieTracker;