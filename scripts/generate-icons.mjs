/**
 * Generates PWA icon PNGs using only Node.js built-ins (no extra dependencies).
 * Produces a gold gradient square icon in 192×192 and 512×512.
 * Run: node scripts/generate-icons.mjs
 */
import { deflateSync } from 'zlib';
import { writeFileSync, mkdirSync } from 'fs';

// ─── CRC-32 ───────────────────────────────────────────────────────────────────
const CRC_TABLE = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) c = (c & 1) ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
  CRC_TABLE[n] = c;
}
function crc32(buf) {
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) crc = CRC_TABLE[(crc ^ buf[i]) & 0xFF] ^ (crc >>> 8);
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

// ─── PNG chunk helper ─────────────────────────────────────────────────────────
function chunk(type, data) {
  const typeBytes = Buffer.from(type, 'ascii');
  const lenBuf = Buffer.allocUnsafe(4);
  lenBuf.writeUInt32BE(data.length, 0);
  const crcBuf = Buffer.allocUnsafe(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBytes, data])), 0);
  return Buffer.concat([lenBuf, typeBytes, data, crcBuf]);
}

// ─── PNG builder ──────────────────────────────────────────────────────────────
function buildPNG(size, r, g, b) {
  const sig  = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.allocUnsafe(13);
  ihdr.writeUInt32BE(size, 0); ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; ihdr[9] = 2; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;

  // Scanlines: 1 filter byte + RGB per pixel
  const row  = 1 + size * 3;
  const raw  = Buffer.allocUnsafe(size * row);
  const cx   = size / 2;
  const cy   = size / 2;
  const rMax = size / 2;

  for (let y = 0; y < size; y++) {
    raw[y * row] = 0; // None filter
    for (let x = 0; x < size; x++) {
      // Subtle radial gradient: bright centre fading to slightly darker edges
      const dist    = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2) / rMax;
      const factor  = Math.max(0.65, 1 - dist * 0.35);
      const px      = y * row + 1 + x * 3;
      raw[px]     = Math.round(Math.min(255, r * factor));
      raw[px + 1] = Math.round(Math.min(255, g * factor));
      raw[px + 2] = Math.round(Math.min(255, b * factor));
    }
  }

  return Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 6 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

// ─── Generate ─────────────────────────────────────────────────────────────────
// Gold: #D4AF37 = RGB(212, 175, 55)
mkdirSync('public', { recursive: true });
writeFileSync('public/pwa-192x192.png',     buildPNG(192, 212, 175, 55));
writeFileSync('public/pwa-512x512.png',     buildPNG(512, 212, 175, 55));
writeFileSync('public/apple-touch-icon.png', buildPNG(180, 212, 175, 55));
console.log('✓ PWA icons generated: public/pwa-192x192.png, pwa-512x512.png, apple-touch-icon.png');
