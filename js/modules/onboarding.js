import { store } from '../store.js';
import { workoutEngine } from './workout.js';
import { nutritionEngine } from './nutrition.js';

class Onboarding {
  constructor() {
    this.currentStep = 1;
    this.totalSteps = 4;
    this.formData = {
      name: '',
      age: 25,
      gender: 'male',
      height: 175,
      weight: 70,
      activityLevel: 'moderate', // sedentary, light, moderate, active, very_active
      lifestyle: 'desk', // desk, active
      waist: '',
      chest: '',
      hips: '',
      arms: '',
      legs: '',
      bodyFat: '',
      goal: 'lose_fat', // lose_fat, build_muscle, get_fit, body_recomp, build_strength, endurance
      targetPhysique: 'fit', // athletic, lean, bulk, fit, bodybuilder, v_shape, custom
      customPhysique: '',
      experienceLevel: 'beginner', // beginner, intermediate, advanced
      environment: 'gym', // home, gym
      equipments: []
    };
  }

  init() {
    const state = store.getState();
    if (!state.onboardingComplete) {
      this.render();
    }
  }

  render() {
    // Prevent duplicate render
    if (document.getElementById('onboarding-wizard')) return;

    const overlay = document.createElement('div');
    overlay.id = 'onboarding-wizard';
    overlay.className = 'onboarding-overlay';
    overlay.innerHTML = `
      <div class="onboarding-box glass-card">
        <div class="onboarding-progress" id="onboarding-progress-indicator">
          ${Array.from({ length: this.totalSteps }, (_, i) => `
            <div class="progress-step-indicator ${i === 0 ? 'active' : ''}" data-step="${i + 1}">${i + 1}</div>
          `).join('')}
        </div>

        <form id="onboarding-form">
          <!-- STEP 1: Temel Bilgiler -->
          <div class="onboarding-step active" data-step="1">
            <h2 class="onboarding-title">Kişisel Bilgileriniz</h2>
            <p class="page-subtitle">Sizi daha iyi tanıyabilmemiz için temel fiziksel bilgilerinizi girin.</p>
            
            <div class="form-group" style="margin-top: 10px;">
              <label for="ob-name">Adınız Soyadınız</label>
              <input type="text" id="ob-name" name="name" required placeholder="Örn. Ahmet Yılmaz">
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="ob-age">Yaş</label>
                <input type="number" id="ob-age" name="age" min="12" max="100" value="25" required>
              </div>
              <div class="form-group">
                <label for="ob-gender">Cinsiyet</label>
                <select id="ob-gender" name="gender" required>
                  <option value="male">Erkek</option>
                  <option value="female">Kadın</option>
                  <option value="other">Belirtmek İstemiyorum</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="ob-height">Boy (cm)</label>
                <input type="number" id="ob-height" name="height" min="100" max="250" value="175" required>
              </div>
              <div class="form-group">
                <label for="ob-weight">Kilo (kg)</label>
                <input type="number" id="ob-weight" name="weight" min="30" max="250" value="70" required>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="ob-activity">Aktivite Seviyesi</label>
                <select id="ob-activity" name="activityLevel" required>
                  <option value="sedentary">Hareketsiz (Masa başı iş, az egzersiz)</option>
                  <option value="light">Hafif Aktif (Haftada 1-3 gün hafif egzersiz)</option>
                  <option value="moderate" selected>Orta Aktif (Haftada 3-5 gün spor)</option>
                  <option value="active">Çok Aktif (Haftada 6-7 gün yoğun spor)</option>
                  <option value="very_active">Profesyonel / Ağır İş (Günde çift antrenman veya ağır fiziksel iş)</option>
                </select>
              </div>
              <div class="form-group">
                <label for="ob-lifestyle">Günlük Yaşam Tipi</label>
                <select id="ob-lifestyle" name="lifestyle" required>
                  <option value="desk">Masa Başı / Hareketsiz</option>
                  <option value="active">Ayakta / Hareketli</option>
                </select>
              </div>
            </div>
          </div>

          <!-- STEP 2: Vücut Ölçüleri -->
          <div class="onboarding-step" data-step="2">
            <h2 class="onboarding-title">Vücut Ölçüleri</h2>
            <p class="page-subtitle">Ölçümleri girmek gelişim takibi ve doğru planlama için önemlidir (Opsiyonel).</p>
            
            <div class="form-row" style="margin-top: 10px;">
              <div class="form-group">
                <label for="ob-waist">Bel Çevresi (cm)</label>
                <input type="number" id="ob-waist" name="waist" placeholder="Opsiyonel">
              </div>
              <div class="form-group">
                <label for="ob-chest">Göğüs Çevresi (cm)</label>
                <input type="number" id="ob-chest" name="chest" placeholder="Opsiyonel">
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="ob-hips">Kalça Çevresi (cm)</label>
                <input type="number" id="ob-hips" name="hips" placeholder="Opsiyonel">
              </div>
              <div class="form-group">
                <label for="ob-arms">Kol Çevresi (cm)</label>
                <input type="number" id="ob-arms" name="arms" placeholder="Opsiyonel">
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="ob-legs">Bacak Çevresi (cm)</label>
                <input type="number" id="ob-legs" name="legs" placeholder="Opsiyonel">
              </div>
              <div class="form-group">
                <label for="ob-bodyfat">Yağ Oranı (%)</label>
                <input type="number" id="ob-bodyfat" name="bodyFat" placeholder="Opsiyonel" min="3" max="60">
              </div>
            </div>
          </div>

          <!-- STEP 3: Hedef & Fizik -->
          <div class="onboarding-step" data-step="3">
            <h2 class="onboarding-title">Hedef Seçimi</h2>
            <p class="page-subtitle">Planınızı şekillendirecek ana hedefinizi ve hayalinizdeki fiziği seçin.</p>
            
            <div class="form-group" style="margin-top: 10px;">
              <label>Ana Hedefiniz</label>
              <div class="grid-options" id="ob-goal-grid">
                <div class="grid-option-card selected" data-value="lose_fat">
                  <i class="fas fa-fire"></i>
                  <span>Yağ Yakımı</span>
                </div>
                <div class="grid-option-card" data-value="build_muscle">
                  <i class="fas fa-dumbbell"></i>
                  <span>Kas Yapma</span>
                </div>
                <div class="grid-option-card" data-value="get_fit">
                  <i class="fas fa-heartbeat"></i>
                  <span>Fit Görünmek</span>
                </div>
                <div class="grid-option-card" data-value="body_recomp">
                  <i class="fas fa-sync"></i>
                  <span>Yağ Yak, Kas Koru</span>
                </div>
                <div class="grid-option-card" data-value="build_strength">
                  <i class="fas fa-weight-hanging"></i>
                  <span>Güç Kazanma</span>
                </div>
                <div class="grid-option-card" data-value="endurance">
                  <i class="fas fa-running"></i>
                  <span>Dayanıklılık</span>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label>Hedeflediğin Fizik Nasıl Olsun?</label>
              <div class="grid-options" id="ob-physique-grid">
                <div class="grid-option-card selected" data-value="fit">
                  <i class="fas fa-child"></i>
                  <span>Fit</span>
                </div>
                <div class="grid-option-card" data-value="athletic">
                  <i class="fas fa-skating"></i>
                  <span>Athletic</span>
                </div>
                <div class="grid-option-card" data-value="lean">
                  <i class="fas fa-compress-arrows-alt"></i>
                  <span>Lean</span>
                </div>
                <div class="grid-option-card" data-value="bulk">
                  <i class="fas fa-compress-alt"></i>
                  <span>Bulk</span>
                </div>
                <div class="grid-option-card" data-value="bodybuilder">
                  <i class="fas fa-user-shield"></i>
                  <span>Bodybuilder</span>
                </div>
                <div class="grid-option-card" data-value="v_shape">
                  <i class="fas fa-vector-square"></i>
                  <span>V-Shape</span>
                </div>
                <div class="grid-option-card" data-value="custom">
                  <i class="fas fa-pen"></i>
                  <span>Özel</span>
                </div>
              </div>
            </div>

            <div class="form-group" id="custom-physique-container" style="display: none;">
              <label for="ob-custom-physique">Fizik Hedefinizi Açıklayın</label>
              <textarea id="ob-custom-physique" name="customPhysique" placeholder="Hayalinizdeki fiziği kısaca tarif edin..."></textarea>
            </div>

            <div class="form-group" style="margin-top: 10px;">
              <label>Spor Deneyim Seviyeniz</label>
              <div class="grid-options" id="ob-level-grid">
                <div class="grid-option-card selected" data-value="beginner">
                  <i class="fas fa-seedling"></i>
                  <span>Başlangıç</span>
                </div>
                <div class="grid-option-card" data-value="intermediate">
                  <i class="fas fa-medal"></i>
                  <span>Orta Seviye</span>
                </div>
                <div class="grid-option-card" data-value="advanced">
                  <i class="fas fa-crown"></i>
                  <span>İleri Seviye</span>
                </div>
              </div>
            </div>
          </div>

          <!-- STEP 4: Çalışma Ortamı & Ekipmanlar -->
          <div class="onboarding-step" data-step="4">
            <h2 class="onboarding-title">Çalışma Ortamı & Ekipmanlar</h2>
            <p class="page-subtitle">Egzersizlerinizi nerede yapacaksınız ve hangi ekipmanlara erişiminiz var?</p>
            
            <div class="form-group" style="margin-top: 10px;">
              <label>Çalışma Ortamı</label>
              <div class="grid-options" id="ob-env-grid">
                <div class="grid-option-card" data-value="home">
                  <i class="fas fa-home"></i>
                  <span>Ev</span>
                </div>
                <div class="grid-option-card selected" data-value="gym">
                  <i class="fas fa-building"></i>
                  <span>Spor Salonu</span>
                </div>
              </div>
            </div>

            <div class="form-group" id="equipment-selection-container" style="display: none;">
              <label>Mevcut Ekipmanlarınız (Ev İçin)</label>
              <div class="checkbox-options" id="ob-equipment-checkboxes">
                <div class="checkbox-option-card" data-value="dumbbell">
                  <input type="checkbox" id="eq-dumbbell">
                  <label for="eq-dumbbell">Dumbbell</label>
                </div>
                <div class="checkbox-option-card" data-value="band">
                  <input type="checkbox" id="eq-band">
                  <label for="eq-band">Direnç Bandı</label>
                </div>
                <div class="checkbox-option-card" data-value="bench">
                  <input type="checkbox" id="eq-bench">
                  <label for="eq-bench">Bench</label>
                </div>
                <div class="checkbox-option-card" data-value="pullup_bar">
                  <input type="checkbox" id="eq-pullup">
                  <label for="eq-pullup">Barfiks Barı</label>
                </div>
                <div class="checkbox-option-card" data-value="kettlebell">
                  <input type="checkbox" id="eq-kettlebell">
                  <label for="eq-kettlebell">Kettlebell</label>
                </div>
                <div class="checkbox-option-card" data-value="barbell">
                  <input type="checkbox" id="eq-barbell">
                  <label for="eq-barbell">Halter Barı (Barbell)</label>
                </div>
                <div class="checkbox-option-card" data-value="plates">
                  <input type="checkbox" id="eq-plates">
                  <label for="eq-plates">Ağırlık Plakaları</label>
                </div>
                <div class="checkbox-option-card" data-value="treadmill">
                  <input type="checkbox" id="eq-treadmill">
                  <label for="eq-treadmill">Koşu Bandı</label>
                </div>
                <div class="checkbox-option-card" data-value="mat">
                  <input type="checkbox" id="eq-mat">
                  <label for="eq-mat">Egzersiz Matı</label>
                </div>
                <div class="checkbox-option-card" data-value="none">
                  <input type="checkbox" id="eq-none">
                  <label for="eq-none">Hiç Ekipman Yok</label>
                </div>
              </div>
            </div>

          </div>

          <!-- Navigation Buttons -->
          <div style="display: flex; justify-content: space-between; margin-top: 30px;">
            <button type="button" class="btn btn-secondary" id="ob-btn-prev" style="visibility: hidden;">Geri</button>
            <button type="button" class="btn btn-primary" id="ob-btn-next">İleri</button>
          </div>
        </form>
      </div>
    `;

    document.body.appendChild(overlay);
    this.bindEvents(overlay);
  }

