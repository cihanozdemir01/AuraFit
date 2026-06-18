import { store } from '../store.js';

// Exercise Library
export const EXERCISES = [
  // Bodyweight (No Equipment)
  { id: 'ex_pushup', name: 'Şınav (Push-up)', description: 'Göğüs, omuz ve arka kol kaslarını çalıştıran temel vücut ağırlığı hareketi.', videoUrl: '', equipments: [] },
  { id: 'ex_squat', name: 'Squat', description: 'Ön bacak, arka bacak ve kalça kaslarını hedefleyen temel alt vücut egzersizi.', videoUrl: '', equipments: [] },
  { id: 'ex_plank', name: 'Plank', description: 'Karın ve core bölgesini güçlendiren izometrik duruş egzersizi.', videoUrl: '', equipments: [] },
  { id: 'ex_lunges', name: 'Lunge (Lunges)', description: 'Tek bacak dengesini geliştiren ve kalçaları şekillendiren egzersiz.', videoUrl: '', equipments: [] },
  { id: 'ex_mountain_climber', name: 'Mountain Climber', description: 'Core bölgesini çalıştıran ve nabzı yükselten kardiyovasküler hareket.', videoUrl: '', equipments: [] },
  { id: 'ex_burpee', name: 'Burpee', description: 'Tüm vücudu çalıştıran, yağ yakımını maksimize eden yüksek yoğunluklu hareket.', videoUrl: '', equipments: [] },
  { id: 'ex_leg_raise', name: 'Leg Raise', description: 'Alt karın kaslarını hedefleyen yer egzersizi.', videoUrl: '', equipments: [] },
  { id: 'ex_dips', name: 'Dips (Sandalye Kenarında)', description: 'Arka kol ve göğüs altı kaslarını çalıştıran kol bükme egzersizi.', videoUrl: '', equipments: [] },
  { id: 'ex_wall_sit', name: 'Wall Sit', description: 'Duvara yaslanarak yapılan, bacak dayanıklılığını artıran izometrik hareket.', videoUrl: '', equipments: [] },

  // Dumbbell
  { id: 'ex_db_press', name: 'Dumbbell Shoulder Press', description: 'Dumbbell\'lar ile omuz kaslarını baş üstüne iterek güçlendirme.', videoUrl: '', equipments: ['dumbbell'] },
  { id: 'ex_db_chest_press', name: 'Dumbbell Floor Press', description: 'Yerde sırt üstü yatarak dumbbell göğüs presi yapma egzersizi.', videoUrl: '', equipments: ['dumbbell', 'mat'] },
  { id: 'ex_db_curl', name: 'Dumbbell Bicep Curl', description: 'Dumbbell\'lar ile ön kol (pazı) bükme hareketi.', videoUrl: '', equipments: ['dumbbell'] },
  { id: 'ex_db_row', name: 'Dumbbell Row', description: 'Sırt kaslarını ve kanatları geliştiren dumbbell çekiş egzersizi.', videoUrl: '', equipments: ['dumbbell'] },
  { id: 'ex_db_goblet', name: 'Dumbbell Goblet Squat', description: 'Dumbbell\'ı göğüste tutarak yapılan squat varyasyonu.', videoUrl: '', equipments: ['dumbbell'] },
  { id: 'ex_db_lateral', name: 'Dumbbell Lateral Raise', description: 'Yan omuz başlarını izole ederek omuzları genişleten hareket.', videoUrl: '', equipments: ['dumbbell'] },

  // Resistance Band
  { id: 'ex_band_pull', name: 'Band Pull-Apart', description: 'Direnç bandını göğüs hizasında dışa doğru çekerek arka omuz/sırtı çalıştırma.', videoUrl: '', equipments: ['band'] },
  { id: 'ex_band_row', name: 'Band Row', description: 'Bandı bir yere sabitleyerek kendinize doğru çekerek sırtı çalıştırma.', videoUrl: '', equipments: ['band'] },
  { id: 'ex_band_squat', name: 'Band Squat', description: 'Ayaklar altına basılan bant direnciyle uygulanan squat.', videoUrl: '', equipments: ['band'] },
  { id: 'ex_band_curl', name: 'Band Bicep Curl', description: 'Bant direnciyle ön kol bükme hareketi.', videoUrl: '', equipments: ['band'] },

  // Pullup Bar
  { id: 'ex_pullup', name: 'Barfiks (Pull-up)', description: 'Geniş sırt ve kanat kaslarını geliştiren üst vücut çekiş hareketi.', videoUrl: '', equipments: ['pullup_bar'] },
  { id: 'ex_hanging_knees', name: 'Hanging Knee Raise', description: 'Barfiks barına asılarak dizleri göğse çekme (alt karın).', videoUrl: '', equipments: ['pullup_bar'] },

  // Kettlebell
  { id: 'ex_kb_swing', name: 'Kettlebell Swing', description: 'Kalça patlayıcı gücünü ve arka zincir bacak kaslarını çalıştıran swing.', videoUrl: '', equipments: ['kettlebell'] },
  { id: 'ex_kb_squat', name: 'Kettlebell Goblet Squat', description: 'Kettlebell ile bacakları derin bükme egzersizi.', videoUrl: '', equipments: ['kettlebell'] },

  // Gym / Barbell & Machines (Assumed for Gym Environment)
  { id: 'ex_bb_bench', name: 'Barbell Bench Press', description: 'Bench sehpası üzerinde barbell ile göğüs presi.', videoUrl: '', equipments: ['bench', 'barbell'] },
  { id: 'ex_lat_pulldown', name: 'Lat Pulldown', description: 'Sırtı genişleten makinede yukarıdan çekiş egzersizi.', videoUrl: '', equipments: ['machines'] },
  { id: 'ex_bb_squat', name: 'Barbell Back Squat', description: 'Sırtta barbell ağırlığıyla yapılan derin bacak bükme.', videoUrl: '', equipments: ['barbell'] },
  { id: 'ex_cable_row', name: 'Cable Seated Row', description: 'Kablolu istasyonda oturarak sırt çekiş egzersizi.', videoUrl: '', equipments: ['cables'] },
  { id: 'ex_leg_press', name: 'Leg Press', description: 'Bacak pres makinesinde kuadriseps ve kalça itişi.', videoUrl: '', equipments: ['machines'] },
  { id: 'ex_tricep_pushdown', name: 'Cable Tricep Pushdown', description: 'Kabloda aşağı doğru arka kol itiş egzersizi.', videoUrl: '', equipments: ['cables'] }
];

