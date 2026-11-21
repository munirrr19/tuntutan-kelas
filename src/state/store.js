/**
 * Keadaan global aplikasi yang dikongsi merentas halaman dan komponen.
 */
const bulanSemasa = new Date().toLocaleDateString('en-CA').slice(0, 7);

export const state = {
  entri: [],          // guru: rekod sendiri; admin: rekod semua guru
  guru: {},           // profil pengguna semasa
  semuaGuru: [],      // admin sahaja
  selesai: [],        // { guru, bulan, masa }: bulan yang ditanda SELESAI
  kadarSejam: 30,
  intensif: 0,
  pilihCetak: null,   // admin: id guru untuk dicetak seorang, null = semua
  idUbah: null,
  sedangMuat: true,
  menyegar: false,
  menghantar: false,
  adminTapis: 'semua',
  adminCari: '',
  jadual: null,       // { id, masa }: fail Drive jadual bulanan
  bulan: bulanSemasa,
  tahunDimuat: bulanSemasa.slice(0, 4),
};
