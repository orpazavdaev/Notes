const sharp = require('sharp');
const path = require('path');

const assetsDir = path.join(__dirname, 'assets');
const primaryColor = { r: 245, g: 166, b: 35 }; // #F5A623

// SVG checkmark icon - large and centered
const createCheckmarkSvg = (size) => {
  const strokeWidth = Math.round(size * 0.08);
  const boxSize = Math.round(size * 0.55);
  const boxX = Math.round((size - boxSize) / 2);
  const boxY = Math.round((size - boxSize) / 2);
  const radius = Math.round(size * 0.08);
  
  return Buffer.from(`
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <rect x="${boxX}" y="${boxY}" width="${boxSize}" height="${boxSize}" rx="${radius}" ry="${radius}" 
            fill="none" stroke="white" stroke-width="${strokeWidth}"/>
      <polyline points="${boxX + boxSize * 0.2},${boxY + boxSize * 0.5} ${boxX + boxSize * 0.4},${boxY + boxSize * 0.7} ${boxX + boxSize * 0.8},${boxY + boxSize * 0.3}" 
                fill="none" stroke="white" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `);
};

async function createAssets() {
  try {
    // Create icon (1024x1024) with checkmark
    const iconBase = await sharp({
      create: {
        width: 1024,
        height: 1024,
        channels: 4,
        background: { ...primaryColor, alpha: 1 }
      }
    }).png().toBuffer();
    
    await sharp(iconBase)
      .composite([{ input: createCheckmarkSvg(1024), top: 0, left: 0 }])
      .png()
      .toFile(path.join(assetsDir, 'icon.png'));
    console.log('Created: icon.png');

    // Create splash (1284x2778)
    await sharp({
      create: {
        width: 1284,
        height: 2778,
        channels: 3,
        background: { r: 255, g: 245, b: 235 } // Light peach background
      }
    })
    .png()
    .toFile(path.join(assetsDir, 'splash.png'));
    console.log('Created: splash.png');

    // Create adaptive-icon (1024x1024) with checkmark
    await sharp(iconBase)
      .composite([{ input: createCheckmarkSvg(1024), top: 0, left: 0 }])
      .png()
      .toFile(path.join(assetsDir, 'adaptive-icon.png'));
    console.log('Created: adaptive-icon.png');

    // Create favicon (48x48) with checkmark
    const faviconBase = await sharp({
      create: {
        width: 48,
        height: 48,
        channels: 4,
        background: { ...primaryColor, alpha: 1 }
      }
    }).png().toBuffer();
    
    await sharp(faviconBase)
      .composite([{ input: createCheckmarkSvg(48), top: 0, left: 0 }])
      .png()
      .toFile(path.join(assetsDir, 'favicon.png'));
    console.log('Created: favicon.png');

    console.log('\nAll assets created successfully!');
  } catch (error) {
    console.error('Error creating assets:', error);
  }
}

createAssets();
