import { BULAN, BULAN_HIJRI, HARI } from '../config/appConfig.js';

export const minit = hhmm => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

export const hhmm = min =>
  String(Math.floor(min / 60)).padStart(2, '0') + ':' + String(min % 60).padStart(2, '0');

export const kiraJam = (mula, tamat) => (minit(tamat) - minit(mula)) / 60;

export function masaTeks(t) {
  const min = minit(t);
  const h = Math.floor(min / 60);
  const h12 = h % 12 || 12;
  const sufiks = h < 12 ? 'pg' : h < 19 ? 'ptg' : 'mlm';
  return `${h12}.${String(min % 60).padStart(2, '0')} ${sufiks}`;
}

export const tarikhTeks = t => t.split('-').reverse().join('/');

export const hariTeks = t => (t ? HARI[new Date(t + 'T00:00').getDay()] || '' : '');

export const namaBulan = bulan => BULAN[bulan.slice(5) - 1] + ' ' + bulan.slice(0, 4);

export const bertindih = (a, b) =>
  minit(a.mula) < minit(b.tamat) && minit(b.mula) < minit(a.tamat);

/**
 * Tukar tarikh Gregorian kepada tarikh Hijri (takwim Umm al-Qura).
 * Dilaraskan -1 hari agar selaras dengan takwim rasmi Malaysia.
 */
export function tarikhHijri(d) {
  const semalam = new Date(d.getFullYear(), d.getMonth(), d.getDate() - 1);
  const p = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  }).formatToParts(semalam);
  const v = k => parseInt(p.find(x => x.type === k).value, 10);
  return `${v('day')} ${BULAN_HIJRI[v('month') - 1]} ${v('year')}H`;
}
