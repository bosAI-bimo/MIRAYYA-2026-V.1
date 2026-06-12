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

  // Background
  content = content.replace(/bg-slate-50/g, 'bg-white');

  // Sidebar container
  content = content.replace(/bg-slate-800 text-slate-100/g, 'bg-white text-slate-800 border-r border-pink-100');
  
  // Sidebar Header
  content = content.replace(/border-slate-700/g, 'border-pink-100');
  content = content.replace(/text-2xl font-bold text-white/g, 'text-2xl font-bold text-pink-500');
  content = content.replace(/text-slate-300 hover:text-white/g, 'text-slate-500 hover:text-pink-500');
  
  // Section Title
  content = content.replace(/text-slate-400 mb-4 px-2/g, 'text-pink-400 mb-4 px-2');
  
  // Sidebar Links
  content = content.replace(/bg-\[#B76E79\] text-white shadow-sm/g, 'bg-pink-100 text-pink-700 font-semibold shadow-sm');
  content = content.replace(/text-slate-300 hover:bg-slate-700 hover:text-white/g, 'text-slate-600 hover:bg-pink-50 hover:text-pink-600');
  
  // User Profile
  content = content.replace(/bg-slate-600/g, 'bg-pink-100 text-pink-700');
  content = content.replace(/border-\[#B76E79\]/g, 'border-pink-200');
  content = content.replace(/text-sm font-medium text-white/g, 'text-sm font-medium text-slate-800');
  content = content.replace(/text-xs text-slate-400/g, 'text-xs text-slate-500');
  
  // Logout Button
  content = content.replace(/text-slate-300 border-slate-600 hover:bg-slate-700 hover:text-white bg-transparent/g, 'text-slate-600 border-pink-200 hover:bg-pink-50 hover:text-pink-600 bg-white');

  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`Updated ${filePath}`);
}

layouts.forEach(replaceInFile);

