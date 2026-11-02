// Backend Google Apps Script untuk Tuntutan Kelas (ramai guru).
// Tampal dalam Extensions > Apps Script pada Google Sheet sekolah. Lihat README.md.

const SITE = 'https://munirrr19.github.io/tuntutan-kelas/';
const DATA = 'Kehadiran';
const GURU = 'Guru';
const TETAPAN = 'Tetapan';
const SELESAI = 'Selesai'; // guru | bulan (yyyy-mm) | masa: bulan yang guru tanda siap untuk dituntut
const LAJUR = ['id', 'tarikh', 'tingkatan', 'mula', 'tamat', 'jam', 'catatan', 'guru'];
const LAJUR_GURU = ['id', 'nama', 'kp', 'telefon', 'token', 'admin', 'link'];

function onOpen() {
  SpreadsheetApp.getUi().createMenu('Tuntutan Kelas').addItem('Jana token & link guru', 'janaLink').addToUi();
}

// Jalankan dari editor selepas tampal kod. Selamat dijalankan berulang kali.
function setup() {
  const ss = SpreadsheetApp.getActive();
  const data = ss.getSheetByName(DATA) || ss.insertSheet(DATA);
  data.getRange(1, 1, 1, LAJUR.length).setValues([LAJUR]);
  // Simpan sebagai teks supaya Sheet tidak tukar tarikh/masa kepada format lain
  data.getRange('A:H').setNumberFormat('@');
  const tetapan = ss.getSheetByName(TETAPAN) || ss.insertSheet(TETAPAN);
  if (tetapan.getLastRow() === 0) tetapan.appendRow(['kunci', 'nilai']);
  tetapan.getRange('A:B').setNumberFormat('@');
  const guru = ss.getSheetByName(GURU) || ss.insertSheet(GURU);
  guru.getRange(1, 1, 1, LAJUR_GURU.length).setValues([LAJUR_GURU]);
  guru.getRange('A:G').setNumberFormat('@');

  // Migrasi dari versi seorang guru: pemilik token lama menjadi admin pertama
  const props = PropertiesService.getScriptProperties();
  const lama = props.getProperty('TOKEN');
  if (lama && guru.getLastRow() === 1) {
    const t = {};
    baris_(TETAPAN).forEach(r => t[r[0]] = String(r[1]));
    const id = Utilities.getUuid().slice(0, 8);
    // setValues (bukan appendRow) supaya format teks dikekalkan dan sifar di depan tidak hilang
    guru.getRange(2, 1, 1, 7).setNumberFormat('@').setValues([[id, t.nama || '', t.kp || '', t.telefon || '', lama, 'ya', '']]);
    const n = data.getLastRow() - 1;
    if (n > 0) {
      const r = data.getRange(2, 8, n, 1);
      r.setValues(r.getValues().map(([g]) => [g || id]));
    }
    props.deleteProperty('TOKEN');
  }
  janaLink();
}

// Isi id, token dan link untuk setiap guru baru (baris yang ada nama)
function janaLink() {
  const sh = SpreadsheetApp.getActive().getSheetByName(GURU);
  const n = sh.getLastRow() - 1;
  if (n < 1) return;
  const r = sh.getRange(2, 1, n, LAJUR_GURU.length);
  r.setValues(r.getValues().map(g => {
    if (!g[1]) return g;
    if (!g[0]) g[0] = Utilities.getUuid().slice(0, 8);
    if (!g[4]) g[4] = Utilities.getUuid();
    g[6] = SITE + '#k=' + g[4];
    return g;
  }));
}

function helaiSelesai_() {
  const ss = SpreadsheetApp.getActive();
  let sh = ss.getSheetByName(SELESAI);
  if (!sh) {
    sh = ss.insertSheet(SELESAI);
    sh.getRange('A:C').setNumberFormat('@');
    sh.getRange(1, 1, 1, 3).setValues([['guru', 'bulan', 'masa']]);
  }
  return sh;
}

function baris_(nama) {
  return SpreadsheetApp.getActive().getSheetByName(nama).getDataRange().getValues().slice(1);
}

// Sheet menukar nombor seperti 0123456789 kepada 123456789 (cth bila tampal dari Excel); pulihkan sifar di depan
// (nombor Malaysia sentiasa bermula dengan 0; KP tanpa sengkang sentiasa 12 digit)
const telefon_ = v => /^[1-9][\d -]*$/.test(String(v)) ? '0' + v : String(v);
const kp_ = v => /^\d{9,11}$/.test(String(v)) ? String(v).padStart(12, '0') : String(v);
const profil_ = g => ({ id: String(g[0]), nama: String(g[1]), kp: kp_(g[2]), telefon: telefon_(g[3]) });

