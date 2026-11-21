import { BARIS_SEHALAMAN, BULAN } from '../config/appConfig.js';
import { state } from '../state/store.js';
import { hariTeks, masaTeks, namaBulan, tarikhHijri, tarikhTeks } from '../utils/dateTime.js';
import { $, esc, jamTeks, jumlah, namaSurat, pecah, rm } from '../utils/format.js';

const KEPALA = `<div class="kepala"><img src="assets/logo.png" alt=""><div>
      <div class="ar">معهد تحفيظ القرءان والقراءات</div>
      <b>MAAHAD TAHFIZ AL QURAN WAL QIRAAT</b><b>16600 PULAI CHONDONG</b></div></div>`;

export const entriBulan = idGuru =>
  state.entri
    .filter(x => x.guru === idGuru && x.tarikh.startsWith(state.bulan))
    .sort((a, b) => (a.tarikh + a.mula).localeCompare(b.tarikh + b.mula));

export const statusSelesai = (idGuru, b = state.bulan) =>
  state.selesai.find(s => s.guru === idGuru && s.bulan === b);

export const senaraiBayaran = () =>
  state.semuaGuru
    .map(g => ({ g, senarai: entriBulan(g.id) }))
    .filter(x => x.senarai.length)
    .sort((a, b) => a.g.nama.localeCompare(b.g.nama, 'ms'));

export function borangHTML(profil, senarai) {
  const jumlahJam = jumlah(senarai);
  const [thn, bln] = state.bulan.split('-');
  const halaman = pecah(senarai, BARIS_SEHALAMAN);
  const selesaiPada = statusSelesai(profil.id);
  const kadar = state.kadarSejam;

  return halaman.map((h, hi) => `<div class="halaman">${KEPALA}
    <div class="tajuk">BORANG TUNTUTAN MENGAJAR KELAS AL-QURAN</div>
    <div class="medan" style="justify-content:flex-end"><b>BULAN :</b><span style="flex:0 0 35mm">${BULAN[bln - 1].toUpperCase()}</span><b>TAHUN :</b><span style="flex:0 0 25mm">${thn}</span></div>
    <div class="medan"><b>NAMA :</b><span>${esc(profil.nama)}</span></div>
    <div class="medan"><b>NO KAD PENGENALAN :</b><span>${esc(profil.kp)}</span><b>NO TELEFON :</b><span>${esc(profil.telefon)}</span></div>
    <p>Dengan ini, saya menuntut bayaran mengajar kelas Al Quran di Maahad Tahfiz Al Quran Wal Qiraat sebagaimana kenyataan berikut:</p>
    <table><thead><tr><th style="width:6%">BIL</th><th style="width:13%">TARIKH</th><th style="width:11%">HARI</th><th style="width:12%">TINGKATAN</th><th style="width:25%">MASA</th><th style="width:11%">JUMLAH JAM</th><th>CATATAN</th></tr></thead>
    <tbody>${Array.from({ length: BARIS_SEHALAMAN }, (_, i) => {
      const x = h[i];
      const bil = hi * BARIS_SEHALAMAN + i + 1;
      return x
        ? `<tr><td>${bil}</td><td>${tarikhTeks(x.tarikh)}</td><td>${hariTeks(x.tarikh)}</td><td>${esc(x.tingkatan)}</td><td>${masaTeks(x.mula)} – ${masaTeks(x.tamat)}</td><td>${jamTeks(x.jam)}</td><td>${esc(x.catatan)}</td></tr>`
        : `<tr><td>${bil}</td><td></td><td></td><td></td><td></td><td></td><td></td></tr>`;
    }).join('')}</tbody></table>
    ${hi < halaman.length - 1 ? '<p style="text-align:right"><i>bersambung...</i></p>' : `
    <p style="margin:5mm 0 0"><b>JUMLAH JAM MENGAJAR</b></p>
    <div class="kotak">JUMLAH KESELURUHAN JAM MENGAJAR <b>${jamTeks(jumlahJam)}</b> JAM X RM${kadar}<br>
      <b style="font-size:12pt">JUMLAH KESELURUHAN, RM : ${rm(jumlahJam * kadar)}</b></div>
    <div class="tt">
      <div>Nama dan tandatangan guru<div class="ruang"></div>( ${esc(profil.nama) || '&nbsp;'.repeat(60)} )
        <br>Tarikh : ${selesaiPada ? tarikhTeks(selesaiPada.masa.slice(0, 10)) : '..............................'}</div>
      <div>Disemak oleh :<div class="ruang"></div>(......................................................)<br>Setiausaha Al - Quran<br>Maahad Tahfiz Al Quran Wal Qiraat</div></div>
    <div style="text-align:right;margin-top:5mm">Tarikh : ..............................</div>`}
  </div>`).join('');
}

