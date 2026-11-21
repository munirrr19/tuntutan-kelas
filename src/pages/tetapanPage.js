import { state } from '../state/store.js';
import { $ } from '../utils/format.js';
import { api } from '../services/api.js';
import { kemasCacheDariState } from '../services/cache.js';
import { mesej } from '../components/toast.js';

export function isiTetapan() {
  $('tNama').value = state.guru.nama || '';
  $('tKp').value = state.guru.kp || '';
  $('tTel').value = state.guru.telefon || '';
}

export function initTetapanPage({ onRender }) {
  $('fTetapan').onsubmit = async e => {
    e.preventDefault();
    const profil = {
      nama: $('tNama').value.trim(),
      kp: $('tKp').value.trim(),
      telefon: $('tTel').value.trim(),
    };
    try {
      await api({ action: 'profil', profil });
      Object.assign(state.guru, profil);
      state.semuaGuru.filter(g => g.id === state.guru.id).forEach(g => Object.assign(g, profil));
      kemasCacheDariState();
      $('namaHeader').textContent = state.guru.nama ? `${state.guru.nama} · MTAQ` : 'MTAQ Pulai Chondong';
      mesej('Tetapan disimpan');
      onRender();
    } catch (err) {
      mesej(err.message, true);
    }
  };
}
