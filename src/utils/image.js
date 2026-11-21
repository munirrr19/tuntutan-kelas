/**
 * Kecilkan gambar kamera telefon (5-10MB) supaya muat naik ke Apps Script pantas.
 */
export async function kecilkanImej(fail) {
  const img = await createImageBitmap(fail);
  const s = Math.min(1, 2000 / Math.max(img.width, img.height));
  const c = Object.assign(document.createElement('canvas'), {
    width: Math.round(img.width * s),
    height: Math.round(img.height * s),
  });
  const g = c.getContext('2d');
  // Latar putih supaya PNG lutsinar tidak menjadi hitam apabila ditukar ke JPEG
  g.fillStyle = '#fff';
  g.fillRect(0, 0, c.width, c.height);
  g.drawImage(img, 0, 0, c.width, c.height);
  return new Promise(ok => c.toBlob(ok, 'image/jpeg', 0.85));
}
