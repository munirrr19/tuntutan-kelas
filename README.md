# e-Tuntutan Kelas Al-Quran

Website untuk guru merekod kelas Al-Quran yang diajar setiap hari dan menjana Borang Tuntutan Mengajar (MTAQ Pulai Chondong) di hujung bulan. Semua data disimpan dalam satu Google Sheet sekolah.

| | |
|---|---|
| **Laman** | https://munirrr19.github.io/tuntutan-kelas/ (GitHub Pages) |
| **Pelayan** | Google Apps Script (`Code.gs`) yang terikat pada Google Sheet "Tuntutan Kelas" |
| **Pangkalan data** | Google Sheet sekolah |

## Ciri utama
- **Link peribadi** untuk setiap guru, tanpa kata laluan. Link boleh dibatalkan dan dijana semula oleh admin.
- **Catat** kelas selepas mengajar: tarikh, Tingkatan, masa mula dan tamat (setiap 15 minit). Amaran jika bertindih.
- **Simpan serta-merta** dengan gilir di telefon: rekod tidak hilang walaupun tiada internet.
- **Borang** bulanan dengan jumlah jam dan RM. Butang **SELESAI** mengunci bulan itu.
- **Admin:** status semua guru, senarai penerima imbuhan dan surat claim (PDF).
- Kadar sejam dan kelas intensif ditetapkan dalam Sheet.
- Boleh dipasang di skrin utama telefon (PWA).

## Dokumen

| Dokumen | Untuk siapa |
|---|---|
| [docs/panduan-guru.md](docs/panduan-guru.md) | Guru: catat kelas, Borang, SELESAI |
| [docs/panduan-admin.md](docs/panduan-admin.md) | Admin / Setiausaha: tambah guru, link, tetapan, claim |
| [docs/panduan-serahan.md](docs/panduan-serahan.md) | Pengganti: akses, sandaran, pemulihan |
| [docs/pembangunan.md](docs/pembangunan.md) | Pembangun: seni bina, kemas kini laman dan `Code.gs` |
| [docs/data.md](docs/data.md) | Struktur Sheet dan API |
| [CHANGELOG.md](CHANGELOG.md) | Sejarah perubahan |

## Kemas kini pantas
- **Laman:** ubah `index.html` dan push ke `main`.
- **Code.gs:** tampal dalam Extensions → Apps Script, jalankan **setup** sekali, kemudian **Deploy → Manage deployments → Edit → New version → Deploy**. Jangan cipta deployment baharu.

## Privasi
Repo ini **awam**. Jangan commit senarai guru, No KP, nombor telefon atau eksport Sheet. Fail seperti ini sudah dikecualikan dalam `.gitignore`.
