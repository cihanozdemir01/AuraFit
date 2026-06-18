import { store } from '../store.js';

const LOCAL_FOODS_DB = [
  { name: 'Tavuk Göğsü (Izgara)', calories: 165, protein: 31, carbs: 0, fats: 3.6 },
  { name: 'Dana Bonfile (Izgara)', calories: 150, protein: 26, carbs: 0, fats: 5 },
  { name: 'Yumurta (Haşlanmış)', calories: 155, protein: 13, carbs: 1.1, fats: 11 },
  { name: 'Yulaf Ezmesi', calories: 389, protein: 16.9, carbs: 66, fats: 6.9 },
  { name: 'Muz', calories: 89, protein: 1.1, carbs: 23, fats: 0.3 },
  { name: 'Elma', calories: 52, protein: 0.3, carbs: 14, fats: 0.2 },
  { name: 'Pirinç Pilavı (Pişmiş)', calories: 130, protein: 2.7, carbs: 28, fats: 0.3 },
  { name: 'Bulgur Pilavı (Pişmiş)', calories: 121, protein: 3.1, carbs: 26, fats: 0.6 },
  { name: 'Süzme Yoğurt', calories: 97, protein: 9, carbs: 4, fats: 5 },
  { name: 'Lor Peyniri', calories: 90, protein: 13, carbs: 3, fats: 2.2 },
  { name: 'Fıstık Ezmesi', calories: 588, protein: 25, carbs: 20, fats: 50 },
  { name: 'Badem (Çiğ)', calories: 579, protein: 21, carbs: 22, fats: 49 },
  { name: 'Ceviz', calories: 654, protein: 15, carbs: 14, fats: 65 },
  { name: 'Somon Fırın', calories: 206, protein: 22, carbs: 0, fats: 13 },
  { name: 'Hindi Göğsü (Izgara)', calories: 135, protein: 30, carbs: 0, fats: 1 },
  { name: 'Beyaz Peynir', calories: 260, protein: 14, carbs: 2.5, fats: 21 },
  { name: 'Tam Buğday Ekmeği (1 dilim)', calories: 70, protein: 3, carbs: 13, fats: 1 }
];


class NutritionEngine {
  constructor() {
    this.mealDatabase = {
      lose_fat: {
        breakfast: { name: 'Yulaf Kasesi & Yumurta', foods: '40g yulaf, 150ml yarım yağlı süt, 3 adet haşlanmış yumurta beyazı, 1 tam yumurta, 10-12 çiğ badem.' },
        lunch: { name: 'Izgara Tavuklu Kinoa Salata', foods: '150g ızgara tavuk göğsü, 50g haşlanmış kinoa, bol yeşillik, 1 tatlı kaşığı zeytinyağı, limon.' },
        dinner: { name: 'Fırın Somon & Kuşkonmaz', foods: '150g fırınlanmış somon fileto, buharda pişmiş kuşkonmaz veya brokoli, 100g fırın patates.' },
        snack: { name: 'Lor Peynirli Galeta & Yeşil Çay', foods: '100g yağsız lor peyniri, 2 adet karabuğday galetası, 1 fincan yeşil çay.' }
      },
      build_muscle: {
        breakfast: { name: 'Sporcu Omleti & Fıstık Ezmesi', foods: '4 adet yumurta (2 sarısı, 4 beyazı), 2 dilim tam buğday ekmeği, 1 muz, 2 tatlı kaşığı şekersiz fıstık ezmesi.' },
        lunch: { name: 'Dana Bonfile & Pirinç Pilavı', foods: '180g dana bonfile veya biftek, 150g (pişmiş) pirinç pilavı, 1 porsiyon buharda sebze.' },
        dinner: { name: 'Tavuk Sote & Fırın Patates', foods: '200g tavuk göğsü (sote), 200g fırınlanmış patates püre veya dilim, 1 kase yoğurt.' },
        snack: { name: 'Whey shake & Çiğ Kuruyemiş', foods: '1 ölçek whey protein, 300ml süt, 1 avuç karışık kuruyemiş (ceviz, badem, fındık).' }
      },
      get_fit: {
        breakfast: { name: 'Çırpılmış Yumurtalı Avokado Tost', foods: '2 adet yumurta, yarım avokado (ezilmiş), 2 dilim çavdar ekmeği, beyaz peynir.' },
        lunch: { name: 'Izgara Hindi & Karabuğday', foods: '150g ızgara hindi göğsü, 100g haşlanmış karabuğday, zeytinyağlı mevsim salata.' },
        dinner: { name: 'Zeytinyağlı Sebze & Tavuk', foods: '1 kase zeytinyağlı taze fasulye veya kabak yemeği, 150g ızgara tavuk, 1 kase cacık.' },
        snack: { name: 'Meyveli Süzme Yoğurt', foods: '150g süzme yoğurt, 1 avuç yaban mersini veya çilek, 1 tatlı kaşığı chia tohumu.' }
      }
    };
  }

