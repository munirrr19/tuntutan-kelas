# Tuntutan Kelas Al-Quran

Website untuk merekod kelas Al-Quran yang diajar setiap hari dan menjana Borang Tuntutan Mengajar (MTAQ Pulai Chondong) di hujung bulan. Data disimpan dalam Google Sheet anda sendiri.

- `index.html`: website (dihoskan di GitHub Pages)
- `Code.gs`: skrip Google Apps Script yang menyimpan data ke Google Sheet

## Setup (sekali sahaja, kira-kira 10 minit)

### 1. Google Sheet dan Apps Script
1. Buka [sheets.new](https://sheets.new) dan namakan Sheet itu, contohnya "Tuntutan Kelas".
2. Pilih menu **Extensions → Apps Script**.
3. Padam kod sedia ada, kemudian tampal semua isi `Code.gs` dan tekan **Save** (ikon disket).
4. Di bahagian atas, pilih fungsi **`setup`** dan tekan **Run**. Benarkan akses apabila diminta (Advanced → Go to ... → Allow).
5. Buka **Execution log** dan salin nilai `TOKEN anda: ...`. Token ini ialah kata laluan anda, jadi jangan kongsikan.

### 2. Deploy sebagai web app
1. Tekan **Deploy → New deployment**, klik ikon gear dan pilih **Web app**.
2. Tetapkan **Execute as: Me** dan **Who has access: Anyone**.
3. Tekan **Deploy**, kemudian salin **Web app URL** (yang berakhir dengan `/exec`).

> "Anyone" diperlukan supaya website boleh menghubungi skrip ini. Data tetap dilindungi oleh token.

### 3. Hidupkan GitHub Pages
1. Dalam repo GitHub, pergi ke **Settings → Pages**.
2. Untuk **Source**, pilih **Deploy from a branch**, kemudian pilih branch **main** dan folder **/ (root)**, dan tekan **Save**.
3. Selepas 1 hingga 2 minit, website boleh dibuka di `https://munirrr19.github.io/tuntutan-kelas/`.

### 4. Isi Tetapan dalam website
Buka website, pergi ke tab **Tetapan**, dan isi Nama, No KP, No Telefon, URL web app dan Token. Kemudian tekan **Simpan tetapan**.

Di telefon, pilih **Add to Home screen** supaya website ini boleh dibuka seperti app.

## Penggunaan
- **Catat:** isi selepas setiap kelas. Tarikh hari ini dan tingkatan terakhir diisi secara automatik, dan butang 2 jam / 1 jam / 30 minit mengisi masa tamat.
- **Senarai:** lihat, ubah atau padam rekod untuk sesuatu bulan.
- **Borang:** pilih bulan, kemudian tekan **Cetak / PDF**. Jika ada lebih daripada 20 kelas, borang akan bersambung ke halaman kedua.

## Kemas kini Code.gs
Jika `Code.gs` diubah: tampal kod baru, kemudian pilih **Deploy → Manage deployments → Edit (ikon pensel) → Version: New version → Deploy**. URL web app kekal sama.
