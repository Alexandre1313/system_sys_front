'use client'

import { useState } from "react";

const fetcher = async (id: number) => {

};

const arr = [1, 2, 3]

export default function Expedition() {
    const [isDark, setIsDark] = useState(true); // Alternar entre temas claro e escuro

    const toggleTheme = () => setIsDark(!isDark ? true: false);

    const containerClass = isDark
        ? "bg-gray-900 text-gray-200"
        : "bg-gray-100 text-gray-900";

    const tableHeaderClass = isDark
        ? "bg-gray-700 text-gray-200 border-b-2 border-gray-600"
        : "bg-gray-200 text-gray-900 border-b-2 border-gray-300";

    const buttonBaseClass =
        "rounded px-4 py-2 cursor-pointer transition-colors duration-300";

    const buttonClass = isDark
        ? `${buttonBaseClass} bg-gray-700 text-gray-200 hover:bg-gray-600`
        : `${buttonBaseClass} bg-gray-300 text-gray-900 hover:bg-gray-400`;

    const borderClass = isDark
        ? "border border-gray-600"
        : "border border-gray-300";

    return (
        <div className={`${containerClass} flex flex-col w-full min-h-screen items-center justify-start p-5 gap-y-5`}>
            {arr.map((i) => (
                <div
                    key={i}
                    className={`flex flex-col items-center justify-center p-4 ${borderClass} rounded-md w-full shadow-md ${isDark ? "bg-gray-800" : "bg-white"
                        }`}
                >
                    <table className="w-full border-collapse text-sm">
                        <thead>
                            <tr className={`${tableHeaderClass} text-center`}>
                                <th className="p-2 font-semibold">AJUSTAR GRADE</th>
                                <th className="p-2 font-semibold">STATUS</th>
                                <th className="p-2 font-semibold">TOTAL DA GRADE</th>
                                <th className="p-2 font-semibold">À EXPEDIR</th>
                                <th className="p-2 font-semibold">EXPEDIDO</th>
                                <th className="p-2 font-semibold">ITENS</th>
                                <th className="p-2 font-semibold">ETIQUETAS</th>
                                <th className="p-2 font-semibold">ITENS DA GRADE</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                className={`text-center ${isDark
                                        ? "border-b border-gray-600"
                                        : "border-b border-gray-300"
                                    }`}
                            >
                                <td className="p-2">
                                    <button
                                        className={buttonClass}
                                        onClick={() => alert(`Ajustando grade ${i}`)}
                                    >
                                        AJUSTAR
                                    </button>
                                </td>
                                <td className="p-2">{i}</td>
                                <td className="p-2">{i}</td>
                                <td className="p-2">{i}</td>
                                <td className="p-2">{i}</td>
                                <td className="p-2">
                                    <ul className="list-disc pl-5">
                                        {arr.map((item, idx) => (
                                            <li key={idx}>{item}</li>
                                        ))}
                                    </ul>
                                </td>
                                <td className="p-2">
                                    <button
                                        className={buttonClass}
                                        onClick={() => alert(`Etiquetas da grade ${i}`)}
                                    >
                                        ETIQUETAS
                                    </button>
                                </td>
                                <td className="p-2">
                                    <button
                                        className={buttonClass}
                                        onClick={() => alert(`Itens da grade ${i}`)}
                                    >
                                        ITENS DA GRADE
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            ))}
            {/* Botão para alternar tema */}
            <button
                onClick={toggleTheme}
                className={`mb-5 ${buttonClass}`}
            >
                Alternar para {isDark ? "Modo Claro" : "Modo Escuro"}
            </button>
        </div>
    );
}
