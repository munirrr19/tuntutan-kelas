import { state } from '../state/store.js';
import { masaTeks, namaBulan, tarikhTeks } from '../utils/dateTime.js';
import { $, esc, jamTeks, jumlah, rm } from '../utils/format.js';
import { api, token } from '../services/api.js';
import { kemasCacheDariState } from '../services/cache.js';
import { gilir, setGilir } from '../services/syncQueue.js';
import { sahkan } from '../components/modal.js';
import { mesej } from '../components/toast.js';
import { entriBulan, statusSelesai } from '../components/printTemplates.js';

export function lukisSenarai() {
  const senarai = entriBulan(state.guru.id);
  const jumlahJam = jumlah(senarai);
  const s = statusSelesai(state.guru.id);
  const bln = namaBulan(state.bulan);
  const teksSelesai = st => `✓ SELESAI · ${tarikhTeks(st.masa.slice(0, 10))}${st.masa.slice(10)}`;

  $('kpiSenarai').innerHTML = `<div class="kpi-kad tabular">
    <div class="kpi-atas"><span>${bln}</span><span class="lencana ${s ? 'lencana-hijau' : 'lencana-draf'}">${s ? '✓ Selesai' : 'Draf'}</span></div>
    <div class="kpi-grid">
      <div class="kpi-kotak"><small>Kelas</small><b>${senarai.length}</b></div>
      <div class="kpi-kotak"><small>Jumlah jam</small><b>${jamTeks(jumlahJam)}</b></div>
      <div class="kpi-kotak"><small>Jumlah (RM)</small><b>${rm(jumlahJam * state.kadarSejam)}</b></div>
    </div>
  </div>`;

  if (!token()) {
    $('senarai').innerHTML = '<div class="kosong">Pautan peribadi diperlukan. Sila dapatkan pautan tersebut daripada admin.</div>';
  } else if (state.sedangMuat) {
    $('senarai').innerHTML = '<div class="skel"></div><div class="skel"></div><div class="skel"></div>';
  } else {
    $('senarai').innerHTML =
      (s ? `<div class="ringkas" style="margin:0 0 8px">${teksSelesai(s)}</div>` : '') +
      (senarai.length
        ? senarai.map(x => `<div class="item"><div class="item-isi">
            <div class="item-atas sebaris"><b class="tabular">${tarikhTeks(x.tarikh)}</b><span class="tag-kelas">${esc(x.tingkatan)}</span></div>
            <small class="tabular">${masaTeks(x.mula)} – ${masaTeks(x.tamat)}</small>
            <small class="tabular"><b>${jamTeks(x.jam)} jam</b>${x.catatan ? ' · ' + esc(x.catatan) : ''}</small></div>
            ${s ? '' : `<div class="item-tindakan"><button type="button" class="btn" data-ubah="${esc(x.id)}">Ubah</button>
            <button type="button" class="btn bahaya" data-padam="${esc(x.id)}">Padam</button></div>`}</div>`).join('')
        : `<div class="kosong">Tiada rekod untuk ${bln}.${s ? '' : '<br><button type="button" class="btn" data-catat-bulan>+ Catat kelas</button>'}</div>`);
  }
}

export function initSenaraiPage({ onUbah, onCatatBulan, onRender }) {
  $('senarai').onclick = async e => {
    const btnUbah = e.target.closest('[data-ubah]');
    if (btnUbah) return onUbah(btnUbah.dataset.ubah);

    const btnCatat = e.target.closest('[data-catat-bulan]');
    if (btnCatat) return onCatatBulan();

    const btnPadam = e.target.closest('[data-padam]');
    if (!btnPadam) return;
    const id = btnPadam.dataset.padam;
    const x = state.entri.find(item => item.id === id);
    if (!x) return;

    const sah = await sahkan(
      'Padam Rekod?',
      `Padam rekod ${tarikhTeks(x.tarikh)} (${x.tingkatan}) daripada senarai?`,
      'Padam',
      true
    );
    if (!sah) return;

    try {
      await api({ action: 'padam', entri: { id } });
      setGilir(gilir().filter(q => q.id !== id));
      state.entri = state.entri.filter(item => item.id !== id);
      kemasCacheDariState();
      onRender();
      mesej('Dipadam');
    } catch (err) {
      mesej(err.message, true);
    }
  };
}
