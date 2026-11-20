// Jadual guru bertugas: SU Quran upload PDF/gambar ke folder Drive, app papar fail paling baharu.
// Fail berasingan daripada Code.gs supaya mudah ditambah dalam Apps Script (+ → Script, nama "Jadual").

// Jalankan sekali dari editor: cipta folder Drive dan simpan ID-nya dalam tab Tetapan (folder_jadual).
function setupJadual() {
  const tetapan = SpreadsheetApp.getActive().getSheetByName(TETAPAN);
  const ada = tetapan.getDataRange().getValues().some(r => r[0] === 'folder_jadual');
  if (ada) return;
  const folder = DriveApp.createFolder('Jadual Kelas (e-Tuntutan)');
  tetapan.getRange(tetapan.getLastRow() + 1, 1, 1, 2).setNumberFormat('@').setValues([['folder_jadual', folder.getId()]]);
}

// Fail jadual paling baharu (PDF atau gambar) dalam folder_jadual. Disimpan dalam cache 5 minit
// supaya DriveApp tidak dipanggil setiap kali guru buka app.
function jadual_(folderId) {
  if (!folderId) return null;
  const cache = CacheService.getScriptCache(), kunciCache = 'jadual_' + folderId;
  const c = cache.get(kunciCache);
  if (c) return JSON.parse(c);
  let baru = null;
  try {
    const fail = DriveApp.getFolderById(folderId).getFiles();
    while (fail.hasNext()) {
      const f = fail.next(), jenis = f.getMimeType();
      if ((jenis === MimeType.PDF || jenis.startsWith('image/')) && (!baru || f.getDateCreated() > baru.getDateCreated())) baru = f;
    }
  } catch (err) {
    return null;
  }
  let hasil = null;
  if (baru) {
    // Guru tidak log masuk Google: fail mesti boleh dilihat oleh sesiapa yang ada link
    try {
      if (baru.getSharingAccess() !== DriveApp.Access.ANYONE_WITH_LINK) baru.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    } catch (err) {}
    hasil = { id: baru.getId(), nama: baru.getName().replace(/\.[^.]+$/, ''), pdf: baru.getMimeType() === MimeType.PDF };
  }
  cache.put(kunciCache, JSON.stringify(hasil), 300);
  return hasil;
}
