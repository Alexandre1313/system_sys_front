import { useState } from "react";
import { Escola, Grade } from "../../../core";
import TitleComponentFixed from "../Componentes_Interface/TitleComponentFixed";
import BotaoArrowLeft from "../Componentes_Interface/BotaoArrowLeft";
import { ArrowRight } from "react-feather";
import BotaoArrowLeftSmall from "../Componentes_Interface/BotaoArrowLehtSmall";
import BotaoRefreshCcw from "../Componentes_Interface/BotaoRefreshCcw";
import BotaoPrinter from "../Componentes_Interface/BotaoPrinter";
import BotaoBox from "../Componentes_Interface/BotaoBox";

export interface GradeComponentProps {
    grade: Grade;
    escola: Escola | null;
    mutate: (e: string) => void;
}

export default function GradeComponent(props: GradeComponentProps) {
    const [mostrarTela, setMostrarTela] = useState(false);
    const [mostrarTelaExped, setMostrarTelaExped] = useState(false);
    const [itemSelecionado, setItemSelecionado] = useState<any>(null); // Estado para armazenar o item selecionado

    if (!props.grade || !props.grade.itensGrade) return <div>Nenhuma grade encontrada.</div>;

    const total = props.grade.itensGrade.reduce((totini, itemGrade) => {
        return totini + itemGrade.quantidade;
    }, 0);

    const totalExpedido = props.grade.itensGrade.reduce((totini, itemGrade) => {
        return totini + itemGrade.quantidadeExpedida;
    }, 0);
    const nomeItem = props.grade.itensGrade[0]?.itemTamanho?.item?.nome || 'Item não encontrado';
    const nomeGenero = props.grade.itensGrade[0]?.itemTamanho?.item?.genero || 'Item não encontrado';

    const borderColor = total === totalExpedido ? 'border-green-900' : 'border-gray-700';

    const abrirTela = () => {
        setMostrarTela(true);
    };

    const fecharTela = () => {
        setMostrarTela(false);
    };

    const abrirTelaExped = (item: any) => {
        setItemSelecionado(item); // Armazena o item selecionado no estado
        setMostrarTelaExped(true);
    };

    const fecharTelaExped = () => {
        setMostrarTelaExped(false);
        setItemSelecionado(null); // Limpa o item selecionado ao fechar a tela
    };

    return (
        <>
            {/* Card com informações */}
            <div className={`flex flex-col m-2 p-3  border rounded-md gap-y-2 ${borderColor}`}>
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
                    <strong className="ml-2 font-semi-bold text-[19px] text-yellow-700">{nomeItem}</strong>
                </h2>
                <h2 className="text-[17px] font-normal text-gray-400">
                    Gênero:
                    <strong className="ml-2 font-semi-bold text-[19px] text-yellow-700">{nomeGenero}</strong>
                </h2>

                {/* Botão que abre o modal */}
                <button
                    type="button"
                    onClick={abrirTela}
                    className="flex items-center justify-center mt-3 px-4 py-2 bg-blue-500 hover:bg-green-500 hover:bg-opacity-10 
                    bg-opacity-30 text-white font-normal text-[14px] rounded-md min-w-[200px] self-center"
                >
                    ITENS DA GRADE <ArrowRight className="pl-2 animate-bounceX" size={25} strokeWidth={2} />
                </button>
            </div>

            {/* Modal - Tela de sobreposição para Itens da Grade */}
            {mostrarTela && (
                <div className="absolute inset-0 z-50 bg-zinc-950 bg-opacity-100 flex 
                pt-9 flex-col items-center lg:min-h-[100%] min-h-[190vh]">
                    <TitleComponentFixed stringOne={`ESCOLA`} twoPoints={`:`} stringTwo={props.escola?.nome} />

                    {/* Ajustar o espaçamento abaixo do título */}
                    <div className="flex flex-wrap justify-center w-full max-w-[1200px] p-6">
                        {props.grade.itensGrade.map((itemGrade, index) => {
                            const item = itemGrade?.itemTamanho?.item;
                            const genero = item?.genero;
                            const tamanho = itemGrade?.itemTamanho?.tamanho;
                            const quantidade = itemGrade.quantidade;
                            const estoque = itemGrade?.itemTamanho?.estoque?.quantidade;
                            const barcode = itemGrade?.itemTamanho?.barcode?.codigo;
                            return (
                                <div
                                    onClick={() => abrirTelaExped(itemGrade)} // Passa o item ao clicar
                                    key={index}
                                    className="bg-zinc-950 bg-opacity-15 p-6 m-4 rounded-md gap-y-4 shadow-lg flex-1 
                                      min-w-[300px] flex flex-col items-start justify-center hover:shadow-green transition duration-200 
                                      hover:border-green-700 ease-in-out cursor-pointer min-h-[200px] border border-gray-800"
                                >
                                    <p className="text-[12px] font-semibold text-slate-500 tracking-[1px]">
                                        ITEM: <strong className="text-slate-400 text-[15px] font-semibold"> {item?.nome}</strong>
                                    </p>
                                    <p className="text-[12px] font-semibold text-slate-500 tracking-[1px]">
                                        GÊNERO:  <strong className="text-slate-400 text-[15px] font-semibold"> {genero}</strong>
                                    </p>
                                    <p className="text-[12px] font-semibold text-slate-500 tracking-[1px]">
                                        TAMANHO: <strong className="text-slate-200 text-[15px] font-semibold"> {tamanho?.nome}</strong>
                                    </p>
                                    <p className="text-[12px] font-semibold text-slate-500 tracking-[1px]">
                                        QUANTIDADE:  <strong className="text-slate-200 text-[15px] font-semibold"> {quantidade}</strong>
                                    </p>
                                    <p className="text-[12px] font-semibold text-slate-500 tracking-[1px]">
                                        ESTOQUE:  <strong className="text-slate-400 text-[15px] font-semibold"> {estoque}</strong>
                                    </p>
                                    <p className="text-[12px] font-semibold text-slate-500 tracking-[1px]">
                                        BARCODE:  <strong className="text-slate-400 text-[15px] font-semibold"> {barcode}</strong>
                                    </p>
                                </div>
                            );
                        })}
                    </div>

                    {/* Botão de fechar */}
                    <div className="fixed bottom-0 left-4 flex justify-start w-full mt-2 pb-10">
                        <BotaoArrowLeft onClick={fecharTela} stringButtton={`VOLTAR`} iconSize={20} strokeWidth={3} />
                    </div>
                </div>
            )}

            {/* Modal de detalhes do item - Comportamento fixo */}
            {mostrarTelaExped && itemSelecionado && (
                <div className="fixed inset-0 z-50 bg-zinc-900 bg-opacity-100 min-h-[105vh]
                 lg:min-h-[100vh] flex flex-col pt-10
                justify-center items-center p-4">
                    <TitleComponentFixed stringOne={`EXPEDINDO ITEM`} twoPoints={`:`}
                        stringTwo={itemSelecionado?.itemTamanho?.item?.nome} />
                    {/* Exibe detalhes do item selecionado, com largura fixa e centralização */}
                    <div className="p-6 rounded-md flex flex-col justify-between w-full border border-gray-500 min-h-full">                     
                        <div className="flex justify-between w-full">
                            <div>
                                <BotaoArrowLeftSmall stringButtton={"VOLTAR"} bgColor={"bg-red-700"} 
                                iconSize={19} onClick={fecharTelaExped} bgHoverColor={"hover:bg-red-600"}/>
                            </div>    
                            <div className="flex gap-x-9">
                                <BotaoRefreshCcw stringButtton={"EXPEDIR ITEM"} iconSize={19} />
                                <BotaoBox stringButtton={"FECHAR CAIXA"} iconSize={19} bgColor={"bg-yellow-500"}
                                bgHoverColor={"hover:bg-yellow-300"}/>
                                <BotaoPrinter stringButtton={"IMPRIMIR ETIQUETA"} bgColor={"bg-blue-700"} 
                                 iconSize={19} bgHoverColor={"hover:bg-blue-500"} />
                            </div>                                               
                        </div>
                        <div>
                            <h2 className="text-lg font-bold">Detalhes do Item Selecionado</h2>
                            <p><strong>Item:</strong> {itemSelecionado?.itemTamanho?.item?.nome}</p>
                            <p><strong>Gênero:</strong> {itemSelecionado?.itemTamanho?.item?.genero}</p>
                            <p><strong>Tamanho:</strong> {itemSelecionado?.itemTamanho?.tamanho?.nome}</p>
                            <p><strong>Quantidade:</strong> {itemSelecionado?.quantidade}</p>
                            <p><strong>Quantidade Expedida:</strong> {itemSelecionado?.quantidadeExpedida}</p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
