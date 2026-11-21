import { state } from './state/store.js';
import { $ } from './utils/format.js';
import { api, initTokenDariHash, token } from './services/api.js';
import { bacaCache, tulisCache } from './services/cache.js';
import { gilir, hantar } from './services/syncQueue.js';
import { initToast, kemasSync, mesej } from './components/toast.js';
import { bukaJadual, initModalJadual } from './components/modal.js';
import { initMonthPickers, kemasMonthPickers } from './components/monthPicker.js';
import { skalaBorang } from './components/printTemplates.js';
import {
  catatBulanIni,
  initCatatPage,
  isiTingkatan,
  kemasBannerKunci,
  kemasRingkas,
  lukisChipsTingkatan,
  mulaUbah,
  resetCatat,
} from './pages/catatPage.js';
import { initSenaraiPage, lukisSenarai } from './pages/senaraiPage.js';
import { initBorangPage, lukisBorang } from './pages/borangPage.js';
import { initTetapanPage, isiTetapan } from './pages/tetapanPage.js';
import { cetakGuru, initAdminPage, kemasJadual, lukisAdmin } from './pages/adminPage.js';

function tukarTab(nama) {
  document.querySelectorAll('nav button').forEach(b => {
    const aktif = b.dataset.tab === nama;
    b.classList.toggle('aktif', aktif);
    if (aktif) b.setAttribute('aria-current', 'page');
    else b.removeAttribute('aria-current');
  });
  document.querySelectorAll('section').forEach(s => s.classList.toggle('aktif', s.id === 'tab-' + nama));
  if (nama === 'borang' || nama === 'admin') skalaBorang();
}

function lukis() {
  kemasMonthPickers();
  $('bannerToken').hidden = !!token();
  $('fCatat').hidden = !token();
  for (const t of ['borang', 'tetapan']) {
    document.querySelector(`nav [data-tab=${t}]`).hidden = !token();
  }
  kemasBannerKunci();
  lukisSenarai();
  lukisBorang();
  if (state.guru.admin) lukisAdmin();
  skalaBorang();
}

function gunaData(d) {
  state.guru = d.guru;
  state.entri = d.entri
    .filter(x => !gilir().some(q => q.id === x.id))
    .concat(gilir().map(q => ({ ...q, guru: state.guru.id })));
  state.kadarSejam = d.kadar;
  state.intensif = Number(d.intensif) || 0;

  const t = $('tingkatan').value;
  isiTingkatan(state.intensif);
  $('tingkatan').value = state.idUbah ? t : (t || localStorage.getItem('tingkatanAkhir') || '');
  if (!$('tingkatan').value) $('tingkatan').value = '';

  state.semuaGuru = d.semuaGuru || [];
  state.selesai = d.selesai || [];
  state.jadual = d.jadual || null;
  kemasJadual();

  $('navAdmin').hidden = !state.guru.admin;
  $('namaHeader').textContent = state.guru.nama ? `${state.guru.nama} · MTAQ` : 'MTAQ Pulai Chondong';

  isiTetapan();
  lukis();
  kemasRingkas();
  lukisChipsTingkatan();
  kemasBannerKunci();
}

async function muat() {
  const tahun = state.tahunDimuat;
  const c = bacaCache(tahun);
  if (c) {
    state.sedangMuat = false;
    gunaData(c);
  } else {
    state.sedangMuat = true;
    lukis();
  }
  state.menyegar = !!token();
  kemasSync();
  try {
    const d = await api();
    if (tahun !== state.tahunDimuat) return;
    tulisCache(tahun, d);
    state.sedangMuat = false;
    gunaData(d);
    hantar(lukis);
  } catch (e) {
    state.sedangMuat = false;
    if (!c) {
      $('namaHeader').textContent = 'MTAQ Pulai Chondong';
      lukis();
    }
    if (token()) mesej(e.message, true);
  } finally {
    state.menyegar = false;
    kemasSync();
  }
}

function tukarBulan(b) {
  state.bulan = b;
  lukis();
  if (b.slice(0, 4) !== state.tahunDimuat) {
    state.tahunDimuat = b.slice(0, 4);
    muat();
  }
}

function mula() {
  initTokenDariHash();
  initToast();
  initModalJadual();

  $('btnJadual').onclick = bukaJadual;
  $('syncPill').onclick = () => hantar(lukis);
  document.querySelectorAll('nav button').forEach(b => {
    b.onclick = () => tukarTab(b.dataset.tab);
  });

  initMonthPickers(tukarBulan);
  document.querySelectorAll('[data-cetak="borang"]').forEach(btn => { btn.onclick = () => print(); });
  document.querySelectorAll('[data-cetak="admin"]').forEach(btn => { btn.onclick = () => cetakGuru(null); });

  initCatatPage({ onTukartab: tukarTab, onBulanTukar: tukarBulan, onRender: lukis });
  initSenaraiPage({ onUbah: mulaUbah, onCatatBulan: catatBulanIni, onRender: lukis });
  initBorangPage({ onRender: lukis });
  initTetapanPage({ onRender: lukis });
  initAdminPage();

  new ResizeObserver(skalaBorang).observe($('borang'));
  new ResizeObserver(skalaBorang).observe($('borangAdmin'));

  addEventListener('online', () => { kemasSync(); hantar(lukis); });
  addEventListener('offline', kemasSync);
  addEventListener('beforeunload', e => { if (gilir().length) e.preventDefault(); });

  kemasSync();
  resetCatat();
  lukis();
  muat();
}

mula();
