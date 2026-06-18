// Central State Store with LocalStorage Persistence
const STORAGE_KEY = 'antigravity_fitness_mvp_state';

const DEFAULT_STATE = {
  user: null, // { name, age, gender, height, weight, goal, targetPhysique, activityLevel, workoutEnvironment }
  measurements: [], // Array of { weight, waist, chest, hips, arms, legs, bodyFat, createdAt }
  equipments: [], // Array of strings: e.g. ['dumbbell', 'band', 'bench']
  workoutPlan: null, // { planType, goal, difficulty, days: { Monday: [], ... } }
  activeWorkout: null, // { dayName, completedExercises: [], startTime, totalDuration: 0 }
  nutrition: {
    caloriesTarget: 0,
    proteinTarget: 0,
    carbsTarget: 0,
    fatsTarget: 0,
    caloriesIntake: 0,
    proteinIntake: 0,
    carbsIntake: 0,
    fatsIntake: 0,
    waterIntake: 0,
    waterTarget: 2500,
    completedMeals: [],
    extraFoodsLog: []
  },
  supplements: [], // Array of { id, name, dosage, timing, note }
  onboardingComplete: false
};

class Store {
  constructor() {
    this.state = this.loadState();
    this.listeners = [];
  }

  loadState() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        // Deep merge with default state to prevent missing properties if schema updates
        const parsed = JSON.parse(data);
        if (parsed.nutrition) {
          parsed.nutrition = { ...DEFAULT_STATE.nutrition, ...parsed.nutrition };
        }
        return { ...DEFAULT_STATE, ...parsed };
      }
    } catch (e) {
      console.error('Error loading state from localStorage:', e);
    }
    return JSON.parse(JSON.stringify(DEFAULT_STATE));
  }

  saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      this.notify();
    } catch (e) {
      console.error('Error saving state to localStorage:', e);
    }
  }

  getState() {
    return this.state;
  }

  updateState(updater) {
    if (typeof updater === 'function') {
      this.state = updater(this.state);
    } else {
      this.state = { ...this.state, ...updater };
    }
    this.saveState();
  }

  resetState() {
    this.state = JSON.parse(JSON.stringify(DEFAULT_STATE));
    this.saveState();
  }

  // Pub-Sub Mechanism for Reactive UI
  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(listener => {
      try {
        listener(this.state);
      } catch (e) {
        console.error('Listener notification error:', e);
      }
    });
  }

  // Helper selectors/mutators
  setUser(userData) {
    this.updateState(state => {
      state.user = userData;
      return state;
    });
  }

  setEquipments(equipments) {
    this.updateState(state => {
      state.equipments = equipments;
      return state;
    });
  }

  setWorkoutPlan(plan) {
    this.updateState(state => {
      state.workoutPlan = plan;
      return state;
    });
  }

  addMeasurement(measurement) {
    this.updateState(state => {
      const newMeasurement = {
        ...measurement,
        createdAt: new Date().toISOString()
      };
      state.measurements.push(newMeasurement);
      // Keep measurements sorted by date
      state.measurements.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      return state;
    });
  }

  updateWater(amount) {
    this.updateState(state => {
      if (!state.nutrition) {
        state.nutrition = { ...DEFAULT_STATE.nutrition };
      }
      state.nutrition.waterIntake = Math.max(0, state.nutrition.waterIntake + amount);
      return state;
    });
  }

  setNutritionTargets(calories, protein, carbs, fats) {
    this.updateState(state => {
      state.nutrition = {
        ...state.nutrition,
        caloriesTarget: calories,
        proteinTarget: protein,
        carbsTarget: carbs,
        fatsTarget: fats
      };
      return state;
    });
  }

  addSupplement(supp) {
    this.updateState(state => {
      const newSupp = {
        id: Date.now().toString(),
        ...supp
      };
      state.supplements.push(newSupp);
      return state;
    });
  }

  deleteSupplement(id) {
    this.updateState(state => {
      state.supplements = state.supplements.filter(s => s.id !== id);
      return state;
    });
  }

  startWorkout(dayName) {
    this.updateState(state => {
      state.activeWorkout = {
        dayName: dayName,
        completedExercises: [],
        startTime: new Date().toISOString(),
        totalDuration: 0
      };
      return state;
    });
  }

  toggleExerciseComplete(exerciseId) {
    this.updateState(state => {
      if (!state.activeWorkout) return state;
      const idx = state.activeWorkout.completedExercises.indexOf(exerciseId);
      if (idx > -1) {
        state.activeWorkout.completedExercises.splice(idx, 1);
      } else {
        state.activeWorkout.completedExercises.push(exerciseId);
      }
      return state;
    });
  }

  finishWorkout(duration, calorieBurn, successRate) {
    this.updateState(state => {
      // Save progress to user history if desired. For now, reset active workout
      state.activeWorkout = null;
      return state;
    });
  }

  cancelWorkout() {
    this.updateState(state => {
      state.activeWorkout = null;
      return state;
    });
  }

  completeOnboarding() {
    this.updateState(state => {
      state.onboardingComplete = true;
      return state;
    });
  }

  toggleMealComplete(mealKey) {
    this.updateState(state => {
      if (!state.nutrition) {
        state.nutrition = { ...DEFAULT_STATE.nutrition };
      }
      if (!state.nutrition.completedMeals) {
        state.nutrition.completedMeals = [];
      }
      
      const idx = state.nutrition.completedMeals.indexOf(mealKey);
      
      // Meal coefficients: breakfast: 30%, lunch: 35%, dinner: 25%, snack: 10%
      const coefficients = {
        breakfast: 0.30,
        lunch: 0.35,
        dinner: 0.25,
        snack: 0.10
      };
      const coeff = coefficients[mealKey] || 0.25;

      const caloriesDiff = Math.round(state.nutrition.caloriesTarget * coeff);
      const proteinDiff = Math.round(state.nutrition.proteinTarget * coeff);
      const carbsDiff = Math.round(state.nutrition.carbsTarget * coeff);
      const fatsDiff = Math.round(state.nutrition.fatsTarget * coeff);

      if (idx > -1) {
        // Uncheck meal
        state.nutrition.completedMeals.splice(idx, 1);
        state.nutrition.caloriesIntake = Math.max(0, (state.nutrition.caloriesIntake || 0) - caloriesDiff);
        state.nutrition.proteinIntake = Math.max(0, (state.nutrition.proteinIntake || 0) - proteinDiff);
        state.nutrition.carbsIntake = Math.max(0, (state.nutrition.carbsIntake || 0) - carbsDiff);
        state.nutrition.fatsIntake = Math.max(0, (state.nutrition.fatsIntake || 0) - fatsDiff);
      } else {
        // Check meal
        state.nutrition.completedMeals.push(mealKey);
        state.nutrition.caloriesIntake = (state.nutrition.caloriesIntake || 0) + caloriesDiff;
        state.nutrition.proteinIntake = (state.nutrition.proteinIntake || 0) + proteinDiff;
        state.nutrition.carbsIntake = (state.nutrition.carbsIntake || 0) + carbsDiff;
        state.nutrition.fatsIntake = (state.nutrition.fatsIntake || 0) + fatsDiff;
      }
      return state;
    });
  }

  addExtraFood(food) {
    this.updateState(state => {
      if (!state.nutrition) {
        state.nutrition = { ...DEFAULT_STATE.nutrition };
      }
      if (!state.nutrition.extraFoodsLog) {
        state.nutrition.extraFoodsLog = [];
      }
      
      const newFood = {
        id: Date.now().toString(),
        ...food
      };
      
      state.nutrition.extraFoodsLog.push(newFood);
      
      // Update intakes
      state.nutrition.caloriesIntake = (state.nutrition.caloriesIntake || 0) + food.calories;
      state.nutrition.proteinIntake = (state.nutrition.proteinIntake || 0) + food.protein;
      state.nutrition.carbsIntake = (state.nutrition.carbsIntake || 0) + food.carbs;
      state.nutrition.fatsIntake = (state.nutrition.fatsIntake || 0) + food.fats;
      
      return state;
    });
  }

  deleteExtraFood(foodId) {
    this.updateState(state => {
      if (!state.nutrition || !state.nutrition.extraFoodsLog) return state;
      
      const foodIndex = state.nutrition.extraFoodsLog.findIndex(f => f.id === foodId);
      if (foodIndex > -1) {
        const food = state.nutrition.extraFoodsLog[foodIndex];
        
        // Subtract from intakes
        state.nutrition.caloriesIntake = Math.max(0, (state.nutrition.caloriesIntake || 0) - food.calories);
        state.nutrition.proteinIntake = Math.max(0, (state.nutrition.proteinIntake || 0) - food.protein);
        state.nutrition.carbsIntake = Math.max(0, (state.nutrition.carbsIntake || 0) - food.carbs);
        state.nutrition.fatsIntake = Math.max(0, (state.nutrition.fatsIntake || 0) - food.fats);
        
        state.nutrition.extraFoodsLog.splice(foodIndex, 1);
      }
      return state;
    });
  }
}

export const store = new Store();
