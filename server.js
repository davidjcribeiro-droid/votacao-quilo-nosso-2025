import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 8081;

// Servir arquivos estáticos do diretório dist
app.use(express.static(path.join(__dirname, 'dist')));

// Para todas as rotas que não são arquivos estáticos, retornar index.html
// Isso permite que o React Router funcione corretamente
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Servidor rodando em http://0.0.0.0:${port}`);
});