  bindEvents(overlay) {
    const prevBtn = overlay.querySelector('#ob-btn-prev');
    const nextBtn = overlay.querySelector('#ob-btn-next');
    const steps = overlay.querySelectorAll('.onboarding-step');
    const progressIndicators = overlay.querySelectorAll('.progress-step-indicator');
    
    // Step 3 Goal Card click handler
    const goalCards = overlay.querySelectorAll('#ob-goal-grid .grid-option-card');
    goalCards.forEach(card => {
      card.addEventListener('click', () => {
        goalCards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        this.formData.goal = card.dataset.value;
      });
    });

    // Step 3 Physique Card click handler
    const physiqueCards = overlay.querySelectorAll('#ob-physique-grid .grid-option-card');
    const customPhysiqueContainer = overlay.querySelector('#custom-physique-container');
    physiqueCards.forEach(card => {
      card.addEventListener('click', () => {
        physiqueCards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        const val = card.dataset.value;
        this.formData.targetPhysique = val;
        if (val === 'custom') {
          customPhysiqueContainer.style.display = 'flex';
        } else {
          customPhysiqueContainer.style.display = 'none';
        }
      });
    });

    // Step 3 Level Card click handler
    const levelCards = overlay.querySelectorAll('#ob-level-grid .grid-option-card');
    levelCards.forEach(card => {
      card.addEventListener('click', () => {
        levelCards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        this.formData.experienceLevel = card.dataset.value;
      });
    });

    // Step 4 Workspace click handler
    const envCards = overlay.querySelectorAll('#ob-env-grid .grid-option-card');
    const eqContainer = overlay.querySelector('#equipment-selection-container');
    envCards.forEach(card => {
      card.addEventListener('click', () => {
        envCards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        const val = card.dataset.value;
        this.formData.environment = val;
        if (val === 'home') {
          eqContainer.style.display = 'flex';
        } else {
          eqContainer.style.display = 'none';
        }
      });
    });

    // Step 4 Equipments checkboxes
    const eqCards = overlay.querySelectorAll('#ob-equipment-checkboxes .checkbox-option-card');
    eqCards.forEach(card => {
      const checkbox = card.querySelector('input[type="checkbox"]');
      
      card.addEventListener('click', (e) => {
        if (e.target !== checkbox) {
          checkbox.checked = !checkbox.checked;
        }
        
        const isNone = card.dataset.value === 'none';
        
        if (checkbox.checked) {
          card.classList.add('selected');
          if (isNone) {
            // Uncheck all other options
            eqCards.forEach(c => {
              if (c !== card) {
                c.classList.remove('selected');
                c.querySelector('input[type="checkbox"]').checked = false;
              }
            });
          } else {
            // Uncheck 'none' option
            const noneCard = overlay.querySelector('.checkbox-option-card[data-value="none"]');
            noneCard.classList.remove('selected');
            noneCard.querySelector('input[type="checkbox"]').checked = false;
          }
        } else {
          card.classList.remove('selected');
        }
      });
    });

    // Next & Prev button clicks
    prevBtn.addEventListener('click', () => this.goToStep(this.currentStep - 1, steps, progressIndicators, prevBtn, nextBtn));
    nextBtn.addEventListener('click', () => {
      if (this.currentStep === this.totalSteps) {
        this.handleSubmit(overlay);
      } else {
        if (this.validateStep(this.currentStep)) {
          this.goToStep(this.currentStep + 1, steps, progressIndicators, prevBtn, nextBtn);
        }
      }
    });
  }

