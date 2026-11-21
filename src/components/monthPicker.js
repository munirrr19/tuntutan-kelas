import { state } from '../state/store.js';
import { namaBulan } from '../utils/dateTime.js';

/**
 * Bina komponen pemilih bulan seragam untuk setiap tab yang memerlukannya.
 */
export function initMonthPickers(onBulanTukar) {
  document.querySelectorAll('[data-month-picker]').forEach(el => {
    const cetakLabel = el.dataset.cetakLabel;
    const cetakAction = el.dataset.cetakAction;
    el.innerHTML = `
      <button type="button" class="bulan-nav" data-delta="-1" aria-label="Bulan sebelum">‹</button>
      <div class="bulan-kotak"><span class="bulan-papar"></span><input type="month" class="pilihBulan" aria-label="Bulan"></div>
      <button type="button" class="bulan-nav" data-delta="1" aria-label="Bulan seterus">›</button>
      ${cetakLabel ? `<button type="button" class="btn btn-cetak" data-cetak="${cetakAction}">${cetakLabel}</button>` : ''}
    `;
  });

  document.querySelectorAll('.bulan-nav').forEach(btn => {
    btn.onclick = () => {
      const delta = Number(btn.dataset.delta);
      const [y, m] = state.bulan.split('-').map(Number);
      const d = new Date(y, m - 1 + delta, 1);
      onBulanTukar(d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0'));
    };
  });

  document.querySelectorAll('.pilihBulan').forEach(input => {
    input.onchange = () => { if (input.value) onBulanTukar(input.value); };
  });
}

export function kemasMonthPickers() {
  document.querySelectorAll('.pilihBulan').forEach(i => { i.value = state.bulan; });
  document.querySelectorAll('.bulan-papar').forEach(el => { el.textContent = namaBulan(state.bulan); });
}
