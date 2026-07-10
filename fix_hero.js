const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Replace the hero bg::after base64 with a real image from Work folder
//    Use a high-quality car image like IMG_2756
html = html.replace(
    /\.hero-bg::after \{[\s\S]*?background-image: url\('[^']+'\);/,
    `.hero-bg::after {
            content: '';
            position: absolute;
            inset: 0;
            background-image: url('Work/Sipho/IMG_2756.JPG');`
);

// 2. Raise opacity from 0.15 to 0.45 so image is much more visible
html = html.replace(
    /\.hero-bg::after \{([\s\S]*?)opacity: 0\.15;/,
    (m, inner) => `.hero-bg::after {${inner}opacity: 0.45;`
);

// 3. Lower the dark overlay that sits on top
// The hero::before or overlay gradient is usually set at rgba(5, 5, 5, 0.85)
// Let's find it near line 124 (in hero context)
const lines = html.split('\n');
// Line 124 is the dark overlay on hero-bg
lines.forEach((line, i) => {
    if (i > 120 && i < 145 && line.includes('rgba(5, 5, 5, 0.85)')) {
        console.log('Found hero overlay at line ' + (i+1) + ': ' + line.trim());
    }
});

fs.writeFileSync('index.html', html);
console.log('Hero image and opacity updated!');
