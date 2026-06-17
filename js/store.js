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
    waterIntake: 0,
    waterTarget: 2500
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
}

export const store = new Store();
