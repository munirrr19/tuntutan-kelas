# Seni Bina Sistem e-Tuntutan Al-Quran

Dokumen ini menerangkan struktur folder, peranan setiap modul, aliran data, teknologi yang digunakan, dan keputusan reka bentuk sistem.

## 1. Struktur Folder

```text
.
├── index.html                  # Titik masuk HTML utama (struktur skrin & pautan modul)
├── manifest.json               # Konfigurasi PWA (Add to Home screen)
├── .env.example                # Templat rujukan konfigurasi deployment
├── ARCHITECTURE.md             # Dokumentasi seni bina (fail ini)
├── README.md                   # Panduan pemasangan, pembangunan & deployment
├── CHANGELOG.md                # Sejarah perubahan sistem
├── assets/                     # Imej, logo rasmi, favicon dan ikon PWA
│   ├── apple-touch-icon.png
│   ├── e-Tuntutan Al-Quran Badge.png
│   ├── favicon.png
│   ├── icon-192.png
│   ├── icon-512.png
│   ├── logo-warna.png
│   └── logo.png
├── styles/                     # Lembaran gaya CSS terasing mengikut fungsi
│   ├── tokens.css              # Pemboleh ubah warna, jarak, tipografi, fokus & asas
│   ├── layout.css              # Header, navigasi, grid halaman & responsif
│   ├── components.css          # Kad, borang, chips, KPI, senarai, toast, modal
│   └── print.css               # Susun atur borang A4, surat rasmi & @media print
├── src/
│   ├── main.js                 # Inisialisasi aplikasi, pendengar acara & penyelarasan tab
│   ├── config/
│   │   └── appConfig.js        # Pemalar sistem (API URL, senarai bulan, tingkatan, had baris)
│   ├── state/
│   │   └── store.js            # Keadaan global aplikasi yang dikongsi antara modul
│   ├── utils/
│   │   ├── dateTime.js         # Pengiraan & pemformatan tarikh, masa, jam, hijri, pertindihan
│   │   ├── format.js           # Pemformatan wang, teks, sanitasi HTML (esc), namaSurat, pecah
│   │   └── image.js            # Pemampatan imej jadual sebelum muat naik
│   ├── services/
│   │   ├── api.js              # Komunikasi fetch ke Apps Script & pengurusan token
│   │   ├── cache.js            # Cache tahunan dalam localStorage
│   │   └── syncQueue.js        # Gilir simpanan luar talian & cuba semula automatik
│   ├── components/
│   │   ├── modal.js            # Dialog pengesahan (sahkan) & paparan jadual bulanan
│   │   ├── monthPicker.js      # Komponen pemilih bulan seragam
│   │   ├── printTemplates.js   # Templat HTML cetakan A4 (borang, ringkasan, surat)
│   │   └── toast.js            # Notifikasi toast & status sync pill
│   └── pages/
│       ├── catatPage.js        # Tab Catat (borang kelas, chips, pengesahan pertindihan)
│       ├── senaraiPage.js      # Tab Senarai (KPI bulanan, ubah & padam rekod)
│       ├── borangPage.js       # Tab Borang (pratonton A4 & penguncian SELESAI)
│       ├── tetapanPage.js      # Tab Tetapan (kemas kini profil guru)
│       └── adminPage.js        # Tab Admin (tapis/cari guru, cetak, surat, muat naik jadual)
├── backend/
│   └── Code.gs                 # Skrip pelayan Google Apps Script (Google Sheet & Drive)
├── tests/
│   └── utils.test.js           # Ujian unit menggunakan node:test
└── docs/                       # Panduan pengguna, admin, serahan, pembangunan & struktur data
```

## 2. Aliran Data

```text
Telefon Guru (GitHub Pages: index.html + src/)
   │
   ├── Baca token (#k=<token>) → simpan ke localStorage & bersihkan hash URL
   ├── Muat data tahunan (GET ?token=&tahun=)
   │      └── Papar cache tempatan dahulu (cache_<tahun>) jika ada, kemudian kemas kini dari pelayan
   ├── Catat / Ubah kelas → simpan ke gilir (localStorage: gilir) → papar serta-merta → hantar di belakang (POST)
   └── Padam / SELESAI / Profil / Jadual → hantar terus ke pelayan (POST) → kemas kini state & cache
          │
          ▼
Apps Script Web App (backend/Code.gs)
   │
   ├── LockService (tunggu sehingga 30s untuk elak pertembungan hujung bulan)
   └── Google Sheet (Kehadiran, Guru, Tetapan, Selesai) & Google Drive (fail jadual)
```

## 3. Teknologi Digunakan

- **Frontend:** HTML5, CSS3 (Custom Properties, Grid, Flexbox, `@media print`), JavaScript ES Modules tulen tanpa rangka kerja atau bundler.
- **PWA:** `manifest.json` untuk pemasangan di skrin utama telefon.
- **Backend:** Google Apps Script (`backend/Code.gs`) menggunakan `SpreadsheetApp`, `DriveApp`, `LockService`, dan `PropertiesService`.
- **Pangkalan Data & Storan:** Google Sheet sekolah dan Google Drive.
- **Hosting:** GitHub Pages (fail statik dari root `/`).
- **Ujian:** `node:test` terbina dalam Node.js.

## 4. Keputusan Reka Bentuk Utama

- **Tiada langkah binaan (No Build Step):** Menggunakan ES Modules natif pelayar supaya repo boleh dihoskan terus di GitHub Pages tanpa kebergantungan `node_modules` atau bundler.
- **`index.html` dan `manifest.json` kekal di root:** Mengekalkan URL GitHub Pages sedia ada tanpa mengubah tetapan hosting.
- **Simpanan berpusatkan gilir luar talian:** Permintaan Apps Script mengambil masa 2–3 saat; gilir `localStorage` membolehkan UI bertindak balas serta-merta dan melindungi rekod walaupun tiada sambungan internet.
- **Pengasingan templat cetakan (`print.css` & `printTemplates.js`):** Susun atur A4 dan surat rasmi diasingkan daripada gaya UI skrin agar perubahan responsif tidak mengganggu cetakan PDF rasmi.
- **Event delegation & sanitasi `esc()`:** Menggantikan `onclick` sebaris dalam HTML terjana dengan `data-*` dan pendengar acara berpusat untuk mengurangkan risiko suntikan HTML/XSS.
