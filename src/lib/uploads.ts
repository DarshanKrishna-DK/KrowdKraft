export const MAX_IMAGE_BYTES = 2 * 1024 * 1024;
export function imageFormat(bytes: Uint8Array): { type: string; extension: string } | null {
  if (bytes.length < 12) return null;
  if ([137, 80, 78, 71, 13, 10, 26, 10].every((v, i) => bytes[i] === v))
    return { type: 'image/png', extension: 'png' };
  if (bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255)
    return { type: 'image/jpeg', extension: 'jpg' };
  if (
    String.fromCharCode(...bytes.slice(0, 4)) === 'RIFF' &&
    String.fromCharCode(...bytes.slice(8, 12)) === 'WEBP'
  )
    return { type: 'image/webp', extension: 'webp' };
  return null;
}
