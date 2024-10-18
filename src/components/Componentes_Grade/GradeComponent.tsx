import { useState } from "react";
import Link from "next/link";
import { Escola, Grade } from "../../../core";
import TitleComponentFixed from "../Componentes_Interface/TitleComponentFixed";

export interface GradeComponentProps {
    grade: Grade;
    escola: Escola | null;
}

export default function GradeComponent(props: GradeComponentProps) {
    // Verifica se `grade` e `itensGrade` existem
    if (!props.grade || !props.grade.itensGrade) return <div>Nenhuma grade encontrada.</div>;

    // Calcula o total de quantidades somando os itensGrade
    const total = props.grade.itensGrade.reduce((totini, itemGrade) => {
        return totini + itemGrade.quantidade;
    }, 0);

    // Calcula o total de itens expedidos
    const totalExpedido = props.grade.itensGrade.reduce((totini, itemGrade) => {
        return totini + itemGrade.quantidadeExpedida;
    }, 0);

    // Definir a cor da borda com base na condição
    const borderColor = total === totalExpedido ? 'border-green-900' : 'border-gray-700';

    // Estado para controlar a visibilidade da tela de sobreposição
    const [mostrarTela, setMostrarTela] = useState(false);

    // Função para abrir a tela
    const abrirTela = () => {
        setMostrarTela(true);
    };

    // Função para fechar a tela
    const fecharTela = () => {
        setMostrarTela(false);
    };

    return (
        <>
            <div className={`flex flex-col m-2 p-3 border rounded-md gap-y-2 ${borderColor}`}>
                <h2 className="text-[17px] font-normal text-gray-400">
                    Total de Itens na Grade:
                    <strong className="ml-2 font-semi-bold text-[19px] text-orange-600">{total}</strong>
                </h2>
                <h2 className="text-[17px] font-normal text-gray-400">
                    Total de Itens expedido:
                    <strong className="ml-2 font-semi-bold text-[19px] text-green-700">{totalExpedido}</strong>
                </h2>

                {/* Botão para abrir a tela de sobreposição */}
                <button
                    type="button"
                    onClick={abrirTela}
                    className="flex items-center justify-center mt-3 px-4 py-2 bg-blue-500 hover:bg-green-500 hover:bg-opacity-10 
                    bg-opacity-30 text-white font-normal rounded-md w-[200px] self-center"
                >
                    Exibir Detalhes
                </button>
            </div>

            {/* Tela de sobreposição que ocupa toda a tela */}
            {mostrarTela && (
                <div className="fixed inset-0 z-50 bg-zinc-950 flex flex-col items-center justify-center pb-9 pt-9">
                    <TitleComponentFixed stringOne={`ESCOLA`} twoPoints={`:`} stringTwo={props.escola?.nome} />

                    {/* Container dos cards */}
                    <div className="flex flex-wrap justify-center w-full max-w-[1200px] p-6
                    lg:overflow-hidden  lg:h-auto overflow-y-auto h-screen pb-3 overflow-x-hidden">
                        {props.grade.itensGrade.map((itemGrade, index) => {
                            let item = itemGrade?.itemTamanho?.item;
                            let genero = item?.genero;
                            let tamanho = itemGrade?.itemTamanho?.tamanho;
                            let quantidade = itemGrade.quantidade;
                            let estoque = itemGrade?.itemTamanho?.estoque?.quantidade;

                            return (
                                <Link href={`/item/${item?.id}`} key={index}>
                                    <div className="bg-zinc-950 p-6 m-4 rounded-md gap-y-4 shadow-lg 
                                      m-w-[350px] flex flex-col items-start justify-center
                                     hover:shadow-green-900 hover:shadow-opacity-5 transition duration-200 
                                      ease-in-out cursor-pointer min-h-[200px] max-w-[380px] border border-gray-800">
                                        {/* Título do Item */}
                                        <p className="text-lg font-normal text-white">
                                            Item: <span className="text-emerald-400">{item?.nome}</span>
                                        </p>
                                        {/* Gênero */}
                                        <p className="text-white">
                                            Gênero: <span className="text-blue-400">{genero}</span>
                                        </p>
                                        {/* Tamanho */}
                                        <p className="text-white">
                                            Tamanho: <span className="text-purple-400">{tamanho?.nome}</span>
                                        </p>
                                        {/* Quantidade */}
                                        <p className="text-white">
                                            Quantidade: <span className="text-green-400">{quantidade}</span>
                                        </p>
                                        {/* Estoque */}
                                        <p className="text-white">
                                            Em Estoque: <span className="text-red-400">{estoque}</span>
                                        </p>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Botão "Fechar" centralizado */}
                    <div className="flex justify-center w-full">
                        <button
                            type="button"
                            onClick={fecharTela}
                            className="mt-5 px-24 py-3 bg-red-600 text-white font-semibold rounded-md"
                        >
                            Fechar
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
