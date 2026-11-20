# Panduan Admin

Untuk Setiausaha atau pentadbir yang mengurus guru dan tuntutan. Admin juga guru biasa: semua tab guru masih ada, ditambah tab **Admin**.

Lihat juga: [panduan-guru.md](panduan-guru.md) · [panduan-serahan.md](panduan-serahan.md) · [data.md](data.md)

## Tambah guru baharu
1. Buka Google Sheet **Tuntutan Kelas**, tab **Guru**.
2. Isi satu baris baharu dengan **nama**, **kp** dan **telefon** sahaja.
3. Pilih menu **Tuntutan Kelas → Jana token & link guru**. Lajur `id`, `token` dan `link` terisi sendiri.
4. Tekan **Hantar** di lajur `whatsapp` (lajur H). WhatsApp dibuka ke nombor guru itu bersama link dan cara guna. Semak mesej, kemudian tekan Send. **Jangan hantar ke group.**

## Jadikan seseorang admin
Taip `ya` dalam lajur **admin** untuk guru itu. Admin nampak tab **Admin**.

Admin yang juga perlu menambah guru mesti diberi akses **Editor** kepada Google Sheet melalui butang Share.

## Buang guru atau tukar link
- **Buang guru:** padam baris guru itu. Rekod lamanya kekal dalam tab `Kehadiran`.
- **Link terdedah atau telefon hilang:** kosongkan sel **token** guru itu dan jana semula. Link lama terus tidak berfungsi. Hantar link baharu.

## Tetapan
Dalam tab **Tetapan** di Sheet (lajur `kunci` dan `nilai`):

| Kunci | Contoh | Maksud |
|---|---|---|
| `kadar` | `30` | Kadar RM sejam. Jika tiada, RM30 |
| `folder_jadual` | (ID folder Drive) | Dicipta oleh **setup**. Folder tempat SU Quran upload jadual bulanan |
| `intensif` | `7` | Bilangan kelas intensif (Kelas 1 hingga Kelas 7) untuk musim cuti. Kosongkan untuk menutup. Rekod lama tidak terjejas |

## Jadual guru bertugas (setiap bulan)
Guru nampak butang **Jadual Guru Bertugas** di atas tab Catat. Bila ditekan, jadual terus dipaparkan skrin penuh.

**Untuk SU Quran (setiap bulan):**
1. Buka app **Google Drive** di telefon atau komputer.
2. Masuk folder **Jadual Kelas (e-Tuntutan)** (ada di bawah *Shared with me*).
3. Tekan **+ → Upload** dan pilih PDF atau gambar jadual bulan baharu.
4. Siap. Dalam masa 5 minit, app memaparkan fail **paling baharu**. Fail lama boleh dibiarkan sebagai arkib.

Nota:
- Nama fail dipaparkan pada butang, jadi namakan dengan jelas, cth `Jadual Guru Bertugas Disember 2026`.
- Hanya **halaman pertama** PDF dipaparkan sebagai gambar. Guru boleh tekan **Buka PDF** untuk fail penuh.
- Tersilap upload? Padam fail itu; app kembali memaparkan fail sebelumnya.
- Fail dikongsi sebagai *sesiapa yang ada link boleh lihat* (dibuat automatik) supaya guru boleh melihatnya tanpa log masuk Google.

**Sediakan sekali sahaja (pemilik Sheet):** tambah fail `Jadual.gs` dalam Apps Script dan jalankan **setupJadual** (atau **setup**). Folder ini dicipta di Drive pemilik dan ID-nya disimpan dalam tab Tetapan (`folder_jadual`). Klik kanan folder → **Share** → tambah emel SU Quran sebagai **Editor**.

## Tab Admin
- Senarai semua guru dengan jumlah jam dan RM bagi bulan dipilih.
- Status setiap guru: **✓ Selesai** atau **Belum selesai**. Yang belum selesai berada di atas.
- Cetak borang setiap guru, atau semua sekali.

### Urusan claim
- **Senarai penerima imbuhan:** satu halaman senarai nama, No KP, jam dan RM semua guru.
- **Surat claim (PDF):** surat permohonan kepada Pengetua bersama lampiran senarai penerima. Pilih **Save as PDF** dalam tetingkap cetak.

## Aliran hujung bulan
1. Ingatkan guru menekan **SELESAI** di tab Borang.
2. Di tab Admin, pastikan semua guru ✓ Selesai.
3. Cetak senarai penerima dan surat claim.
4. Jika ada pembetulan, guru menekan **Buka semula untuk ubah**, betulkan, kemudian SELESAI semula.
