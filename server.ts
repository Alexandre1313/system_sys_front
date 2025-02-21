import https from 'https';
import fs from 'fs';
import next from 'next';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = https.createServer(
    {
      key: fs.readFileSync('/etc/letsencrypt/live/SEU_DOMÍNIO/privkey.pem'),  // Caminho para a chave privada
      cert: fs.readFileSync('/etc/letsencrypt/live/SEU_DOMÍNIO/fullchain.pem'), // Caminho para o certificado
    },
    (req, res) => {
      handle(req, res); // Lidar com as requisições
    }
  );

  // Tratar erros com evento 'error'
  server.on('error', (err: Error) => {
    console.error('Erro no servidor: ', err);
  });

  // Garantir que a variável "port" seja um número
  const port = Number(process.env.PORT) || 3000;  // Converte para número, ou usa 3000 como fallback
  const host = '0.0.0.0';

  // Ouvindo a porta 3000 e garantindo que o servidor escute em todas as interfaces
  server.listen(port, host, () => {
    console.log(`> Ready on https://${host}:${port}`);
  });
});
