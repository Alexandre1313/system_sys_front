import { NextResponse } from 'next/server';

// Função para lidar com requisição POST
export async function POST(req: Request) {
  try {
    // Verificar se os dados foram enviados corretamente (espera-se um objeto com a chave 'etiquetas' que contenha o ZPL)
    const { etiquetas } = await req.json();

    // Verificar se o ZPL foi enviado
    if (!etiquetas || typeof etiquetas !== 'string') {
      return NextResponse.json({ error: 'ZPL inválido ou ausente' }, { status: 400 });
    }
    return NextResponse.json({ message: etiquetas });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro ao comunicar com a impressora' }, { status: 500 });
  }
}
