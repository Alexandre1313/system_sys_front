import { Loader } from "react-feather";

export default function IsLoading() {
    return (
        <div className="fixed inset-0 flex items-center justify-center px-4 z-50 bg-slate-800/90 backdrop-blur-sm">
            {/* Loading Card */}
            <div className="relative z-10 text-center">
                <div className="bg-slate-800/90 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 sm:p-12 shadow-2xl">
                    {/* Loading Icon */}
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Loader size={32} className="text-white animate-rotate" strokeWidth={2} />
                    </div>

                    {/* Loading Text */}
                    <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4">
                        Carregando...
                    </h2>
                    <p className="text-slate-400 text-sm sm:text-base">
                        Aguarde enquanto carregamos os dados
                    </p>

                    {/* Progress Bar */}
                    <div className="mt-6 w-full bg-slate-700 rounded-full h-2 overflow-hidden relative">
                        <div className="absolute left-0 top-0 h-full w-1/3 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-full animate-loadingBar"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
