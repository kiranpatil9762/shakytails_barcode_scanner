// This file can be used to create the public directories
const fs = require('fs');
const path = require('path');

const directories = [
  path.join(__dirname, '../public/qrcodes'),
  path.join(__dirname, '../public/uploads'),
];

directories.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`✅ Created directory: ${dir}`);
  } else {
    console.log(`📁 Directory already exists: ${dir}`);
  }
});

console.log('✨ All directories are ready!');
