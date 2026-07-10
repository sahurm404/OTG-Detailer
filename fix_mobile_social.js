const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Replace mobile social image CSS
html = html.replace(
    /\.social-image \{ width: 100%; height: 200px;/,
    '.social-image { width: 100%; aspect-ratio: 16/9; height: auto;'
);

fs.writeFileSync('index.html', html);
console.log('Fixed social-image aspect ratio on mobile');
