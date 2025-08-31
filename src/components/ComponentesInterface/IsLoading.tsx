import { Loader } from "react-feather";



export default function IsLoading(){
    return (
        <div className="min-h-[100dvh] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 relative flex items-center justify-center px-4">
            {/* Background Pattern */}
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(120,119,198,0.1),transparent_70%)] pointer-events-none"></div>
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(16,185,129,0.1),transparent_70%)] pointer-events-none"></div>
            
            {/* Loading Card */}
            <div className="relative z-10 text-center">
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 sm:p-12">
                    {/* Loading Icon */}
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Loader size={32} className="text-white animate-spin" strokeWidth={2} />
                    </div>
                    
                    {/* Loading Text */}
                    <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4">
                        Carregando...
                    </h2>
                    <p className="text-slate-400 text-sm sm:text-base">
                        Aguarde enquanto carregamos os dados
                    </p>
                    
                    {/* Progress Bar */}
                    <div className="mt-6 w-full bg-slate-700 rounded-full h-2">
                        <div className="bg-gradient-to-r from-emerald-500 to-blue-600 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
