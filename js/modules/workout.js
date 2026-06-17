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

    const plan = {
      planType: workoutEnvironment === 'gym' ? 'Spor Salonu Split Planı' : 'Evde Egzersiz Planı',
      goal: goal,
      difficulty: 'Orta Seviye',
      days: {}
    };

    // Determine exercise splits based on goal
    const bodyweightOnly = availableExercises.every(ex => ex.equipments.length === 0);
    
    let dayPlans = {};
    
    if (goal === 'lose_fat' || goal === 'endurance') {
      // High Intensity Full Body / HIIT (3-Day Split)
      const fullBodyExs = this.selectExercises(availableExercises, ['ex_burpee', 'ex_squat', 'ex_pushup', 'ex_mountain_climber', 'ex_plank', 'ex_lunges', 'ex_leg_raise', 'ex_kb_swing'], 5);
      const hiitExs = this.selectExercises(availableExercises, ['ex_mountain_climber', 'ex_burpee', 'ex_squat', 'ex_pushup', 'ex_plank', 'ex_wall_sit'], 5);
      const cardioExs = this.selectExercises(availableExercises, ['ex_lunges', 'ex_leg_raise', 'ex_dips', 'ex_pushup', 'ex_plank', 'ex_kb_swing'], 5);

      dayPlans = {
        'Pazartesi': this.buildWorkoutDay(fullBodyExs, 3, 12, 0, 45), // Sets, Reps, Duration, Rest
        'Salı': 'Dinlenme Günü',
        'Çarşamba': this.buildWorkoutDay(hiitExs, 3, 15, 0, 30),
        'Perşembe': 'Dinlenme Günü',
        'Cuma': this.buildWorkoutDay(cardioExs, 3, 12, 0, 40),
        'Cumartesi': 'Aktif Dinlenme / Hafif Koşu',
        'Pazar': 'Dinlenme Günü'
      };
    } else if (goal === 'build_muscle' || goal === 'build_strength' || goal === 'body_recomp') {
      // Hypertrophy Muscle Gain splits
      if (workoutEnvironment === 'gym') {
        // Push / Pull / Legs Split
        const pushExs = this.selectExercises(availableExercises, ['ex_bb_bench', 'ex_db_press', 'ex_tricep_pushdown', 'ex_db_lateral', 'ex_pushup'], 5);
        const pullExs = this.selectExercises(availableExercises, ['ex_pullup', 'ex_lat_pulldown', 'ex_cable_row', 'ex_db_row', 'ex_db_curl'], 5);
        const legsExs = this.selectExercises(availableExercises, ['ex_bb_squat', 'ex_leg_press', 'ex_db_goblet', 'ex_lunges', 'ex_plank'], 5);

        dayPlans = {
          'Pazartesi': this.buildWorkoutDay(pushExs, 4, 10, 0, 60),
          'Salı': 'Dinlenme Günü',
          'Çarşamba': this.buildWorkoutDay(pullExs, 4, 10, 0, 60),
          'Perşembe': 'Dinlenme Günü',
          'Cuma': this.buildWorkoutDay(legsExs, 4, 12, 0, 75),
          'Cumartesi': 'Dinlenme Günü',
          'Pazar': 'Dinlenme Günü'
        };
      } else {
        // Home Hypertrophy (Upper / Lower Split or Full Body Hypertrophy)
        if (bodyweightOnly) {
          // Bodyweight Progression Split
          const w1 = this.selectExercises(availableExercises, ['ex_pushup', 'ex_squat', 'ex_dips', 'ex_lunges', 'ex_plank'], 5);
          const w2 = this.selectExercises(availableExercises, ['ex_mountain_climber', 'ex_wall_sit', 'ex_pushup', 'ex_leg_raise', 'ex_plank'], 5);
          const w3 = this.selectExercises(availableExercises, ['ex_dips', 'ex_squat', 'ex_pushup', 'ex_lunges', 'ex_leg_raise'], 5);

          dayPlans = {
            'Pazartesi': this.buildWorkoutDay(w1, 3, 12, 0, 45),
            'Salı': 'Dinlenme Günü',
            'Çarşamba': this.buildWorkoutDay(w2, 3, 15, 0, 45),
            'Perşembe': 'Dinlenme Günü',
            'Cuma': this.buildWorkoutDay(w3, 3, 12, 0, 45),
            'Cumartesi': 'Dinlenme Günü',
            'Pazar': 'Dinlenme Günü'
          };
        } else {
          // Home Equipment hypertrophic mix (Upper/Lower Split)
          const upperExs = this.selectExercises(availableExercises, ['ex_db_press', 'ex_db_chest_press', 'ex_db_row', 'ex_band_pull', 'ex_db_curl', 'ex_pushup'], 5);
          const lowerExs = this.selectExercises(availableExercises, ['ex_db_goblet', 'ex_lunges', 'ex_kb_swing', 'ex_wall_sit', 'ex_plank', 'ex_leg_raise'], 5);

          dayPlans = {
            'Pazartesi': this.buildWorkoutDay(upperExs, 4, 10, 0, 60),
            'Salı': 'Dinlenme Günü',
            'Çarşamba': this.buildWorkoutDay(lowerExs, 4, 12, 0, 60),
            'Perşembe': 'Dinlenme Günü',
            'Cuma': this.buildWorkoutDay(upperExs, 3, 12, 0, 60),
            'Cumartesi': 'Dinlenme Günü',
            'Pazar': 'Dinlenme Günü'
          };
        }
      }
    } else {
      // General Fit / Recomp: 3 Days Hypertrophy / Cardio Mix
      const mix1 = this.selectExercises(availableExercises, ['ex_squat', 'ex_pushup', 'ex_db_row', 'ex_band_pull', 'ex_plank'], 5);
      const mix2 = this.selectExercises(availableExercises, ['ex_mountain_climber', 'ex_lunges', 'ex_db_press', 'ex_leg_raise', 'ex_wall_sit'], 5);
      const mix3 = this.selectExercises(availableExercises, ['ex_burpee', 'ex_db_goblet', 'ex_dips', 'ex_plank', 'ex_kb_swing'], 5);

      dayPlans = {
        'Pazartesi': this.buildWorkoutDay(mix1, 3, 12, 0, 45),
        'Salı': 'Dinlenme Günü',
        'Çarşamba': this.buildWorkoutDay(mix2, 3, 12, 0, 45),
        'Perşembe': 'Dinlenme Günü',
        'Cuma': this.buildWorkoutDay(mix3, 3, 12, 0, 45),
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

  buildWorkoutDay(exercises, sets, reps, duration, restTime) {
    return exercises.map(ex => ({
      exerciseId: ex.id,
      sets: sets,
      reps: reps,
      duration: duration, // 0 means rep-based
      restTime: restTime // Rest between sets in seconds
    }));
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

    container.innerHTML = `
      <div>
        <div class="page-header">
          <div>
            <h1 class="page-title">Egzersiz Programım</h1>
            <p class="page-subtitle">${plan.planType} — Hedef: ${this.translateGoal(plan.goal)}</p>
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
