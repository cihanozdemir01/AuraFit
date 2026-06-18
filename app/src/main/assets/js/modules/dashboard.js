import { store } from '../store.js';
import { workoutEngine } from './workout.js';

class Dashboard {
  constructor() {}

  renderDashboardTab(container) {
    const state = store.getState();
    const user = state.user;
    const plan = state.workoutPlan;
    const measurements = state.measurements || [];
    const nutrition = state.nutrition;
    const activeWorkout = state.activeWorkout;

    if (!user || !plan) {
      container.innerHTML = `
        <div class="glass-card text-center" style="padding: 60px 20px;">
          <i class="fas fa-chart-line" style="font-size: 50px; color: var(--accent-cyan); margin-bottom: 20px;"></i>
          <h2>Hoş Geldiniz!</h2>
          <p class="text-secondary" style="margin: 10px 0 20px;">Kişiselleştirilmiş planınızı oluşturmak için onboarding sürecini başlatın.</p>
          <button class="btn btn-primary" id="dashboard-start-ob-btn">Hemen Başla</button>
        </div>
      `;
      container.querySelector('#dashboard-start-ob-btn')?.addEventListener('click', () => {
        store.resetState();
        window.location.reload();
      });
      return;
    }

    // Get current weekday and program
    const todayIndex = new Date().getDay();
    const todayName = workoutEngine.getDayName(todayIndex);
    const todayExercises = plan.days[todayName];
    const isRest = typeof todayExercises === 'string';

    // Calculate daily checklist progress
    let workoutProgressText = 'Aktif Antrenman Yok';
    let workoutProgressPerc = 0;
    let workoutBtnHtml = `<button class="btn btn-secondary btn-go-tab" data-tab="workout">Programı Gör <i class="fas fa-chevron-right"></i></button>`;

    if (isRest) {
      workoutProgressText = 'Bugün Dinlenme Günü';
      workoutProgressPerc = 100;
    } else if (todayExercises) {
      const totalExCount = todayExercises.length;
      
      let completedExCount = 0;
      if (activeWorkout && activeWorkout.dayName === todayName) {
        completedExCount = activeWorkout.completedExercises.length;
        workoutProgressPerc = Math.round((completedExCount / totalExCount) * 100);
        workoutProgressText = `%${workoutProgressPerc} Tamamlandı`;
        workoutBtnHtml = `<button class="btn btn-accent-green btn-go-tab" data-tab="workout"><i class="fas fa-play"></i> Devam Et</button>`;
      } else {
        workoutProgressText = `${totalExCount} Egzersiz Hazır`;
        workoutProgressPerc = 0;
        workoutBtnHtml = `<button class="btn btn-primary btn-go-tab" data-tab="workout"><i class="fas fa-bolt"></i> Antrenmana Başla</button>`;
      }
    }

    // Progress measurements data
    const latestMeasurement = measurements[measurements.length - 1] || {};
    const firstMeasurement = measurements[0] || {};
    const weightDiff = (latestMeasurement.weight - firstMeasurement.weight).toFixed(1) || 0;
    const waistDiff = ((latestMeasurement.waist || 0) - (firstMeasurement.waist || 0)).toFixed(1) || 0;

    // Nutrition & Water variables
    const waterTarget = nutrition.waterTarget || 2500;
    const waterIntake = nutrition.waterIntake || 0;
    const waterProgressPerc = Math.min(100, Math.round((waterIntake / waterTarget) * 100));

    container.innerHTML = `
      <!-- Hero Welcome Banner -->
      <div class="glass-card" style="background: linear-gradient(135deg, rgba(0, 229, 255, 0.1), rgba(41, 121, 255, 0.02)); border-color: rgba(0, 229, 255, 0.2); display: flex; justify-content: space-between; align-items: center; padding: 30px;">
        <div>
          <h1 class="page-title" style="font-size: 28px;">Tekrar Hoş Geldin, ${user.name}!</h1>
          <p class="text-secondary" style="margin-top: 4px; font-size: 14px;">Bugün hedeflerine bir adım daha yaklaşmak için harika bir gün. Programını tamamlamayı unutma!</p>
        </div>
        <div style="font-family: var(--font-display); text-align: right;">
          <span style="font-size: 32px; font-weight: 800; color: var(--accent-cyan);">%${waterProgressPerc}</span><br>
          <span class="text-secondary" style="font-size: 11px; text-transform: uppercase;">Su Hedefi</span>
        </div>
      </div>

      <!-- Quick stats summary row -->
      <div class="summary-cards">
        <div class="glass-card mini-card">
          <div class="mini-card-icon cyan"><i class="fas fa-weight"></i></div>
          <div>
            <div class="mini-card-val">${user.weight} kg</div>
            <div class="mini-card-lbl">Güncel Kilo</div>
          </div>
        </div>
        
        <div class="glass-card mini-card">
          <div class="mini-card-icon emerald"><i class="fas fa-compress"></i></div>
          <div>
            <div class="mini-card-val">${latestMeasurement.waist ? `${latestMeasurement.waist} cm` : '-'}</div>
            <div class="mini-card-lbl">Bel Ölçüsü</div>
          </div>
        </div>

        <div class="glass-card mini-card">
          <div class="mini-card-icon orange"><i class="fas fa-fire"></i></div>
          <div>
            <div class="mini-card-val">${nutrition.caloriesTarget} kcal</div>
            <div class="mini-card-lbl">Kalori Hedefi</div>
          </div>
        </div>
      </div>

      <div class="dashboard-grid">
        <!-- Left Column: Workout & Progress -->
        <div style="display: flex; flex-direction: column; gap: 32px;">
          <!-- Workout Card -->
          <div class="glass-card" style="display: flex; gap: 24px; align-items: center;">
            <div class="progress-ring-container">
              <svg class="progress-ring" width="140" height="140">
                <circle class="progress-ring-circle-bg" cx="70" cy="70" r="60" />
                <circle class="progress-ring-circle" cx="70" cy="70" r="60" stroke-dasharray="376.99" stroke-dashoffset="${376.99 * (1 - (workoutProgressPerc / 100))}" />
              </svg>
              <div class="progress-ring-text">
                <span class="progress-ring-num">${workoutProgressPerc}%</span>
                <span class="progress-ring-unit">Tamamlandı</span>
              </div>
            </div>

            <div style="flex-grow: 1; display: flex; flex-direction: column; gap: 8px;">
              <span class="text-secondary" style="font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">BUGÜNÜN PROGRAMI</span>
              <h2 style="font-family: var(--font-display); font-size: 22px;">${isRest ? 'Dinlenme Günü' : todayName + ' Antrenmanı'}</h2>
              <p class="text-secondary" style="font-size: 13px;">${workoutProgressText}</p>
              <div style="margin-top: 8px;">
                ${workoutBtnHtml}
              </div>
            </div>
          </div>

          <!-- Progress summary Card -->
          <div class="glass-card">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
              <h2 style="font-family: var(--font-display); font-size: 20px;">Gelişim Analizi</h2>
              <button class="btn btn-secondary btn-go-tab" data-tab="progress" style="padding: 6px 12px; font-size: 12px;">Check-in Yap</button>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
              <div class="glass-card text-center" style="background-color: rgba(255,255,255,0.01); border-radius: 12px; padding: 16px;">
                <span class="text-secondary" style="font-size: 12px;">Toplam Kilo Değişimi</span>
                <div style="font-family: var(--font-display); font-size: 24px; font-weight: 700; margin-top: 6px; color: ${weightDiff > 0 ? 'var(--accent-pink)' : weightDiff < 0 ? 'var(--accent-emerald)' : 'var(--text-primary)'}">
                  ${weightDiff > 0 ? `+${weightDiff}` : weightDiff} kg
                </div>
              </div>
              <div class="glass-card text-center" style="background-color: rgba(255,255,255,0.01); border-radius: 12px; padding: 16px;">
                <span class="text-secondary" style="font-size: 12px;">Bel Ölçüsü Değişimi</span>
                <div style="font-family: var(--font-display); font-size: 24px; font-weight: 700; margin-top: 6px; color: ${waistDiff > 0 ? 'var(--accent-pink)' : waistDiff < 0 ? 'var(--accent-emerald)' : 'var(--text-primary)'}">
                  ${waistDiff > 0 ? `+${waistDiff}` : waistDiff} cm
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column: Nutrition Widget -->
        <div style="display: flex; flex-direction: column; gap: 32px;">
          <div class="glass-card">
            <h2 style="font-family: var(--font-display); font-size: 20px; margin-bottom: 16px;">Beslenme & Su Durumu</h2>
            
            <div style="display: flex; flex-direction: column; gap: 16px; margin-bottom: 20px;">
              <div>
                <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 4px;">
                  <span>Su Tüketimi</span>
                  <strong>${waterIntake} / ${waterTarget} ml</strong>
                </div>
                <div class="macro-bar-bg" style="height: 6px;">
                  <div class="macro-bar-fill protein" style="width: ${waterProgressPerc}%; background-color: var(--accent-cyan);"></div>
                </div>
              </div>
              
              <div>
                <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 4px;">
                  <span>Protein Hedefi</span>
                  <strong>${nutrition.proteinTarget}g</strong>
                </div>
                <div class="macro-bar-bg" style="height: 6px;">
                  <div class="macro-bar-fill protein" style="width: 100%; background-color: var(--accent-emerald);"></div>
                </div>
              </div>
            </div>

            <!-- Quick Water Adder -->
            <div style="display: flex; gap: 8px; justify-content: center; border-top: 1px solid var(--border-color); padding-top: 16px;">
              <button class="btn-water btn-dashboard-water" data-amount="250">+250ml Su Ekle</button>
              <button class="btn-water btn-dashboard-water" data-amount="500">+500ml Su Ekle</button>
            </div>
          </div>
        </div>
      </div>
    `;

    // Bind navigation buttons
    container.querySelectorAll('.btn-go-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        window.dispatchEvent(new CustomEvent('switch-tab', { detail: { tabId: tab } }));
      });
    });

    // Bind water buttons
    container.querySelectorAll('.btn-dashboard-water').forEach(btn => {
      btn.addEventListener('click', () => {
        const amount = parseInt(btn.dataset.amount);
        store.updateWater(amount);
        this.renderDashboardTab(container);
      });
    });
  }
}

export const dashboard = new Dashboard();
