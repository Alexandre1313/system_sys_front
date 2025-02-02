'use client';

import TitleComponentFixed from "@/components/ComponentesInterface/TitleComponentFixed";
import { useEffect, useState } from "react";
import { useParams } from 'next/navigation';
import useSWR from "swr";
import { ajust, getGradesPorEscolasByItems } from "@/hooks_api/api";
import { EscolaGradesItems } from "../../../../core";
import IsLoading from "@/components/ComponentesInterface/IsLoading";
import { motion } from "framer-motion";
import { AlertTriangle } from "react-feather";

const fetcher = async (id: string) => {
    const escolaComGradesByItems = await getGradesPorEscolasByItems(id);
    return escolaComGradesByItems;
};

const fetcherGradeAjust = async (id: string) => {
    const gradeReplica = await ajust(id);
    return gradeReplica;
};

export default function Expedition() {
    let { id } = useParams();

    if (Array.isArray(id)) {
        id = undefined;
    }

    // states tabela grades
    const [escolaData, setEscolaData] = useState<EscolaGradesItems | null>(null);
    const [isDark, setIsDark] = useState(true);

    // states tela de itens   
    const [mostrarItens, setMostrarItens] = useState(false);

    // states modal confirmar ajuste de grade   
    const [ajustGrade, setAjustGrade] = useState(false);
    const [idGradeSelecionada, setIdGradeSelecionada] = useState<string | null>(null);

    // Usando SWR
    const { data, error, mutate: swrMutate } = useSWR(typeof id === 'string' && id ? ['grades', id] : null, () => fetcher(id!), {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    });

    useEffect(() => {
        if (data) {
            setEscolaData(data);
        }
    }, [data]);

    // estilos
    const toggleTheme = () => setIsDark(!isDark);

    const containerClass = isDark
        ? "bg-[#181818] text-gray-300"
        : "bg-gray-100 text-gray-900";

    const tableHeaderClass = isDark
        ? "bg-gray-700 text-zinc-400 border-b-2 border-gray-600"
        : "bg-gray-200 text-gray-900 border-b-2 border-gray-300";

    const buttonBaseClass =
        "rounded px-4 py-2 cursor-pointer transition-colors duration-300 min-w-[200px]";

    const buttonBaseClassTheme =
        "rounded px-4 py-2 cursor-pointer transition-colors duration-300 fixed bottom-5 left-1/2 transform -translate-x-1/2 min-w-[400px]";

    const buttonBaseClassTheme2 =
        "rounded px-4 py-2 cursor-pointer transition-colors duration-300 fixed bottom-24 left-1/2 transform -translate-x-1/2 min-w-[400px]";

    const buttonClassTheme = isDark
        ? `${buttonBaseClassTheme} bg-gray-700 text-gray-200 hover:bg-gray-600`
        : `${buttonBaseClassTheme} bg-gray-300 text-gray-900 hover:bg-gray-400`;

    const buttonClassTheme2 = isDark
        ? `${buttonBaseClassTheme2} bg-red-500 text-white hover:bg-red-600`
        : `${buttonBaseClassTheme2} bg-red-500 text-white hover:bg-red-600`;

    const buttonClass = isDark
        ? `${buttonBaseClass} bg-gray-700 text-gray-200 hover:bg-gray-500`
        : `${buttonBaseClass} bg-gray-300 text-gray-900 hover:bg-gray-500`;

    const borderClass = isDark
        ? "border border-gray-600"
        : "border border-gray-300";

    // função para determinar a cor da borda com base no status da grade
    const getBorderColor = (status: string) => {
        switch (status) {
            case 'EXPEDIDA':
                return 'border border-green-500';
            case 'DESPACHADA':
                return 'border border-purple-500';
            case 'IMPRESSA':
                return 'border border-blue-200';
            default:
                return borderClass;
        }
    };

    // Função para determinar a cor do gradiente com base na comparação de num1 e num2
    const getBgColor = (num1: number, num2: number) => {
        if (num1 - num2 === 0) {
            return isDark
                ? 'bg-gradient-to-r from-[#0d4127] to-transparent'  // Verde escuro no modo escuro
                : 'bg-gradient-to-r from-[#effff3] to-transparent';  // Verde ainda mais suave no modo claro
        } else if (num1 - num2 === num1) {
            return isDark
                ? 'bg-gradient-to-r from-[#252525] to-transparent'  // Gradiente suave no modo escuro
                : 'bg-gradient-to-r from-[#f0f0f0] to-transparent';  // Gradiente muito suave no modo claro
        } else {
            return isDark
                ? 'bg-gradient-to-r from-[#4b3d0e] to-transparent'  // Amarelo suave no modo escuro
                : 'bg-gradient-to-r from-[#fffee4] to-transparent';  // Amarelo bem clarinho no modo claro
        }
    };

    // Função para determinar a cor do texto
    const getBgColorText = (num1: number, num2: number) => {
        if (num1 - num2 === 0) {
            return 'text-green-500';
        } else if (num1 - num2 === num1) {
            return 'text-green-500';
        } else {
            return 'text-green-500';
        }
    };

    const getBgColorTextRest = (num1: number, num2: number) => {
        if (num1 - num2 === 0) {
            return 'text-blue-500';
        } else if (num1 - num2 === num1) {
            return 'text-blue-500';
        } else {
            return 'text-blue-500';
        }
    };

    // Função para determinar a cor do texto do estoque
    const getBgColorTextEst = (num1: number) => {
        if (num1 < 0) {
            return 'text-red-500';
        } else if (num1 === 0) {
            return 'text-orange-600';
        } else {
            return 'text-zinc-400';
        }
    };

    // funções mostrar/Ocultar itens da grade
    const mostrarOcultarItensDaGrade = () => {
        setMostrarItens(mostrarItens ? false : true)
    }

    // funções utils
    function calcularTotais(grade: any) {
        const totalItens: number = grade.itensGrade.reduce((total: number, item: any) => total + item.quantidade, 0);
        const totalExpedido: number = grade.itensGrade.reduce((total: number, item: any) => total + item.quantidadeExpedida, 0);
        const restanteParaExpedir: number = totalItens - totalExpedido;
        const totalCaixas: number = grade.gradeCaixas.length;
        return {
            totalItens,
            totalExpedido,
            restanteParaExpedir,
            totalCaixas,
        };
    }

    function coletarVariacoesNomesItens(grade: any): string[] {
        const nomesUnicos = Array.from(
            new Set<string>(grade.itensGrade.map((item: any) => item.itemTamanho.itemNome))
        );
        return nomesUnicos;
    }

    // functions ajustar grade 
    const abrirModalAjustGrade = (id: string | null) => {
        setAjustGrade(ajustGrade ? false : true);
        setIdGradeSelecionada(id);
    }

    const isExpedido = (grade: any) => grade.itensGrade?.some((item: any) => item.quantidadeExpedida > 0);

    const handlerAjustaGrade = async (gradeId: string) => {
        await fetcherGradeAjust(gradeId);
        setAjustGrade(ajustGrade ? false : true);
        swrMutate();
    }

    if (!data && !error) {
        return <IsLoading />
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[95vh] w-[100%]">
                <p style={{ color: 'red', fontSize: '25px', fontWeight: '700' }}>
                    Erro: {error.message || 'Erro desconhecido'}
                </p>
            </div>
        );
    }

    return (
        <div className={`${containerClass} flex flex-col w-full min-h-screen items-center justify-start p-3 gap-y-9`}>
            <div className={`flex w-full mb-12`}>
                <TitleComponentFixed stringOne={`GRADES DA ESCOLA: ${escolaData?.nome}`} />
            </div>
            {escolaData?.grades.map((grade) => {
                const totais = calcularTotais(grade);
                const variacoes = coletarVariacoesNomesItens(grade);
                return (
                    <div
                        key={grade.id}
                        className={`gap-y-2 flex flex-col max-w-[95%] items-center justify-center p-2 
                        rounded-md w-full shadow-md`}
                    >
                        <div className={`flex flex-col w-full ${getBorderColor(grade.status)} 
                        ${isDark ? "bg-gray-800" : "bg-white"} rounded-md`}>
                            <table className="w-full border-collapse text-sm">
                                <thead>
                                    <tr className={`${tableHeaderClass} text-left p-3`}>
                                        <th className="p-2 font-semibold w-[20%]"></th>
                                        <th className="p-2 font-semibold w-[10%]">STATUS</th>
                                        <th className="p-2 font-semibold w-[10%]">TOTAL PREVISTO</th>
                                        <th className="p-2 font-semibold w-[10%]">EXPEDIDO</th>
                                        <th className="p-2 font-semibold w-[10%]">À EXPEDIR</th>
                                        <th className="p-2 font-semibold w-[10%]">VOLUMES</th>
                                        <th className="p-2 font-semibold w-[20%]">ITENS</th>
                                        <th className="p-2 font-semibold w-[10%]"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr
                                        className={`text-left ${isDark
                                            ? "border-b border-gray-600"
                                            : "border-b border-gray-300"
                                            }`}                            >

                                        <td className="p-2">
                                            {grade.status === "PRONTA" && isExpedido(grade) &&
                                                <button
                                                    className={buttonClass}
                                                    onClick={() => abrirModalAjustGrade(String(grade.id))}
                                                >
                                                    AJUSTAR
                                                </button>
                                            }
                                        </td>
                                        <td className="p-2 text-[23px]">{grade.status}</td>
                                        <td className="p-2 text-[23px]">{totais.totalItens}</td>
                                        <td className="p-2 text-[23px]">{totais.totalExpedido}</td>
                                        <td className="p-2 text-[23px]">{totais.restanteParaExpedir}</td>
                                        <td className="p-2 text-[23px]">{totais.totalCaixas}</td>
                                        <td className="p-2">
                                            <ul className="text-[17px]">
                                                {variacoes.map((item, idx) => (
                                                    <li key={idx}>{item}</li>
                                                ))}
                                            </ul>
                                        </td>
                                        <td className="p-2">
                                            <button
                                                className={buttonClass}
                                                onClick={() => alert(`Etiquetas da grade ${1}`)}
                                            >
                                                ETIQUETAS
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className={`flex flex-col w-full ${getBorderColor(grade.status)} 
                        ${isDark ? "bg-gray-800" : "bg-white"} rounded-md`}>
                            <table className="w-full border-collapse text-sm">
                                <thead>
                                    <tr className={`${tableHeaderClass} text-left`}>
                                        <th className="p-2 font-semibold w-[20%]">ITEM</th>
                                        <th className="p-2 font-semibold w-[10%]">GÊNERO</th>
                                        <th className="p-2 font-semibold w-[10%]">TAMANHO</th>
                                        <th className="p-2 font-semibold w-[10%]">PREVISTO</th>
                                        <th className="p-2 font-semibold w-[10%]">EXPEDIDO</th>
                                        <th className="p-2 font-semibold w-[10%]">Á EXPEDIR</th>
                                        <th className="p-2 font-semibold w-[10%]">ESTOQUE</th>
                                        <th className="p-2 font-semibold w-[10%]">CÓD. BARRAS</th>
                                        <th className="p-2 font-semibold w-[10%]"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {grade.itensGrade.map((item: any) =>
                                        <tr
                                            key={item.id}
                                            className={`text-left hover:bg-green-600 hover:bg-opacity-10 ${isDark
                                                ? "border-b border-gray-600"
                                                : "border-b border-gray-300"
                                                } ${getBgColor(item.quantidade, item.quantidadeExpedida)}`}                            >

                                            <td className="p-2 text-[20px]">
                                                <span>{``}</span>
                                                <span>{item.itemTamanho.itemNome}</span>
                                            </td>
                                            <td className="p-2 text-[20px]">
                                                <span>{``}</span>
                                                <span>{item.itemTamanho.itemGenero}</span>
                                            </td>
                                            <td className="p-2 text-[20px]">
                                                <span>{``}</span>
                                                <span>{item.itemTamanho.tamanhoNome}</span>
                                            </td>
                                            <td className="p-2 text-[20px]">
                                                <span>{``}</span>
                                                <span className={`text-yellow-500`}>{item.quantidade}</span>
                                            </td>
                                            <td className="p-2 text-[20px]">
                                                <span>{``}</span>
                                                <span className={getBgColorText(item.quantidade, item.quantidadeExpedida)}>{item.quantidadeExpedida}</span>
                                            </td>
                                            <td className="p-2 text-[20px]">
                                                <span>{``}</span>
                                                <span className={getBgColorTextRest(item.quantidade, item.quantidadeExpedida)}>{item.quantidade - item.quantidadeExpedida}</span>
                                            </td>
                                            <td className="p-2 text-[20px]">
                                                <span>{``}</span>
                                                <span className={getBgColorTextEst(item.itemTamanho.estoque)}>{item.itemTamanho.estoque}</span>
                                            </td>
                                            <td className="p-2 text-[20px]">
                                                <span>{``}</span>
                                                <span>{item.itemTamanho.barcode}</span>
                                            </td>
                                            <td className="p-2">
                                                <button
                                                    className={buttonClass}
                                                    onClick={mostrarOcultarItensDaGrade}
                                                >
                                                    EXPEDIR ITEM
                                                </button>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )
            })}

            {mostrarItens && (
                <div className={`fixed inset-0 z-50 bg-[#181818] bg-opacity-80 min-h-[105vh]
                    lg:min-h-[100vh] flex flex-col pt-10
                    justify-start items-center p-4`}>
                    <TitleComponentFixed stringOne={`EXPEDINDO ITEM`} twoPoints={`:`}
                        stringTwo={``} />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.7 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.7 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        className={`${isDark ? "bg-[#181818]" : "bg-white"} shadow-md min-w-[75%] min-h-[85%] mt-5
                            flex flex-col items-center justify-start border border-zinc-600`}
                        >
                        <div>
                            <button
                                onClick={() => ""}
                                className={""}
                            >
                                {isDark ? "ENCERRAR CAIXA" : "ENCERRAR CAIXA"}
                            </button>
                        </div>
                        <div className={`flex flex-col text-black w-full items-center justify-center`}>

                        </div>
                    </motion.div>
                    <button
                        onClick={mostrarOcultarItensDaGrade}
                        className={buttonClassTheme}
                    >
                        {isDark ? "VOLTAR" : "VOLTAR"}
                    </button>
                </div>
            )}

            {ajustGrade && (
                <div className={`fixed inset-0 z-50 bg-[#181818] bg-opacity-80 min-h-[105vh]
                lg:min-h-[100vh] flex flex-col pt-10
                justify-center items-center p-4`}>
                    <TitleComponentFixed stringOne={`EXPEDINDO ITEM`} twoPoints={`:`}
                        stringTwo={``} />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.7 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.7 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        className="bg-white p-8 rounded-md shadow-md min-w-[30%] min-h-[40%]
                        flex flex-col items-center justify-center"
                    >
                        <div>
                            <AlertTriangle size={90} color={`rgba(255, 0, 0, 1)`} />
                        </div>
                        <div className={`flex flex-col text-black w-full items-center justify-center`}>
                            <h2 className={`text-[50px] font-bold`}>{`AJUSTE DE GRADE`}</h2>
                            <h2 className={`text-[30px] font-bold`}>{`GRADE DE ID: ${idGradeSelecionada}`}</h2>
                            <span className={`text-[17px] font-bold`}>DESEJA MESMO AJUSTAR A GRADE?</span>
                            <span className={`text-[17px] font-bold`}>A OPERAÇÃO NÃO PODERÁ SER REVERTIDA</span>
                        </div>
                    </motion.div>
                    <button
                        onClick={() => handlerAjustaGrade(idGradeSelecionada!)}
                        className={buttonClassTheme}
                    >
                        {isDark ? "AJUSTAR" : "AJUSTAR"}
                    </button>
                    <button
                        onClick={() => abrirModalAjustGrade(null)}
                        className={buttonClassTheme2}
                    >
                        {isDark ? "CANCELAR" : "CANCELAR"}
                    </button>
                </div>
            )}

            <div className="flex gap-4 mt-5">
                <button
                    onClick={toggleTheme}
                    className={buttonClassTheme}
                >
                    ALTERNAR PARA {isDark ? "MODO CLARO" : "MODO ESCURO"}
                </button>
            </div>
        </div>
    );
}
