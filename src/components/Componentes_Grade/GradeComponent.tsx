import { useState } from "react";
import Link from "next/link";
import { Escola, Grade } from "../../../core";
import TitleComponentFixed from "../Componentes_Interface/TitleComponentFixed";

export interface GradeComponentProps {
    grade: Grade;
    escola: Escola | null;
}

export default function GradeComponent(props: GradeComponentProps) {
     // Estado para controlar a visibilidade da tela de sobreposição
     const [mostrarTela, setMostrarTela] = useState(false);
     
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
    const nomeItem = props.grade.itensGrade[0]?.itemTamanho?.item?.nome || 'Item não encontrado';

    // Definir a cor da borda com base na condição
    const borderColor = total === totalExpedido ? 'border-green-900' : 'border-gray-700';   

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
                <h2 className="text-[17px] font-normal text-gray-400">
                    Item:
                    <strong className="ml-2 font-semi-bold text-[19px] text-yelow-700">{nomeItem}</strong>
                </h2>

                {/* Botão para abrir a tela de sobreposição */}
                <button
                    type="button"
                    onClick={abrirTela}
                    className="flex items-center justify-center mt-3 px-4 py-2 bg-blue-500 hover:bg-green-500 hover:bg-opacity-10 
                    bg-opacity-30 text-white font-normal rounded-md min-w-[200px] self-center"
                >
                    Exibir Detalhes
                </button>
            </div>

            {/* Tela de sobreposição que ocupa toda a tela */}
            {mostrarTela && (
                <div className="fixed inset-0 z-50 bg-zinc-950 flex flex-col items-center justify-center pb-9 pt-9"
                style={{ backgroundImage: 'url(/background.png)' }}>
                    <TitleComponentFixed stringOne={`ESCOLA`} twoPoints={`:`} stringTwo={props.escola?.nome} />

                    {/* Container dos cards */}
                    <div className="flex flex-wrap justify-center w-full max-w-[1200px] p-6
                    lg:overflow-hidden  lg:h-auto overflow-y-auto h-screen pb-3 overflow-x-hidden">
                        {props.grade.itensGrade.map((itemGrade, index) => {
                            const item = itemGrade?.itemTamanho?.item;
                            const genero = item?.genero;
                            const tamanho = itemGrade?.itemTamanho?.tamanho;
                            const quantidade = itemGrade.quantidade;
                            const estoque = itemGrade?.itemTamanho?.estoque?.quantidade;

                            return (
                                <Link href={`/item/${item?.id}`} key={index}>
                                    <div className="bg-zinc-950 bg-opacity-15 p-6 m-4 rounded-md gap-y-4 shadow-lg 
                                      m-w-[350px] flex flex-col items-start justify-center
                                     hover:shadow-green transition duration-200 hover:border-green-700 hover:bghover 
                                      ease-in-out cursor-pointer min-h-[200px] max-w-[380px] min-w-[280px] border border-gray-800">
                                        {/* Título do Item */}
                                        <p className="text-[14px] font-semibold text-slate-400 tracking-[1px]">
                                            ITEM: {item?.nome}
                                        </p>
                                        {/* Gênero */}
                                        <p className="text-blue-500 font-semibold text-[14px] tracking-[1px]">
                                            GÊNERO: {genero}
                                        </p>
                                        {/* Tamanho */}
                                        <p className="text-orange-500 font-semibold text-[14px] tracking-[1px]">
                                            TAMANHO: {tamanho?.nome}
                                        </p>
                                        {/* Quantidade */}
                                        <p className="text-green-500 font-semibold text-[14px] tracking-[1px]">
                                            QUANTIDADE: {quantidade}
                                        </p>
                                        {/* Estoque */}
                                        <p className="text-red-500 font-semibold text-[14px] tracking-[1px]">
                                            ESTOQUE: {estoque}
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
                            className="mt-5 px-24 py-3 bg-red-600 text-white font-semibold rounded-md
                             hover:bg-red-500 transition duration-500"
                        >
                            Fechar
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
