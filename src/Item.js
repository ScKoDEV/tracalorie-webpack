class Meal {
    constructor(name, calories){
        this.id = Math.random().toString(16).slice(2); //this is not optimal solution for id as there still could be duplicates, usually db deals with id creation but we are front end only, better solution would be crypto api - crypto.randomUUID(), only works on localhost and https, another one could be datetimestamp
        this.name = name;
        this.calories = calories;
    }
    }
    
    class Workout {
    constructor(name, calories){
        this.id = Math.random().toString(16).slice(2); 
        this.name = name;
        this.calories = calories;
    }
    }

    export {
        Meal,
        Workout
    };