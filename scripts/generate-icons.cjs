// Simple icon generator for EchoMeo PWA
const fs = require('fs');
const path = require('path');

// Create a simple EchoMeo icon SVG
const createEchoMeoSVG = (size) => `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="${size}" height="${size}" rx="${size * 0.1}" fill="#3b82f6"/>
  
  <!-- Cat emoji or simple icon -->
  <circle cx="${size * 0.5}" cy="${size * 0.4}" r="${size * 0.2}" fill="#ffffff"/>
  <circle cx="${size * 0.42}" cy="${size * 0.35}" r="${size * 0.03}" fill="#000000"/>
  <circle cx="${size * 0.58}" cy="${size * 0.35}" r="${size * 0.03}" fill="#000000"/>
  
  <!-- Text "EM" for EchoMeo -->
  <text x="${size * 0.5}" y="${size * 0.8}" 
        font-family="Arial, sans-serif" 
        font-size="${size * 0.2}" 
        font-weight="bold" 
        fill="white" 
        text-anchor="middle">EM</text>
</svg>
`;

// Ensure icons directory exists
const iconsDir = path.join(__dirname, '..', 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Generate SVG icons for different sizes
const sizes = [16, 32, 48, 72, 96, 128, 144, 152, 192, 384, 512];

sizes.forEach(size => {
  const svg = createEchoMeoSVG(size);
  const filename = `icon-${size}x${size}.svg`;
  const filepath = path.join(iconsDir, filename);
  
  fs.writeFileSync(filepath, svg);
  console.log(`Generated ${filename}`);
});

console.log('\\nIcons generated! You can convert SVG to PNG using online tools or:');
console.log('1. Visit: https://convertio.co/svg-png/');
console.log('2. Upload the SVG files from public/icons/');
console.log('3. Download as PNG and replace the existing files');