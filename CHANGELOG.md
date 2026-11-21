# Sejarah Perubahan

Butiran penuh: `git log`.

## 2026-11-21
- **Penstrukturan semula kod & kualiti (tanpa ubah rupa atau tingkah laku):**
  - Pecahkan `index.html` monolitik kepada modul berasingan: `styles/` (`tokens.css`, `layout.css`, `components.css`, `print.css`), `src/config/`, `src/state/`, `src/utils/`, `src/services/`, `src/components/`, dan `src/pages/`.
  - Pindahkan aset imej ke `assets/` (termasuk kemas kini `manifest.json`) dan `Code.gs` ke `backend/Code.gs`.
  - Baiki bug `padam()` supaya tidak membuang rekod dari gilir sebelum API berjaya, kemas kini cache tempatan selepas setiap mutasi, bersihkan `#k=<token>` daripada URL selepas disimpan, dan baiki sanitasi `esc()` untuk apostrof (`'`) bersama event delegation.
  - Buang duplikasi helper `teksSelesai` dan `!important` CSS yang tidak diperlukan; pindahkan semakan `console.assert` ke ujian unit dalam `tests/utils.test.js`.
  - Tambah `ARCHITECTURE.md`, `.env.example`, dan kemas kini `README.md` serta `docs/pembangunan.md`.
- Reka semula UI responsif (fungsi, data dan kandungan kekal): token jarak/jejari/tipografi, breakpoint mobile-first (360–767, ≥768, ≥1280), sasaran sentuh 44px sebenar, teks minimum 12px, kontras AA. Tablet: tab atas dan borang Catat 2 lajur. Desktop: KPI melekat, kawalan kiri dan pratonton A4 kanan. Cetakan A4 tidak berubah.
- Polish visual: header, tab dan kandungan sejajar pada satu lebar bekas; state hover (hanya peranti hover), active dan fokus konsisten; toast berbilang baris dan modal bottom-sheet dikemas.

## 2026-11-20
- Penambahbaikan penggunaan (rupa kekal): tanpa pautan peribadi dipaparkan arahan 3 langkah dan borang disembunyikan; mesej ralat kekal sehingga ditutup dan toast tidak lagi menutup Simpan; Tingkatan tiada lalai 1A (Simpan lumpuh sehingga dipilih) dan pilihan semasa sentiasa chip aktif; kawasan sentuh butang dilebarkan (Ubah/Padam, chip, Masa); cincin fokus papan kekunci; modal guna `<dialog>`; senarai kosong ada butang **+ Catat kelas** dan SELESAI yang lumpuh menerangkan sebabnya; istilah *pautan* dan *Surat tuntutan*.
- Butang **Jadual** di header: memaparkan jadual bulanan (PDF/gambar). SU Quran muat naik dari tab Admin; fail baru menggantikan yang lama.

## 2026-11-12
- Dokumentasi dalam `docs/`: panduan guru, admin, serahan, pembangunan dan struktur data. README diringkaskan.

## 2026-11-04
- Nama ditukar kepada **e-Tuntutan**; ikon baharu (bulat, latar telus).

## 2026-11-03
- Surat claim dicetak sebagai PDF (butang Muat turun Excel dibuang); cogan kata dan rujukan surat dikemas kini.
- Admin: surat claim dan tajuk Senarai Penerima Imbuhan.
- Borang: tarikh SELESAI di bawah nama guru.
- Hanya rekod setahun dimuat; simpanan menunggu kunci sehingga 30 saat dan dicuba semula automatik.
- Link guru dihantar melalui lajur whatsapp di Sheet.

## 2026-11-02
- Kelas intensif (Kelas 1..n) dikawal dari tab Tetapan.
- Admin: senarai semua guru, ringkasan bayaran; amaran kelas bertindih.
- Butang **SELESAI** di tab Borang: kunci rekod bulan dan tunjuk status kepada admin.
- Simpan serta-merta dengan gilir di peranti.
- Butang muat semula di header (mod app).
- Kelas Syahadah, Tahsin dan Daurah.
- Fail senarai kakitangan diabaikan oleh git (data peribadi).
- Tanya dahulu sebelum menukar akaun apabila link guru lain dibuka.
- Ikon app, manifest dan logo berwarna.
- Sifar di depan No KP dan telefon dipulihkan.
- Tarikh dipaparkan dengan nama hari; tarikh terakhir dikekalkan selepas simpan.
- **Ramai guru:** link peribadi, tab Guru dan halaman Admin.
- Pilihan masa setiap 15 minit.
- Versi pertama: website tuntutan kelas Al-Quran dengan backend Google Sheet.