class WorkoutEngine {
  constructor() {
    this.currentDayIndex = new Date().getDay(); // 0 is Sunday, 1 is Monday, etc.
    this.daysMapping = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
  }

  generatePlan(userParams) {
    const { goal, workoutEnvironment, equipments } = userParams;
    const experienceLevel = userParams.experienceLevel || 'intermediate';
    
    // Filter exercises based on environment and equipments
    let availableExercises = EXERCISES.filter(ex => {
      // If we are at gym, we assume we have everything
      if (workoutEnvironment === 'gym') return true;
      
      // If we are at home, check if we have the equipment
      if (ex.equipments.length === 0) return true; // Bodyweight is always available
      return ex.equipments.every(eq => equipments.includes(eq));
    });

    // Fallback: If no exercises available, use bodyweight
    if (availableExercises.length === 0) {
      availableExercises = EXERCISES.filter(ex => ex.equipments.length === 0);
    }

    const translateLevel = {
      beginner: 'Başlangıç',
      intermediate: 'Orta',
      advanced: 'İleri'
    };

    const plan = {
      planType: workoutEnvironment === 'gym' ? 'Spor Salonu Split Planı' : 'Evde Egzersiz Planı',
      goal: goal,
      difficulty: translateLevel[experienceLevel] || 'Orta',
      days: {}
    };

    // Determine exercise splits based on goal
    const bodyweightOnly = availableExercises.every(ex => ex.equipments.length === 0);
    
    let dayPlans = {};

    // Dynamic workout parameters based on Experience Level
    let setsDefault = 3;
    let repsDefault = 12;
    let restDefault = 60;
    let exerciseCount = 5;
    
    let hiitReps = 15;
    let hiitRest = 30;
    
    let legsSets = 4;
    let legsReps = 12;
    let legsRest = 75;

    if (experienceLevel === 'beginner') {
      setsDefault = 3;
      repsDefault = 10;
      restDefault = 75;
      exerciseCount = 4;
      hiitReps = 12;
      hiitRest = 45;
      legsSets = 3;
      legsReps = 10;
      legsRest = 90;
    } else if (experienceLevel === 'advanced') {
      setsDefault = 4;
      repsDefault = 10; // heavier reps
      restDefault = 45;
      exerciseCount = 6;
      hiitReps = 18;
      hiitRest = 20;
      legsSets = 4;
      legsReps = 10;
      legsRest = 60;
    }
    
    if (goal === 'lose_fat' || goal === 'endurance') {
      // High Intensity Full Body / HIIT (3-Day Split)
      const fullBodyExs = this.selectExercises(availableExercises, ['ex_burpee', 'ex_squat', 'ex_pushup', 'ex_mountain_climber', 'ex_plank', 'ex_lunges', 'ex_leg_raise', 'ex_kb_swing'], exerciseCount);
      const hiitExs = this.selectExercises(availableExercises, ['ex_mountain_climber', 'ex_burpee', 'ex_squat', 'ex_pushup', 'ex_plank', 'ex_wall_sit'], exerciseCount);
      const cardioExs = this.selectExercises(availableExercises, ['ex_lunges', 'ex_leg_raise', 'ex_dips', 'ex_pushup', 'ex_plank', 'ex_kb_swing'], exerciseCount);

      dayPlans = {
        'Pazartesi': this.buildWorkoutDay(fullBodyExs, setsDefault, repsDefault, 0, restDefault, userParams), // Sets, Reps, Duration, Rest
        'Salı': 'Dinlenme Günü',
        'Çarşamba': this.buildWorkoutDay(hiitExs, setsDefault, hiitReps, 0, hiitRest, userParams),
        'Perşembe': 'Dinlenme Günü',
        'Cuma': this.buildWorkoutDay(cardioExs, setsDefault, repsDefault, 0, restDefault - 5, userParams),
        'Cumartesi': 'Aktif Dinlenme / Hafif Koşu',
        'Pazar': 'Dinlenme Günü'
      };
    } else if (goal === 'build_muscle' || goal === 'build_strength' || goal === 'body_recomp') {
      // Hypertrophy Muscle Gain splits
      if (workoutEnvironment === 'gym') {
        // Push / Pull / Legs Split
        const pushExs = this.selectExercises(availableExercises, ['ex_bb_bench', 'ex_db_press', 'ex_tricep_pushdown', 'ex_db_lateral', 'ex_pushup'], exerciseCount);
        const pullExs = this.selectExercises(availableExercises, ['ex_pullup', 'ex_lat_pulldown', 'ex_cable_row', 'ex_db_row', 'ex_db_curl'], exerciseCount);
        const legsExs = this.selectExercises(availableExercises, ['ex_bb_squat', 'ex_leg_press', 'ex_db_goblet', 'ex_lunges', 'ex_plank'], exerciseCount);

        dayPlans = {
          'Pazartesi': this.buildWorkoutDay(pushExs, setsDefault, repsDefault, 0, restDefault, userParams),
          'Salı': 'Dinlenme Günü',
          'Çarşamba': this.buildWorkoutDay(pullExs, setsDefault, repsDefault, 0, restDefault, userParams),
          'Perşembe': 'Dinlenme Günü',
          'Cuma': this.buildWorkoutDay(legsExs, legsSets, legsReps, 0, legsRest, userParams),
          'Cumartesi': 'Dinlenme Günü',
          'Pazar': 'Dinlenme Günü'
        };
      } else {
        // Home Hypertrophy (Upper / Lower Split or Full Body Hypertrophy)
        if (bodyweightOnly) {
          // Bodyweight Progression Split
          const w1 = this.selectExercises(availableExercises, ['ex_pushup', 'ex_squat', 'ex_dips', 'ex_lunges', 'ex_plank'], exerciseCount);
          const w2 = this.selectExercises(availableExercises, ['ex_mountain_climber', 'ex_wall_sit', 'ex_pushup', 'ex_leg_raise', 'ex_plank'], exerciseCount);
          const w3 = this.selectExercises(availableExercises, ['ex_dips', 'ex_squat', 'ex_pushup', 'ex_lunges', 'ex_leg_raise'], exerciseCount);

          dayPlans = {
            'Pazartesi': this.buildWorkoutDay(w1, setsDefault, repsDefault, 0, restDefault, userParams),
            'Salı': 'Dinlenme Günü',
            'Çarşamba': this.buildWorkoutDay(w2, setsDefault, repsDefault, 0, restDefault, userParams),
            'Perşembe': 'Dinlenme Günü',
            'Cuma': this.buildWorkoutDay(w3, setsDefault, repsDefault, 0, restDefault, userParams),
            'Cumartesi': 'Dinlenme Günü',
            'Pazar': 'Dinlenme Günü'
          };
        } else {
          // Home Equipment hypertrophic mix (Upper/Lower Split)
          const upperExs = this.selectExercises(availableExercises, ['ex_db_press', 'ex_db_chest_press', 'ex_db_row', 'ex_band_pull', 'ex_db_curl', 'ex_pushup'], exerciseCount);
          const lowerExs = this.selectExercises(availableExercises, ['ex_db_goblet', 'ex_lunges', 'ex_kb_swing', 'ex_wall_sit', 'ex_plank', 'ex_leg_raise'], exerciseCount);

          dayPlans = {
            'Pazartesi': this.buildWorkoutDay(upperExs, setsDefault, repsDefault, 0, restDefault, userParams),
            'Salı': 'Dinlenme Günü',
            'Çarşamba': this.buildWorkoutDay(lowerExs, setsDefault, repsDefault, 0, restDefault, userParams),
            'Perşembe': 'Dinlenme Günü',
            'Cuma': this.buildWorkoutDay(upperExs, setsDefault, repsDefault, 0, restDefault, userParams),
            'Cumartesi': 'Dinlenme Günü',
            'Pazar': 'Dinlenme Günü'
          };
        }
      }
    } else {
      // General Fit / Recomp: 3 Days Hypertrophy / Cardio Mix
      const mix1 = this.selectExercises(availableExercises, ['ex_squat', 'ex_pushup', 'ex_db_row', 'ex_band_pull', 'ex_plank'], exerciseCount);
      const mix2 = this.selectExercises(availableExercises, ['ex_mountain_climber', 'ex_lunges', 'ex_db_press', 'ex_leg_raise', 'ex_wall_sit'], exerciseCount);
      const mix3 = this.selectExercises(availableExercises, ['ex_burpee', 'ex_db_goblet', 'ex_dips', 'ex_plank', 'ex_kb_swing'], exerciseCount);

      dayPlans = {
        'Pazartesi': this.buildWorkoutDay(mix1, setsDefault, repsDefault, 0, restDefault, userParams),
        'Salı': 'Dinlenme Günü',
        'Çarşamba': this.buildWorkoutDay(mix2, setsDefault, repsDefault, 0, restDefault, userParams),
        'Perşembe': 'Dinlenme Günü',
        'Cuma': this.buildWorkoutDay(mix3, setsDefault, repsDefault, 0, restDefault, userParams),
        'Cumartesi': 'Dinlenme Günü',
        'Pazar': 'Dinlenme Günü'
      };
    }

    plan.days = dayPlans;
    return plan;
  }

