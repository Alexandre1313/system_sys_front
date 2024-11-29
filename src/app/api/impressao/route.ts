import { NextResponse } from 'next/server';
import { SerialPort } from 'serialport';

// Função para lidar com requisição POST
export async function POST(req: Request) {
  try {
    // Verificar se os dados foram enviados corretamente (espera-se um objeto com a chave 'etiquetas' que contenha o ZPL)
    const { etiquetas } = await req.json();

    // Verificar se o ZPL foi enviado
    if (!etiquetas || typeof etiquetas !== 'string') {
      return NextResponse.json({ error: 'ZPL inválido ou ausente' }, { status: 400 });
    }

    // Conectar à porta da impressora (ajuste para o caminho correto)
    const port = new SerialPort({
      path: '\\\\.\\COM3',  // Ajuste para o caminho correto da sua impressora (no caso de Windows, seria algo como COM3)
      baudRate: 9600,
      dataBits: 8,
      stopBits: 1,
      parity: 'none',
    });

    // Quando a porta estiver aberta, enviar o ZPL para a impressora
    await new Promise<void>((resolve, reject) => {
      port.open((err: Error | null) => {
        if (err) {
          reject('Erro ao abrir a porta da impressora: ' + err.message);
        } else {
          console.log('Conectado à impressora, enviando ZPL...');
          port.write(etiquetas, (err: Error | null | undefined) => {
            if (err) {
              reject('Erro ao enviar ZPL: ' + err.message);
            } else {
              console.log('ZPL enviado com sucesso!');
              resolve();
            }
          });
        }
      });
    });

    // Fechar a conexão após o envio
    port.close((err: Error | null) => {
      if (err) {
        console.log('Erro ao fechar a porta:', err.message);
      } else {
        console.log('Conexão com a impressora fechada.');
      }
    });

    return NextResponse.json({ message: 'Impressão enviada com sucesso!' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro ao comunicar com a impressora' }, { status: 500 });
  }
}
