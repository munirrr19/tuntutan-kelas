# Struktur Data

Semua data dalam satu **Google Sheet** sekolah. `Code.gs` ialah skrip Apps Script yang terikat pada Sheet itu. Semua lajur diformat sebagai teks supaya Sheet tidak menukar tarikh, masa atau membuang sifar di depan No KP dan telefon.

> **Jangan tukar nama tab atau susunan tajuk lajur.** Lajur baharu hanya di hujung.

## Tab `Kehadiran` (satu baris bagi setiap kelas)

| Lajur | Keterangan |
|---|---|
| `id` | ID rekod (dijana di telefon) |
| `tarikh` | `YYYY-MM-DD` |
| `tingkatan` | 1A–6B, Syahadah, Tahsin, Daurah, atau Kelas 1..n (intensif) |
| `mula`, `tamat` | `HH:MM` |
| `jam` | Jam kelas (nombor) |
| `catatan` | Pilihan |
| `guru` | `id` guru dalam tab `Guru` |

## Tab `Guru`

| Lajur | Keterangan |
|---|---|
| `id` | ID pendek, dijana oleh *Jana token & link guru* |
| `nama`, `kp`, `telefon` | Diisi admin; guru boleh mengemas kini di tab Tetapan app |
| `token` | Kunci rahsia link peribadi. Kosongkan dan jana semula untuk membatalkan link lama |
| `admin` | `ya` untuk admin |
| `link` | Link peribadi guru (`<laman>#k=<token>`) |
| `whatsapp` | Butang Hantar (lajur H) |

## Tab `Tetapan`
Pasangan `kunci` dan `nilai`: `kadar`, `intensif`. Lihat [panduan-admin.md](panduan-admin.md#tetapan).

## Tab `Selesai`
Bulan yang guru tanda SELESAI: `guru` (id), `bulan` (`YYYY-MM`), `masa`. Selagi baris ada, rekod bulan itu dikunci.

## API (Apps Script Web App)

| Kaedah | Fungsi |
|---|---|
| `GET ?token=&tahun=` | Profil guru, kadar, intensif, rekod setahun dan status Selesai. Admin menerima semua guru |
| `POST {token, action: "simpan", entri}` | Tambah atau ubah satu rekod |
| `POST {token, action: "padam", entri}` | Padam satu rekod |
| `POST {token, action: "profil", profil}` | Kemas kini nama, KP, telefon |
| `POST {token, action: "selesai", bulan, batal?}` | Tanda atau buka semula SELESAI |

Keselamatan:
- Setiap permintaan mesti membawa `token` yang sah. Tanpanya, tiada data dipulangkan.
- Guru hanya boleh mengubah rekod sendiri, termasuk admin.
- Bulan yang SELESAI tidak boleh diubah.
- `POST` memakai `LockService` (tunggu sehingga 30 saat) supaya simpanan serentak di hujung bulan tidak bertembung.

## Pertumbuhan data
Hanya rekod **setahun** dihantar ke telefon (anggaran ~7,000 rekod setahun untuk semua guru). Had Google Sheet ialah 10 juta sel bagi satu fail, jauh di atas penggunaan semasa.
