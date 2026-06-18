import { store } from './store.js';
import { onboarding } from './modules/onboarding.js';
import { dashboard } from './modules/dashboard.js';
import { workoutEngine } from './modules/workout.js';
import { nutritionEngine } from './modules/nutrition.js';
import { timerEngine } from './modules/timer.js';
import { progressTracker } from './modules/progress.js';
import { supplementModule } from './modules/supplement.js';
import { profileModule } from './modules/profile.js';

class App {
  constructor() {
    this.activeTabId = 'dashboard';
    this.containers = {
      dashboard: document.getElementById('dashboard'),
      workout: document.getElementById('workout'),
      nutrition: document.getElementById('nutrition'),
      progress: document.getElementById('progress'),
      profile: document.getElementById('profile')
    };
  }

  init() {
    // 1. Initialize sub-engines
    onboarding.init();
    timerEngine.init();
    supplementModule.init();

    // 2. Setup navigation listeners
    this.bindNavigation();

    // 3. Listen to store updates to keep sidebar/avatar in sync
    store.subscribe((state) => this.handleStateChange(state));

    // 4. Initial rendering
    const state = store.getState();
    if (state.onboardingComplete) {
      this.handleStateChange(state);
      this.renderActiveTab();
    }

    // 5. Global Custom Event Listeners (for inter-module routing & notifications)
    window.addEventListener('switch-tab', (e) => {
      this.switchTab(e.detail.tabId);
    });
    window.addEventListener('show-toast', (e) => {
      this.showToast(e.detail.message, e.detail.type);
    });
  }

  showToast(message, type = 'info') {
    // Remove existing toasts
    document.querySelectorAll('.toast-notification').forEach(t => t.remove());

    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    if (type === 'success') {
      toast.style.borderColor = 'var(--accent-emerald)';
      toast.style.borderLeftColor = 'var(--accent-emerald)';
      toast.innerHTML = `<i class="fas fa-check-circle" style="color: var(--accent-emerald); font-size: 16px;"></i> <span>${message}</span>`;
    } else {
      toast.innerHTML = `<i class="fas fa-info-circle" style="color: var(--accent-cyan); font-size: 16px;"></i> <span>${message}</span>`;
    }
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 3000);
  }

  bindNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const tabId = item.dataset.tab;
        this.switchTab(tabId);
      });
    });
  }

  switchTab(tabId) {
    if (!this.containers[tabId]) return;

    // Check onboarding completion requirement
    const state = store.getState();
    if (!state.onboardingComplete) {
      alert('Lütfen önce onboarding sürecini tamamlayınız.');
      return;
    }

    this.activeTabId = tabId;

    // Update active class in links
    document.querySelectorAll('.nav-item').forEach(item => {
      if (item.dataset.tab === tabId) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Toggle visible section
    Object.keys(this.containers).forEach(key => {
      if (key === tabId) {
        this.containers[key].classList.add('active');
      } else {
        this.containers[key].classList.remove('active');
      }
    });

    // Render tab content
    this.renderActiveTab();
  }

  renderActiveTab() {
    const container = this.containers[this.activeTabId];
    if (!container) return;

    switch (this.activeTabId) {
      case 'dashboard':
        dashboard.renderDashboardTab(container);
        break;
      case 'workout':
        workoutEngine.renderWorkoutTab(container);
        break;
      case 'nutrition':
        nutritionEngine.renderNutritionTab(container);
        break;
      case 'progress':
        progressTracker.renderProgressTab(container);
        break;
      case 'profile':
        profileModule.renderProfileTab(container);
        break;
    }
  }

  handleStateChange(state) {
    // Sync sidebar footer demographics
    const nameEl = document.getElementById('sidebar-name');
    const goalEl = document.getElementById('sidebar-goal');
    const avatarEl = document.getElementById('sidebar-avatar');

    if (state.user) {
      nameEl.innerText = state.user.name;
      goalEl.innerText = this.translateGoal(state.user.goal);
      avatarEl.innerText = state.user.name.charAt(0).toUpperCase();
    } else {
      nameEl.innerText = 'Misafir Kullanıcı';
      goalEl.innerText = 'Hedef Belirlenmedi';
      avatarEl.innerText = 'U';
    }

    // Refresh active tab if user is interacting with it
    if (state.onboardingComplete) {
      this.renderActiveTab();
    }
  }

  translateGoal(goal) {
    const mapping = {
      lose_fat: 'Yağ Yakımı',
      build_muscle: 'Kas Yapma',
      get_fit: 'Fit Görünmek',
      body_recomp: 'Kas Yapıp Yağ Yakma',
      build_strength: 'Güçlenme',
      endurance: 'Dayanıklılık'
    };
    return mapping[goal] || goal;
  }
}

// Instantiate and start
document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
});