  // BMR + TDEE Math
  calculatePlan(userParams) {
    const { gender, age, height, weight, activityLevel, goal } = userParams;

    // 1. Basal Metabolic Rate (BMR) - Mifflin-St Jeor
    let bmr = 0;
    if (gender === 'male') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else if (gender === 'female') {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    } else {
      // Average for neutral/other
      bmr = 10 * weight + 6.25 * height - 5 * age - 78;
    }

    // 2. TDEE Multipliers
    const multipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9
    };
    const factor = multipliers[activityLevel] || 1.55;
    const tdee = Math.round(bmr * factor);

    // 3. Goal Deficit/Surplus adjustment
    let targetCalories = tdee;
    let proteinFactor = 1.8; // default protein g per kg

    if (goal === 'lose_fat') {
      targetCalories = tdee - 500; // Deficit
      proteinFactor = 1.8; // 1.6-2.2 range
    } else if (goal === 'build_muscle' || goal === 'build_strength') {
      targetCalories = tdee + 300; // Surplus
      proteinFactor = 2.0; // High protein for muscle
    } else if (goal === 'body_recomp') {
      targetCalories = tdee - 200; // Slight deficit
      proteinFactor = 2.0;
    } else {
      // get_fit, endurance
      targetCalories = tdee;
      proteinFactor = 1.6;
    }

    // Ensure minimum calories safety
    const minCalories = gender === 'female' ? 1200 : 1500;
    targetCalories = Math.max(minCalories, targetCalories);

    // 4. Macro Allocation
    // Protein: 4 kcal per gram
    const proteinTarget = Math.round(weight * proteinFactor);
    const proteinCalories = proteinTarget * 4;

    // Fats: 9 kcal per gram (around 25% of calories)
    const fatsTarget = Math.round((targetCalories * 0.25) / 9);
    const fatsCalories = fatsTarget * 9;

    // Carbs: Remaining calories (4 kcal per gram)
    const remainingCalories = targetCalories - proteinCalories - fatsCalories;
    const carbsTarget = Math.max(0, Math.round(remainingCalories / 4));

