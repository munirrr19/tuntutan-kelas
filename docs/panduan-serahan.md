# Panduan Serahan Tugas

Untuk staf yang mengambil alih urusan Tuntutan Kelas. Tugasan harian tidak memerlukan kod: lihat [panduan-admin.md](panduan-admin.md).

> Repo ini **awam**. Jangan tulis kata laluan, nama akaun, data guru atau ID Sheet dalam repo. Simpan maklumat akaun dalam dokumen persendirian sekolah.

## 1. Sistem ini terdiri daripada apa

| Bahagian | Fungsi |
|---|---|
| Laman (GitHub Pages) | Skrin yang guru buka di telefon |
| Google Sheet "Tuntutan Kelas" | Semua rekod, senarai guru dan tetapan |
| Apps Script (terikat pada Sheet) | Pelayan: semak token, simpan dan baca rekod |
| Repo GitHub | Kod laman dan `Code.gs` |

## 2. Akses yang mesti ada pada sekurang-kurangnya dua orang

- [ ] **Akaun Google pemilik Sheet** (pemilik Apps Script juga), dengan 2FA dan kaedah pemulihan dikemas kini
- [ ] **Akses Editor** Sheet untuk Setiausaha atau admin yang menambah guru
- [ ] **Sekurang-kurangnya dua admin** (`ya` dalam lajur admin)
- [ ] **Akaun GitHub** dengan akses ke repo ini
- [ ] Lokasi simpanan kata laluan diketahui oleh dua orang

## 3. Tugasan mengikut kekerapan

### Setiap bulan
- Pastikan semua guru menekan SELESAI, kemudian cetak senarai penerima dan surat claim ([panduan-admin.md](panduan-admin.md#aliran-hujung-bulan)).

### Bila perlu
- Guru baharu, guru berhenti, link terdedah, tukar kadar, musim intensif: lihat [panduan-admin.md](panduan-admin.md).

### Setiap tahun
- **Sandaran:** Fail → Buat salinan pada Sheet, namakan "Tuntutan Kelas <tahun>". Simpan di Google Drive sekolah.
- Semak senarai guru dan admin.
- Semak kadar sejam masih betul.

## 4. Sandaran
- **Salinan manual Sheet** sekurang-kurangnya sebulan sekali selepas claim dihantar.
- **Sejarah versi:** Fail → Sejarah versi, untuk memulihkan data yang tersilap dipadam.
- **Kod** di GitHub.

## 5. Jika sesuatu tidak berfungsi

| Gejala | Apa dibuat |
|---|---|
| Laman tak terbuka | Semak status GitHub Pages di Settings → Pages repo ini |
| Semua guru dapat ralat | Apps Script: semak **Executions** dalam editor. Jika baru dikemas kini, semak deployment dan kebenaran ([pembangunan.md](pembangunan.md)) |
| Seorang guru "Token tidak sah" | Token guru itu kosong atau ditukar. Jana semula dan hantar link baharu |
| Data hilang dalam Sheet | Fail → Sejarah versi → pulihkan |

## 6. Perkara yang jangan dibuat
- Jangan tukar nama tab atau tajuk lajur dalam Sheet.
- Jangan cipta deployment Apps Script baharu.
- Jangan kongsi link guru dalam group.
- Jangan commit senarai guru, No KP, nombor telefon atau eksport Sheet ke repo ini.

## 7. Senarai semak serahan

| Perkara | Dibuat oleh | Tarikh |
|---|---|---|
| Dua orang ada akses pemilik atau Editor Sheet | | |
| Dua admin aktif dalam tab Guru | | |
| Lokasi simpanan kata laluan dimaklumkan | | |
| Salinan Sheet terkini dibuat | | |
| Pengganti cuba tambah satu guru ujian (kemudian buang) | | |
| Dokumen ini dibaca bersama pengganti | | |
