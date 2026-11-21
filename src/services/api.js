import { API } from '../config/appConfig.js';
import { state } from '../state/store.js';

export const token = () => localStorage.getItem('token') || '';

/**
 * Baca token daripada URL fragment (#k=...) sekali semasa mula dan bersihkan URL.
 */
export function initTokenDariHash() {
  const tokenDariHash = new URLSearchParams(location.hash.slice(1)).get('k');
  if (!tokenDariHash) return;
  if (tokenDariHash !== token() && (!token() || confirm('Tukar ke akaun lain?'))) {
    localStorage.setItem('token', tokenDariHash);
  }
  history.replaceState(null, '', location.pathname + location.search);
}

export async function api(body) {
  if (!token()) throw new Error('Sila buka pautan peribadi yang diberikan oleh admin');
  const res = body
    ? await fetch(API, { method: 'POST', body: JSON.stringify({ ...body, token: token() }) })
    : await fetch(`${API}?token=${encodeURIComponent(token())}&tahun=${state.tahunDimuat}`);
  const data = await res.json();
  if (!data.ok) throw Object.assign(new Error(data.ralat || 'Ralat pelayan'), { pelayan: true });
  return data;
}
