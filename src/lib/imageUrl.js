const STORAGE_PREFIX = "/storage/v1/object/public/product-images/";

export function imageSrc(url) {
  if (!url) return url;
  const index = url.indexOf(STORAGE_PREFIX);
  if (index === -1 || !url.includes(".supabase.co")) return url;
  return `/img/${url.slice(index + STORAGE_PREFIX.length)}`;
}