  selectExercises(pool, preferredIds, count) {
    const list = [];
    // First try to grab preferred items from the pool
    preferredIds.forEach(id => {
      const found = pool.find(ex => ex.id === id);
      if (found) list.push(found);
    });

    // If we need more, grab random items from the pool
    if (list.length < count) {
      const remaining = pool.filter(ex => !list.some(l => l.id === ex.id));
      const needed = count - list.length;
      const shuffled = [...remaining].sort(() => 0.5 - Math.random());
      list.push(...shuffled.slice(0, needed));
    }

    return list.slice(0, count);
  }

  buildWorkoutDay(exercises, sets, reps, duration, restTime, userParams = {}) {
    const level = userParams.experienceLevel || 'intermediate';
    const gender = userParams.gender || 'male';
    const weight = userParams.weight || 70;
    
    return exercises.map(ex => {
      const recWeight = this.getRecommendedWeight(ex.id, level, gender, weight);
      return {
        exerciseId: ex.id,
        sets: sets,
        reps: reps,
        duration: duration, // 0 means rep-based
        restTime: restTime, // Rest between sets in seconds
        weight: recWeight
      };
    });
  }

  getBarbellPlates(totalWeight) {
    const barWeight = totalWeight >= 20 ? 20 : 10;
    const platesWeight = (totalWeight - barWeight) / 2;
    if (platesWeight === 0) {
      return `${totalWeight} kg (Barbell) [${barWeight} kg Bar]`;
    }
    return `${totalWeight} kg (Barbell) [${barWeight} kg Bar + 2x ${platesWeight} kg Plaka]`;
  }

