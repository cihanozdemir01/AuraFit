import { store } from '../store.js';
import { EXERCISES } from './workout.js';

class TimerEngine {
  constructor() {
    this.intervalId = null;
    this.audioCtx = null;
    this.activeWorkout = null;
    this.workoutPlan = null;
    this.exercises = [];
    
    // Timer state variables
    this.currentExIndex = 0;
    this.currentSet = 1;
    this.timerState = 'work'; // 'work', 'rest', 'prep'
    this.timeRemaining = 0;
    this.totalTimeLimit = 0;
    this.isPaused = false;
    
    // Summary trackers
    this.startTime = null;
    this.totalExerciseCount = 0;
    this.completedExerciseCount = 0;
  }

  init() {
    window.addEventListener('workout-started', (e) => {
      this.start(e.detail.dayName);
    });
  }

  // Web Audio synth tones
  playTone(frequency, duration, type = 'sine') {
    try {
      if (!this.audioCtx) {
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      
      // Resume if suspended (browser security autoplays)
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      
      const oscillator = this.audioCtx.createOscillator();
      const gainNode = this.audioCtx.createGain();
      
      oscillator.type = type;
      oscillator.frequency.value = frequency;
      
      gainNode.gain.setValueAtTime(0.1, this.audioCtx.currentTime);
      // Fade out to prevent clicks
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + duration);
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioCtx.destination);
      
      oscillator.start();
      oscillator.stop(this.audioCtx.currentTime + duration);
    } catch (e) {
      console.warn('Web Audio Playback blocked or failed:', e);
    }
  }

  beep() {
    this.playTone(880, 0.1, 'sine'); // Short high pitch
  }

  chime() {
    this.playTone(587.33, 0.15, 'triangle'); // D5 note
    setTimeout(() => {
      this.playTone(880, 0.25, 'triangle'); // A5 note
    }, 120);
  }

  start(dayName) {
    const state = store.getState();
    this.workoutPlan = state.workoutPlan;
    if (!this.workoutPlan || !this.workoutPlan.days[dayName]) return;
    
    this.exercises = this.workoutPlan.days[dayName];
    this.activeWorkout = state.activeWorkout;
    this.startTime = new Date();
    
    this.currentExIndex = 0;
    this.currentSet = 1;
    this.isPaused = false;
    this.totalExerciseCount = this.exercises.length;
    this.completedExerciseCount = 0;
    
    this.renderOverlay();
    this.startExercise(0);
  }

  renderOverlay() {
    // Prevent duplicates
    if (document.getElementById('active-workout-overlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'active-workout-overlay';
    overlay.className = 'active-workout-overlay';
    overlay.innerHTML = `
      <div class="active-workout-header">
        <div>
          <h2 style="font-family: var(--font-display); font-size: 22px;">Antrenman Modu</h2>
          <p class="text-secondary" style="font-size: 13px;" id="aw-header-day"></p>
        </div>
        <button class="btn btn-danger btn-close-workout" id="aw-btn-quit">Antrenmanı Bitir</button>
      </div>

      <div class="active-workout-body">
        <!-- Timer Countdown -->
        <div class="active-workout-timer-sec">
          <span class="timer-state-title work" id="aw-timer-label">EGZERSİZ</span>
          
          <div class="timer-circle-wrap">
            <svg class="progress-ring" width="280" height="280">
              <circle class="progress-ring-circle-bg" cx="140" cy="140" r="120" />
              <circle id="aw-timer-ring" class="progress-ring-circle" cx="140" cy="140" r="120" stroke-dasharray="753.98" stroke-dashoffset="0" />
            </svg>
            <div class="progress-ring-text">
              <span class="timer-circle-value" id="aw-timer-display">00</span>
              <span class="progress-ring-unit" id="aw-timer-unit">saniye</span>
            </div>
          </div>

          <div class="timer-control-buttons">
            <button class="btn btn-secondary" id="aw-btn-pause" style="width: 120px;"><i class="fas fa-pause"></i> Duraklat</button>
            <button class="btn btn-primary" id="aw-btn-skip" style="width: 120px;">Geç <i class="fas fa-step-forward"></i></button>
          </div>
        </div>

        <!-- Exercise Specs -->
        <div class="active-workout-exercise-sec">
          <span class="page-subtitle" style="font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;" id="aw-ex-count">HAREKET 1 / 5</span>
          <h1 class="active-ex-name" id="aw-ex-name">Push-up</h1>
          <p class="active-ex-desc" id="aw-ex-desc">Şınav göğüs ve arka kolları güçlendirir.</p>
          
          <div class="active-ex-specs">
            <div class="spec-pill" id="aw-spec-sets">Set: <strong id="aw-spec-sets-val">1 / 3</strong></div>
            <div class="spec-pill" id="aw-spec-reps">Tekrar: <strong id="aw-spec-reps-val">12</strong></div>
            <div class="spec-pill" id="aw-spec-rest">Dinlenme: <strong id="aw-spec-rest-val">45 sn</strong></div>
          </div>
          
          <button class="btn btn-accent-green" id="aw-btn-work-done" style="margin-top: 20px; font-size: 16px; padding: 16px;"><i class="fas fa-check-circle"></i> Seti Tamamladım</button>
        </div>
      </div>

      <div class="active-workout-footer">
        <span class="text-secondary" style="font-size: 13px;" id="aw-footer-current">Sıradaki: Squat</span>
        <div class="workout-progress-bar-container">
          <div class="workout-progress-bar-fill" id="aw-progress-bar"></div>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    // Bind event listeners inside overlay
    overlay.querySelector('#aw-btn-pause').addEventListener('click', () => this.togglePause());
    overlay.querySelector('#aw-btn-skip').addEventListener('click', () => this.skipStep());
    overlay.querySelector('#aw-btn-work-done').addEventListener('click', () => this.completeSet());
    overlay.querySelector('#aw-btn-quit').addEventListener('click', () => this.promptQuit());

    document.getElementById('aw-header-day').innerText = `${this.activeWorkout.dayName} Antrenmanı`;
  }

  startExercise(index) {
    if (index >= this.exercises.length) {
      this.finishWorkout();
      return;
    }

    this.currentExIndex = index;
    this.currentSet = 1;
    this.setupActiveExerciseUI();
    this.startWorkPhase();
  }

  setupActiveExerciseUI() {
    const currentEx = this.exercises[this.currentExIndex];
    const detail = EXERCISES.find(e => e.id === currentEx.exerciseId) || { name: 'Egzersiz', description: '' };
    
    document.getElementById('aw-ex-count').innerText = `HAREKET ${this.currentExIndex + 1} / ${this.exercises.length}`;
    document.getElementById('aw-ex-name').innerText = detail.name;
    document.getElementById('aw-ex-desc').innerText = detail.description;
    
    document.getElementById('aw-spec-sets-val').innerText = `${this.currentSet} / ${currentEx.sets}`;
    document.getElementById('aw-spec-reps-val').innerText = currentEx.reps > 0 ? currentEx.reps : `${currentEx.duration} sn`;
    document.getElementById('aw-spec-rest-val').innerText = `${currentEx.restTime} sn`;

    // Setup next exercise hint in footer
    const nextEx = this.exercises[this.currentExIndex + 1];
    if (nextEx) {
      const nextDetail = EXERCISES.find(e => e.id === nextEx.exerciseId);
      document.getElementById('aw-footer-current').innerText = `Sıradaki: ${nextDetail ? nextDetail.name : 'Bitir'}`;
    } else {
      document.getElementById('aw-footer-current').innerText = `Sıradaki: Antrenman Sonu!`;
    }

    // Update overall workout progress bar
    const progressPerc = (this.currentExIndex / this.exercises.length) * 100;
    document.getElementById('aw-progress-bar').style.width = `${progressPerc}%`;
  }

  startWorkPhase() {
    this.timerState = 'work';
    const currentEx = this.exercises[this.currentExIndex];
    
    const label = document.getElementById('aw-timer-label');
    label.innerText = 'EGZERSİZ YAPIN';
    label.className = 'timer-state-title work';
    
    const doneBtn = document.getElementById('aw-btn-work-done');
    
    if (currentEx.duration > 0) {
      // Duration based exercise (e.g. plank)
      doneBtn.style.display = 'none'; // Hide button, timer handles it
      this.timeRemaining = currentEx.duration;
      this.totalTimeLimit = currentEx.duration;
      this.chime();
      this.runTimer(() => {
        this.completeSet();
      });
    } else {
      // Repetition based exercise
      doneBtn.style.display = 'block'; // Show button for manual completion
      this.timeRemaining = 0;
      this.totalTimeLimit = 0;
      this.updateTimerCircle(0);
      document.getElementById('aw-timer-display').innerText = `${currentEx.reps}`;
      document.getElementById('aw-timer-unit').innerText = 'Tekrar';
      this.chime();
    }
  }

  runTimer(onFinish) {
    if (this.intervalId) clearInterval(this.intervalId);
    this.updateTimerCircle(1);
    this.isPaused = false;
    document.getElementById('aw-btn-pause').innerHTML = `<i class="fas fa-pause"></i> Duraklat`;

    this.intervalId = setInterval(() => {
      if (this.isPaused) return;

      this.timeRemaining--;
      this.updateTimerDisplay();
      
      const ratio = this.timeRemaining / this.totalTimeLimit;
      this.updateTimerCircle(ratio);

      // Warning chimes during the final 10 seconds of REST or PREPARATION
      if (this.timerState !== 'work' && this.timeRemaining <= 10 && this.timeRemaining > 0) {
        this.beep();
      }

      if (this.timeRemaining <= 0) {
        clearInterval(this.intervalId);
        onFinish();
      }
    }, 1000);

    this.updateTimerDisplay();
  }

  updateTimerDisplay() {
    const mins = Math.floor(this.timeRemaining / 60);
    const secs = this.timeRemaining % 60;
    document.getElementById('aw-timer-display').innerText = mins > 0 
      ? `${mins}:${secs.toString().padStart(2, '0')}` 
      : `${secs}`;
    document.getElementById('aw-timer-unit').innerText = 'saniye';
  }

  updateTimerCircle(ratio) {
    const ring = document.getElementById('aw-timer-ring');
    if (!ring) return;
    const r = parseFloat(ring.getAttribute('r'));
    const circumference = 2 * Math.PI * r;
    
    // Set dash array in case it got reset
    ring.style.strokeDasharray = `${circumference}`;
    
    // Calculate offset
    const offset = circumference * (1 - ratio);
    ring.style.strokeDashoffset = `${offset}`;
    
    // Color code circle based on timer state
    if (this.timerState === 'work') {
      ring.style.stroke = 'var(--accent-cyan)';
    } else if (this.timerState === 'rest') {
      ring.style.stroke = 'var(--accent-emerald)';
    } else {
      ring.style.stroke = 'var(--accent-orange)';
    }
  }

  togglePause() {
    this.isPaused = !this.isPaused;
    const pauseBtn = document.getElementById('aw-btn-pause');
    if (this.isPaused) {
      pauseBtn.innerHTML = `<i class="fas fa-play"></i> Başlat`;
      pauseBtn.classList.add('btn-accent-green');
    } else {
      pauseBtn.innerHTML = `<i class="fas fa-pause"></i> Duraklat`;
      pauseBtn.classList.remove('btn-accent-green');
    }
  }

  completeSet() {
    if (this.intervalId) clearInterval(this.intervalId);
    
    // Mark checked in store for checklist tracking
    const currentEx = this.exercises[this.currentExIndex];
    
    // If it was the last set of the exercise
    if (this.currentSet >= currentEx.sets) {
      // Increment completed counter for summary report
      this.completedExerciseCount++;
      
      // Auto toggle complete in store
      store.toggleExerciseComplete(currentEx.exerciseId);
      
      // Check if there are more exercises
      if (this.currentExIndex + 1 < this.exercises.length) {
        // Start Transition rest between movements (prep phase)
        this.startPrepPhase();
      } else {
        // Completed last set of last exercise!
        this.finishWorkout();
      }
    } else {
      // Start Set Rest phase
      this.startRestPhase();
    }
  }

  startRestPhase() {
    this.timerState = 'rest';
    const currentEx = this.exercises[this.currentExIndex];
    
    const label = document.getElementById('aw-timer-label');
    label.innerText = 'DİNLENME SÜRESİ';
    label.className = 'timer-state-title rest';

    document.getElementById('aw-btn-work-done').style.display = 'none';
    
    // standard rest time
    const restSec = currentEx.restTime || 45;
    this.timeRemaining = restSec;
    this.totalTimeLimit = restSec;
    
    this.runTimer(() => {
      // Go to next set
      this.currentSet++;
      document.getElementById('aw-spec-sets-val').innerText = `${this.currentSet} / ${currentEx.sets}`;
      this.startWorkPhase();
    });
  }

  startPrepPhase() {
    this.timerState = 'prep';
    
    const label = document.getElementById('aw-timer-label');
    label.innerText = 'SONRAKİ HAREKETE GEÇİŞ';
    label.className = 'timer-state-title prep';

    document.getElementById('aw-btn-work-done').style.display = 'none';

    // Transition time (20s)
    const prepSec = 20;
    this.timeRemaining = prepSec;
    this.totalTimeLimit = prepSec;

    this.runTimer(() => {
      // Go to next exercise
      this.startExercise(this.currentExIndex + 1);
    });
  }

  skipStep() {
    if (this.intervalId) clearInterval(this.intervalId);
    
    if (this.timerState === 'work') {
      // Skip the work set
      this.completeSet();
    } else if (this.timerState === 'rest') {
      // Skip rest and go straight to next work set
      const currentEx = this.exercises[this.currentExIndex];
      this.currentSet++;
      document.getElementById('aw-spec-sets-val').innerText = `${this.currentSet} / ${currentEx.sets}`;
      this.startWorkPhase();
    } else {
      // Skip prep phase and go to next exercise
      this.startExercise(this.currentExIndex + 1);
    }
  }

  promptQuit() {
    const confirmQuit = confirm('Antrenmanı yarım bırakmak istediğinize emin misiniz? Gelişiminiz kaydedilmeyecektir.');
    if (confirmQuit) {
      this.cleanup();
      store.cancelWorkout();
      document.getElementById('active-workout-overlay')?.remove();
    }
  }

  finishWorkout() {
    this.cleanup();
    
    const endTime = new Date();
    const diffMs = endTime - this.startTime;
    const minutes = Math.ceil(diffMs / 1000 / 60);
    
    // Estimated calorie calculation
    // Average intensity MET = 5.0, energy burn = 5 * 3.5 * weightKg / 200 per min
    const state = store.getState();
    const weight = state.user ? state.user.weight : 70;
    const estCalories = Math.round(5 * 3.5 * weight * minutes / 200);
    
    const successRate = Math.round((this.completedExerciseCount / this.totalExerciseCount) * 100) || 0;

    store.finishWorkout(minutes, estCalories, successRate);
    
    // Close overlay
    document.getElementById('active-workout-overlay')?.remove();

    // Play Victory sound chime
    this.playTone(523.25, 0.2, 'sine'); // C5
    setTimeout(() => this.playTone(659.25, 0.2, 'sine'), 150); // E5
    setTimeout(() => this.playTone(783.99, 0.2, 'sine'), 300); // G5
    setTimeout(() => this.playTone(1046.50, 0.4, 'sine'), 450); // C6

    // Render summary report
    this.renderSummary(minutes, estCalories, successRate);
  }

  renderSummary(minutes, calories, successRate) {
    if (document.getElementById('workout-summary-overlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'workout-summary-overlay';
    overlay.className = 'summary-overlay';
    overlay.innerHTML = `
      <div class="summary-modal glass-card">
        <div class="summary-trophy"><i class="fas fa-trophy"></i></div>
        <div>
          <h2 class="summary-title">Tebrikler!</h2>
          <p class="text-secondary" style="font-size: 14px; margin-top: 4px;">Günlük antrenmanınızı başarıyla tamamladınız.</p>
        </div>
        
        <div class="summary-stats-grid">
          <div class="summary-stat-box">
            <span class="summary-stat-val">${minutes}</span>
            <span class="summary-stat-lbl">Toplam Süre (Dakika)</span>
          </div>
          <div class="summary-stat-box">
            <span class="summary-stat-val">${calories}</span>
            <span class="summary-stat-lbl">Tahmini Kalori (kcal)</span>
          </div>
          <div class="summary-stat-box">
            <span class="summary-stat-val">${this.completedExerciseCount} / ${this.totalExerciseCount}</span>
            <span class="summary-stat-lbl">Tamamlanan Hareket</span>
          </div>
          <div class="summary-stat-box">
            <span class="summary-stat-val">%${successRate}</span>
            <span class="summary-stat-lbl">Başarı Oranı</span>
          </div>
        </div>

        <button class="btn btn-primary" id="summary-btn-close" style="width: 100%; padding: 14px;">Dashboard'a Dön</button>
      </div>
    `;

    document.body.appendChild(overlay);

    overlay.querySelector('#summary-btn-close').addEventListener('click', () => {
      overlay.remove();
      // Reload UI to show clean state
      window.location.reload();
    });
  }

  cleanup() {
    if (this.intervalId) clearInterval(this.intervalId);
    this.intervalId = null;
    this.activeWorkout = null;
  }
}

export const timerEngine = new TimerEngine();
