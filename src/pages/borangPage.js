import { state } from '../state/store.js';
import { namaBulan, tarikhTeks } from '../utils/dateTime.js';
import { $ } from '../utils/format.js';
import { api } from '../services/api.js';
import { kemasCacheDariState } from '../services/cache.js';
import { gilir, hantar } from '../services/syncQueue.js';
import { sahkan } from '../components/modal.js';
import { mesej } from '../components/toast.js';
import { borangHTML, entriBulan, statusSelesai } from '../components/printTemplates.js';

export function lukisBorang() {
  const senarai = entriBulan(state.guru.id);
  const s = statusSelesai(state.guru.id);
  const bln = namaBulan(state.bulan);
  const teksSelesai = st => `✓ SELESAI · ${tarikhTeks(st.masa.slice(0, 10))}${st.masa.slice(10)}`;

  $('kotakSelesai').innerHTML = s
    ? `<div class="ringkas" style="margin:0">${teksSelesai(s)}</div>
       <button type="button" class="btn" style="width:100%;margin-top:8px" data-selesai="batal">Buka semula untuk ubah</button>`
    : `<small style="color:var(--kelabu)">Semak borang di bawah. Apabila semua kelas ${bln} telah diisi, tekan SELESAI supaya Setiausaha dapat memproses tuntutan.</small>
       <button type="button" class="btn utama" ${senarai.length ? '' : 'disabled aria-describedby="sebabLumpuh"'} data-selesai="sah">SELESAI</button>
       ${senarai.length ? '' : `<small id="sebabLumpuh" style="display:block;margin-top:8px;color:var(--kelabu);text-align:center">Belum ada rekod untuk dihantar bagi ${bln}.</small>`}`;

  $('borang').innerHTML = borangHTML(state.guru, senarai);
}

export function initBorangPage({ onRender }) {
  $('kotakSelesai').onclick = async e => {
    const btn = e.target.closest('[data-selesai]');
    if (!btn) return;
    const batal = btn.dataset.selesai === 'batal';
    const bln = namaBulan(state.bulan);

    const ok = await sahkan(
      batal ? `Buka semula ${bln}?` : `Tandakan ${bln} SELESAI?`,
      batal
        ? 'Status akan bertukar kepada BELUM SELESAI dan rekod boleh diubah semula.'
        : 'Rekod bulan ini akan dikunci supaya Setiausaha dapat memproses tuntutan.',
      batal ? 'Buka semula' : 'Ya, SELESAI'
    );
    if (!ok) return;

    mesej('Menghantar...');
    try {
      await hantar(onRender);
      if (gilir().some(q => q.tarikh.startsWith(state.bulan))) {
        throw new Error('Terdapat rekod bulan ini yang belum dihantar. Cuba lagi apabila sambungan internet tersedia.');
      }
      await api({ action: 'selesai', bulan: state.bulan, batal });
      state.selesai = state.selesai.filter(s => !(s.guru === state.guru.id && s.bulan === state.bulan));
      if (!batal) {
        state.selesai.push({
          guru: state.guru.id,
          bulan: state.bulan,
          masa: new Date().toLocaleString('sv').slice(0, 16),
        });
      }
      kemasCacheDariState();
      onRender();
      mesej(batal ? 'Dibuka semula' : 'Ditandakan SELESAI');
    } catch (err) {
      mesej(err.message, true);
    }
  };
}
