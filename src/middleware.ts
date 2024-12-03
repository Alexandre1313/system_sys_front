import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('userToken');  // Acessando o cookie no lado do servidor

  // Verifica se não há token e se está tentando acessar uma rota protegida
  if (!token) {
    // Se não houver token, redireciona para a página de login
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Se houver token, permite a continuação da requisição
  return NextResponse.next();
}

// Aqui, o matcher agora cobre todas as rotas
export const config = {
  matcher: ['/((?!_next|static|favicon.ico).*)'],  // Protege todas as rotas, excluindo as rotas internas do Next.js
};
