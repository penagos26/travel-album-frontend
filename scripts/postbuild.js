const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const outDir = path.join(process.cwd(), 'out');
const repoName = 'travel-album-frontend';
const isGitHubPages = process.env.GITHUB_PAGES === 'true';
const isLocalTest = process.env.LOCAL_TEST === 'true';

console.log('🔧 Post-build iniciado...');
console.log(`📌 Entorno: ${isGitHubPages ? 'GitHub Pages' : isLocalTest ? 'Local Test' : 'Desarrollo local'}`);

function fixPathsForGitHubPages(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      fixPathsForGitHubPages(filePath);
    } else if (file.endsWith('.html')) {
      let content = fs.readFileSync(filePath, 'utf8');
      
      content = content.replace(
        /(src|href)="\//g,
        `$1="/${repoName}/`
      );
      
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
  
  // Crear instrucciones claras para servir
  console.log('\n' + '='.repeat(50));
  console.log('✅ PRUEBA LOCAL PREPARADA');
  console.log('='.repeat(50));
  console.log('\n📋 Para servir la aplicación:');
  console.log('\n   Opción 1 (Recomendada - con serve):');
  console.log(`   cd test-deploy/${repoName} && npx serve@latest -l 3000`);
  console.log('\n   Opción 2 (Con un servidor HTTP simple):');
  console.log(`   cd test-deploy/${repoName} && npx http-server -p 3000`);
  console.log('\n🌐 Luego abre en tu navegador:');
  console.log(`   http://localhost:3000\n`);
}

// Ejecutar según el entorno
if (isGitHubPages) {
  console.log('🚀 Preparando para GitHub Pages...');
  fixPathsForGitHubPages(outDir);
  console.log('✅ Archivos listos para GitHub Pages');
} else if (isLocalTest) {
  console.log('🧪 Preparando para prueba local...');
  reorganizeForLocalTest();
} else {
  console.log('💻 Modo desarrollo local - sin modificaciones');
}

console.log('🎉 Post-build completado!');