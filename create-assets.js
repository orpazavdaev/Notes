const sharp = require('sharp');
const path = require('path');

const assetsDir = path.join(__dirname, 'assets');
const primaryColor = { r: 245, g: 166, b: 35 }; // #F5A623

async function createAssets() {
  try {
    // Create icon (1024x1024)
    await sharp({
      create: {
        width: 1024,
        height: 1024,
        channels: 3,
        background: primaryColor
      }
    })
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

    // Create adaptive-icon (1024x1024)
    await sharp({
      create: {
        width: 1024,
        height: 1024,
        channels: 3,
        background: primaryColor
      }
    })
    .png()
    .toFile(path.join(assetsDir, 'adaptive-icon.png'));
    console.log('Created: adaptive-icon.png');

    // Create favicon (48x48)
    await sharp({
      create: {
        width: 48,
        height: 48,
        channels: 3,
        background: primaryColor
      }
    })
    .png()
    .toFile(path.join(assetsDir, 'favicon.png'));
    console.log('Created: favicon.png');

    console.log('\nAll assets created successfully!');
  } catch (error) {
    console.error('Error creating assets:', error);
  }
}

createAssets();
