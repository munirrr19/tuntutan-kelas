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
| `intensif` | `7` | Bilangan kelas intensif (Kelas 1 hingga Kelas 7) untuk musim cuti. Kosongkan untuk menutup. Rekod lama tidak terjejas |

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
