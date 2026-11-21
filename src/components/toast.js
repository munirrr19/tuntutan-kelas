import { state } from '../state/store.js';
import { $ } from '../utils/format.js';

export function mesej(teks, ralat = false) {
  const m = $('mesej');
  $('mesejTeks').textContent = teks;
  m.classList.toggle('err', ralat);
  m.setAttribute('role', ralat ? 'alert' : 'status');
  m.style.display = 'flex';
  clearTimeout(mesej.t);
  if (!ralat) mesej.t = setTimeout(() => { m.style.display = 'none'; }, 2600);
}

export function initToast() {
  $('mesejTutup').onclick = () => { $('mesej').style.display = 'none'; };
}

export function kemasSync() {
  const pill = $('syncPill');
  const q = JSON.parse(localStorage.getItem('gilir') || '[]').length;
  pill.className = 'sync-pill' + (!navigator.onLine ? ' offline' : (state.menghantar || q || state.menyegar) ? ' sibuk' : '');
  $('syncTeks').textContent = !navigator.onLine
    ? 'Luar talian'
    : (state.menghantar || q)
      ? `Menghantar (${q || 1})`
      : state.menyegar
        ? 'Menyegar...'
        : 'Disegerak';
}
