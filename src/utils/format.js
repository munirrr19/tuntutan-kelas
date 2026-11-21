export const $ = id => document.getElementById(id);

export const rm = n => n.toFixed(2);

export const jamTeks = j => String(+j.toFixed(2)); // contoh: 0.75, 1.25, 2

export const jumlah = senarai => senarai.reduce((s, x) => s + x.jam, 0);

export const pecah = (arr, n) =>
  arr.length
    ? Array.from({ length: Math.ceil(arr.length / n) }, (_, i) => arr.slice(i * n, i * n + n))
    : [[]];

export const esc = s =>
  String(s ?? '').replace(/[&<>"']/g, c => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[c]));

export const namaSurat = n =>
  String(n).toLowerCase().replace(/[^\s-]+/g, w =>
    /^(bin|binti|bt)$/.test(w) ? w : w[0].toUpperCase() + w.slice(1)
  );