  validateStep(step) {
    if (step === 1) {
      const nameInput = document.getElementById('ob-name');
      const ageInput = document.getElementById('ob-age');
      const heightInput = document.getElementById('ob-height');
      const weightInput = document.getElementById('ob-weight');
      
      if (!nameInput.value.trim()) {
        alert('Lütfen adınızı giriniz.');
        return false;
      }
      if (!ageInput.value || ageInput.value < 12) {
        alert('Lütfen geçerli bir yaş giriniz (En az 12).');
        return false;
      }
      if (!heightInput.value || heightInput.value < 100) {
        alert('Lütfen geçerli bir boy giriniz (En az 100 cm).');
        return false;
      }
      if (!weightInput.value || weightInput.value < 30) {
        alert('Lütfen geçerli bir kilo giriniz (En az 30 kg).');
        return false;
      }
    }
    return true;
  }

  goToStep(stepNum, steps, progressIndicators, prevBtn, nextBtn) {
    // Hide active step
    steps[this.currentStep - 1].classList.remove('active');
    progressIndicators[this.currentStep - 1].classList.remove('active');
    if (this.currentStep < stepNum) {
      progressIndicators[this.currentStep - 1].classList.add('completed');
    } else {
      progressIndicators[stepNum - 1].classList.remove('completed');
    }

    this.currentStep = stepNum;
    
    // Show new step
    steps[this.currentStep - 1].classList.add('active');
    progressIndicators[this.currentStep - 1].classList.add('active');

    // Manage buttons
    prevBtn.style.visibility = this.currentStep === 1 ? 'hidden' : 'visible';
    nextBtn.innerText = this.currentStep === this.totalSteps ? 'Tamamla' : 'İleri';
  }

