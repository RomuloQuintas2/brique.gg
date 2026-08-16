import sharp from "sharp";
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const svg = `
<svg width="90" height="90" viewBox="0 0 90 90" xmlns="http://www.w3.org/2000/svg">
  <circle cx="45" cy="45" r="45" fill="#1D4ED8"/>
  <path d="M 25 55 L 40 35 L 50 45 L 65 25"
        stroke="#FFFFFF" stroke-width="6" fill="none"
        stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M 55 25 L 65 25 L 65 35"
        stroke="#FFFFFF" stroke-width="6" fill="none"
        stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;

const svgBuffer = Buffer.from(svg);

mkdirSync(path.join(root, "public", "icons"), { recursive: true });

const targets = [
  { file: "public/icons/icon-192.png", size: 192 },
  { file: "public/icons/icon-512.png", size: 512 },
  { file: "app/apple-icon.png", size: 180 },
];

for (const { file, size } of targets) {
  await sharp(svgBuffer, { density: 384 })
    .resize(size, size)
    .png()
    .toFile(path.join(root, file));
  console.log(`generated ${file} (${size}x${size})`);
}
