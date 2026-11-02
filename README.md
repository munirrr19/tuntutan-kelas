# Tuntutan Kelas Al-Quran

Website untuk guru merekod kelas Al-Quran yang diajar setiap hari dan menjana Borang Tuntutan Mengajar (MTAQ Pulai Chondong) di hujung bulan. Semua data disimpan dalam satu Google Sheet sekolah.

- `index.html`: website (GitHub Pages: https://munirrr19.github.io/tuntutan-kelas/)
- `Code.gs`: skrip Google Apps Script yang terikat pada Google Sheet "Tuntutan Kelas"

## Untuk admin

### Tambah guru baru
1. Buka Google Sheet **Tuntutan Kelas** dan pergi ke tab **Guru**.
2. Isi satu baris baru dengan **nama**, **kp** dan **telefon** sahaja.
3. Pilih menu **Tuntutan Kelas → Jana token & link guru**. Lajur `id`, `token` dan `link` akan terisi sendiri.
4. Hantar **link** itu kepada guru tersebut, contohnya melalui WhatsApp. Link ini adalah peribadi.

### Jadikan seseorang admin
Taip `ya` dalam lajur **admin** untuk guru itu. Admin akan nampak tab **Admin** dalam website, yang menunjukkan senarai semua guru serta jumlah jam dan RM, dan membolehkan admin mencetak borang setiap guru atau semua sekali.

Admin yang juga perlu menambah guru (contohnya Setiausaha) mesti diberi akses **Editor** kepada Google Sheet ini melalui butang Share.

### Buang guru atau tukar link
- **Buang guru:** padam baris guru itu. Rekod lama guru itu kekal dalam tab Kehadiran.
- **Link terdedah:** kosongkan sel **token** guru itu dan jana semula. Link lama akan terus tidak berfungsi.

### Tukar kadar sejam
Dalam tab **Tetapan**, tambah baris `kadar` dengan nilai `30` (atau kadar baru). Jika tiada baris ini, kadar asal ialah RM30.

### Kelas intensif (cuti panjang)
Dalam tab **Tetapan**, tambah baris `intensif` dengan bilangan kelas, contohnya `7`. Pilihan **Kelas 1** hingga **Kelas 7** akan muncul dalam dropdown Tingkatan guru. Untuk menutup musim intensif, kosongkan atau padam baris itu. Rekod kelas intensif yang lama tidak terjejas.

## Untuk guru
1. Buka link peribadi daripada admin. Anda hanya perlu buat ini sekali di setiap telefon.
2. Di tab **Tetapan**, semak Nama, No KP dan No Telefon.
3. **Catat:** isi selepas setiap kelas.
4. **Borang:** di hujung bulan, semak borang dan tekan **SELESAI**. Rekod bulan itu akan dikunci, dan Setiausaha boleh nampak borang anda sudah siap. Jika perlu ubah, tekan **Buka semula untuk ubah**.

Di tab **Admin**, setiap guru ditunjuk sebagai ✓ Selesai atau Belum selesai. Guru yang belum selesai berada di atas. Status ini disimpan dalam helaian `Selesai` di Sheet.

Untuk bendahari, gunakan **Ringkasan bayaran** untuk mencetak satu halaman senarai nama, No KP, jam dan RM semua guru. Gunakan pula **Muat turun Excel** untuk mendapatkan fail yang sama dalam bentuk Excel.

Di telefon, pilih **Add to Home screen** supaya website ini boleh dibuka seperti app.

## Kemas kini Code.gs
1. Tampal kod baru dalam Extensions → Apps Script, simpan, dan jalankan **setup** sekali.
2. Kemudian pilih **Deploy → Manage deployments → Edit (ikon pensel) → Version: New version → Deploy**. URL web app kekal sama.