function cariGuru_(token) {
  const semua = baris_(GURU);
  const i = token ? semua.findIndex(r => String(r[4]) === String(token)) : -1;
  if (i < 0) throw new Error('Token tidak sah');
  return { baris: i + 2, ...profil_(semua[i]), admin: String(semua[i][5]).trim().toLowerCase() === 'ya' };
}

function jawab_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

// GET: rekod guru ini (admin: semua guru) + profil + kadar
function doGet(e) {
  try {
    const guru = cariGuru_(e.parameter.token);
    // shortcut: admin terima semua rekod sepanjang masa; tapis ikut tahun jika data jadi terlalu besar
    const entri = baris_(DATA).filter(r => r[0]).map(r => {
      const o = {};
      LAJUR.forEach((k, i) => o[k] = String(r[i]));
      o.jam = Number(o.jam);
      return o;
    }).filter(o => guru.admin || o.guru === guru.id);
    const t = {};
    baris_(TETAPAN).forEach(r => { if (r[0]) t[r[0]] = String(r[1]); });
    const selesai = helaiSelesai_().getDataRange().getValues().slice(1)
      .filter(r => r[0] && (guru.admin || String(r[0]) === guru.id))
      .map(r => ({ guru: String(r[0]), bulan: String(r[1]), masa: String(r[2]) }));
    const res = { ok: true, guru, kadar: Number(t.kadar) || 30, entri, selesai };
    if (guru.admin) {
      res.semuaGuru = baris_(GURU).filter(r => r[0]).map(profil_);
    }
    return jawab_(res);
  } catch (err) {
    return jawab_({ ok: false, ralat: err.message });
  }
}

// POST (body JSON sebagai text/plain): simpan | padam | profil
function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const b = JSON.parse(e.postData.contents);
    const guru = cariGuru_(b.token);
    const ss = SpreadsheetApp.getActive();
    const selesai = helaiSelesai_().getDataRange().getValues();
    const iSelesai = bulan => selesai.findIndex(r => String(r[0]) === guru.id && String(r[1]) === bulan);
    const kunci = tarikh => { if (iSelesai(String(tarikh).slice(0, 7)) > 0) throw new Error('Bulan ini sudah ditanda SELESAI'); };

    if (b.action === 'simpan' || b.action === 'padam') {
      const sh = ss.getSheetByName(DATA);
      // Cari id terus dalam lajur A; tidak perlu baca semua rekod (data membesar setiap bulan)
      const sel = sh.getRange('A:A').createTextFinder(String(b.entri.id)).matchEntireCell(true).findNext();
      const baris = sel && sel.getRow() > 1 ? sel.getRow() : 0;
      if (baris) {
        const lama = sh.getRange(baris, 1, 1, LAJUR.length).getValues()[0];
        // Guru hanya boleh ubah rekod sendiri (admin juga)
        if (String(lama[7]) !== guru.id) throw new Error('Bukan rekod anda');
        kunci(lama[1]);
      }
      if (b.action === 'padam') {
        if (baris) sh.deleteRow(baris);
      } else {
        const r = { ...b.entri, guru: guru.id };
        if (!/^\d{4}-\d{2}-\d{2}$/.test(r.tarikh) || !(Number(r.jam) > 0)) throw new Error('Data tidak sah');
        kunci(r.tarikh);
        const nilai = [LAJUR.map(k => String(r[k] ?? ''))];
        if (baris) sh.getRange(baris, 1, 1, LAJUR.length).setValues(nilai);
        else sh.getRange(sh.getLastRow() + 1, 1, 1, LAJUR.length).setNumberFormat('@').setValues(nilai);
      }
    } else if (b.action === 'profil') {
      const p = b.profil;
      ss.getSheetByName(GURU).getRange(guru.baris, 2, 1, 3).setNumberFormat('@').setValues([[String(p.nama), String(p.kp), String(p.telefon)]]);
    } else if (b.action === 'selesai') {
      if (!/^\d{4}-\d{2}$/.test(b.bulan)) throw new Error('Data tidak sah');
      const sh = helaiSelesai_(), i = iSelesai(b.bulan);
      if (b.batal) { if (i > 0) sh.deleteRow(i + 1); }
      else if (i < 0) sh.getRange(sh.getLastRow() + 1, 1, 1, 3).setNumberFormat('@')
        .setValues([[guru.id, b.bulan, Utilities.formatDate(new Date(), 'Asia/Kuala_Lumpur', 'yyyy-MM-dd HH:mm')]]);
    } else {
      throw new Error('Tindakan tidak dikenali');
    }
    return jawab_({ ok: true });
  } catch (err) {
    return jawab_({ ok: false, ralat: err.message });
  } finally {
    lock.releaseLock();
  }
}
