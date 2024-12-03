import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('userToken');  // Acessando o cookie no lado do servidor

  // Se não houver token e o usuário não estiver tentando acessar a página de login
  if (!token && !req.url.includes('/login')) {
    // Redireciona para a página de login
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Se houver token ou se for a página de login, permite a continuação da requisição
  return NextResponse.next();
}

// Exclui a página de login e arquivos estáticos
export const config = {
  matcher: ['/((?!_next|static|favicon.ico|login).*)'],  // Exclui a rota /login da proteção
};
