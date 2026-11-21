# e-Tuntutan Kelas Al-Quran

Website untuk guru merekod kelas Al-Quran yang diajar setiap hari dan menjana Borang Tuntutan Mengajar (MTAQ Pulai Chondong) di hujung bulan. Semua data disimpan dalam satu Google Sheet sekolah.

| | |
|---|---|
| **Laman** | https://munirrr19.github.io/tuntutan-kelas/ (GitHub Pages) |
| **Pelayan** | Google Apps Script (`backend/Code.gs`) yang terikat pada Google Sheet "Tuntutan Kelas" |
| **Pangkalan data** | Google Sheet sekolah |

## Ciri utama
- **Link peribadi** untuk setiap guru, tanpa kata laluan. Link boleh dibatalkan dan dijana semula oleh admin.
- **Catat** kelas selepas mengajar: tarikh, Tingkatan, masa mula dan tamat (setiap 15 minit). Amaran jika bertindih.
- **Simpan serta-merta** dengan gilir di telefon: rekod tidak hilang walaupun tiada internet.
- **Borang** bulanan dengan jumlah jam dan RM. Butang **SELESAI** mengunci bulan itu.
- **Admin:** status semua guru, senarai penerima imbuhan dan surat tuntutan (PDF).
- Kadar sejam dan kelas intensif ditetapkan dalam Sheet.
- Boleh dipasang di skrin utama telefon (PWA).

## Pemasangan & Pembangunan Setempat

Projek ini tidak memerlukan `npm install` atau langkah binaan (*build step*). Hanya Node.js (v20+) atau Python 3 diperlukan untuk menjalankan pelayan setempat dan ujian unit.

1. **Klon repositori:**
   ```bash
   git clone <url-repositori>
   cd tuntutan-kelas
   ```

2. **Konfigurasi (jika perlu tukar pelayan Apps Script):**
   - Rujuk `.env.example` untuk senarai pemboleh ubah konfigurasi.
   - Kemas kini `API` dalam `src/config/appConfig.js` dan `SITE` dalam `backend/Code.gs` mengikut URL deployment anda.

3. **Jalankan pelayan tempatan:**
   Oleh kerana frontend menggunakan ES Modules (`<script type="module">`), buka laman melalui pelayan HTTP tempatan (bukan terus `file://`):
   ```bash
   python -m http.server 8080
   # atau
   npx serve .
   ```
   Kemudian buka `http://localhost:8080` di pelayar.

4. **Jalankan ujian unit:**
   ```bash
   node --test tests/utils.test.js
   ```

## Deploy

- **Frontend (GitHub Pages):** Push perubahan ke branch `main`. GitHub Pages akan menerbitkan fail statik dari root (`/`) dalam masa 1–2 minit.
- **Backend (`backend/Code.gs`):** Tampal kandungan `backend/Code.gs` ke **Extensions → Apps Script** dalam Google Sheet, jalankan fungsi **setup** sekali, kemudian pilih **Deploy → Manage deployments → Edit → New version → Deploy**. Jangan cipta deployment baharu supaya URL `/exec` kekal sama.

## Dokumen

| Dokumen | Untuk siapa |
|---|---|
| [ARCHITECTURE.md](ARCHITECTURE.md) | Pembangun: struktur folder, aliran data & keputusan reka bentuk |
| [docs/panduan-guru.md](docs/panduan-guru.md) | Guru: catat kelas, Borang, SELESAI |
| [docs/panduan-admin.md](docs/panduan-admin.md) | Admin / Setiausaha: tambah guru, link, tetapan, tuntutan |
| [docs/panduan-serahan.md](docs/panduan-serahan.md) | Pengganti: akses, sandaran, pemulihan |
| [docs/pembangunan.md](docs/pembangunan.md) | Pembangun: kemas kini laman dan `backend/Code.gs` |
| [docs/data.md](docs/data.md) | Struktur Sheet dan API |
| [CHANGELOG.md](CHANGELOG.md) | Sejarah perubahan |

## Privasi
Repo ini **awam**. Jangan commit senarai guru, No KP, nombor telefon atau eksport Sheet. Fail seperti ini sudah dikecualikan dalam `.gitignore`.
