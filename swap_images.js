const fs = require('fs');
const path = require('path');

let html = fs.readFileSync('index.html', 'utf8');

const replacements = {
  // Hero
  'IMG_2756.JPG': 'IMG_2383.JPG',
  // Service Cards
  'IMG_2758.JPG': '20251026_155910_Original.jpg',
  'IMG_2755.JPG': '20251026_134730_Original.jpg',
  'IMG_2753.JPG': 'IMG_2384.JPG',
  'IMG_2751.JPG': 'IMG_2385.JPG',
  // Social Cards
  'IMG_2756(1).JPG': 'IMG_2381.JPG',
  'IMG_2759.JPG': 'IMG_2380.JPG',
  'IMG_2749.JPG': 'IMG_2748.JPG'
};

for (const [oldImg, newImg] of Object.entries(replacements)) {
  const regex = new RegExp(oldImg.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
  html = html.replace(regex, newImg);
}

fs.writeFileSync('index.html', html);
console.log('Successfully replaced all images in index.html with a new random set.');
