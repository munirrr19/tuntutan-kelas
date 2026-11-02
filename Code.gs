// Backend Google Apps Script untuk Tuntutan Kelas.
// Tampal dalam Extensions > Apps Script pada Google Sheet anda. Lihat README.md.

const DATA = 'Kehadiran';
const TETAPAN = 'Tetapan';
const LAJUR = ['id', 'tarikh', 'tingkatan', 'mula', 'tamat', 'jam', 'catatan'];

// Jalankan SEKALI dari editor: sediakan tab dan jana token. Token keluar dalam Log.
function setup() {
  const ss = SpreadsheetApp.getActive();
  const data = ss.getSheetByName(DATA) || ss.insertSheet(DATA);
  data.getRange(1, 1, 1, LAJUR.length).setValues([LAJUR]);
  // Simpan sebagai teks supaya Sheet tidak tukar tarikh/masa kepada format lain
  data.getRange('A:G').setNumberFormat('@');
  const tetapan = ss.getSheetByName(TETAPAN) || ss.insertSheet(TETAPAN);
  if (tetapan.getLastRow() === 0) tetapan.appendRow(['kunci', 'nilai']);
  tetapan.getRange('A:B').setNumberFormat('@');

  const props = PropertiesService.getScriptProperties();
  if (!props.getProperty('TOKEN')) props.setProperty('TOKEN', Utilities.getUuid());
  Logger.log('TOKEN anda: ' + props.getProperty('TOKEN'));
}

function semakToken_(token) {
  const sebenar = PropertiesService.getScriptProperties().getProperty('TOKEN');
  if (!sebenar || token !== sebenar) throw new Error('Token tidak sah');
}

function jawab_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function baris_(nama) {
  const sh = SpreadsheetApp.getActive().getSheetByName(nama);
  return sh.getDataRange().getValues().slice(1);
}

// GET: pulangkan semua kehadiran + tetapan dalam satu panggilan
function doGet(e) {
  try {
    semakToken_(e.parameter.token);
    const entri = baris_(DATA).filter(r => r[0]).map(r => {
      const o = {};
      LAJUR.forEach((k, i) => o[k] = String(r[i]));
      o.jam = Number(o.jam);
      return o;
    });
    const tetapan = {};
    baris_(TETAPAN).forEach(r => { if (r[0]) tetapan[r[0]] = String(r[1]); });
    return jawab_({ ok: true, entri, tetapan });
  } catch (err) {
    return jawab_({ ok: false, ralat: err.message });
  }
}

// POST (body JSON sebagai text/plain): simpan | padam | tetapan
function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const b = JSON.parse(e.postData.contents);
    semakToken_(b.token);
    const ss = SpreadsheetApp.getActive();

    if (b.action === 'simpan' || b.action === 'padam') {
      const sh = ss.getSheetByName(DATA);
      const ids = sh.getRange(1, 1, sh.getLastRow(), 1).getValues().map(r => String(r[0]));
      const idx = ids.indexOf(String(b.entri.id));
      if (b.action === 'padam') {
        if (idx > 0) sh.deleteRow(idx + 1);
      } else {
        const r = b.entri;
        if (!/^\d{4}-\d{2}-\d{2}$/.test(r.tarikh) || !(Number(r.jam) > 0)) throw new Error('Data tidak sah');
        const nilai = [LAJUR.map(k => String(r[k] ?? ''))];
        if (idx > 0) sh.getRange(idx + 1, 1, 1, LAJUR.length).setValues(nilai);
        else sh.getRange(sh.getLastRow() + 1, 1, 1, LAJUR.length).setNumberFormat('@').setValues(nilai);
      }
    } else if (b.action === 'tetapan') {
      const sh = ss.getSheetByName(TETAPAN);
      sh.getRange(2, 1, Math.max(sh.getLastRow() - 1, 1), 2).clearContent();
      const rows = Object.entries(b.tetapan).map(([k, v]) => [k, String(v)]);
      if (rows.length) sh.getRange(2, 1, rows.length, 2).setValues(rows);
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
