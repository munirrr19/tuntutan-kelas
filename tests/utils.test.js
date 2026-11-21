import test from 'node:test';
import assert from 'node:assert/strict';
import {
  bertindih,
  hariTeks,
  hhmm,
  kiraJam,
  masaTeks,
  minit,
  namaBulan,
  tarikhHijri,
  tarikhTeks,
  teksSelesai,
} from '../src/utils/dateTime.js';
import { esc, jamTeks, jumlah, namaSurat, pecah, rm } from '../src/utils/format.js';

test('kiraJam dan pemformatan masa berfungsi tepat', () => {
  assert.equal(minit('08:30'), 510);
  assert.equal(hhmm(510), '08:30');
  assert.equal(kiraJam('08:00', '10:00'), 2);
  assert.equal(kiraJam('14:00', '14:30'), 0.5);
  assert.equal(kiraJam('08:15', '10:15'), 2);
  assert.equal(jamTeks(kiraJam('08:00', '08:45')), '0.75');
  assert.equal(masaTeks('08:00'), '8.00 pg');
  assert.equal(masaTeks('12:30'), '12.30 ptg');
  assert.equal(masaTeks('20:00'), '8.00 mlm');
});

test('bertindih mengesan pertindihan selang masa dengan betul', () => {
  assert.equal(
    bertindih({ mula: '08:00', tamat: '10:00' }, { mula: '09:30', tamat: '11:00' }),
    true
  );
  assert.equal(
    bertindih({ mula: '08:00', tamat: '10:00' }, { mula: '10:00', tamat: '12:00' }),
    false
  );
});

test('tarikhTeks, hariTeks, namaBulan, teksSelesai dan tarikhHijri', () => {
  assert.equal(tarikhTeks('2026-11-21'), '21/11/2026');
  assert.equal(hariTeks('2026-11-21'), 'Sabtu');
  assert.equal(hariTeks(''), '');
  assert.equal(namaBulan('2026-11'), 'November 2026');
  assert.equal(teksSelesai({ masa: '2026-11-21 10:30' }), '✓ SELESAI · 21/11/2026 10:30');
  assert.equal(tarikhHijri(new Date(2026, 9, 5)), '23 Rabiulakhir 1448H');
});

test('pecah, rm, jumlah, esc dan namaSurat', () => {
  assert.equal(pecah([1, 2, 3], 2).length, 2);
  assert.equal(pecah([], 20).length, 1);
  assert.equal(rm(60), '60.00');
  assert.equal(jumlah([{ jam: 1.5 }, { jam: 0.75 }]), 2.25);
  assert.equal(esc(`<script>'test' & "ok"</script>`), '&lt;script&gt;&#39;test&#39; &amp; &quot;ok&quot;&lt;/script&gt;');
  assert.equal(namaSurat('MAGED AHMED ALI AL-QAIFI'), 'Maged Ahmed Ali Al-Qaifi');
  assert.equal(namaSurat('AHMAD MUNIR BIN RAHMAN'), 'Ahmad Munir bin Rahman');
});
