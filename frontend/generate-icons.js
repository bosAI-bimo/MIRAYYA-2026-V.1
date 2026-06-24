const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, 'public', 'logo.png');
const sizes = [192, 512];

async function generateIcons() {
  if (!fs.existsSync(inputPath)) {
    console.error('Logo not found at', inputPath);
    return;
  }

  for (const size of sizes) {
    const outputPath = path.join(__dirname, 'public', `icon-${size}x${size}.png`);
    await sharp(inputPath)
      .resize(size, size, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .toFile(outputPath);
    console.log(`Generated ${outputPath}`);
  }
}

generateIcons().catch(console.error);
