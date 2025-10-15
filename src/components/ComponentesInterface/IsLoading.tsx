export default function IsLoading() {
    return (
        <div className="flex items-center justify-center w-full min-h-[60vh] px-4">
            {/* Loading Card */}
            <div className="text-center">
                {/* Loading Icon */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 border-4 border-white border-t-transparent rounded-full animate-rotate"></div>
                </div>

                {/* Loading Text */}
                <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4">
                    Carregando...
                </h2>
                <p className="text-slate-400 text-sm sm:text-base">
                    Aguarde enquanto carregamos os dados
                </p>

                {/* Progress Bar */}
                <div className="mt-6 w-64 mx-auto bg-slate-800 rounded-full h-2 overflow-hidden relative">
                    <div className="absolute top-0 h-full w-1/3 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-full animate-loadingBar"></div>
                </div>
            </div>
        </div>
    );
}
