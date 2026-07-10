const fs = require('fs');
const path = require('path');

let html = fs.readFileSync('index.html', 'utf8');

const replacements = {
  // Hero
  'IMG_2383.JPG': '20251026_160209_Original.jpg',
  // Service Cards
  '20251026_155910_Original.jpg': '20251026_134638_Original.jpg',
  '20251026_134730_Original.jpg': '20251026_134829_Original.jpg',
  'IMG_2384.JPG': '20251026_155855_Original.jpg',
  'IMG_2385.JPG': 'fafd77c7-2ef4-4d38-8c41-068e2da0b3e8.JPG',
  // Social Cards
  'IMG_2381.JPG': 'IMG_2382.JPG',
  'IMG_2380.JPG': '20251026_160223_Original.jpg',
  'IMG_2748.JPG': '20251026_155302_Original.jpg'
};

for (const [oldImg, newImg] of Object.entries(replacements)) {
  const regex = new RegExp(oldImg.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
  html = html.replace(regex, newImg);
}

fs.writeFileSync('index.html', html);
console.log('Successfully replaced all images in index.html with another random set.');
