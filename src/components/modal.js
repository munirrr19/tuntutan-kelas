import { state } from '../state/store.js';
import { $ } from '../utils/format.js';

export function sahkan(tajuk, teks, labelTerus = 'Teruskan', bahaya = false) {
  return new Promise(resolve => {
    const asal = document.activeElement;
    $('modalTajuk').textContent = tajuk;
    $('modalTeks').textContent = teks;
    const btn = $('modalTerus');
    btn.textContent = labelTerus;
    btn.className = bahaya ? 'btn bahaya' : 'btn utama';
    btn.style.marginTop = '0';
    const dlg = $('modalLatar');
    if (dlg.open) dlg.close();
    dlg.showModal();
    $('modalBatal').focus();

    const tutup = ok => {
      dlg.oncancel = null;
      dlg.close();
      if (asal && asal.focus) asal.focus();
      resolve(ok);
    };

    dlg.oncancel = e => { e.preventDefault(); tutup(false); };
    $('modalBatal').onclick = () => tutup(false);
    $('modalLatar').onclick = e => { if (e.target === $('modalLatar')) tutup(false); };
    btn.onclick = () => tutup(true);
  });
}

export function bukaJadual() {
  if (!state.jadual) return;
  $('jadualBingkai').src = `https://drive.google.com/file/d/${state.jadual.id}/preview`;
  $('jadualPenuh').href = `https://drive.google.com/file/d/${state.jadual.id}/view`;
  $('jadualLatar').showModal();
}

export function initModalJadual() {
  $('jadualLatar').onclick = e => { if (e.target === $('jadualLatar')) $('jadualLatar').close(); };
  $('btnTutupJadual').onclick = () => $('jadualLatar').close();
}
