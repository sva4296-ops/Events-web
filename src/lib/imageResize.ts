/**
 * Browser version of the app's utils/imageProcessing.ts: two JPEGs per photo,
 * a 400px thumbnail (q 0.65) for grids and a 2800px full version (q 0.9) for
 * the lightbox and album download. Never upscales.
 */
async function resize(file: File, longestEdge: number, quality: number): Promise<Blob> {
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  const scale = Math.min(1, longestEdge / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (context === null) throw new Error("canvas unavailable");
  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob === null ? reject(new Error("encode failed")) : resolve(blob)), "image/jpeg", quality);
  });
}

export async function processEventPhoto(file: File): Promise<{ thumb: Blob; full: Blob }> {
  const [thumb, full] = await Promise.all([resize(file, 400, 0.65), resize(file, 2800, 0.9)]);
  return { thumb, full };
}
