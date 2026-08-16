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

// Maskable variant: same art padded into a safe zone so Android's adaptive-icon
// mask doesn't crop it or synthesize a background square behind an edge-to-edge circle.
const maskableSvg = `
<svg width="126" height="126" viewBox="0 0 126 126" xmlns="http://www.w3.org/2000/svg">
  <g transform="translate(18, 18)">
    <circle cx="45" cy="45" r="45" fill="#1D4ED8"/>
    <path d="M 25 55 L 40 35 L 50 45 L 65 25"
          stroke="#FFFFFF" stroke-width="6" fill="none"
          stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M 55 25 L 65 25 L 65 35"
          stroke="#FFFFFF" stroke-width="6" fill="none"
          stroke-linecap="round" stroke-linejoin="round"/>
  </g>
</svg>
`;

const svgBuffer = Buffer.from(svg);
const maskableSvgBuffer = Buffer.from(maskableSvg);

mkdirSync(path.join(root, "public", "icons"), { recursive: true });

const targets = [
  { file: "public/icons/icon-192.png", size: 192, buffer: svgBuffer },
  { file: "public/icons/icon-512.png", size: 512, buffer: svgBuffer },
  { file: "app/apple-icon.png", size: 180, buffer: svgBuffer },
  { file: "public/icons/icon-192-maskable.png", size: 192, buffer: maskableSvgBuffer },
  { file: "public/icons/icon-512-maskable.png", size: 512, buffer: maskableSvgBuffer },
];

for (const { file, size, buffer } of targets) {
  await sharp(buffer, { density: 384 })
    .resize(size, size)
    .png()
    .toFile(path.join(root, file));
  console.log(`generated ${file} (${size}x${size})`);
}