  getDumbbellDetail(weightPerHand) {
    return `${weightPerHand} kg (Dumbbell) [Çift - Her elde ${weightPerHand} kg]`;
  }

  getRecommendedWeight(exerciseId, level, gender, userWeight) {
    const isMale = gender === 'male';

    // Bodyweight exercises
    const bodyweightExercises = [
      'ex_pushup', 'ex_squat', 'ex_plank', 'ex_lunges', 'ex_mountain_climber',
      'ex_burpee', 'ex_leg_raise', 'ex_dips', 'ex_wall_sit', 'ex_pullup', 'ex_hanging_knees'
    ];
    if (bodyweightExercises.includes(exerciseId)) {
      return 'Vücut Ağırlığı';
    }

    // Resistance Band exercises
    const bandExercises = ['ex_band_pull', 'ex_band_row', 'ex_band_squat', 'ex_band_curl'];
    if (bandExercises.includes(exerciseId)) {
      if (level === 'beginner') return 'Hafif Direnç Bandı';
      if (level === 'advanced') return 'Ağır Direnç Bandı';
      return 'Orta Direnç Bandı';
    }

    // Dumbbell Exercises - Small muscle groups / isolation
    const dbSmallExs = ['ex_db_curl', 'ex_db_lateral'];
    if (dbSmallExs.includes(exerciseId)) {
      if (isMale) {
        if (level === 'beginner') return this.getDumbbellDetail(5);
        if (level === 'advanced') return this.getDumbbellDetail(12.5);
        return this.getDumbbellDetail(7.5);
      } else {
        if (level === 'beginner') return this.getDumbbellDetail(2.5);
        if (level === 'advanced') return this.getDumbbellDetail(7.5);
        return this.getDumbbellDetail(5);
      }
    }

    // Dumbbell Exercises - Large muscle groups / compounds
    const dbLargeExs = ['ex_db_press', 'ex_db_chest_press', 'ex_db_row', 'ex_db_goblet'];
    if (dbLargeExs.includes(exerciseId)) {
      if (isMale) {
        if (level === 'beginner') return this.getDumbbellDetail(7.5);
        if (level === 'advanced') return this.getDumbbellDetail(20);
        return this.getDumbbellDetail(12.5);
      } else {
        if (level === 'beginner') return this.getDumbbellDetail(4);
        if (level === 'advanced') return this.getDumbbellDetail(10);
        return this.getDumbbellDetail(6);
      }
    }

    // Kettlebell Exercises
    const kbExs = ['ex_kb_swing', 'ex_kb_squat'];
    if (kbExs.includes(exerciseId)) {
      if (isMale) {
        if (level === 'beginner') return '8 kg (Kettlebell)';
        if (level === 'advanced') return '20 kg (Kettlebell)';
        return '12 kg (Kettlebell)';
      } else {
        if (level === 'beginner') return '4 kg (Kettlebell)';
        if (level === 'advanced') return '12 kg (Kettlebell)';
        return '8 kg (Kettlebell)';
      }
    }

    // Barbell Exercises
    if (exerciseId === 'ex_bb_bench') {
      if (isMale) {
        if (level === 'beginner') return this.getBarbellPlates(30);
        if (level === 'advanced') return this.getBarbellPlates(70);
        return this.getBarbellPlates(45);
      } else {
        if (level === 'beginner') return this.getBarbellPlates(15);
        if (level === 'advanced') return this.getBarbellPlates(35);
        return this.getBarbellPlates(20);
      }
    }
    if (exerciseId === 'ex_bb_squat') {
      if (isMale) {
        if (level === 'beginner') return this.getBarbellPlates(40);
        if (level === 'advanced') return this.getBarbellPlates(90);
        return this.getBarbellPlates(60);
      } else {
        if (level === 'beginner') return this.getBarbellPlates(20);
        if (level === 'advanced') return this.getBarbellPlates(50);
        return this.getBarbellPlates(30);
      }
    }

    // Machines & Cables
    if (exerciseId === 'ex_leg_press') {
      if (isMale) {
        if (level === 'beginner') return '50 kg';
        if (level === 'advanced') return '150 kg';
        return '90 kg';
      } else {
        if (level === 'beginner') return '30 kg';
        if (level === 'advanced') return '90 kg';
        return '50 kg';
      }
    }
    if (['ex_lat_pulldown', 'ex_cable_row'].includes(exerciseId)) {
      if (isMale) {
        if (level === 'beginner') return '30 kg';
        if (level === 'advanced') return '65 kg';
        return '45 kg';
      } else {
        if (level === 'beginner') return '15 kg';
        if (level === 'advanced') return '35 kg';
        return '25 kg';
      }
    }
    if (exerciseId === 'ex_tricep_pushdown') {
      if (isMale) {
        if (level === 'beginner') return '15 kg';
        if (level === 'advanced') return '35 kg';
        return '25 kg';
      } else {
        if (level === 'beginner') return '7.5 kg';
        if (level === 'advanced') return '20 kg';
        return '12.5 kg';
      }
    }

    return 'Ortalama Ağırlık';
  }

