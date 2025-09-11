"use client";

export default function RetryButton() {
    return (
        <button
            onClick={() => window.location.reload()}
            className="w-full h-12 bg-red-600 hover:bg-red-500 text-white font-semibold
       rounded-xl transition-all duration-300 transform hover:scale-105"
        >
            Tentar Novamente
        </button>
    );
}
