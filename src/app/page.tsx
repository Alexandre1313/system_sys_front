"use client";

import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { useEffect, useState } from 'react';
import { Clock, User, Wifi } from 'react-feather';

export default function Home() {
  
  const [currentTime, setCurrentTime] = useState('');
  const [userName, setUserName] = useState('');
  const [isOnline, setIsOnline] = useState(true); 
  
  // Get user from AuthContext
  const { user } = useAuth();

  useEffect(() => {
    // Update time every second
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);

    // Set user name from context
    if (user) {
      try {        
        setUserName(user.nome || 'Desconectado');
      } catch {
        setUserName('Desconectado');
      }
    }

    // Monitor online status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      clearInterval(interval);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [user]);
  return (
    <div className="min-h-[100dvh] bg-slate-950 relative flex flex-col w-full justify-between overflow-hidden">      
      {/* Header */}
      <header className="relative z-20 w-full px-4 py-4 sm:px-6 lg:px-8 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-800/50 overflow-hidden">
        {/* Brushed metal effect - horizontal lines */}
        <div className="absolute inset-0 opacity-70 pointer-events-none brushed-metal"></div>
        {/* Metallic shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-500/30 to-transparent opacity-80 pointer-events-none"></div>
        <div className="relative flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <span className="text-white font-bold text-sm sm:text-base">S</span>
            </div>
            <div className="text-white">
              <h1 className="text-lg sm:text-xl font-semibold">SYS EXPED</h1>
              <p className="text-xs sm:text-sm text-slate-400">Sistema de Expedição</p>
            </div>
          </div>
          
          {/* Dynamic Info */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* User Info */}
            {userName && (
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-800 rounded-lg border border-slate-700/40">
                <User size={14} className="text-emerald-400" />
                <span className="text-sm text-slate-300">{userName}</span>
              </div>
            )}
            
            {/* Time */}
            {currentTime && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-800 rounded-lg border border-slate-700/40">
                <Clock size={14} className="text-blue-400" />
                <span className="text-sm text-slate-300">{currentTime}</span>
              </div>
            )}
            
            {/* Status */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 rounded-lg border border-slate-700/40">
              <Wifi size={14} className={isOnline ? 'text-green-400' : 'text-red-400'} />
              <span className="hidden sm:inline text-xs text-slate-300">{isOnline ? 'Online' : 'Offline'}</span>
              <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-30 flex-1 flex flex-col items-center justify-start px-4 py-8 sm:px-6 lg:px-8">
        {/* Logo Section */}
        <div>
          <div className="text-center mb-8 sm:mb-12">
            <div className="flex items-center justify-center mb-4 transform-gpu">
              <h1 className="text-3xl sm:text-5xl lg:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-600 transform hover:scale-105 hover:rotate-1 transition-all duration-500 cursor-default">
                SYS
              </h1>
              <span className="text-2xl sm:text-4xl lg:text-6xl font-bold text-blue-400 ml-2 transform hover:scale-110 hover:rotate-3 transition-all duration-500 cursor-default">E</span>
              <span className="text-xl sm:text-3xl lg:text-5xl font-medium text-slate-300 ml-0 transform hover:scale-105 hover:-rotate-1 transition-all duration-500 cursor-default">XPED</span>
            </div>
            <p className="text-slate-400 text-sm sm:text-base max-w-md mx-auto transform hover:scale-105 transition-all duration-300 cursor-default">
              Sistema para gestão de expedição e logística
            </p>
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-blue-500/5 to-purple-500/5 rounded-full blur-3xl transform scale-150 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
          </div>

          {/* Navigation Grid */}
          <div className="w-full max-w-6xl">
            {/* Primary Actions */}
            <div className="mb-8">
              <h2 className="text-slate-300 text-sm font-medium mb-4 px-4">Operações Principais</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <Link href="/projetos" className="group animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                  <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 rounded-xl p-4 sm:p-6 transition-all duration-300 border border-emerald-500/30 hover:border-emerald-400/50 relative z-50 hover:shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-white font-semibold text-sm sm:text-base">Expedição</h3>
                      <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center transition-transform duration-300">
                        <span className="text-white text-xs">📦</span>
                      </div>
                    </div>
                    <p className="text-emerald-100 text-xs sm:text-sm opacity-90">Gestão de expedições</p>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </Link>

                <Link href="/entradas_embalagem" className="group animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                  <div className="bg-slate-800 hover:bg-slate-700 rounded-xl p-4 sm:p-6 transition-all duration-300 border border-slate-700/50 hover:border-blue-500/50 relative z-50 hover:shadow-[0_0_30px_rgba(59,130,246,0.2)]">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-white font-semibold text-sm sm:text-base">Embalagem</h3>
                      <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center transition-transform duration-300">
                        <span className="text-blue-400 text-xs">📋</span>
                      </div>
                    </div>
                    <p className="text-slate-300 text-xs sm:text-sm">Controle de estoque</p>
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </Link>

                <Link href="/graf" className="group animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                  <div className="bg-slate-800 hover:bg-slate-700 rounded-xl p-4 sm:p-6 transition-all duration-300 border border-slate-700/50 hover:border-purple-500/50 relative z-50 hover:shadow-[0_0_30px_rgba(168,85,247,0.2)]">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-white font-semibold text-sm sm:text-base">Gráficos</h3>
                      <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center transition-transform duration-300">
                        <span className="text-purple-400 text-xs">📊</span>
                      </div>
                    </div>
                    <p className="text-slate-300 text-xs sm:text-sm">Análises e métricas</p>
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </Link>

                <Link href="/estoques" className="group animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                  <div className="bg-slate-800 hover:bg-slate-700 rounded-xl p-4 sm:p-6 transition-all duration-300 border border-slate-700/50 hover:border-orange-500/50 relative z-50 hover:shadow-[0_0_30px_rgba(249,115,22,0.2)]">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-white font-semibold text-sm sm:text-base">Movimentações</h3>
                      <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center transition-transform duration-300">
                        <span className="text-orange-400 text-xs">📈</span>
                      </div>
                    </div>
                    <p className="text-slate-300 text-xs sm:text-sm">Análise de estoque</p>
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Secondary Actions */}
            <div className="mb-8">
              <h2 className="text-slate-300 text-sm font-medium mb-4 px-4">Relatórios e Análises</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <Link href="/rankingusers" className="group animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                  <div className="bg-slate-800 hover:bg-slate-700 rounded-xl p-4 transition-all duration-300 border border-slate-700/40 hover:border-slate-500/60 relative z-50 hover:shadow-[0_0_20px_rgba(148,163,184,0.15)]">
                    <h3 className="text-white font-medium text-sm mb-1">Ranking</h3>
                    <p className="text-slate-300 text-xs">Performance dos usuários</p>
                  </div>
                </Link>

                <Link href="/resume2" className="group animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                  <div className="bg-slate-800 hover:bg-slate-700 rounded-xl p-4 transition-all duration-300 border border-slate-700/40 hover:border-slate-500/60 relative z-50 hover:shadow-[0_0_20px_rgba(148,163,184,0.15)]">
                    <h3 className="text-white font-medium text-sm mb-1">Relatórios PK</h3>
                    <p className="text-slate-300 text-xs">Relatórios por Kits ou peças avulsas</p>
                  </div>
                </Link>

                <Link href="/resumepp" className="group animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
                  <div className="bg-slate-800 hover:bg-slate-700 rounded-xl p-4 transition-all duration-300 border border-slate-700/40 hover:border-slate-500/60 relative z-50 hover:shadow-[0_0_20px_rgba(148,163,184,0.15)]">
                    <h3 className="text-white font-medium text-sm mb-1">Relatórios PP</h3>
                    <p className="text-slate-300 text-xs">Relatórios somente por peças avulsas</p>
                  </div>
                </Link>

                <Link href="/caixas_por_grade_m" className="group animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
                  <div className="bg-slate-800 hover:bg-slate-700 rounded-xl p-4 transition-all duration-300 border border-slate-700/40 hover:border-slate-500/60 relative z-50 hover:shadow-[0_0_20px_rgba(148,163,184,0.15)]">
                    <h3 className="text-white font-medium text-sm mb-1">Etiquetas/Grade</h3>
                    <p className="text-slate-300 text-xs">Impressão de etiquetas por grade</p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Additional Tools */}
            <div>
              <h2 className="text-slate-300 text-sm font-medium mb-4 px-4">Ferramentas Adicionais</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <Link href="/relatoriosaidapordata" className="group animate-fade-in-up" style={{ animationDelay: '0.9s' }}>
                  <div className="bg-slate-800 hover:bg-slate-700 rounded-xl p-4 transition-all duration-300 border border-slate-700/40 hover:border-slate-500/60 relative z-50 hover:shadow-[0_0_20px_rgba(148,163,184,0.15)]">
                    <h3 className="text-white font-medium text-sm mb-1">Relatório Saída</h3>
                    <p className="text-slate-300 text-xs">Saídas por data</p>
                  </div>
                </Link>

                <Link href="/relatoriosaidapordataescola" className="group animate-fade-in-up" style={{ animationDelay: '1s' }}>
                  <div className="bg-slate-800 hover:bg-slate-700 rounded-xl p-4 transition-all duration-300 border border-slate-700/40 hover:border-slate-500/60 relative z-50 hover:shadow-[0_0_20px_rgba(148,163,184,0.15)]">
                    <h3 className="text-white font-medium text-sm mb-1">Relatório Saída P/ Escola</h3>
                    <p className="text-slate-300 text-xs">Saídas por data e escola</p>
                  </div>
                </Link>

                <Link href="/" className="group hidden">
                  <div className="bg-slate-800 hover:bg-slate-700 rounded-xl p-4 transition-all duration-300 transform hover:scale-105 border border-slate-700">
                    <h3 className="text-white font-medium text-sm mb-1"></h3>
                    <p className="text-slate-400 text-xs"></p>
                  </div>
                </Link>

                <Link href="/" className="group hidden">
                  <div className="bg-slate-800 hover:bg-slate-700 rounded-xl p-4 transition-all duration-300 transform hover:scale-105 border border-slate-700">
                    <h3 className="text-white font-medium text-sm mb-1"></h3>
                    <p className="text-slate-400 text-xs"></p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-20 w-full px-4 py-6 sm:px-6 lg:px-8 border-t border-slate-800 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
        {/* Brushed metal effect - horizontal lines */}
        <div className="absolute inset-0 opacity-70 pointer-events-none brushed-metal"></div>
        {/* Metallic shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-500/30 to-transparent opacity-80 pointer-events-none"></div>
        <div className="relative text-center">
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-4 text-xs sm:text-sm">
            <Link href="/resume" className="text-slate-400 hover:text-white transition-colors">
              Resumos Legacy
            </Link>
            <Link href="/" className="text-slate-400 hover:text-white transition-colors">
              ----
            </Link>
            <span className="text-slate-600">|</span>
            <span className="text-slate-500">Status: Online</span>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm">
            © {new Date().getFullYear()} - SYS EXPED - All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
