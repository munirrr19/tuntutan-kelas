/**
 * Konfigurasi dan pemalar aplikasi.
 * URL API menunjuk kepada deployment Web App Google Apps Script.
 */
export const API = 'https://script.google.com/macros/s/AKfycbw9zaNiQtD7Z2TaqZCky1uiwonQTdCDmWte-rZWsaIH08MTRll5LtCvUE9QtouTrun0/exec';

export const BULAN = [
  'Januari', 'Februari', 'Mac', 'April', 'Mei', 'Jun',
  'Julai', 'Ogos', 'September', 'Oktober', 'November', 'Disember',
];

export const HARI = ['Ahad', 'Isnin', 'Selasa', 'Rabu', 'Khamis', 'Jumaat', 'Sabtu'];

export const BULAN_HIJRI = [
  'Muharam', 'Safar', 'Rabiulawal', 'Rabiulakhir', 'Jamadilawal', 'Jamadilakhir',
  'Rejab', 'Syaaban', 'Ramadan', 'Syawal', 'Zulkaedah', 'Zulhijah',
];

export const TINGKATAN = [1, 2, 3, 4, 5, 6]
  .flatMap(t => [t + 'A', t + 'B'])
  .concat('Syahadah', 'Tahsin', 'Daurah');

export const BARIS_SEHALAMAN = 20;

export const PILIHAN_MASA = Array.from(
  { length: (23 * 60 - 6 * 60) / 15 + 1 },
  (_, i) => {
    const total = 6 * 60 + i * 15;
    return String(Math.floor(total / 60)).padStart(2, '0') + ':' + String(total % 60).padStart(2, '0');
  }
);
