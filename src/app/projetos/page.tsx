import PageWithDrawer from '@/components/ComponentesInterface/PageWithDrawer';
import ProjetoComponentNew from '@/components/ComponentesProjeto/ProjetoComponentNew';
import { Projeto } from '../../../core';
import { get } from "../../hooks_api/api";

export const revalidate = 0;

// Componente com data fetching assíncrono
export default async function Projetos() {
    try {
        // Busca de dados diretamente no servidor
        const projetos: Projeto[] = await get();

        return (
            <PageWithDrawer sectionName="Projetos" currentPage="projetos">
                <div className="px-4 lg:pt-20 pt-14 pb-8 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        {/* Page Header */}
                        <div className="lg:fixed lg:top-0 lg:left-0 lg:right-0 lg:z-20
                         lg:bg-slate-900/95 lg:backdrop-blur-sm lg:border-b lg:border-slate-700 flex flex-col
                         justify-center items-center lg:py-7">
                            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r
                            from-emerald-400 via-blue-500 to-purple-600 mb-3">
                                Gestão de Projetos
                            </h1>
                            <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto text-center">
                                Selecione um projeto para acessar suas unidades escolares
                            </p>
                            <div className="flex items-center justify-center mt-4">
                                <div className="w-16 h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
                                <span className="mx-4 text-slate-500 text-xs lg:text-sm">
                                    {projetos.length > 0 ? `${projetos.length} projeto${projetos.length > 1 ? 's' : ''} disponível${projetos.length > 1 ? 'eis' : ''}` : 'Carregando...'}
                                </span>
                                <div className="w-16 h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
                            </div>
                        </div>

                        {/* Projects Grid */}
                        {projetos.length > 0 ? (
                            <div className="pt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:pt-[8rem] sm:gap-6">
                                {projetos.map((projeto, index) => (
                                        <div 
                                            key={projeto.id}
                                            className="animate-fade-in"
                                            style={{
                                                animationDelay: `${index * 50}ms`,
                                                animationFillMode: 'both'
                                            }}
                                        >
                                            <ProjetoComponentNew projeto={projeto} />
                                        </div>
                                    ))
                                }
                            </div>
                        ) : (
                            <div className="text-center py-12 sm:py-20">
                                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <span className="text-slate-500 text-2xl sm:text-3xl">📋</span>
                                </div>
                                <h3 className="text-xl sm:text-2xl font-semibold text-slate-300 mb-4">
                                    Nenhum projeto encontrado
                                </h3>
                                <p className="text-slate-500 text-sm sm:text-base max-w-md mx-auto">
                                    Não foi possível carregar os projetos no momento. Verifique sua conexão ou entre em contato com o suporte.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </PageWithDrawer>
        );
    } catch (error: any) {
        return (
            <PageWithDrawer sectionName="Erro" currentPage="projetos">
                <div className="flex items-center justify-center min-h-[100dvh] px-4">
                    {/* Error Card */}
                    <div className="relative z-10 max-w-md w-full">
                        <div className="bg-red-900/20 border border-red-800 rounded-2xl p-6 sm:p-8 text-center">
                            <div className="w-16 h-16 bg-red-900/50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <span className="text-red-400 text-2xl">⚠️</span>
                            </div>
                            <h2 className="text-xl sm:text-2xl font-bold text-red-400 mb-4">
                                Erro no Sistema
                            </h2>
                            <p className="text-red-300 text-sm sm:text-base mb-6">
                                {error.message || 'Ocorreu um erro inesperado ao carregar os projetos.'}
                            </p>
                            <button 
                                onClick={() => window.location.reload()}
                                className="w-full h-12 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
                            >
                                Tentar Novamente
                            </button>
                        </div>
                    </div>
                </div>
            </PageWithDrawer>
        );
    }
}
