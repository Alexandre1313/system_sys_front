import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  // Verificação simples usando uma chave no localStorage
  const isLoggedIn = !!localStorage.getItem('userToken');  // Esta verificação acontece no lado do cliente

  // Checando se a rota acessada deve ser protegida
  if (!isLoggedIn && req.url.includes('/dashboard')) {  // Ajuste as rotas conforme necessário
    // Redireciona para a página de login caso o usuário não esteja autenticado
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Deixa passar a requisição caso o usuário esteja autenticado
  return NextResponse.next();
}

// Configuração das rotas que serão protegidas
export const config = {
  matcher: ['/', '/grades', '/escolas', '/entradas_embalagem', '/projetos', '/romaneios_despacho'],  // Especificando as rotas que exigem autenticação
};
