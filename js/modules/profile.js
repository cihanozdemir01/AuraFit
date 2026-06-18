import { store } from '../store.js';

class ProfileModule {
  constructor() {
    this.isEditing = false;
  }

  renderProfileTab(container) {
    const state = store.getState();
    const user = state.user;
    const equipments = state.equipments || [];

    if (!user) {
      container.innerHTML = `
        <div class="glass-card text-center" style="padding: 60px 20px;">
          <i class="fas fa-user-circle" style="font-size: 50px; color: var(--text-secondary); margin-bottom: 20px;"></i>
          <h2>Profil Bulunamadı</h2>
          <p class="text-secondary" style="margin: 10px 0 20px;">Lütfen onboarding sürecini tamamlayın.</p>
        </div>
      `;
      return;
    }

    if (this.isEditing) {
      container.innerHTML = `
        <div class="page-header">
          <div>
            <h1 class="page-title">Profil Düzenleme</h1>
            <p class="page-subtitle">Kişisel bilgilerinizi ve hedeflerinizi güncelleyin.</p>
          </div>
        </div>

        <div class="profile-grid">
          <!-- Edit Form -->
          <div class="glass-card">
            <h2 style="font-family: var(--font-display); font-size: 20px; margin-bottom: 20px;">Bilgileri Güncelle</h2>
            
            <form id="profile-edit-form" style="display: flex; flex-direction: column; gap: 16px;">
              <div class="form-group">
                <label for="pe-name">Adınız Soyadınız</label>
                <input type="text" id="pe-name" value="${user.name}" required>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="pe-age">Yaş</label>
                  <input type="number" id="pe-age" value="${user.age}" min="12" max="100" required>
                </div>
                <div class="form-group">
                  <label for="pe-gender">Cinsiyet</label>
                  <select id="pe-gender" required>
                    <option value="male" ${user.gender === 'male' ? 'selected' : ''}>Erkek</option>
                    <option value="female" ${user.gender === 'female' ? 'selected' : ''}>Kadın</option>
                    <option value="other" ${user.gender === 'other' ? 'selected' : ''}>Belirtmek İstemiyorum</option>
                  </select>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="pe-height">Boy (cm)</label>
                  <input type="number" id="pe-height" value="${user.height}" min="100" max="250" required>
                </div>
                <div class="form-group">
                  <label for="pe-weight">Kilo (kg)</label>
                  <input type="number" id="pe-weight" value="${user.weight}" min="30" max="250" required>
                </div>
              </div>

              <div class="form-group">
                <label for="pe-activity">Aktivite Seviyesi</label>
                <select id="pe-activity" required>
                  <option value="sedentary" ${user.activityLevel === 'sedentary' ? 'selected' : ''}>Hareketsiz (Masa başı iş)</option>
                  <option value="light" ${user.activityLevel === 'light' ? 'selected' : ''}>Hafif Aktif (Haftada 1-3 gün spor)</option>
                  <option value="moderate" ${user.activityLevel === 'moderate' ? 'selected' : ''}>Orta Aktif (Haftada 3-5 gün spor)</option>
                  <option value="active" ${user.activityLevel === 'active' ? 'selected' : ''}>Çok Aktif (Haftada 6-7 gün yoğun spor)</option>
                  <option value="very_active" ${user.activityLevel === 'very_active' ? 'selected' : ''}>Profesyonel (Günde çift antrenman)</option>
                </select>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="pe-goal">Hedef</label>
                  <select id="pe-goal" required>
                    <option value="lose_fat" ${user.goal === 'lose_fat' ? 'selected' : ''}>Yağ Yakımı</option>
                    <option value="build_muscle" ${user.goal === 'build_muscle' ? 'selected' : ''}>Kas Yapma</option>
                    <option value="get_fit" ${user.goal === 'get_fit' ? 'selected' : ''}>Fit Görünmek</option>
                    <option value="body_recomp" ${user.goal === 'body_recomp' ? 'selected' : ''}>Yağ Yak, Kas Koru</option>
                    <option value="build_strength" ${user.goal === 'build_strength' ? 'selected' : ''}>Güç Kazanma</option>
                    <option value="endurance" ${user.goal === 'endurance' ? 'selected' : ''}>Dayanıklılık</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="pe-env">Çalışma Ortamı</label>
                  <select id="pe-env" required>
                    <option value="home" ${user.workoutEnvironment === 'home' ? 'selected' : ''}>Ev</option>
                    <option value="gym" ${user.workoutEnvironment === 'gym' ? 'selected' : ''}>Spor Salonu</option>
                  </select>
                </div>
              </div>

              <div class="form-group">
                <label for="pe-physique">Hedef Vücut Tipi</label>
                <select id="pe-physique" required>
                  <option value="fit" ${user.targetPhysique === 'fit' ? 'selected' : ''}>Fit</option>
                  <option value="athletic" ${user.targetPhysique === 'athletic' ? 'selected' : ''}>Athletic</option>
                  <option value="lean" ${user.targetPhysique === 'lean' ? 'selected' : ''}>Lean</option>
                  <option value="bulk" ${user.targetPhysique === 'bulk' ? 'selected' : ''}>Bulk</option>
                  <option value="bodybuilder" ${user.targetPhysique === 'bodybuilder' ? 'selected' : ''}>Bodybuilder</option>
                  <option value="v_shape" ${user.targetPhysique === 'v_shape' ? 'selected' : ''}>V-Shape</option>
                  <option value="custom" ${user.targetPhysique === 'custom' ? 'selected' : ''}>Özel (Açıklama Yaz)</option>
                </select>
              </div>

              <div class="form-group">
                <label for="pe-level">Spor Deneyim Seviyeniz</label>
                <select id="pe-level" required>
                  <option value="beginner" ${user.experienceLevel === 'beginner' ? 'selected' : ''}>Başlangıç</option>
                  <option value="intermediate" ${user.experienceLevel === 'intermediate' ? 'selected' : ''}>Orta Seviye</option>
                  <option value="advanced" ${user.experienceLevel === 'advanced' ? 'selected' : ''}>İleri Seviye</option>
                </select>
              </div>

              <div class="form-group" id="pe-custom-physique-container" style="display: ${user.targetPhysique === 'custom' ? 'flex' : 'none'};">
                <label for="pe-custom-physique">Fizik Hedefi Açıklaması</label>
                <textarea id="pe-custom-physique" placeholder="Hayalinizdeki fiziği kısaca tarif edin...">${user.customPhysique || ''}</textarea>
              </div>

              <div style="display: flex; gap: 12px; margin-top: 10px;">
                <button type="button" class="btn btn-secondary" id="pe-btn-cancel" style="flex: 1;">Vazgeç</button>
                <button type="submit" class="btn btn-primary" style="flex: 1;">Kaydet</button>
              </div>
            </form>
          </div>

          <div style="display: flex; flex-direction: column; gap: 24px;">
            <div class="glass-card">
              <h2 style="font-family: var(--font-display); font-size: 20px; margin-bottom: 8px;">Uygulama Bilgisi</h2>
              <p class="text-secondary" style="font-size: 13px;">Profil bilgilerinizi güncellediğinizde, günlük enerji ihtiyacınız (TDEE), makrolarınız ve egzersiz planınız otomatik olarak yeniden hesaplanarak güncellenecektir.</p>
            </div>
          </div>
        </div>
      `;

      // Bind events for Edit Form
      const form = container.querySelector('#profile-edit-form');
      const cancelBtn = container.querySelector('#pe-btn-cancel');
      const physiqueSelect = container.querySelector('#pe-physique');
      const customPhysiqueContainer = container.querySelector('#pe-custom-physique-container');

      physiqueSelect.addEventListener('change', () => {
        if (physiqueSelect.value === 'custom') {
          customPhysiqueContainer.style.display = 'flex';
        } else {
          customPhysiqueContainer.style.display = 'none';
        }
      });

      cancelBtn.addEventListener('click', () => {
        this.isEditing = false;
        this.renderProfileTab(container);
      });

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = container.querySelector('#pe-name').value.trim();
        const age = parseInt(container.querySelector('#pe-age').value);
        const gender = container.querySelector('#pe-gender').value;
        const height = parseInt(container.querySelector('#pe-height').value);
        const weight = parseFloat(container.querySelector('#pe-weight').value);
        const activityLevel = container.querySelector('#pe-activity').value;
        const goal = container.querySelector('#pe-goal').value;
        const environment = container.querySelector('#pe-env').value;
        const targetPhysique = physiqueSelect.value;
        const customPhysique = container.querySelector('#pe-custom-physique').value.trim();
        const experienceLevel = container.querySelector('#pe-level').value;

        // 1. Check if weight changed, if so add measurement
        const weightChanged = user.weight !== weight;
        
        // 2. Set new user object
        const updatedUser = {
          name,
          age,
          gender,
          height,
          weight,
          activityLevel,
          goal,
          targetPhysique,
          customPhysique: targetPhysique === 'custom' ? customPhysique : '',
          workoutEnvironment: environment,
          experienceLevel
        };

        store.setUser(updatedUser);

        if (weightChanged) {
          // Add weight measurement log
          store.addMeasurement({
            weight: weight,
            waist: state.measurements[state.measurements.length - 1]?.waist || null,
            chest: state.measurements[state.measurements.length - 1]?.chest || null,
            hips: state.measurements[state.measurements.length - 1]?.hips || null,
            arms: state.measurements[state.measurements.length - 1]?.arms || null,
            legs: state.measurements[state.measurements.length - 1]?.legs || null,
            bodyFat: state.measurements[state.measurements.length - 1]?.bodyFat || null
          });
        }

        // 3. Regenerate plans
        import('./workout.js').then(({ workoutEngine }) => {
          // Build user params containing updated equipments or previous
          const userParams = {
            ...updatedUser,
            equipments: state.equipments
          };
          
          const newWorkoutPlan = workoutEngine.generatePlan(userParams);
          store.setWorkoutPlan(newWorkoutPlan);

          import('./nutrition.js').then(({ nutritionEngine }) => {
            const newNutrition = nutritionEngine.calculatePlan(updatedUser);
            store.setNutritionTargets(newNutrition.calories, newNutrition.protein, newNutrition.carbs, newNutrition.fats);
            
            window.dispatchEvent(new CustomEvent('show-toast', { detail: { message: 'Profiliniz başarıyla güncellendi!', type: 'success' } }));
            
            this.isEditing = false;
            this.renderProfileTab(container);
          });
        });
      });

