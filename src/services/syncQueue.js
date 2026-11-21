import { state } from '../state/store.js';
import { tarikhTeks } from '../utils/dateTime.js';
import { api, token } from './api.js';
import { kemasCacheDariState } from './cache.js';
import { kemasSync, mesej } from '../components/toast.js';

export const gilir = () => JSON.parse(localStorage.getItem('gilir') || '[]');

export function setGilir(q) {
  localStorage.setItem('gilir', JSON.stringify(q));
  kemasSync();
}

export async function hantar(onChange) {
  if (state.menghantar || !token()) return;
  state.menghantar = true;
  kemasSync();
  try {
    for (let q = gilir(); q.length; q = gilir()) {
      const r = q[0];
      const sama = x => JSON.stringify(x) === JSON.stringify(r);
      try {
        await api({ action: 'simpan', entri: r });
      } catch (err) {
        if (!err.pelayan) {
          mesej(`${q.length} rekod belum dihantar. Penghantaran akan dicuba semula.`);
          clearTimeout(hantar.t);
          hantar.t = setTimeout(() => hantar(onChange), 30000);
          return;
        }
        state.entri = state.entri.filter(x => x.id !== r.id);
        kemasCacheDariState();
        if (onChange) onChange();
        mesej(`Rekod ${tarikhTeks(r.tarikh)} ditolak: ${err.message}`, true);
      }
      setGilir(gilir().filter(x => !sama(x)));
    }
  } finally {
    state.menghantar = false;
    kemasSync();
  }
}
