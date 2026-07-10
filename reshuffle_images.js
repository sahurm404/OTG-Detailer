const fs = require('fs');
const path = require('path');

const workDir = path.join(__dirname, 'Work', 'Sipho');
const htmlPath = path.join(__dirname, 'index.html');
const allowedExts = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif']);

// 1. Read existing HTML
let html = fs.readFileSync(htmlPath, 'utf8');

// 2. Find all current images in index.html that come from Work/Sipho
const regex = /Work\/Sipho\/([^'"\)\s]+)/gi;
let match;
const currentImages = new Set();
while ((match = regex.exec(html)) !== null) {
  const file = match[1];
  const ext = path.extname(file).toLowerCase();
  if (allowedExts.has(ext)) {
    currentImages.add(file);
  }
}

const currentImagesArr = Array.from(currentImages);
console.log(`Found ${currentImagesArr.length} unique images currently in index.html.`);

// 3. Get all allowed images from Work/Sipho
const allFiles = fs.readdirSync(workDir);
const availableImages = allFiles.filter(file => {
  const ext = path.extname(file).toLowerCase();
  return allowedExts.has(ext);
});

console.log(`Found ${availableImages.length} available images in Work/Sipho.`);

if (availableImages.length < currentImagesArr.length) {
  console.error("Not enough images in Work/Sipho to reshuffle.");
  process.exit(1);
}

// 4. Shuffle available images
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

shuffleArray(availableImages);

// 5. Pick the first N images
const newImages = availableImages.slice(0, currentImagesArr.length);

// 6. Replace old images with new images
const replacements = {};
for (let i = 0; i < currentImagesArr.length; i++) {
  replacements[currentImagesArr[i]] = newImages[i];
  console.log(`Replacing ${currentImagesArr[i]} with ${newImages[i]}`);
}

for (const [oldImg, newImg] of Object.entries(replacements)) {
  const escapeRegExp = oldImg.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const replaceRegex = new RegExp(escapeRegExp, 'g');
  html = html.replace(replaceRegex, newImg);
}

// 7. Write back to index.html
fs.writeFileSync(htmlPath, html, 'utf8');
console.log('Successfully reshuffled all images in index.html!');
