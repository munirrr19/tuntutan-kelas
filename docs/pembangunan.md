# Panduan Pembangunan

## Struktur

```
index.html       seluruh aplikasi (HTML + CSS + JS dalam satu fail), dihos di GitHub Pages
Code.gs          pelayan Google Apps Script, terikat pada Google Sheet
manifest.json    PWA (Add to Home screen)
*.png            logo dan ikon
docs/            dokumentasi
```

Tiada *build step* dan tiada kebergantungan.

## Seni bina

```
Telefon guru ──HTTPS──▶ GitHub Pages (index.html)
     │
     └──GET / POST JSON──▶ Apps Script Web App (Code.gs)
                                   │
                                   ▼
                           Google Sheet (Kehadiran, Guru, Tetapan, Selesai)
```

- Token guru disimpan dalam `localStorage` selepas link peribadi dibuka (`#k=<token>`).
- **Gilir simpanan:** rekod dipaparkan serta-merta, disimpan dalam `localStorage` (`gilir`) dan dihantar di belakang. Jika gagal kerana rangkaian, ia dicuba semula. Ini mengelakkan kehilangan rekod jika app ditutup atau tiada internet.
- Apps Script mengambil 2–3 saat bagi setiap simpanan, sebab itu simpanan tidak menunggu pelayan.

## Kemas kini laman (`index.html`)
1. Ubah `index.html`.
2. Uji dengan membuka fail secara setempat, atau tolak ke cabang lain dahulu.
3. Push ke `main`. GitHub Pages menerbitkan dalam masa satu atau dua minit.
4. Guru mungkin perlu tutup dan buka semula app.

## Kemas kini `Code.gs`
1. Buka Google Sheet → **Extensions → Apps Script**. Tampal kod baharu dan simpan.
2. Jalankan **setup** sekali (selamat dijalankan berulang kali: mencipta tab dan tajuk yang belum ada).
3. **Deploy → Manage deployments → Edit (ikon pensel) → Version: New version → Deploy.** URL web app kekal sama.

> **Jangan cipta deployment baharu.** URL `/exec` sudah tertanam dalam `index.html`. Deployment baharu memberi URL lain dan laman akan berhenti berfungsi.

Jika kod mula memakai perkhidmatan Google baharu, pemilik mesti menjalankan satu fungsi dalam editor dan menekan **Allow** sebelum deploy.

## Konvensyen
- Teks paparan dalam Bahasa Melayu.
- Semua sel Sheet diformat sebagai teks (`@`). Gunakan `setValues` (bukan `appendRow`) supaya format kekal.
- Sifar di depan No KP dan telefon dipulihkan oleh `kp_` dan `telefon_` jika Sheet membuangnya.
- **Jangan commit data guru.** `.gitignore` sudah mengecualikan `senarai_*.md`, `*.xlsx`, `*.csv` dan `*.pdf`. Repo ini **awam**.

## Masalah lazim
| Gejala | Punca / tindakan |
|---|---|
| Semua guru dapat ralat selepas kemas kini | Deployment belum dikemas kini ke versi baharu, atau kebenaran baharu belum diberi |
| Simpanan gagal di hujung bulan | Ramai guru serentak. Telefon akan cuba semula sendiri |
| No KP atau telefon hilang sifar | Ditampal dari Excel. Sistem memulihkannya semasa dibaca |
