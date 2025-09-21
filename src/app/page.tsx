import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 relative">
      {/* Background Pattern */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(120,119,198,0.1),transparent_70%)] pointer-events-none"></div>
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(16,185,129,0.1),transparent_70%)] pointer-events-none"></div>
      {/* Header */}
      <header className="relative z-10 w-full px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm sm:text-base">S</span>
            </div>
            <div className="text-white">
              <h1 className="text-lg sm:text-xl font-semibold">SYS EXPED</h1>
              <p className="text-xs sm:text-sm text-slate-400">Sistema de Expedição</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center space-x-2 text-xs text-slate-400">
            <span>v2.1.1</span>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        {/* Logo Section */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="flex items-center justify-center mb-4">
            <h1 className="text-3xl sm:text-5xl lg:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-600">
              SYS
            </h1>
            <span className="text-2xl sm:text-4xl lg:text-6xl font-bold text-blue-400 ml-2">E</span>
            <span className="text-xl sm:text-3xl lg:text-5xl font-medium text-slate-300 ml-0">XPED</span>          
          </div>
          <p className="text-slate-400 text-sm sm:text-base max-w-md mx-auto">
            Sistema para gestão de expedição e logística
          </p>
        </div>

        {/* Navigation Grid */}
        <div className="w-full max-w-6xl">
          {/* Primary Actions */}
          <div className="mb-8">
            <h2 className="text-slate-300 text-sm font-medium mb-4 px-4">Operações Principais</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <Link href="/projetos" className="group">
                <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 rounded-xl p-4 sm:p-6 transition-all duration-300 transform hover:scale-105 hover:shadow-xl border border-emerald-500/20">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-white font-semibold text-sm sm:text-base">Expedição</h3>
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                      <span className="text-white text-xs">📦</span>
                    </div>
                  </div>
                  <p className="text-emerald-100 text-xs sm:text-sm opacity-90">Gestão de expedições</p>
                </div>
              </Link>

              <Link href="/entradas_embalagem" className="group">
                <div className="bg-slate-800 hover:bg-slate-700 rounded-xl p-4 sm:p-6 transition-all duration-300 transform hover:scale-105 hover:shadow-xl border border-slate-700">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-white font-semibold text-sm sm:text-base">Embalagem</h3>
                    <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <span className="text-blue-400 text-xs">📋</span>
                    </div>
                  </div>
                  <p className="text-slate-400 text-xs sm:text-sm">Controle de estoque</p>
                </div>
              </Link>

              <Link href="/graf" className="group">
                <div className="bg-slate-800 hover:bg-slate-700 rounded-xl p-4 sm:p-6 transition-all duration-300 transform hover:scale-105 hover:shadow-xl border border-slate-700">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-white font-semibold text-sm sm:text-base">Gráficos</h3>
                    <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                      <span className="text-purple-400 text-xs">📊</span>
                    </div>
                  </div>
                  <p className="text-slate-400 text-xs sm:text-sm">Análises e métricas</p>
                </div>
              </Link>

              <Link href="/estoques" className="group">
                <div className="bg-slate-800 hover:bg-slate-700 rounded-xl p-4 sm:p-6 transition-all duration-300 transform hover:scale-105 hover:shadow-xl border border-slate-700">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-white font-semibold text-sm sm:text-base">Movimentações</h3>
                    <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center">
                      <span className="text-orange-400 text-xs">📈</span>
                    </div>
                  </div>
                  <p className="text-slate-400 text-xs sm:text-sm">Análise de estoque</p>
                </div>
              </Link>
            </div>
          </div>

          {/* Secondary Actions */}
          <div className="mb-8">
            <h2 className="text-slate-300 text-sm font-medium mb-4 px-4">Relatórios e Análises</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <Link href="/rankingusers" className="group">
                <div className="bg-slate-800 hover:bg-slate-700 rounded-xl p-4 transition-all duration-300 transform hover:scale-105 border border-slate-700">
                  <h3 className="text-white font-medium text-sm mb-1">Ranking</h3>
                  <p className="text-slate-400 text-xs">Performance dos usuários</p>
                </div>
              </Link>

              <Link href="/resume2" className="group">
                <div className="bg-slate-800 hover:bg-slate-700 rounded-xl p-4 transition-all duration-300 transform hover:scale-105 border border-slate-700">
                  <h3 className="text-white font-medium text-sm mb-1">Relatórios PK</h3>
                  <p className="text-slate-400 text-xs">Relatórios por Kits ou peças avulsas</p>
                </div>
              </Link>

              <Link href="/resumepp" className="group">
                <div className="bg-slate-800 hover:bg-slate-700 rounded-xl p-4 transition-all duration-300 transform hover:scale-105 border border-slate-700">
                  <h3 className="text-white font-medium text-sm mb-1">Relatórios PP</h3>
                  <p className="text-slate-400 text-xs">Relatórios somente por peças avulsas</p>
                </div>
              </Link>

              <Link href="/caixas_por_grade_m" className="group">
                <div className="bg-slate-800 hover:bg-slate-700 rounded-xl p-4 transition-all duration-300 transform hover:scale-105 border border-slate-700">
                  <h3 className="text-white font-medium text-sm mb-1">Etiquetas/Grade</h3>
                  <p className="text-slate-400 text-xs">Impressão de etiquetas por grade</p>
                </div>
              </Link>
            </div>
          </div>

          {/* Additional Tools */}
          <div>
            <h2 className="text-slate-300 text-sm font-medium mb-4 px-4">Ferramentas Adicionais</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <Link href="/relatoriosaidapordata" className="group">
                <div className="bg-slate-800 hover:bg-slate-700 rounded-xl p-4 transition-all duration-300 transform hover:scale-105 border border-slate-700">
                  <h3 className="text-white font-medium text-sm mb-1">Relatório Saída</h3>
                  <p className="text-slate-400 text-xs">Saídas por data</p>
                </div>
              </Link>              

              <Link href="/relatoriosaidapordataescola" className="group">
                <div className="bg-slate-800 hover:bg-slate-700 rounded-xl p-4 transition-all duration-300 transform hover:scale-105 border border-slate-700">
                  <h3 className="text-white font-medium text-sm mb-1">Relatório Saída P/ Escola</h3>
                  <p className="text-slate-400 text-xs">Saídas por data e escola</p>
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
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full px-4 py-6 sm:px-6 lg:px-8 border-t border-slate-800">
        <div className="text-center">
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
            © {new Date().getFullYear()} SYS EXPED - Sistema de Expedição. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
