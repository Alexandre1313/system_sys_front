import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('userToken');  // Acessando o cookie no lado do servidor

  // Se o token existir, redireciona para a raiz ("/") se estiver tentando acessar a página de login
  if (token && req.url.includes('/login')) {
    return NextResponse.redirect(new URL('/', req.url));  // Redireciona para a raiz da app
  }

  // Se não houver token e não for a página de login, redireciona para a página de login
  if (!token && !req.url.includes('/login')) {
    return NextResponse.redirect(new URL('/login', req.url));  // Redireciona para a página de login
  }

  // Se estiver autenticado ou acessando login, permite a continuação
  return NextResponse.next();
}

// Aqui, o matcher agora cobre todas as rotas, excluindo as rotas de login, estáticas e internas do Next.js
export const config = {
  matcher: ['/((?!_next|static|favicon.ico|login).*)'],  // Protege todas as rotas, mas permite acesso à página de login
};
