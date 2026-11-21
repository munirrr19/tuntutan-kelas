import { state } from '../state/store.js';
import { token } from './api.js';

export function bacaCache(tahun) {
  try {
    const c = JSON.parse(localStorage.getItem('cache_' + tahun) || 'null');
    return c && c.token === token() ? c.d : null;
  } catch {
    return null;
  }
}

export function tulisCache(tahun, d) {
  try {
    localStorage.setItem('cache_' + tahun, JSON.stringify({ token: token(), d }));
  } catch {}
}

/**
 * Segerakkan cache tahun semasa selepas mutasi tempatan supaya muat semula tidak memaparkan data lama.
 */
export function kemasCacheDariState() {
  if (!token() || !state.guru.id) return;
  tulisCache(state.tahunDimuat, {
    ok: true,
    guru: state.guru,
    kadar: state.kadarSejam,
    intensif: state.intensif,
    entri: state.entri,
    semuaGuru: state.semuaGuru,
    selesai: state.selesai,
    jadual: state.jadual,
  });
}
