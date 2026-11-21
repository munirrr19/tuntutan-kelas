import { state } from '../state/store.js';
import { namaBulan, tarikhTeks } from '../utils/dateTime.js';
import { $, esc, jamTeks, jumlah, rm } from '../utils/format.js';
import { kecilkanImej } from '../utils/image.js';
import { api } from '../services/api.js';
import { kemasCacheDariState } from '../services/cache.js';
import { mesej } from '../components/toast.js';
import {
  borangHTML,
  entriBulan,
  ringkasanHTML,
  senaraiBayaran,
  skalaBorang,
  statusSelesai,
  suratHTML,
} from '../components/printTemplates.js';

export function kemasJadual() {
  $('btnJadual').hidden = !state.jadual;
  $('statusJadual').textContent =
    (state.jadual ? 'Jadual semasa dimuat naik ' + tarikhTeks(state.jadual.masa) : 'Belum ada jadual') +
    '. Muat naik PDF atau gambar baharu untuk menggantikannya.';
}

export function lukisAdmin() {
  const semua = state.semuaGuru
    .map(g => ({ g, senarai: entriBulan(g.id), s: statusSelesai(g.id) }))
    .sort((a, b) => a.g.nama.localeCompare(b.g.nama, 'ms'));
  const ada = senaraiBayaran();
  const jam = ada.reduce((s, x) => s + jumlah(x.senarai), 0);
  const siap = semua.filter(x => x.s).length;
  const peratus = semua.length ? Math.round((siap / semua.length) * 100) : 0;

  const tapis = semua.filter(x => {
    if (state.adminTapis === 'belum' && x.s) return false;
    if (state.adminTapis === 'selesai' && !x.s) return false;
    if (state.adminCari && !x.g.nama.toLowerCase().includes(state.adminCari.toLowerCase())) return false;
    return true;
  });

  $('ringkasAdmin').innerHTML = semua.length
    ? `<div style="display:flex;justify-content:space-between;align-items:baseline;gap:8px">
         <b class="tabular">${siap}/${semua.length} guru selesai</b>
         <b class="tabular" style="color:var(--hijau)">${jamTeks(jam)} jam · RM${rm(jam * state.kadarSejam)}</b>
       </div>
       <div class="progress-wrap"><div class="progress-bar" style="width:${peratus}%"></div></div>
       <input type="search" id="adminCariInput" aria-label="Cari nama guru" placeholder="Cari nama guru..." value="${esc(state.adminCari)}" style="margin-bottom:8px">
       <div class="chips" style="margin-bottom:10px">
         <button type="button" class="chip${state.adminTapis === 'semua' ? ' aktif' : ''}" data-tapis="semua">Semua (${semua.length})</button>
         <button type="button" class="chip${state.adminTapis === 'belum' ? ' aktif' : ''}" data-tapis="belum">Belum (${semua.length - siap})</button>
         <button type="button" class="chip${state.adminTapis === 'selesai' ? ' aktif' : ''}" data-tapis="selesai">Selesai (${siap})</button>
       </div>` +
      (tapis.length
        ? tapis.map(({ g, senarai, s }) => `<div class="item"><div class="item-isi">
            <div class="item-atas"><b>${esc(g.nama) || '(tiada nama)'}</b>
            <span class="lencana ${s ? 'lencana-hijau' : 'lencana-merah'}">${s ? '✓ Selesai' : 'Belum'}</span></div>
            <small class="tabular">${senarai.length ? `${senarai.length} kelas · ${jamTeks(jumlah(senarai))} jam · RM${rm(jumlah(senarai) * state.kadarSejam)}` : 'Tiada rekod'}</small></div>
            ${senarai.length ? `<button type="button" class="btn btn-cetak" data-cetak-guru="${esc(g.id)}">Cetak</button>` : ''}</div>`).join('')
        : '<div class="kosong">Tiada guru yang sepadan</div>')
    : '<div class="kosong">Tiada guru</div>';

  $('borangAdmin').innerHTML = ada
    .filter(x => !state.pilihCetak || x.g.id === state.pilihCetak)
    .map(x => borangHTML(x.g, x.senarai))
    .join('');
  skalaBorang();
}

export function cetakGuru(id) {
  state.pilihCetak = id;
  lukisAdmin();
  print();
  state.pilihCetak = null;
  lukisAdmin();
}

export function initAdminPage() {
  $('ringkasAdmin').onclick = e => {
    const btnTapis = e.target.closest('[data-tapis]');
    if (btnTapis) {
      state.adminTapis = btnTapis.dataset.tapis;
      lukisAdmin();
      return;
    }
    const btnCetak = e.target.closest('[data-cetak-guru]');
    if (btnCetak) cetakGuru(btnCetak.dataset.cetakGuru);
  };

  $('ringkasAdmin').oninput = e => {
    if (e.target.id !== 'adminCariInput') return;
    const pos = e.target.selectionStart;
    state.adminCari = e.target.value;
    lukisAdmin();
    // Kekalkan fokus dan kedudukan kursor semasa menaip dalam input carian
    const inp = $('adminCariInput');
    if (inp) {
      inp.focus();
      inp.setSelectionRange(pos, pos);
    }
  };

  $('btnCetakRingkasan').onclick = () => {
    $('borangAdmin').innerHTML = ringkasanHTML();
    skalaBorang();
    print();
    lukisAdmin();
  };

  $('btnSuratClaim').onclick = () => {
    if (!senaraiBayaran().length) return mesej('Tiada rekod untuk bulan ini', true);
    const tajuk = document.title;
    document.title = `Surat Tuntutan ${namaBulan(state.bulan)}`;
    $('borangAdmin').innerHTML = suratHTML();
    skalaBorang();
    print();
    document.title = tajuk;
    lukisAdmin();
  };

  $('inputJadual').onchange = async e => {
    const input = e.target;
    const fail = input.files[0];
    input.value = '';
    if (!fail) return;
    try {
      const blob = fail.type === 'application/pdf' ? fail : await kecilkanImej(fail);
      if (blob.size > 10e6) throw new Error('Fail terlalu besar (maksimum 10MB)');
      mesej('Memuat naik jadual...');
      const data = await new Promise((ok, gagal) => {
        const r = new FileReader();
        r.onload = () => ok(r.result.split(',')[1]);
        r.onerror = gagal;
        r.readAsDataURL(blob);
      });
      const d = await api({ action: 'jadual', mime: blob.type, data });
      state.jadual = d.jadual;
      kemasJadual();
      kemasCacheDariState();
      mesej('Jadual dikemas kini');
    } catch (err) {
      mesej(err.message || 'Gagal memuat naik', true);
    }
  };
}
