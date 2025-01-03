const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

async function generateIcons() {
  // Create a simple colored square as base image
  const size = 512;
  const svg = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="black"/>
      <text
        x="50%"
        y="50%"
        text-anchor="middle"
        dominant-baseline="middle"
        font-size="${size * 0.6}px"
        fill="white"
        font-family="system-ui, sans-serif"
        font-weight="bold"
      >C</text>
    </svg>
  `;

  // Create base image from SVG
  const baseImage = sharp(Buffer.from(svg));

  // Ensure the public directory exists
  await fs.mkdir(path.join(process.cwd(), 'public'), { recursive: true });

  // Generate PNG icons
  const sizes = {
    'icon.png': 32,
    'apple-icon.png': 180,
    'favicon.ico': 32,
  };

  for (const [filename, size] of Object.entries(sizes)) {
    await baseImage
      .clone()
      .resize(size, size)
      .png()
      .toFile(path.join(process.cwd(), 'public', filename));
  }

  console.log('Icons generated successfully!');
}

generateIcons().catch(console.error); 