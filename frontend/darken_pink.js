const fs = require('fs');
const path = require('path');

const layouts = [
  'src/app/dashboard/owner/layout.tsx',
  'src/app/dashboard/kepala-toko/layout.tsx',
  'src/app/dashboard/karyawan/layout.tsx',
  'src/app/dashboard/hr/layout.tsx',
  'src/app/dashboard/accounting/layout.tsx'
];

function replaceInFile(filePath) {
  const fullPath = path.join(__dirname, filePath);
  if (!fs.existsSync(fullPath)) {
    console.log(`File not found: ${fullPath}`);
    return;
  }
  
  let content = fs.readFileSync(fullPath, 'utf8');

  // Sidebar container border
  content = content.replace(/border-pink-100/g, 'border-pink-200');
  
  // Sidebar Header
  content = content.replace(/text-pink-500/g, 'text-pink-700');
  content = content.replace(/hover:text-pink-500/g, 'hover:text-pink-700');
  
  // Section Title
  content = content.replace(/text-pink-400/g, 'text-pink-600');
  
  // Sidebar Links
  content = content.replace(/bg-pink-100 text-pink-700 font-semibold shadow-sm/g, 'bg-pink-700 text-white font-semibold shadow-md');
  content = content.replace(/hover:bg-pink-50 hover:text-pink-600/g, 'hover:bg-pink-100 hover:text-pink-800');
  
  // User Profile
  content = content.replace(/bg-pink-100 text-pink-700/g, 'bg-pink-700 text-white');
  content = content.replace(/border-pink-200/g, 'border-pink-300');
  
  // Logout Button
  content = content.replace(/hover:text-pink-600/g, 'hover:text-pink-800');

  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`Updated ${filePath}`);
}

layouts.forEach(replaceInFile);
