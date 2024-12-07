'use client'

import { deleteCookie, getCookie, setCookie } from 'cookies-next';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Usuarios } from '../../core';

interface AuthContextType {
  user: Usuarios | null;
  login: (userData: Usuarios) => void;
  logout: () => void;
}

// Criando o contexto com tipos
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provedor do contexto
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<Usuarios | null>(null);

  useEffect(() => {
    // Ao montar o componente, verificar o cookie
    const storedUser = getCookie('userToken');
    if (storedUser) {
      setUser(JSON.parse(storedUser as string));
    }
  }, []);  // Apenas roda uma vez quando o componente é montado

  const login = (userData: Usuarios) => {
    setUser(userData);   
    // Armazenar o usuário no cookie para persistência
    setCookie('userToken', JSON.stringify(userData), { maxAge: 60 * 60 * 24 });  // 1 dia
  };

  const logout = () => {
    setUser(null);  // Limpar o estado de usuário no contexto
    deleteCookie('userToken');  // Remover o cookie
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para acessar o contexto de autenticação
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
