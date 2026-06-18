import { store } from '../store.js';

class ProgressTracker {
  constructor() {}

  renderProgressTab(container) {
    const state = store.getState();
    const measurements = state.measurements || [];
    
    // Sort measurements chronological
    const sortedMeasurements = [...measurements].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    container.innerHTML = `
      <div class="page-header">
        <div>
          <h1 class="page-title">Gelişim Takibim</h1>
          <p class="page-subtitle">Ölçümlerinizi girin ve zaman içindeki değişimi görsel olarak inceleyin.</p>
        </div>
      </div>

      <div class="progress-grid">
        <!-- Check-in Form -->
        <div class="glass-card">
          <h2 style="font-family: var(--font-display); font-size: 20px; margin-bottom: 12px;">Yeni Ölçüm Girişi</h2>
          <p class="text-secondary" style="font-size: 13px; margin-bottom: 20px;">Haftalık gelişim analiziniz için güncel bilgileri kaydedin.</p>
          
          <form id="progress-checkin-form">
            <div class="form-row">
              <div class="form-group">
                <label for="pr-weight">Kilo (kg) *</label>
                <input type="number" step="0.1" id="pr-weight" required placeholder="Gerekli">
              </div>
              <div class="form-group">
                <label for="pr-waist">Bel Çevresi (cm) *</label>
                <input type="number" step="0.1" id="pr-waist" required placeholder="Gerekli">
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="pr-chest">Göğüs Çevresi (cm)</label>
                <input type="number" step="0.1" id="pr-chest" placeholder="Opsiyonel">
              </div>
              <div class="form-group">
                <label for="pr-hips">Kalça Çevresi (cm)</label>
                <input type="number" step="0.1" id="pr-hips" placeholder="Opsiyonel">
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="pr-arms">Kol Çevresi (cm)</label>
                <input type="number" step="0.1" id="pr-arms" placeholder="Opsiyonel">
              </div>
              <div class="form-group">
                <label for="pr-legs">Bacak Çevresi (cm)</label>
                <input type="number" step="0.1" id="pr-legs" placeholder="Opsiyonel">
              </div>
            </div>

            <div class="form-group">
              <label for="pr-bodyfat">Yağ Oranı (%)</label>
              <input type="number" step="0.1" id="pr-bodyfat" placeholder="Opsiyonel">
            </div>

            <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 16px;"><i class="fas fa-check"></i> Ölçümleri Kaydet</button>
          </form>
        </div>

        <!-- Charts and Graphs Section -->
        <div style="display: flex; flex-direction: column; gap: 24px;">
          <!-- Weight Trend Card -->
          <div class="glass-card">
            <h2 style="font-family: var(--font-display); font-size: 20px;">Kilo Değişim Trendi (kg)</h2>
            <div class="chart-container" id="weight-chart-box">
              <!-- SVG chart injected here -->
            </div>
          </div>

          <!-- Waist Trend Card -->
          <div class="glass-card">
            <h2 style="font-family: var(--font-display); font-size: 20px;">Bel Ölçüsü Değişim Trendi (cm)</h2>
            <div class="chart-container" id="waist-chart-box">
              <!-- SVG chart injected here -->
            </div>
          </div>
        </div>
      </div>

      <!-- History Table -->
      <div class="glass-card" style="margin-top: 32px;">
        <h2 style="font-family: var(--font-display); font-size: 20px;">Geçmiş Ölçümlerim</h2>
        <div class="history-table-wrapper">
          <table class="history-table">
            <thead>
              <tr>
                <th>Tarih</th>
                <th>Kilo (Değişim)</th>
                <th>Bel (Değişim)</th>
                <th>Göğüs</th>
                <th>Kalça</th>
                <th>Kol</th>
                <th>Bacak</th>
                <th>Yağ %</th>
              </tr>
            </thead>
            <tbody>
              ${this.renderHistoryRows(sortedMeasurements)}
            </tbody>
          </table>
        </div>
      </div>
    `;

    // Draw SVG charts
    this.drawChart('weight-chart-box', sortedMeasurements, 'weight', 'var(--accent-cyan)', 'weight-grad');
    this.drawChart('waist-chart-box', sortedMeasurements, 'waist', 'var(--accent-emerald)', 'waist-grad');

    // Bind form submit
    const form = container.querySelector('#progress-checkin-form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const weight = parseFloat(container.querySelector('#pr-weight').value);
      const waist = parseFloat(container.querySelector('#pr-waist').value);
      
      const chestVal = container.querySelector('#pr-chest').value;
      const hipsVal = container.querySelector('#pr-hips').value;
      const armsVal = container.querySelector('#pr-arms').value;
      const legsVal = container.querySelector('#pr-legs').value;
      const fatVal = container.querySelector('#pr-bodyfat').value;

      store.addMeasurement({
        weight,
        waist,
        chest: chestVal ? parseFloat(chestVal) : null,
        hips: hipsVal ? parseFloat(hipsVal) : null,
        arms: armsVal ? parseFloat(armsVal) : null,
        legs: legsVal ? parseFloat(legsVal) : null,
        bodyFat: fatVal ? parseFloat(fatVal) : null
      });

      // Update user current weight in store (demographic)
      const user = store.getState().user;
      if (user) {
        user.weight = weight;
        store.setUser(user);
      }

      this.renderProgressTab(container);
    });
  }

  renderHistoryRows(measurements) {
    if (measurements.length === 0) {
      return `<tr><td colspan="8" class="text-center text-muted" style="padding: 24px;">Kayıtlı veri bulunamadı.</td></tr>`;
    }

    // Build rows reversed (newest first)
    return [...measurements].reverse().map((m, idx, arr) => {
      const dateStr = new Date(m.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' });
      
      // Calculate deltas comparing to previous chronological index in the original list
      // Note: since arr is reversed, the older entry is further down: index (idx + 1)
      let weightDeltaHtml = '';
      let waistDeltaHtml = '';
      
      const olderEntry = arr[idx + 1];
      if (olderEntry) {
        const wDiff = (m.weight - olderEntry.weight).toFixed(1);
        const waDiff = ((m.waist || 0) - (olderEntry.waist || 0)).toFixed(1);

        weightDeltaHtml = wDiff > 0 
          ? `<span style="color: var(--accent-pink); font-size: 11px; margin-left: 6px;">(+${wDiff})</span>`
          : wDiff < 0 
            ? `<span style="color: var(--accent-emerald); font-size: 11px; margin-left: 6px;">(${wDiff})</span>`
            : `<span style="color: var(--text-muted); font-size: 11px; margin-left: 6px;">(0.0)</span>`;

        waistDeltaHtml = waDiff > 0
          ? `<span style="color: var(--accent-pink); font-size: 11px; margin-left: 6px;">(+${waDiff})</span>`
          : waDiff < 0
            ? `<span style="color: var(--accent-emerald); font-size: 11px; margin-left: 6px;">(${waDiff})</span>`
            : `<span style="color: var(--text-muted); font-size: 11px; margin-left: 6px;">(0.0)</span>`;
      }

      return `
        <tr>
          <td><strong>${dateStr}</strong></td>
          <td>${m.weight} kg ${weightDeltaHtml}</td>
          <td>${m.waist ? `${m.waist} cm ${waistDeltaHtml}` : '-'}</td>
          <td>${m.chest ? `${m.chest} cm` : '-'}</td>
          <td>${m.hips ? `${m.hips} cm` : '-'}</td>
          <td>${m.arms ? `${m.arms} cm` : '-'}</td>
          <td>${m.legs ? `${m.legs} cm` : '-'}</td>
          <td>${m.bodyFat ? `%${m.bodyFat}` : '-'}</td>
        </tr>
      `;
    }).join('');
  }

  drawChart(boxId, dataList, valueKey, strokeColor, gradId) {
    const box = document.getElementById(boxId);
    if (!box) return;

    // Filter points containing valid value
    const points = dataList.filter(d => d[valueKey] !== null && d[valueKey] !== undefined);
    
    if (points.length < 2) {
      box.innerHTML = `
        <div style="height: 100%; display: flex; align-items: center; justify-content: center; font-size: 13px; color: var(--text-muted); border: 1px dashed var(--border-color); border-radius: 12px;">
          Trend grafiği için en az 2 haftalık ölçüm girmelisiniz.
        </div>
      `;
      return;
    }

    const width = box.clientWidth || 300;
    const height = 180;
    const padding = 35;
    
    const values = points.map(p => p[valueKey]);
    const minVal = Math.min(...values) * 0.98; // Add 2% padding
    const maxVal = Math.max(...values) * 1.02; // Add 2% padding
    const valRange = maxVal - minVal || 10;

    const xCoords = points.map((_, i) => padding + (i * (width - 2 * padding) / (points.length - 1)));
    const yCoords = points.map(p => height - padding - ((p[valueKey] - minVal) * (height - 2 * padding) / valRange));

    // Construct path strings
    let pathD = `M ${xCoords[0]} ${yCoords[0]}`;
    let fillD = `M ${xCoords[0]} ${height - padding} L ${xCoords[0]} ${yCoords[0]}`;
    
    for (let i = 1; i < points.length; i++) {
      pathD += ` L ${xCoords[i]} ${yCoords[i]}`;
      fillD += ` L ${xCoords[i]} ${yCoords[i]}`;
    }
    fillD += ` L ${xCoords[points.length - 1]} ${height - padding} Z`;

    // Generate Y-axis grid marks
    const gridLines = [];
    const ticks = 4;
    for (let i = 0; i < ticks; i++) {
      const val = minVal + (i * valRange / (ticks - 1));
      const y = height - padding - ((val - minVal) * (height - 2 * padding) / valRange);
      gridLines.push(`
        <line x1="${padding}" y1="${y}" x2="${width - padding}" y2="${y}" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
        <text x="${padding - 8}" y="${y + 4}" fill="var(--text-muted)" font-size="10" font-weight="600" text-anchor="end">${val.toFixed(1)}</text>
      `);
    }

    // Generate Circles (Nodes) & tooltips trigger
    const nodes = points.map((p, i) => {
      const date = new Date(p.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
      return `
        <circle cx="${xCoords[i]}" cy="${yCoords[i]}" r="5" fill="${strokeColor}" stroke="var(--bg-secondary)" stroke-width="2" class="chart-point-node" data-val="${p[valueKey]}" data-date="${date}"/>
      `;
    }).join('');

    // Generate X-axis labels
    const xLabels = points.map((p, i) => {
      const date = new Date(p.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
      // Skip labels if there are too many (density optimization)
      if (points.length > 5 && i % 2 !== 0 && i !== points.length - 1) return '';
      return `<text x="${xCoords[i]}" y="${height - 12}" fill="var(--text-muted)" font-size="10" font-weight="600" text-anchor="middle">${date}</text>`;
    }).join('');

    box.innerHTML = `
      <svg class="chart-svg" width="100%" height="${height}" viewBox="0 0 ${width} ${height}">
        <defs>
          <linearGradient id="${gradId}" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${strokeColor}" stop-opacity="0.25"/>
            <stop offset="100%" stop-color="${strokeColor}" stop-opacity="0.0"/>
          </linearGradient>
        </defs>

        <!-- Grid Lines -->
        ${gridLines.join('')}

        <!-- Bottom X-axis baseline -->
        <line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" stroke="var(--border-color)" stroke-width="1.5"/>

        <!-- Gradient Area Fill -->
        <path d="${fillD}" fill="url(#${gradId})"/>

        <!-- Trend Line -->
        <path d="${pathD}" fill="none" stroke="${strokeColor}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>

        <!-- Nodes -->
        ${nodes}

        <!-- X Labels -->
        ${xLabels}
      </svg>
      <div class="chart-tooltip" id="tooltip-${boxId}"></div>
    `;

    // Tooltip listener setup
    const tooltip = box.querySelector(`#tooltip-${boxId}`);
    box.querySelectorAll('.chart-point-node').forEach(node => {
      node.addEventListener('mouseover', (e) => {
        const val = parseFloat(node.dataset.val).toFixed(1);
        const date = node.dataset.date;
        tooltip.innerHTML = `<strong>${val}</strong><br><span style="color:var(--text-secondary);">${date}</span>`;
        tooltip.style.display = 'block';
        tooltip.style.left = `${parseFloat(node.getAttribute('cx')) - tooltip.clientWidth / 2}px`;
        tooltip.style.top = `${parseFloat(node.getAttribute('cy')) - tooltip.clientHeight - 12}px`;
      });
      node.addEventListener('mouseout', () => {
        tooltip.style.display = 'none';
      });
    });
  }
}

export const progressTracker = new ProgressTracker();