  handleSubmit(overlay) {
    // Gather form inputs
    this.formData.name = document.getElementById('ob-name').value.trim();
    this.formData.age = parseInt(document.getElementById('ob-age').value);
    this.formData.gender = document.getElementById('ob-gender').value;
    this.formData.height = parseInt(document.getElementById('ob-height').value);
    this.formData.weight = parseFloat(document.getElementById('ob-weight').value);
    this.formData.activityLevel = document.getElementById('ob-activity').value;
    this.formData.lifestyle = document.getElementById('ob-lifestyle').value;
    
    // Optional measurements
    const waistVal = document.getElementById('ob-waist').value;
    const chestVal = document.getElementById('ob-chest').value;
    const hipsVal = document.getElementById('ob-hips').value;
    const armsVal = document.getElementById('ob-arms').value;
    const legsVal = document.getElementById('ob-legs').value;
    const fatVal = document.getElementById('ob-bodyfat').value;

    this.formData.waist = waistVal ? parseFloat(waistVal) : null;
    this.formData.chest = chestVal ? parseFloat(chestVal) : null;
    this.formData.hips = hipsVal ? parseFloat(hipsVal) : null;
    this.formData.arms = armsVal ? parseFloat(armsVal) : null;
    this.formData.legs = legsVal ? parseFloat(legsVal) : null;
    this.formData.bodyFat = fatVal ? parseFloat(fatVal) : null;
    
    if (this.formData.targetPhysique === 'custom') {
      this.formData.customPhysique = document.getElementById('ob-custom-physique').value.trim();
    }

    // Equipments
    const equipments = [];
    if (this.formData.environment === 'home') {
      const eqCards = overlay.querySelectorAll('#ob-equipment-checkboxes .checkbox-option-card.selected');
      eqCards.forEach(c => {
        if (c.dataset.value !== 'none') {
          equipments.push(c.dataset.value);
        }
      });
    } else {
      // In gym, assume full equipment
      equipments.push('dumbbell', 'bench', 'pullup_bar', 'barbell', 'cables', 'machines', 'mat');
    }
    this.formData.equipments = equipments;

    // Save to Store
    store.setUser({
      name: this.formData.name,
      age: this.formData.age,
      gender: this.formData.gender,
      height: this.formData.height,
      weight: this.formData.weight,
      goal: this.formData.goal,
      targetPhysique: this.formData.targetPhysique,
      customPhysique: this.formData.customPhysique,
      experienceLevel: this.formData.experienceLevel,
      activityLevel: this.formData.activityLevel,
      lifestyle: this.formData.lifestyle,
      workoutEnvironment: this.formData.environment
    });
    
    store.setEquipments(equipments);

    // Initial measurement log
    store.addMeasurement({
      weight: this.formData.weight,
      waist: this.formData.waist,
      chest: this.formData.chest,
      hips: this.formData.hips,
      arms: this.formData.arms,
      legs: this.formData.legs,
      bodyFat: this.formData.bodyFat
    });

    // Generate workout and nutrition plan dynamically
    const plan = workoutEngine.generatePlan(this.formData);
    store.setWorkoutPlan(plan);

    const nutrition = nutritionEngine.calculatePlan(this.formData);
    store.setNutritionTargets(nutrition.calories, nutrition.protein, nutrition.carbs, nutrition.fats);
    
    // Mark Onboarding Complete
    store.completeOnboarding();

    // Close Modal
    overlay.remove();
  }
}

export const onboarding = new Onboarding();
