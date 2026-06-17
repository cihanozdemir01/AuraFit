import { store } from '../store.js';

class SupplementModule {
  constructor() {
    this.container = null;
  }

  init() {
    window.addEventListener('render-supplement', (e) => {
      this.container = e.detail.container;
      this.render();
    });
  }

  render() {
    if (!this.container) return;
    const state = store.getState();
    const supplements = state.supplements || [];

    const listHtml = supplements.length === 0
      ? `<p class="text-secondary" style="font-size: 13px; font-style: italic;">Henüz eklenmiş supplement bulunmuyor.</p>`
      : supplements.map(s => `
          <div class="supp-item">
            <div class="supp-meta">
              <span class="supp-name"><i class="fas fa-pills" style="color: var(--accent-cyan); margin-right: 6px;"></i> ${s.name}</span>
              <span class="supp-timing-dosage">${s.dosage} — <i class="far fa-clock"></i> ${s.timing}</span>
              ${s.note ? `<span class="supp-note">${s.note}</span>` : ''}
            </div>
            <button class="btn-water btn-supp-delete" data-id="${s.id}" style="padding: 6px 10px; background-color: rgba(255, 51, 102, 0.05); border-color: rgba(255, 51, 102, 0.2); color: var(--accent-pink);"><i class="fas fa-trash"></i></button>
          </div>
        `).join('');

    this.container.innerHTML = `
      <h2 style="font-family: var(--font-display); font-size: 20px; margin-bottom: 12px;">Supplement Takibi</h2>
      
      <div class="supp-list" style="margin-bottom: 16px;">
        ${listHtml}
      </div>

      <div style="border-top: 1px solid var(--border-color); padding-top: 14px;">
        <h3 style="font-size: 14px; font-weight: 600; margin-bottom: 10px;">Yeni Ekle</h3>
        <form id="supp-add-form" style="display: flex; flex-direction: column; gap: 8px;">
          <div class="form-row">
            <input type="text" id="supp-name-input" placeholder="Adı (Örn: Kreatin)" required style="padding: 8px 12px; font-size: 13px;">
            <input type="text" id="supp-dosage-input" placeholder="Miktar (Örn: 5g)" required style="padding: 8px 12px; font-size: 13px;">
          </div>
          <div class="form-row">
            <input type="text" id="supp-timing-input" placeholder="Saat (Örn: Antrenman sonrası)" required style="padding: 8px 12px; font-size: 13px;">
            <input type="text" id="supp-note-input" placeholder="Not (Opsiyonel)" style="padding: 8px 12px; font-size: 13px;">
          </div>
          <button type="submit" class="btn btn-primary" style="padding: 8px 16px; font-size: 13px; margin-top: 4px;"><i class="fas fa-plus"></i> Supplement Ekle</button>
        </form>
      </div>
    `;

    // Bind Form Submission
    const form = this.container.querySelector('#supp-add-form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = this.container.querySelector('#supp-name-input').value.trim();
      const dosage = this.container.querySelector('#supp-dosage-input').value.trim();
      const timing = this.container.querySelector('#supp-timing-input').value.trim();
      const note = this.container.querySelector('#supp-note-input').value.trim();

      store.addSupplement({ name, dosage, timing, note });
      this.render();
    });

    // Bind Delete clicks
    this.container.querySelectorAll('.btn-supp-delete').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        store.deleteSupplement(id);
        this.render();
      });
    });
  }
}

export const supplementModule = new SupplementModule();
