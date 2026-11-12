const MAX_SIDE = 1200;
const QUALITY = 0.8;

function canvasToBlob(canvas, type, quality) {
  return new Promise((resolve) => canvas.toBlob(resolve, type, quality));
}

export async function compressImage(file) {
  if (!file.type.startsWith("image/") || file.type === "image/gif" || file.type === "image/svg+xml") {
    return { blob: file, extension: file.name.split(".").pop().toLowerCase(), type: file.type };
  }

  let bitmap;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    return { blob: file, extension: file.name.split(".").pop().toLowerCase(), type: file.type };
  }

  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, width, height);
  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close?.();

  let blob = await canvasToBlob(canvas, "image/webp", QUALITY);
  if (blob && blob.type === "image/webp") {
    return pickSmaller(file, { blob, extension: "webp", type: "image/webp" });
  }

  blob = await canvasToBlob(canvas, "image/jpeg", QUALITY);
  if (blob) {
    return pickSmaller(file, { blob, extension: "jpg", type: "image/jpeg" });
  }

  return { blob: file, extension: file.name.split(".").pop().toLowerCase(), type: file.type };
}

function pickSmaller(original, compressed) {
  if (compressed.blob.size < original.size) return compressed;
  return { blob: original, extension: original.name.split(".").pop().toLowerCase(), type: original.type };
}
