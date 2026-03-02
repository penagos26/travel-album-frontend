const { spawn, exec } = require('child_process');
const path = require('path');
const os = require('os');

const port = 3000;
const repoName = 'travel-album-frontend';
const serveDir = path.join(process.cwd(), 'test-deploy');
const url = `http://localhost:${port}/${repoName}`;

console.log('🚀 Iniciando servidor de prueba...');
console.log(`📁 Sirviendo desde: ${serveDir}`);
console.log(`🌐 URL: ${url}`);

// Cambiar al directorio correcto y ejecutar serve
const serveProcess = spawn('npx', ['serve@latest', '-l', port], {
  cwd: serveDir,
  shell: true,
  stdio: 'inherit'
});

// Esperar un momento y abrir el navegador
setTimeout(() => {
  const command = os.platform() === 'win32' ? 'start' : 
                  os.platform() === 'darwin' ? 'open' : 'xdg-open';
  
  exec(`${command} ${url}`, (error) => {
    if (error) {
      console.log('✅ Servidor iniciado. Abre manualmente:', url);
    } else {
      console.log('🎯 Navegador abierto automáticamente');
    }
  });
}, 2000);

// Manejar cierre
process.on('SIGINT', () => {
  console.log('\n🛑 Deteniendo servidor...');
  serveProcess.kill();
  process.exit();
});