const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const outDir = path.join(process.cwd(), 'out');
const repoName = 'travel-album-frontend';
const isGitHubPages = process.env.GITHUB_PAGES === 'true';
const isLocalTest = process.env.LOCAL_TEST === 'true';

console.log('🔧 Post-build iniciado...');
console.log(`📌 Entorno: ${isGitHubPages ? 'GitHub Pages' : isLocalTest ? 'Local Test' : 'Desarrollo local'}`);

function fixHtmlPaths(dir, basePath = '') {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      fixHtmlPaths(filePath, basePath);
    } else if (file.endsWith('.html')) {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Corregir rutas en HTML
      if (isGitHubPages) {
        // Para GitHub Pages, rutas absolutas con /repo/
        content = content.replace(
          /(src|href)="\/(_next|assets)/g,
          `$1="/${repoName}/$2`
        );
        content = content.replace(
          /(src|href)="\/(?!\/)/g,
          `$1="/${repoName}/`
        );
      } else if (isLocalTest) {
        // Para prueba local, rutas relativas
        content = content.replace(
          /(src|href)="\/(_next|assets)/g,
          `$1="./$2`
        );
        content = content.replace(
          /(src|href)="\/(?!\/)/g,
          '$1="./'
        );
      }
      
      fs.writeFileSync(filePath, content);
      console.log(`✓ HTML corregido: ${path.relative(outDir, filePath)}`);
    }
  });
}

function reorganizeForLocalTest() {
  const testDir = path.join(process.cwd(), 'test-deploy');
  const targetDir = path.join(testDir, repoName);
  
  console.log(`📁 Preparando prueba local en: ${targetDir}`);
  
  if (fs.existsSync(testDir)) {
    fs.rmSync(testDir, { recursive: true, force: true });
  }
  fs.mkdirSync(targetDir, { recursive: true });
  
  execSync(`cp -r ${outDir}/* ${targetDir}/`);
  
  // Crear archivo de redirección para prueba local
  const redirectHtml = `<!DOCTYPE html>
<html>
<head>
  <meta http-equiv="refresh" content="0; url=/${repoName}/">
</head>
<body>
  <p>Redirigiendo a <a href="/${repoName}/">/${repoName}/</a>...</p>
</body>
</html>`;
  
  fs.writeFileSync(path.join(testDir, 'index.html'), redirectHtml);
  
  console.log('\n' + '='.repeat(50));
  console.log('✅ PRUEBA LOCAL PREPARADA');
  console.log('='.repeat(50));
  console.log('\n📋 Para servir la aplicación:');
  console.log(`   cd test-deploy && npx serve@latest -l 3000`);
  console.log('\n🌐 Luego abre en tu navegador:');
  console.log(`   http://localhost:3000/${repoName}\n`);
}

// Ejecutar según el entorno
if (isGitHubPages) {
  console.log('🚀 Preparando para GitHub Pages...');
  fixHtmlPaths(outDir, repoName);
  console.log('✅ Archivos listos para GitHub Pages');
} else if (isLocalTest) {
  console.log('🧪 Preparando para prueba local...');
  reorganizeForLocalTest();
} else {
  console.log('💻 Modo desarrollo local - sin modificaciones');
  fixHtmlPaths(outDir);
}

console.log('🎉 Post-build completado!');