    return {
      calories: targetCalories,
      protein: proteinTarget,
      carbs: carbsTarget,
      fats: fatsTarget
    };
  }

  getSuggestedMeals(goal) {
    // Map goals to db keys
    let key = 'get_fit';
    if (goal === 'lose_fat' || goal === 'endurance') key = 'lose_fat';
    else if (goal === 'build_muscle' || goal === 'build_strength') key = 'build_muscle';
    
    return this.mealDatabase[key];
  }

  renderNutritionTab(container) {
    const state = store.getState();
    const nutrition = state.nutrition;
    const user = state.user;

    if (!nutrition || !user) {
      container.innerHTML = `
        <div class="glass-card text-center" style="padding: 60px 20px;">
          <i class="fas fa-apple-alt" style="font-size: 50px; color: var(--accent-orange); margin-bottom: 20px;"></i>
          <h2>Beslenme Planınız Hazırlanmadı</h2>
          <p class="text-secondary" style="margin: 10px 0 20px;">Lütfen onboarding sürecini tamamlayın.</p>
        </div>
      `;
      return;
    }

    // Macro percentages
    const currentWeight = user.weight;
    
    // Estimate water target (35ml per kg of weight)
    const computedWaterTarget = Math.round(currentWeight * 35);
    const waterGoal = nutrition.waterTarget || computedWaterTarget;
    const waterPerc = Math.min(100, Math.round((nutrition.waterIntake / waterGoal) * 100));

    // Get suggested meals
    const meals = this.getSuggestedMeals(user.goal);

    // Compute macro progress percentages
    const proteinPerc = Math.min(100, Math.round(((nutrition.proteinIntake || 0) / nutrition.proteinTarget) * 100)) || 0;
    const carbsPerc = Math.min(100, Math.round(((nutrition.carbsIntake || 0) / nutrition.carbsTarget) * 100)) || 0;
    const fatsPerc = Math.min(100, Math.round(((nutrition.fatsIntake || 0) / nutrition.fatsTarget) * 100)) || 0;

    const completedMeals = nutrition.completedMeals || [];
    const isBreakfastChecked = completedMeals.includes('breakfast');
    const isLunchChecked = completedMeals.includes('lunch');
    const isDinnerChecked = completedMeals.includes('dinner');
    const isSnackChecked = completedMeals.includes('snack');

    container.innerHTML = `
      <div class="page-header">
        <div>
          <h1 class="page-title">Beslenme & Su Takibi</h1>
          <p class="page-subtitle">Vücudunuzu besleyin ve hedefinize ulaşın.</p>
        </div>
      </div>

      <div class="nutrition-grid">
        <!-- Calorie & Macro Target Card -->
        <div style="display: flex; flex-direction: column; gap: 24px;">
          <div class="glass-card">
            <h2 style="font-family: var(--font-display); font-size: 20px; margin-bottom: 16px;">Bugünkü Hedef Makrolar</h2>
            
            <div class="nutrition-target-header">
              <div>
                <span class="nutrition-calories-num">${nutrition.caloriesIntake || 0}</span>
                <span class="text-secondary" style="font-size: 14px;"> / ${nutrition.caloriesTarget} kcal Alındı</span>
              </div>
              <div class="text-secondary nutrition-target-details">
                Bazal Metabolizma: ${Math.round(nutrition.caloriesTarget * 0.8)} kcal<br>
                TDEE Hedef Tipi: ${this.translateGoal(user.goal)}
              </div>
            </div>

            <div class="nutrition-bars">
              <div class="macro-bar-item">
                <div class="macro-bar-label">
                  <span>Protein <small class="text-secondary">(Hedef: ${nutrition.proteinTarget}g)</small></span>
                  <strong>${nutrition.proteinIntake || 0}g <span class="text-secondary">(${proteinPerc}%)</span></strong>
                </div>
                <div class="macro-bar-bg">
                  <div class="macro-bar-fill protein" style="width: ${proteinPerc}%;"></div>
                </div>
              </div>
              
              <div class="macro-bar-item">
                <div class="macro-bar-label">
                  <span>Karbonhidrat <small class="text-secondary">(Hedef: ${nutrition.carbsTarget}g)</small></span>
                  <strong>${nutrition.carbsIntake || 0}g <span class="text-secondary">(${carbsPerc}%)</span></strong>
                </div>
                <div class="macro-bar-bg">
                  <div class="macro-bar-fill carbs" style="width: ${carbsPerc}%;"></div>
                </div>
              </div>

              <div class="macro-bar-item">
                <div class="macro-bar-label">
                  <span>Yağ <small class="text-secondary">(Hedef: ${nutrition.fatsTarget}g)</small></span>
                  <strong>${nutrition.fatsIntake || 0}g <span class="text-secondary">(${fatsPerc}%)</span></strong>
                </div>
                <div class="macro-bar-bg">
                  <div class="macro-bar-fill fats" style="width: ${fatsPerc}%;"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Suggested Meal Plan Card -->
          <div class="glass-card">
            <h2 style="font-family: var(--font-display); font-size: 20px;">Örnek Günlük Yemek Planı</h2>
            <p class="text-secondary" style="font-size: 12px; margin-top: 2px;">Hedef makrolarınıza özel hazırlanan dengeli öğünler.</p>
            
            <div class="meal-list">
              <div class="meal-item" style="align-items: center;">
                <div class="check-btn ${isBreakfastChecked ? 'checked' : ''}" data-meal="breakfast" style="margin-right: 12px; flex-shrink: 0;">
                  <i class="fas fa-check"></i>
                </div>
                <div class="meal-icon-box"><i class="fas fa-coffee"></i></div>
                <div class="meal-content">
                  <div class="meal-name">Kahvaltı <small class="text-secondary">(${Math.round(nutrition.caloriesTarget * 0.3)} kcal)</small></div>
                  <div class="meal-foods">${meals.breakfast.name} : ${meals.breakfast.foods}</div>
                </div>
              </div>
              <div class="meal-item" style="align-items: center;">
                <div class="check-btn ${isLunchChecked ? 'checked' : ''}" data-meal="lunch" style="margin-right: 12px; flex-shrink: 0;">
                  <i class="fas fa-check"></i>
                </div>
                <div class="meal-icon-box"><i class="fas fa-utensils"></i></div>
                <div class="meal-content">
                  <div class="meal-name">Öğle Yemeği <small class="text-secondary">(${Math.round(nutrition.caloriesTarget * 0.35)} kcal)</small></div>
                  <div class="meal-foods">${meals.lunch.name} : ${meals.lunch.foods}</div>
                </div>
              </div>
              <div class="meal-item" style="align-items: center;">
                <div class="check-btn ${isDinnerChecked ? 'checked' : ''}" data-meal="dinner" style="margin-right: 12px; flex-shrink: 0;">
                  <i class="fas fa-check"></i>
                </div>
                <div class="meal-icon-box"><i class="fas fa-cloud-sun"></i></div>
                <div class="meal-content">
                  <div class="meal-name">Akşam Yemeği <small class="text-secondary">(${Math.round(nutrition.caloriesTarget * 0.25)} kcal)</small></div>
                  <div class="meal-foods">${meals.dinner.name} : ${meals.dinner.foods}</div>
                </div>
              </div>
              <div class="meal-item" style="align-items: center;">
                <div class="check-btn ${isSnackChecked ? 'checked' : ''}" data-meal="snack" style="margin-right: 12px; flex-shrink: 0;">
                  <i class="fas fa-check"></i>
                </div>
                <div class="meal-icon-box"><i class="fas fa-cookie-bite"></i></div>
                <div class="meal-content">
                  <div class="meal-name">Ara Öğün <small class="text-secondary">(${Math.round(nutrition.caloriesTarget * 0.1)} kcal)</small></div>
                  <div class="meal-foods">${meals.snack.name} : ${meals.snack.foods}</div>
                </div>
              </div>
            </div>
            <button class="btn btn-primary" id="save-nutrition-btn" style="width: 100%; margin-top: 20px;">
              <i class="fas fa-save"></i> Günlük Öğünleri Kaydet
            </button>
          </div>

          <!-- Extra Foods Logging Card -->
          <div class="glass-card" style="margin-top: 24px;">
            <h2 style="font-family: var(--font-display); font-size: 20px; margin-bottom: 8px;">Ekstra Tüketilen Besinler</h2>
            <p class="text-secondary" style="font-size: 12px; margin-bottom: 16px;">Tükettiğiniz ekstra yiyecekleri kütüphaneden aratarak veya elle girerek listenize ekleyin.</p>
            
            <form id="extra-food-form" style="display: flex; flex-direction: column; gap: 14px; margin-bottom: 20px;">
              <div class="extra-food-row">
                <div class="form-group">
                  <label for="extra-food-name">Yiyecek Adı</label>
                  <input type="text" id="extra-food-name" list="foods-datalist" placeholder="Arayın... Örn: Muz" required style="font-size: 14px;">
                  <datalist id="foods-datalist">
                    ${LOCAL_FOODS_DB.map(f => `<option value="${f.name}"></option>`).join('')}
                  </datalist>
                </div>
                <div class="form-group">
                  <label for="extra-food-weight">Miktar (gr)</label>
                  <input type="number" id="extra-food-weight" value="100" min="1" required style="font-size: 14px;">
                </div>
              </div>

              <!-- Manual toggle -->
              <div style="display: flex; align-items: center; gap: 8px;">
                <input type="checkbox" id="extra-food-manual-toggle" style="width: 16px; height: 16px; accent-color: var(--accent-orange); cursor: pointer;">
                <label for="extra-food-manual-toggle" style="cursor: pointer; font-size: 12px; user-select: none;">Değerleri Kendim Gireceğim</label>
              </div>

              <!-- Manual inputs (hidden by default) -->
              <div id="extra-food-manual-fields" class="manual-macro-row" style="display: none;">
                <div class="form-group">
                  <label style="font-size: 11px;">Kalori (kcal)</label>
                  <input type="number" id="manual-calories" placeholder="0" min="0" style="padding: 8px 10px; font-size: 13px;">
                </div>
                <div class="form-group">
                  <label style="font-size: 11px;">Prot (g)</label>
                  <input type="number" id="manual-protein" placeholder="0" min="0" style="padding: 8px 10px; font-size: 13px;">
                </div>
                <div class="form-group">
                  <label style="font-size: 11px;">Karb (g)</label>
                  <input type="number" id="manual-carbs" placeholder="0" min="0" style="padding: 8px 10px; font-size: 13px;">
                </div>
                <div class="form-group">
                  <label style="font-size: 11px;">Yağ (g)</label>
                  <input type="number" id="manual-fats" placeholder="0" min="0" style="padding: 8px 10px; font-size: 13px;">
                </div>
              </div>

              <button type="submit" class="btn btn-primary" style="align-self: flex-end; padding: 10px 20px; font-size: 13px;">
                <i class="fas fa-plus-circle"></i> Ekle
              </button>
            </form>

            <!-- Extra Food Log List -->
            <div id="extra-foods-log-container" style="border-top: 1px solid var(--border-color); padding-top: 16px;">
              <h3 style="font-size: 14px; font-weight: 600; margin-bottom: 12px;">Bugün Eklenenler</h3>
              ${nutrition.extraFoodsLog && nutrition.extraFoodsLog.length > 0 ? `
                <div style="display: flex; flex-direction: column; gap: 10px;">
                  ${nutrition.extraFoodsLog.map(food => `
                    <div class="meal-item" style="display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; border-radius: 10px; background-color: rgba(255,255,255,0.01);">
                      <div style="display: flex; align-items: center; gap: 12px;">
                        <div class="meal-icon-box" style="width: 32px; height: 32px; border-radius: 8px; background-color: rgba(255, 109, 0, 0.05); font-size: 14px;"><i class="fas fa-seedling"></i></div>
                        <div>
                          <div style="font-size: 14px; font-weight: 600;">${food.name} <small class="text-secondary">(${food.weight}g)</small></div>
                          <div style="font-size: 11px; color: var(--text-secondary); margin-top: 2px;">
                            ${food.calories} kcal • P: ${food.protein}g • K: ${food.carbs}g • Y: ${food.fats}g
                          </div>
                        </div>
                      </div>
                      <button class="btn-delete-extra" data-id="${food.id}" style="background: transparent; border: none; color: var(--accent-pink); cursor: pointer; padding: 6px; font-size: 14px; transition: var(--transition-fast);">
                        <i class="fas fa-trash-alt"></i>
                      </button>
                    </div>
                  `).join('')}
                </div>
              ` : `
                <p class="text-secondary text-center" style="font-size: 12px; padding: 10px 0;">Henüz ekstra besin eklenmedi.</p>
              `}
            </div>
          </div>
        </div>

        <!-- Water Tracker Widget & Supplement Tracker Widget -->
        <div style="display: flex; flex-direction: column; gap: 24px;">
          <!-- Water Tracking -->
          <div class="glass-card water-container">
            <h2 style="font-family: var(--font-display); font-size: 20px; align-self: flex-start;">Günlük Su Takibi</h2>
            
            <div class="water-glass-display">
              <div class="water-glass-liquid" id="water-liquid" style="height: ${waterPerc}%;"></div>
            </div>
            
            <div style="text-align: center;">
              <span id="water-val-display" style="font-size: 26px; font-weight: 700; font-family: var(--font-display);">${nutrition.waterIntake}</span>
              <span class="text-secondary" style="font-size: 14px;"> / ${waterGoal} ml</span>
            </div>

            <div class="water-quick-buttons">
              <button class="btn-water" data-amount="250">+250 ml</button>
              <button class="btn-water" data-amount="500">+500 ml</button>
              <button class="btn-water btn-water-reset" data-amount="reset" style="background-color: rgba(255, 51, 102, 0.05); border-color: rgba(255, 51, 102, 0.2); color: var(--accent-pink);"><i class="fas fa-redo"></i></button>
            </div>
          </div>

          <!-- Supplement Logging widget -->
          <div class="glass-card" id="supplement-widget">
            <!-- Supplement container injected by Supplement module -->
          </div>
        </div>
      </div>
    `;

    // Bind Water Tracker Button Events
    container.querySelectorAll('.btn-water').forEach(btn => {
      btn.addEventListener('click', () => {
        const amount = btn.dataset.amount;
        if (amount === 'reset') {
          store.updateState(state => {
            state.nutrition.waterIntake = 0;
            return state;
          });
        } else {
          store.updateWater(parseInt(amount));
        }
        
        // Re-draw water heights
        const updatedState = store.getState();
        const updatedWaterPerc = Math.min(100, Math.round((updatedState.nutrition.waterIntake / waterGoal) * 100));
        document.getElementById('water-liquid').style.height = `${updatedWaterPerc}%`;
        document.getElementById('water-val-display').innerText = `${updatedState.nutrition.waterIntake}`;
      });
    });

    // Bind Meal Checklist Click Events
    container.querySelectorAll('.meal-list .check-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const mealKey = btn.dataset.meal;
        store.toggleMealComplete(mealKey);
        this.renderNutritionTab(container);
      });
    });

    // Bind Meal Save Button Click
    container.querySelector('#save-nutrition-btn')?.addEventListener('click', () => {
      alert('Günlük beslenme planınız ve aldığınız makrolar başarıyla kaydedildi!');
    });

    // Toggle manual entry fields
    const manualToggle = container.querySelector('#extra-food-manual-toggle');
    const manualFields = container.querySelector('#extra-food-manual-fields');
    manualToggle?.addEventListener('change', (e) => {
      if (e.target.checked) {
        manualFields.style.display = 'grid';
        container.querySelector('#manual-calories').required = true;
      } else {
        manualFields.style.display = 'none';
        container.querySelector('#manual-calories').required = false;
      }
    });

    // Handle extra food form submission
    container.querySelector('#extra-food-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const nameInput = container.querySelector('#extra-food-name');
      const weightInput = container.querySelector('#extra-food-weight');
      const isManual = manualToggle?.checked;
      
      const foodName = nameInput.value.trim();
      const weight = parseInt(weightInput.value);
      
      let calories = 0;
      let protein = 0;
      let carbs = 0;
      let fats = 0;
      
      if (isManual) {
        calories = Math.round(parseFloat(container.querySelector('#manual-calories').value) || 0);
        protein = Math.round(parseFloat(container.querySelector('#manual-protein').value) || 0);
        carbs = Math.round(parseFloat(container.querySelector('#manual-carbs').value) || 0);
        fats = Math.round(parseFloat(container.querySelector('#manual-fats').value) || 0);
      } else {
        // Find in local DB
        const match = LOCAL_FOODS_DB.find(f => f.name.toLowerCase() === foodName.toLowerCase());
        if (match) {
          const ratio = weight / 100;
          calories = Math.round(match.calories * ratio);
          protein = Math.round(match.protein * ratio);
          carbs = Math.round(match.carbs * ratio);
          fats = Math.round(match.fats * ratio);
        } else {
          alert('Bu yiyecek kütüphanede bulunamadı. Lütfen "Değerleri Kendim Gireceğim" kutusunu işaretleyerek değerleri girin.');
          manualToggle.checked = true;
          manualFields.style.display = 'grid';
          container.querySelector('#manual-calories').required = true;
          return;
        }
      }
      
      store.addExtraFood({
        name: foodName,
        weight: weight,
        calories: calories,
        protein: protein,
        carbs: carbs,
        fats: fats
      });
      
      this.renderNutritionTab(container);
    });

    // Bind Delete Extra Food buttons
    container.querySelectorAll('.btn-delete-extra').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        store.deleteExtraFood(id);
        this.renderNutritionTab(container);
      });
    });

    // Render Supplement lists inside their container
    const suppWidgetContainer = container.querySelector('#supplement-widget');
    window.dispatchEvent(new CustomEvent('render-supplement', { detail: { container: suppWidgetContainer } }));
  }

  translateGoal(goal) {
    const mapping = {
      lose_fat: 'Yağ Yakımı (Defisit)',
      build_muscle: 'Kas Kazanımı (Sürplus)',
      get_fit: 'Fit Kalma (Koruma)',
      body_recomp: 'Rekompozisyon (Slight Defisit)',
      build_strength: 'Güçlenme (Sürplus)',
      endurance: 'Kardiyo Kondisyon (Koruma)'
    };
    return mapping[goal] || goal;
  }
}

export const nutritionEngine = new NutritionEngine();
