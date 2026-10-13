import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";
await mkdir("public/brand", { recursive: true });
const source = "public/KrowdKraft_Logo.png";
await sharp(source).resize(192, 192).webp({ quality: 85 }).toFile("public/brand/logo.webp");
await sharp(source).resize(192, 192).avif({ quality: 60 }).toFile("public/brand/logo.avif");
await sharp(source).resize(180, 180).png().toFile("public/apple-touch-icon.png");
const icon = await sharp(source).resize(32, 32).png().toBuffer();
const header = Buffer.alloc(22);
header.writeUInt16LE(1, 2); header.writeUInt16LE(1, 4);
header[6] = 32; header[7] = 32;
header.writeUInt16LE(1, 10); header.writeUInt16LE(32, 12);
header.writeUInt32LE(icon.length, 14); header.writeUInt32LE(22, 18);
await writeFile("public/favicon.ico", Buffer.concat([header, icon]));
const logo = await sharp(source).resize(410, 410).png().toBuffer();
await sharp({ create: { width: 1200, height: 630, channels: 4, background: "#09080d" } })
  .composite([{ input: logo, left: 395, top: 110 }]).png().toFile("public/brand/og.png");
console.log("Original mark preserved; WebP, AVIF, icons, and OG image generated.");
