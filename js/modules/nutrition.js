import { store } from '../store.js';

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
            
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <span style="font-size: 32px; font-weight: 800; font-family: var(--font-display); color: var(--accent-orange);">${nutrition.caloriesTarget}</span>
                <span class="text-secondary" style="font-size: 14px;"> kcal / Gün</span>
              </div>
              <div class="text-secondary" style="font-size: 13px; text-align: right;">
                Bazal Metabolizma: ${Math.round(nutrition.caloriesTarget * 0.8)} kcal<br>
                TDEE Hedef Tipi: ${this.translateGoal(user.goal)}
              </div>
            </div>

            <div class="nutrition-bars">
              <div class="macro-bar-item">
                <div class="macro-bar-label">
                  <span>Protein <small class="text-secondary">(2.0x Kilo)</small></span>
                  <strong>${nutrition.proteinTarget}g <span class="text-secondary">(${nutrition.proteinTarget * 4} kcal)</span></strong>
                </div>
                <div class="macro-bar-bg">
                  <div class="macro-bar-fill protein" style="width: 100%;"></div>
                </div>
              </div>
              
              <div class="macro-bar-item">
                <div class="macro-bar-label">
                  <span>Karbonhidrat</span>
                  <strong>${nutrition.carbsTarget}g <span class="text-secondary">(${nutrition.carbsTarget * 4} kcal)</span></strong>
                </div>
                <div class="macro-bar-bg">
                  <div class="macro-bar-fill carbs" style="width: 100%;"></div>
                </div>
              </div>

              <div class="macro-bar-item">
                <div class="macro-bar-label">
                  <span>Yağ</span>
                  <strong>${nutrition.fatsTarget}g <span class="text-secondary">(${nutrition.fatsTarget * 9} kcal)</span></strong>
                </div>
                <div class="macro-bar-bg">
                  <div class="macro-bar-fill fats" style="width: 100%;"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Suggested Meal Plan Card -->
          <div class="glass-card">
            <h2 style="font-family: var(--font-display); font-size: 20px;">Örnek Günlük Yemek Planı</h2>
            <p class="text-secondary" style="font-size: 12px; margin-top: 2px;">Hedef makrolarınıza özel hazırlanan dengeli öğünler.</p>
            
            <div class="meal-list">
              <div class="meal-item">
                <div class="meal-icon-box"><i class="fas fa-coffee"></i></div>
                <div class="meal-content">
                  <div class="meal-name">Kahvaltı</div>
                  <div class="meal-foods">${meals.breakfast.name} : ${meals.breakfast.foods}</div>
                </div>
              </div>
              <div class="meal-item">
                <div class="meal-icon-box"><i class="fas fa-utensils"></i></div>
                <div class="meal-content">
                  <div class="meal-name">Öğle Yemeği</div>
                  <div class="meal-foods">${meals.lunch.name} : ${meals.lunch.foods}</div>
                </div>
              </div>
              <div class="meal-item">
                <div class="meal-icon-box"><i class="fas fa-cloud-sun"></i></div>
                <div class="meal-content">
                  <div class="meal-name">Akşam Yemeği</div>
                  <div class="meal-foods">${meals.dinner.name} : ${meals.dinner.foods}</div>
                </div>
              </div>
              <div class="meal-item">
                <div class="meal-icon-box"><i class="fas fa-cookie-bite"></i></div>
                <div class="meal-content">
                  <div class="meal-name">Ara Öğün</div>
                  <div class="meal-foods">${meals.snack.name} : ${meals.snack.foods}</div>
                </div>
              </div>
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