  getDayName(idx) {
    return this.daysMapping[idx];
  }

  // Renders the Workout Tab UI
  renderWorkoutTab(container, activeDayName = null) {
    const state = store.getState();
    const plan = state.workoutPlan;
    const activeWorkout = state.activeWorkout;
    
    if (!plan) {
      container.innerHTML = `
        <div class="glass-card text-center" style="padding: 60px 20px;">
          <i class="fas fa-heartbeat" style="font-size: 50px; color: var(--accent-pink); margin-bottom: 20px;"></i>
          <h2>Henüz Egzersiz Programınız Oluşturulmadı</h2>
          <p class="text-secondary" style="margin: 10px 0 20px;">Lütfen onboarding sürecini tamamlayın.</p>
          <button class="btn btn-primary" id="start-onboarding-btn">Başla</button>
        </div>
      `;
      document.getElementById('start-onboarding-btn')?.addEventListener('click', () => {
        // Reset and trigger onboarding
        store.resetState();
        window.location.reload();
      });
      return;
    }

    // Determine current day of week in Turkish
    const todayIndex = new Date().getDay();
    const todayName = this.getDayName(todayIndex);
    const dayToShow = activeDayName || (plan.days[todayName] ? todayName : 'Pazartesi');

    const dayList = Object.keys(plan.days);
    
    // Check if the current visible day is a Rest Day (String vs Array)
    const isRestDay = typeof plan.days[dayToShow] === 'string';

    // Build Day Selector Tabs
    const tabsHtml = dayList.map(d => {
      const isActive = d === dayToShow;
      const isRest = typeof plan.days[d] === 'string';
      return `
        <div class="day-tab ${isActive ? 'active' : ''} ${isRest ? 'rest-day' : ''}" data-day="${d}">
          ${d} ${d === todayName ? '<small>(Bugün)</small>' : ''}
        </div>
      `;
    }).join('');

    // Workout Day content
    let contentHtml = '';
    if (isRestDay) {
      contentHtml = `
        <div class="glass-card text-center" style="padding: 40px; border-style: dashed; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px;">
          <i class="fas fa-couch" style="font-size: 40px; color: var(--accent-emerald);"></i>
          <h3>Dinlenme Günü</h3>
          <p class="text-secondary">${plan.days[dayToShow]}. Vücudunuzun toparlanması, kasların gelişmesi için bugün dinlenin.</p>
        </div>
      `;
    } else {
      const exercises = plan.days[dayToShow];
      const exerciseRows = exercises.map(we => {
        const exDetail = EXERCISES.find(e => e.id === we.exerciseId) || { name: 'Egzersiz', description: '' };
        
        // Check if checked in activeWorkout (if the active workout is running for this day)
        const isChecked = activeWorkout && 
                          activeWorkout.dayName === dayToShow && 
                          activeWorkout.completedExercises.includes(we.exerciseId);

        return `
          <div class="exercise-item">
            <div class="exercise-meta-container">
              <div class="check-btn ${isChecked ? 'checked' : ''}" data-id="${we.exerciseId}" data-day="${dayToShow}">
                <i class="fas fa-check"></i>
              </div>
              <div class="exercise-details">
                <span class="exercise-name">${exDetail.name}</span>
                <span class="exercise-specs">
                  <span><i class="fas fa-sync-alt"></i> ${we.sets} Set</span>
                  <span><i class="fas fa-redo"></i> ${we.reps > 0 ? `${we.reps} Tekrar` : `${we.duration} sn`}</span>
                  <span><i class="fas fa-chair"></i> ${we.restTime} sn Dinlenme</span>
                  ${we.weight ? `<span><i class="fas fa-weight-hanging"></i> ${we.weight}</span>` : ''}
                </span>
                <p class="text-secondary" style="font-size: 12px; margin-top: 6px;">${exDetail.description}</p>
              </div>
            </div>
          </div>
        `;
      }).join('');

      // Top control bar
      const isWorkoutStarted = activeWorkout && activeWorkout.dayName === dayToShow;
      const actionButton = isWorkoutStarted 
        ? `<button class="btn btn-accent-green" id="resume-workout-btn"><i class="fas fa-play"></i> Antrenmana Devam Et</button>`
        : `<button class="btn btn-primary" id="start-workout-btn" data-day="${dayToShow}"><i class="fas fa-play"></i> Antrenmanı Başlat</button>`;

      contentHtml = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <h3 class="page-subtitle">${dayToShow} Programı (${exercises.length} Egzersiz)</h3>
          ${actionButton}
        </div>
        <div class="exercise-list">
          ${exerciseRows}
        </div>
      `;
    }

    const userLevel = state.user?.experienceLevel || 'intermediate';

    container.innerHTML = `
      <div>
        <div class="page-header">
          <div>
            <h1 class="page-title">Egzersiz Programım</h1>
            <p class="page-subtitle" style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
              <span>${plan.planType}</span>
              <span>•</span>
              <span>Hedef: ${this.translateGoal(plan.goal)}</span>
              <span>•</span>
              <span>Seviye:</span>
              <select id="workout-level-selector" style="background: rgba(255,255,255,0.05); border: 1px solid var(--border-color); color: var(--accent-cyan); font-weight: 600; padding: 4px 10px; border-radius: 8px; cursor: pointer; outline: none; font-size: 13px;">
                <option value="beginner" ${userLevel === 'beginner' ? 'selected' : ''} style="background: var(--bg-secondary); color: var(--text-primary);">Başlangıç</option>
                <option value="intermediate" ${userLevel === 'intermediate' ? 'selected' : ''} style="background: var(--bg-secondary); color: var(--text-primary);">Orta</option>
                <option value="advanced" ${userLevel === 'advanced' ? 'selected' : ''} style="background: var(--bg-secondary); color: var(--text-primary);">İleri</option>
              </select>
            </p>
          </div>
        </div>
      </div>
      
      <!-- Day Tabs -->
      <div class="days-row">
        ${tabsHtml}
      </div>

      <div class="workout-content-wrapper" style="display: flex; flex-direction: column; gap: 20px;">
        ${contentHtml}
      </div>
    `;

    // Bind Level Switch Event
    container.querySelector('#workout-level-selector')?.addEventListener('change', (e) => {
      const newLevel = e.target.value;
      const currentState = store.getState();
      const updatedUser = {
        ...currentState.user,
        experienceLevel: newLevel
      };
      
      store.setUser(updatedUser);
      
      const newPlan = this.generatePlan(updatedUser);
      store.setWorkoutPlan(newPlan);
      
      this.renderWorkoutTab(container, activeDayName);
    });

    // Bind Day Switch Events
    container.querySelectorAll('.day-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        this.renderWorkoutTab(container, tab.dataset.day);
      });
    });

    // Bind Checklist toggle clicks (only allowed if workout is active!)
    container.querySelectorAll('.check-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const exId = btn.dataset.id;
        const day = btn.dataset.day;
        
        if (!activeWorkout || activeWorkout.dayName !== day) {
          alert('Önce antrenmanı başlatmanız gerekmektedir.');
          return;
        }

        store.toggleExerciseComplete(exId);
        this.renderWorkoutTab(container, dayToShow);
      });
    });

    // Bind start workout trigger
    container.querySelector('#start-workout-btn')?.addEventListener('click', () => {
      store.startWorkout(dayToShow);
      // Trigger workout overlay from global level
      window.dispatchEvent(new CustomEvent('workout-started', { detail: { dayName: dayToShow } }));
    });

    container.querySelector('#resume-workout-btn')?.addEventListener('click', () => {
      window.dispatchEvent(new CustomEvent('workout-started', { detail: { dayName: dayToShow } }));
    });
  }

  translateGoal(goal) {
    const mapping = {
      lose_fat: 'Yağ Yakımı',
      build_muscle: 'Kas Yapma',
      get_fit: 'Fit Görünmek',
      body_recomp: 'Yağ Yakıp Kas Koruma',
      build_strength: 'Güç Kazanma',
      endurance: 'Dayanıklılık'
    };
    return mapping[goal] || goal;
  }
}

export const workoutEngine = new WorkoutEngine();
