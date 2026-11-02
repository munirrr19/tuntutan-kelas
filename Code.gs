// Backend Google Apps Script untuk Tuntutan Kelas (ramai guru).
// Tampal dalam Extensions > Apps Script pada Google Sheet sekolah. Lihat README.md.

const SITE = 'https://munirrr19.github.io/tuntutan-kelas/';
const DATA = 'Kehadiran';
const GURU = 'Guru';
const TETAPAN = 'Tetapan';
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
    guru.appendRow([id, t.nama || '', t.kp || '', t.telefon || '', lama, 'ya', '']);
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

function baris_(nama) {
  return SpreadsheetApp.getActive().getSheetByName(nama).getDataRange().getValues().slice(1);
}

function cariGuru_(token) {
  const semua = baris_(GURU);
  const i = token ? semua.findIndex(r => String(r[4]) === String(token)) : -1;
  if (i < 0) throw new Error('Token tidak sah');
  const g = semua[i];
  return { baris: i + 2, id: String(g[0]), nama: String(g[1]), kp: String(g[2]), telefon: String(g[3]), admin: String(g[5]).trim().toLowerCase() === 'ya' };
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
    const res = { ok: true, guru, kadar: Number(t.kadar) || 30, entri };
    if (guru.admin) {
      res.semuaGuru = baris_(GURU).filter(r => r[0]).map(r => ({ id: String(r[0]), nama: String(r[1]), kp: String(r[2]), telefon: String(r[3]) }));
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

    if (b.action === 'simpan' || b.action === 'padam') {
      const sh = ss.getSheetByName(DATA);
      const rows = sh.getRange(1, 1, sh.getLastRow(), LAJUR.length).getValues();
      const idx = rows.findIndex(r => String(r[0]) === String(b.entri.id));
      // Guru hanya boleh ubah rekod sendiri (admin juga)
      if (idx > 0 && String(rows[idx][7]) !== guru.id) throw new Error('Bukan rekod anda');
      if (b.action === 'padam') {
        if (idx > 0) sh.deleteRow(idx + 1);
      } else {
        const r = { ...b.entri, guru: guru.id };
        if (!/^\d{4}-\d{2}-\d{2}$/.test(r.tarikh) || !(Number(r.jam) > 0)) throw new Error('Data tidak sah');
        const nilai = [LAJUR.map(k => String(r[k] ?? ''))];
        if (idx > 0) sh.getRange(idx + 1, 1, 1, LAJUR.length).setValues(nilai);
        else sh.getRange(sh.getLastRow() + 1, 1, 1, LAJUR.length).setNumberFormat('@').setValues(nilai);
      }
    } else if (b.action === 'profil') {
      const p = b.profil;
      ss.getSheetByName(GURU).getRange(guru.baris, 2, 1, 3).setValues([[String(p.nama), String(p.kp), String(p.telefon)]]);
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
