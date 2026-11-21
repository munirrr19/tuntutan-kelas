import { PILIHAN_MASA, TINGKATAN } from '../config/appConfig.js';
import { state } from '../state/store.js';
import { bertindih, hariTeks, hhmm, kiraJam, masaTeks, minit, tarikhTeks } from '../utils/dateTime.js';
import { $, esc, jamTeks, rm } from '../utils/format.js';
import { kemasCacheDariState } from '../services/cache.js';
import { gilir, hantar, setGilir } from '../services/syncQueue.js';
import { sahkan } from '../components/modal.js';
import { mesej } from '../components/toast.js';
import { statusSelesai } from '../components/printTemplates.js';

let tempoh = 120;
let callbacks = { onTukartab: () => {}, onBulanTukar: () => {}, onRender: () => {} };

export function isiTingkatan(intensif) {
  $('tingkatan').innerHTML =
    '<option value="" disabled>Pilih tingkatan...</option>' +
    TINGKATAN.map(t => `<option>${t}</option>`).join('') +
    (intensif
      ? `<optgroup label="Kelas Intensif">${Array.from({ length: intensif }, (_, i) => `<option>Kelas ${i + 1}</option>`).join('')}</optgroup>`
      : '');
  lukisChipsTingkatan();
}

export function lukisChipsTingkatan() {
  const sediaAda = [...$('tingkatan').options].map(o => o.value).filter(Boolean);
  let kerap = JSON.parse(localStorage.getItem('tingkatanKerap') || '["4A","4B","Syahadah","Tahsin"]');
  kerap = kerap.filter(t => sediaAda.includes(t));
  // Lengkapkan sehingga 4 chip (selepas simpan pertama, senarai kerap hanya ada 1)
  for (const t of ['4A', '4B', 'Syahadah', 'Tahsin', ...sediaAda]) {
    if (kerap.length < 4 && sediaAda.includes(t) && !kerap.includes(t)) kerap.push(t);
  }
  kerap = kerap.slice(0, 4);
  const semasa = $('tingkatan').value;
  // Pilihan semasa sentiasa nampak sebagai chip aktif, walaupun bukan antara yang kerap
  if (semasa && !kerap.includes(semasa)) kerap = [...kerap.slice(0, 3), semasa];
  $('chipsTingkatan').innerHTML = kerap
    .map(t => `<button type="button" class="chip${t === semasa ? ' aktif' : ''}" aria-pressed="${t === semasa}" data-tingkatan="${esc(t)}">${esc(t)}</button>`)
    .join('');
}

export function kemasBannerKunci() {
  const t = $('tarikh').value;
  $('bannerKunci').style.display = t && state.guru.id && statusSelesai(state.guru.id, t.slice(0, 7)) ? 'flex' : 'none';
}

export function paparTarikh() {
  const v = $('tarikh').value;
  $('tarikhPapar').textContent = v ? `${tarikhTeks(v)} (${hariTeks(v)})` : 'Pilih tarikh';
  kemasBannerKunci();
}

function setTamat(minitTambah) {
  const t = Math.min(minit($('mula').value) + minitTambah, 23 * 60);
  $('tamat').value = hhmm(t);
  kemasRingkas();
}

function setMulaPreset(t) {
  const d = Math.max(minit($('tamat').value) - minit($('mula').value), 30);
  $('mula').value = t;
  setTamat(d);
}

export function kemasRingkas() {
  const j = kiraJam($('mula').value, $('tamat').value);
  const el = $('ringkasCatat');
  if (j > 0) {
    el.className = 'ringkas tabular';
    el.innerHTML = `<span>${jamTeks(j)} jam × RM${state.kadarSejam}</span><span>RM${rm(j * state.kadarSejam)}</span>`;
  } else {
    el.className = 'ringkas ralat';
    el.textContent = 'Masa tamat mesti selepas masa mula';
  }
  const adaTingkatan = !!$('tingkatan').value;
  $('btnSimpan').disabled = !(j > 0 && adaTingkatan);
  $('petunjukSimpan').hidden = adaTingkatan;
}

export function resetCatat() {
  state.idUbah = null;
  $('tarikh').value = new Date().toLocaleDateString('en-CA');
  $('tingkatan').value = localStorage.getItem('tingkatanAkhir') || '';
  if (!$('tingkatan').value) $('tingkatan').value = '';
  $('mula').value = localStorage.getItem('mulaAkhir') || '08:00';
  $('catatan').value = '';
  $('btnSimpan').textContent = 'Simpan';
  $('btnBatal').style.display = 'none';
  paparTarikh();
  lukisChipsTingkatan();
  setTamat(120);
}