      return;
    }

    container.innerHTML = `
      <div class="page-header">
        <div>
          <h1 class="page-title">Profil ve Ayarlar</h1>
          <p class="page-subtitle">Kişisel bilgilerinizi ve uygulama ayarlarını yönetin.</p>
        </div>
      </div>

      <div class="profile-grid">
        <!-- Profile details -->
        <div class="glass-card">
          <div style="display: flex; flex-direction: column; align-items: center; gap: 12px; margin-bottom: 24px; text-align: center;">
            <div class="avatar" style="width: 80px; height: 80px; font-size: 30px;">
              ${user.name.charAt(0).toUpperCase()}
            </div>
            <h2 style="font-family: var(--font-display); font-size: 22px;">${user.name}</h2>
            <span class="spec-pill" style="font-size: 12px;">Hedef: ${this.translateGoal(user.goal)}</span>
          </div>

          <div class="profile-card-details">
            <div class="profile-detail-row">
              <span class="profile-detail-lbl">Yaş</span>
              <span class="profile-detail-val">${user.age} yıl</span>
            </div>
            <div class="profile-detail-row">
              <span class="profile-detail-lbl">Cinsiyet</span>
              <span class="profile-detail-val">${user.gender === 'male' ? 'Erkek' : user.gender === 'female' ? 'Kadın' : 'Diğer'}</span>
            </div>
            <div class="profile-detail-row">
              <span class="profile-detail-lbl">Boy</span>
              <span class="profile-detail-val">${user.height} cm</span>
            </div>
            <div class="profile-detail-row">
              <span class="profile-detail-lbl">Kilo</span>
              <span class="profile-detail-val">${user.weight} kg</span>
            </div>
            <div class="profile-detail-row">
              <span class="profile-detail-lbl">Aktivite Seviyesi</span>
              <span class="profile-detail-val">${this.translateActivity(user.activityLevel)}</span>
            </div>
            <div class="profile-detail-row">
               <span class="profile-detail-lbl">Spor Seviyesi</span>
               <span class="profile-detail-val">${this.translateExperience(user.experienceLevel || 'beginner')}</span>
             </div>
             <div class="profile-detail-row">
               <span class="profile-detail-lbl">Ortam</span>
               <span class="profile-detail-val">${user.workoutEnvironment === 'gym' ? 'Spor Salonu' : 'Ev'}</span>
             </div>
             <div class="profile-detail-row">
               <span class="profile-detail-lbl">Hedef Vücut</span>
               <span class="profile-detail-val" style="text-transform: capitalize;">${user.targetPhysique === 'custom' ? user.customPhysique : user.targetPhysique}</span>
             </div>
           </div>
          
          <button class="btn btn-secondary" id="profile-edit-btn" style="width: 100%; margin-top: 20px;"><i class="fas fa-edit"></i> Profili Düzenle</button>
        </div>

        <!-- Settings & Customizations -->
        <div style="display: flex; flex-direction: column; gap: 24px;">
          <!-- Equipment editor (Only shows if home) -->
          ${user.workoutEnvironment === 'home' ? `
            <div class="glass-card">
              <h2 style="font-family: var(--font-display); font-size: 20px; margin-bottom: 8px;">Ekipman Tercihlerim</h2>
              <p class="text-secondary" style="font-size: 12px; margin-bottom: 16px;">Egzersiz programınız evde bulunan ekipmanlara göre güncellenir.</p>
              
              <div class="checkbox-options" id="profile-equipment-checkboxes">
                <div class="checkbox-option-card ${equipments.includes('dumbbell') ? 'selected' : ''}" data-value="dumbbell">
                  <input type="checkbox" id="peq-dumbbell" ${equipments.includes('dumbbell') ? 'checked' : ''}>
                  <label for="peq-dumbbell">Dumbbell</label>
                </div>
                <div class="checkbox-option-card ${equipments.includes('band') ? 'selected' : ''}" data-value="band">
                  <input type="checkbox" id="peq-band" ${equipments.includes('band') ? 'checked' : ''}>
                  <label for="peq-band">Direnç Bandı</label>
                </div>
                <div class="checkbox-option-card ${equipments.includes('bench') ? 'selected' : ''}" data-value="bench">
                  <input type="checkbox" id="peq-bench" ${equipments.includes('bench') ? 'checked' : ''}>
                  <label for="peq-bench">Bench</label>
                </div>
                <div class="checkbox-option-card ${equipments.includes('pullup_bar') ? 'selected' : ''}" data-value="pullup_bar">
                  <input type="checkbox" id="peq-pullup" ${equipments.includes('pullup_bar') ? 'checked' : ''}>
                  <label for="peq-pullup">Barfiks Barı</label>
                </div>
                <div class="checkbox-option-card ${equipments.includes('kettlebell') ? 'selected' : ''}" data-value="kettlebell">
                  <input type="checkbox" id="peq-kettlebell" ${equipments.includes('kettlebell') ? 'checked' : ''}>
                  <label for="peq-kettlebell">Kettlebell</label>
                </div>
                <div class="checkbox-option-card ${equipments.includes('barbell') ? 'selected' : ''}" data-value="barbell">
                  <input type="checkbox" id="peq-barbell" ${equipments.includes('barbell') ? 'checked' : ''}>
                  <label for="peq-barbell">Halter Barı (Barbell)</label>
                </div>
                <div class="checkbox-option-card ${equipments.includes('plates') ? 'selected' : ''}" data-value="plates">
                  <input type="checkbox" id="peq-plates" ${equipments.includes('plates') ? 'checked' : ''}>
                  <label for="peq-plates">Ağırlık Plakaları</label>
                </div>
                <div class="checkbox-option-card ${equipments.includes('treadmill') ? 'selected' : ''}" data-value="treadmill">
                  <input type="checkbox" id="peq-treadmill" ${equipments.includes('treadmill') ? 'checked' : ''}>
                  <label for="peq-treadmill">Koşu Bandı</label>
                </div>
                <div class="checkbox-option-card ${equipments.includes('mat') ? 'selected' : ''}" data-value="mat">
                  <input type="checkbox" id="peq-mat" ${equipments.includes('mat') ? 'checked' : ''}>
                  <label for="peq-mat">Egzersiz Matı</label>
                </div>
              </div>
              
              <button class="btn btn-primary" id="profile-save-equipments" style="margin-top: 16px;">Ekipmanları Güncelle</button>
            </div>
          ` : `
            <div class="glass-card">
              <h2 style="font-family: var(--font-display); font-size: 20px; margin-bottom: 8px;">Ekipman Durumu</h2>
              <p class="text-secondary" style="font-size: 13px;">Spor salonu antrenman modeli seçili olduğu için tüm standart ekipmanların (Dumbbell, Halter, İstasyonlar, Kablo vb.) mevcut olduğu varsayılmaktadır.</p>
            </div>
          `}

          <!-- Account Actions -->
          <div class="glass-card" style="border-color: rgba(255, 51, 102, 0.2);">
            <h2 style="font-family: var(--font-display); font-size: 20px; color: var(--accent-pink); margin-bottom: 8px;">Tehlikeli Bölge</h2>
            <p class="text-secondary" style="font-size: 12px; margin-bottom: 16px;">Bu işlem geri alınamaz. Kaydedilen tüm egzersiz programları, geçmiş ölçümleriniz ve hedefleriniz silinir.</p>
            <button class="btn btn-danger" id="profile-reset-btn" style="width: 100%;"><i class="fas fa-trash-alt"></i> Verileri Sıfırla ve Yeniden Başlat</button>
          </div>
        </div>
      </div>
    `;

    // Bind Edit Toggle click
    container.querySelector('#profile-edit-btn').addEventListener('click', () => {
      this.isEditing = true;
      this.renderProfileTab(container);
    });


    // Bind Equipment Selection checkboxes
    const eqCards = container.querySelectorAll('#profile-equipment-checkboxes .checkbox-option-card');
    eqCards.forEach(card => {
      const checkbox = card.querySelector('input[type="checkbox"]');
      card.addEventListener('click', (e) => {
        if (e.target !== checkbox) {
          checkbox.checked = !checkbox.checked;
        }
        if (checkbox.checked) {
          card.classList.add('selected');
        } else {
          card.classList.remove('selected');
        }
      });
    });

    // Save Equipment Click
    container.querySelector('#profile-save-equipments')?.addEventListener('click', () => {
      const updatedEqs = [];
      container.querySelectorAll('#profile-equipment-checkboxes .checkbox-option-card.selected').forEach(c => {
        updatedEqs.push(c.dataset.value);
      });
      store.setEquipments(updatedEqs);
      
      // Regenerate workout program with new equipments
      const state = store.getState();
      const userParams = {
        ...state.user,
        equipments: updatedEqs
      };
      
      // Import workout engine dynamically if needed or rely on import
      // We import workoutEngine at top so we can use it:
      import('./workout.js').then(({ workoutEngine }) => {
        const newPlan = workoutEngine.generatePlan(userParams);
        store.setWorkoutPlan(newPlan);
        window.dispatchEvent(new CustomEvent('show-toast', { detail: { message: 'Ekipmanlarınız başarıyla güncellendi!', type: 'success' } }));
        this.renderProfileTab(container);
      });
    });

    // Bind reset button
    container.querySelector('#profile-reset-btn').addEventListener('click', () => {
      const confirmReset = confirm('Tüm verileri kalıcı olarak sıfırlamak istediğinize emin misiniz? Onboarding ekranına yönlendirileceksiniz.');
      if (confirmReset) {
        store.resetState();
        window.location.reload();
      }
    });
  }

  translateGoal(goal) {
    const mapping = {
      lose_fat: 'Yağ Yakımı',
      build_muscle: 'Kas Yapma',
      get_fit: 'Fit Görünmek',
      body_recomp: 'Yağ Yak, Kas Koru',
      build_strength: 'Güç Kazanma',
      endurance: 'Dayanıklılık'
    };
    return mapping[goal] || goal;
  }

  translateActivity(lvl) {
    const mapping = {
      sedentary: 'Hareketsiz',
      light: 'Hafif Aktif',
      moderate: 'Orta Aktif',
      active: 'Çok Aktif',
      very_active: 'Çok Ağır Fiziksel'
    };
    return mapping[lvl] || lvl;
  }

  translateExperience(lvl) {
    const mapping = {
      beginner: 'Başlangıç',
      intermediate: 'Orta Seviye',
      advanced: 'İleri Seviye'
    };
    return mapping[lvl] || lvl;
  }
}

export const profileModule = new ProfileModule();
