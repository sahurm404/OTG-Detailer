const fs = require('fs');
const path = require('path');

const WORK_DIR = path.join(__dirname, 'Work');
const OUTPUT_FILE = path.join(__dirname, 'gallery.json');

// Supported image extensions
const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif']);

function getFilesRecursively(dir, fileList = []) {
    if (!fs.existsSync(dir)) return fileList;
    
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
            getFilesRecursively(filePath, fileList);
        } else {
            const ext = path.extname(file).toLowerCase();
            if (IMAGE_EXTENSIONS.has(ext)) {
                fileList.push({
                    path: filePath,
                    relativePath: path.relative(__dirname, filePath).replace(/\\/g, '/'),
                    modifiedTime: stat.mtimeMs,
                    name: file
                });
            }
        }
    }
    return fileList;
}

function generateGallery() {
    console.log('Scanning Work directory for images...');
    const allImages = getFilesRecursively(WORK_DIR);
    
    // Sort by modified time descending (newest first)
    allImages.sort((a, b) => b.modifiedTime - a.modifiedTime);
    
    // Deduplicate images that look like "IMG_1234(1).JPG" vs "IMG_1234.JPG"
    const uniqueImages = [];
    const seenNames = new Set();
    
    for (const img of allImages) {
        const ext = path.extname(img.name);
        const base = path.basename(img.name, ext);
        const canonicalBase = base.replace(/\s*\(\d+\)$/, '').toLowerCase();
        
        if (!seenNames.has(canonicalBase)) {
            seenNames.add(canonicalBase);
            uniqueImages.push(img);
        }
    }
    
    // Filter out BMW X5 images from being featured
    const bmwX5Pattern = /IMG_275[0-9]/;
    const featuredPool = uniqueImages.filter(img => !bmwX5Pattern.test(img.name));
    const featured = featuredPool.slice(0, 3).map(img => img.relativePath);
    
    // The rest of the images
    const gallery = uniqueImages.map(img => img.relativePath);
    
    const outputData = {
        featured: featured,
        gallery: gallery,
        lastUpdated: new Date().toISOString()
    };
    
    const jsContent = `window.galleryData = ${JSON.stringify(outputData, null, 2)};`;
    fs.writeFileSync(path.join(__dirname, 'gallery_data.js'), jsContent);
    console.log(`Successfully generated gallery_data.js with ${gallery.length} images!`);
    console.log(`Top 3 featured images picked:`);
    featured.forEach((img, i) => console.log(`  ${i + 1}. ${img}`));
}

try {
    generateGallery();
} catch (e) {
    console.error('Error generating gallery:', e);
}