export function mulaUbah(id) {
  const x = state.entri.find(e => e.id === id);
  if (!x) return;
  state.idUbah = id;
  if (![...$('tingkatan').options].some(o => o.value === x.tingkatan)) {
    $('tingkatan').add(new Option(x.tingkatan));
  }
  for (const k of ['tarikh', 'tingkatan', 'mula', 'tamat', 'catatan']) $(k).value = x[k];
  $('btnSimpan').textContent = 'Kemas kini';
  $('btnBatal').style.display = 'block';
  paparTarikh();
  lukisChipsTingkatan();
  kemasRingkas();
  callbacks.onTukartab('catat');
}

export function catatBulanIni() {
  if (!$('tarikh').value.startsWith(state.bulan)) {
    $('tarikh').value = state.bulan + '-01';
    paparTarikh();
  }
  callbacks.onTukartab('catat');
}

export function initCatatPage(opts) {
  callbacks = opts;
  isiTingkatan(0);
  for (const id of ['mula', 'tamat']) {
    $(id).innerHTML = PILIHAN_MASA.map(t => `<option value="${t}">${masaTeks(t)}</option>`).join('');
  }

  $('chipsTingkatan').onclick = e => {
    const btn = e.target.closest('[data-tingkatan]');
    if (!btn) return;
    $('tingkatan').value = btn.dataset.tingkatan;
    lukisChipsTingkatan();
    kemasRingkas();
  };

  $('tingkatan').onchange = () => {
    lukisChipsTingkatan();
    kemasRingkas();
  };

  $('tarikh').onchange = paparTarikh;
  $('tarikh').onclick = () => { try { $('tarikh').showPicker(); } catch {} };

  document.querySelectorAll('.preset [data-preset]').forEach(btn => {
    btn.onclick = () => setMulaPreset(btn.dataset.preset);
  });
  document.querySelectorAll('[data-minit]').forEach(b => {
    b.onclick = () => setTamat(Number(b.dataset.minit));
  });

  $('mula').onfocus = () => { tempoh = Math.max(minit($('tamat').value) - minit($('mula').value), 15); };
  $('mula').onchange = () => setTamat(tempoh);
  $('tamat').onchange = kemasRingkas;
  $('btnBatal').onclick = resetCatat;
  $('btnKeBorang').onclick = () => callbacks.onTukartab('borang');

  $('fCatat').onsubmit = async e => {
    e.preventDefault();
    if (!$('tingkatan').value) return mesej('Sila pilih tingkatan dahulu', true);
    const r = {
      id: state.idUbah || crypto.randomUUID(),
      tarikh: $('tarikh').value,
      tingkatan: $('tingkatan').value,
      mula: $('mula').value,
      tamat: $('tamat').value,
      catatan: $('catatan').value.trim(),
      guru: state.guru.id,
    };
    r.jam = kiraJam(r.mula, r.tamat);
    if (statusSelesai(state.guru.id, r.tarikh.slice(0, 7))) {
      return mesej('Bulan ini telah ditandakan SELESAI. Buka semula di tab Borang.', true);
    }
    const tindih = state.entri.find(
      x => x.guru === state.guru.id && x.id !== r.id && x.tarikh === r.tarikh && bertindih(x, r)
    );
    if (
      tindih &&
      !(await sahkan(
        'Masa bertindih',
        `Bertindih dengan rekod ${tindih.tingkatan} (${masaTeks(tindih.mula)} – ${masaTeks(tindih.tamat)}). Simpan juga?`,
        'Simpan juga'
      ))
    ) {
      return;
    }

    setGilir(gilir().filter(x => x.id !== r.id).concat(r));
    state.entri = state.entri.filter(x => x.id !== r.id).concat(r);
    kemasCacheDariState();

    localStorage.setItem('tingkatanAkhir', r.tingkatan);
    localStorage.setItem('mulaAkhir', r.mula);
    const kerap = [
      r.tingkatan,
      ...JSON.parse(localStorage.getItem('tingkatanKerap') || '[]').filter(x => x !== r.tingkatan),
    ].slice(0, 4);
    localStorage.setItem('tingkatanKerap', JSON.stringify(kerap));

    mesej(state.idUbah ? 'Dikemas kini' : 'Disimpan');
    resetCatat();
    callbacks.onBulanTukar(r.tarikh.slice(0, 7));
    $('tarikh').value = r.tarikh;
    paparTarikh();
    hantar(callbacks.onRender);
  };
}