export function ringkasanHTML() {
  const ada = senaraiBayaran();
  const jam = ada.reduce((s, x) => s + jumlah(x.senarai), 0);
  const kadar = state.kadarSejam;

  return `<div class="halaman">${KEPALA}
    <div class="tajuk">SENARAI PENERIMA IMBUHAN<br>KELAS AL-QURAN MALAM &amp; HUJUNG MINGGU<br>BULAN ${namaBulan(state.bulan).toUpperCase()}</div>
    <table><thead><tr><th style="width:7%">BIL</th><th>NAMA</th><th style="width:20%">NO KAD PENGENALAN</th><th style="width:9%">JAM</th><th style="width:14%">JUMLAH (RM)</th><th style="width:12%">STATUS</th></tr></thead>
    <tbody>${ada.map(({ g, senarai }, i) => `<tr><td>${i + 1}</td><td class="catatan">${esc(g.nama)}</td><td>${esc(g.kp)}</td><td>${jamTeks(jumlah(senarai))}</td>
      <td>${rm(jumlah(senarai) * kadar)}</td><td>${statusSelesai(g.id) ? 'Selesai' : 'Belum'}</td></tr>`).join('')}
    <tr><td colspan="3"><b>JUMLAH (${ada.length} GURU)</b></td><td><b>${jamTeks(jam)}</b></td><td><b>${rm(jam * kadar)}</b></td><td></td></tr></tbody></table>
    <div class="tt"><div>Disediakan oleh :<div class="ruang"></div>(......................................................)<br>Setiausaha Al - Quran</div>
      <div>Tarikh : ..............................</div></div>
  </div>`;
}

export function suratHTML() {
  const ada = senaraiBayaran();
  const kini = new Date();
  const bln = namaBulan(state.bulan).toUpperCase();
  const kadar = state.kadarSejam;
  const jumlahRM = ada.reduce((s, x) => s + jumlah(x.senarai), 0) * kadar;
  const ribu = n => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const MTAQ = 'Maahad Tahfiz Al-Quran Wal Qiraat,<br>16600 Pulai Chondong,<br>Kelantan.';

  return `<div class="halaman surat">
    <p>Panitia Al-Quran,<br>${MTAQ}</p><hr>
    <div class="alamat"><p>Ke majlis,<br><br>YBrs Pengetua,<br>${MTAQ}</p>
      <p>Ruj. Kami: 700-1/26 (&nbsp;&nbsp;&nbsp;)<br>Tarikh: ${tarikhHijri(kini)}<br>Bersamaan: ${kini.getDate()} ${BULAN[kini.getMonth()]} ${kini.getFullYear()}</p></div>
    <p>Tuan,</p>
    <p style="margin-top:9mm"><b>POHON PERUNTUKAN BAYARAN IMBUHAN KELAS AL-QURAN MALAM DAN HUJUNG MINGGU BAGI BULAN ${bln}</b></p>
    <p>Dengan segala hormatnya perkara di atas adalah dirujuk.</p>
    <ol start="2">
      <li>Untuk makluman pihak tuan bahawa Unit Al-Quran dan Tahfiz MTAQWQ telah menyusun jadual bertugas bagi setiap guru Al-Quran untuk memantau kelas Al-Quran bagi meningkatkan prestasi hafalan Al-Quran di kalangan pelajar.</li>
      <li>Sehubungan dengan itu kami memohon peruntukan kewangan sebanyak <b>RM${rm(jumlahRM)}</b> sebagai bayaran imbuhan kepada guru-guru yang bertugas kelas Al-Quran sebagaimana senarai dan jadual yang dilampirkan.</li>
      <li>Semoga permohonan ini mendapat perhatian dan pertimbangan daripada pihak tuan dan seterusnya saya dahului dengan ucapan ribuan terima kasih.</li>
    </ol>
    <p>Sekian, terima kasih.</p>
    <p><b><i>“RAJA DAN RAKYAT, BERPISAH TIADA”</i></b></p>
    <p><b><i>“SEMOGA ALLAH MELINDUNGI TUANKU DUNIA DAN AKHIRAT”</i></b></p>
    <p>Saya Yang Menjalankan Amanah,</p>
    <p style="margin-top:18mm"><b>(NORRUZAIMI BIN RUSMAN)</b><br>Penolong Kanan Al-Quran,<br>Maahad Tahfiz Al-Quran Wal Qiraat</p>
  </div>
  <div class="halaman surat">
    <div class="tajuk" style="font-size:14pt;margin-top:6mm">SENARAI PENERIMA IMBUHAN<br>KELAS AL-QURAN MALAM &amp; HUJUNG MINGGU<br>BULAN ${bln}</div>
    <table class="penerima"><thead><tr><th style="width:6%">BIL</th><th>NAMA</th><th style="width:25%">KEKERAPAN</th><th style="width:19%">JUMLAH (RM)</th></tr></thead>
    <tbody>${Array.from({ length: Math.max(23, ada.length) }, (_, i) => {
      const x = ada[i];
      const j = x && jumlah(x.senarai);
      return `<tr><td>${i + 1}</td><td class="catatan">${x ? esc(namaSurat(x.g.nama)) : ''}</td>
        <td>${x ? `<div class="kekerapan"><span>${jamTeks(j)} Jam</span><span>x</span><span>RM${kadar}</span></div>` : ''}</td><td>${x ? ribu(j * kadar) : ''}</td></tr>`;
    }).join('')}
    <tr><td colspan="3"><b>Jumlah</b></td><td><b>${ribu(jumlahRM)}</b></td></tr></tbody></table>
    <p>Jumlah imbuhan bagi setiap jam bertugas ialah sebanyak RM${rm(kadar)} ***</p>
  </div>`;
}

export function skalaBorang() {
  for (const kotak of [$('borang'), $('borangAdmin')]) {
    const lebar = kotak.clientWidth - 16;
    if (lebar <= 0) continue;
    const z = Math.min(1, lebar / (210 * 96 / 25.4));
    kotak.querySelectorAll('.halaman').forEach(h => { h.style.zoom = z; });
  }
}
