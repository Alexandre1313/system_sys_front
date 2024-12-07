import { useEffect, useState } from "react";
import { ChevronsRight } from "react-feather";
import { Escola, EscolaGrade, Grade, GradeItem } from "../../../core";
import Caixa from "../../../core/interfaces/Caixa";
import { Genero } from "../../../core/interfaces/Genero";
import BotaoArrowLeft from "../ComponentesInterface/BotaoArrowLeft";
import BotaoArrowLeftSmall from "../ComponentesInterface/BotaoArrowLehtSmall";
import BotaoBox from "../ComponentesInterface/BotaoBox";
import TitleComponentFixed from "../ComponentesInterface/TitleComponentFixed";
import ItemGradeInputTextState from "./ItemsGradeImputTextState";
import ItemsGradeInputText from './ItemsGradeInputText';
import ItemsGradeTextArea from "./ItemsGradeTextArea";

export interface GradeComponentProps {
    grade: Grade;
    escola: Escola;
    formData: { [key: string]: any }; // Estado do pai passado como objeto   
    setFormData: (key: string, value: string) => void; // Função que atualiza o estado no pai    
    handleItemSelecionado: (item: GradeItem | null) => void
    handleEscolaGradeSelecionada: (escolaGrade: EscolaGrade | null) => void
    handleNumeroDaCaixa: (numeroDaCaixa: string) => void
    OpenModalGerarCaixa: () => void
    printEti: (etiquetas: Caixa[]) => JSX.Element
}

export default function GradeComponent(props: GradeComponentProps) {
    const [mostrarTela, setMostrarTela] = useState(false);
    const [mostrarTelaExped, setMostrarTelaExped] = useState(false);
    const [itemSelecionado, setItemSelecionado] = useState<GradeItem | null>(null); // Estado para armazenar o item selecionado   
    const [totalGrade, setTotalGrade] = useState<number | undefined>(0);

    useEffect(() => {
        const total = props?.grade?.itensGrade?.reduce((totini, itemGrade) => {
            return totini + itemGrade.quantidade;
        }, 0);
        setTotalGrade(total)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    if (!props.grade || !props.grade.itensGrade) return <div>Nenhuma grade encontrada.</div>;

    const total = props.grade.itensGrade.reduce((totini, itemGrade) => {
        return totini + itemGrade.quantidade;
    }, 0);

    const totalExpedido = props.grade.itensGrade.reduce((totini, itemGrade) => {
        return totini + itemGrade.quantidadeExpedida;
    }, 0);

    const totalAExpedir = total - totalExpedido;

    const uniqueItems = Array.from(
        new Map(
            props.grade.itensGrade.map((itemGrade) => {
                const item = itemGrade.itemTamanho?.item;
                if (item) {
                    return [`${item.nome}-${item.genero}`, { nome: item.nome, genero: item.genero }];
                }
                return null;
            }).filter((entry) => entry !== null) as [string, { nome: string; genero: Genero }][]
        ).values()
    );

    const borderColor = total === totalExpedido ? 'border-green-900' : 'border-gray-700';

    const abrirTela = () => {
        setMostrarTela(true);
    };

    const fecharTela = () => {
        setMostrarTela(false);
    };

    const abrirTelaExped = (item: any, escola: Escola, grade: Grade, totalAExpedir: number, totalExpedido: number) => {
        const escolaGrade: EscolaGrade = {
            nomeEscola: escola.nome,
            projeto: escola.projeto?.nome,
            numeroEscola: escola.numeroEscola,
            idEscola: escola.id,
            gradeId: grade.id,
            totalAExpedir: totalAExpedir,
            totalExpedido: totalExpedido,
            grade: grade
        }
        setItemSelecionado(item);
        props.handleItemSelecionado(item)
        props.handleEscolaGradeSelecionada(escolaGrade)
        props.handleNumeroDaCaixa(String(grade.gradeCaixas?.length + 1))
        setMostrarTelaExped(true);
    };

    const fecharTelaExped = () => {
        setMostrarTelaExped(false);
        props.handleItemSelecionado(null)
        props.handleEscolaGradeSelecionada(null)
        setItemSelecionado(null); // Limpa o item selecionado ao fechar a tela
    };

    const print = () => { return props.printEti(props.grade.gradeCaixas) }

    return (
        <>
            {/* Card com informações */}
            <div className={`flex flex-col m-2 p-3  border rounded-md gap-y-0 ${borderColor}`}>
                <h2 className="text-[13px] font-normal text-gray-400">
                    TOTAL DE ITENS NA GRADE:
                    <strong className="ml-2 font-semi-bold text-[17px] text-orange-600">{totalGrade}</strong>
                </h2>
                <h2 className="text-[13px] font-normal text-gray-400">
                    TOTAL DE ITENS À EXPEDIR:
                    <strong className="ml-2 font-semi-bold text-[17px] text-yellow-400">{total - totalExpedido}</strong>
                </h2>
                <h2 className="text-[13px] font-normal text-gray-400">
                    TOTAL DE ITENS JÁ EXPEDIDO:
                    <strong className="ml-2 font-semi-bold text-[17px] text-green-400">{totalExpedido}</strong>
                </h2>
                <div className={`flex flex-col`}>
                    <h2 className="text-[14px] font-normal text-blue-400 mb-2 mt-2">
                        {uniqueItems.length === 1 ? 'ITEM:' : 'ITENS:'}
                    </h2>
                    {uniqueItems.map((it, index) => {
                        return (
                            <div key={index} className={`flex`}>
                                <strong className="ml-0 font-normal text-[14px] text-slate-500">{it.nome}</strong>
                                <strong className={`ml-2 mr-2 font-normal text-[14px]`}>-</strong>
                                <strong className="ml-0 font-normal text-[14px] text-slate-500">{it.genero}</strong>
                            </div>)
                        })}
                </div>
                {/* Botão que abre o modal */}
                <div className={`flex items-center justify-center gap-x-3 w-full`}>
                    {print()}
                    <button
                        type="button"
                        onClick={abrirTela}
                        className="flex items-center justify-center mt-3 px-3 py-1 bg-blue-500 hover:bg-green-500 hover:bg-opacity-10 
                         bg-opacity-30 text-white font-normal text-[13px] rounded-md min-w-[200px]"
                    >
                        ITENS DA GRADE <ChevronsRight className="pl-2 animate-bounceX" size={25} strokeWidth={2} />
                    </button>
                </div>
            </div>

            {/* Modal - Tela de sobreposição para Itens da Grade */}
            {mostrarTela && (
                <div className="absolute inset-0 z-50 bg-[#181818] bg-opacity-100 flex 
                pt-9 flex-col items-center lg:min-h-[100%] min-h-[190vh]">
                    <TitleComponentFixed stringOne={`ESCOLA ${props.escola?.numeroEscola}`} twoPoints={`:`} stringTwo={props.escola?.nome} />
                    {/* Ajustar o espaçamento abaixo do título */}
                    <div className="flex flex-wrap justify-center w-full max-w-[1200px] p-8 mt-12">
                        {props.grade.itensGrade.map((itemGrade, index) => {
                            const item = itemGrade?.itemTamanho?.item;
                            const genero = item?.genero;
                            const tamanho = itemGrade?.itemTamanho?.tamanho;
                            const quantidade = itemGrade.quantidade;
                            const quantidadeExpedida = itemGrade.quantidadeExpedida;
                            const estoque = itemGrade?.itemTamanho?.estoque?.quantidade;
                            const barcode = itemGrade?.itemTamanho?.barcode?.codigo;
                            const classBorderCard = quantidade === quantidadeExpedida ? 'border-green-500' : quantidadeExpedida === 0 ? 'border-gray-800' : 'border-yellow-600';
                            const colorEstoque = estoque! >= 0 ? 'text-slate-400': 'text-red-500';
                            return (
                                <div
                                    onClick={() => abrirTelaExped(itemGrade, props.escola, props.grade, totalAExpedir, totalExpedido)} // Passa o item ao clicar
                                    key={index}
                                    className={`bg-zinc-950 bg-opacity-15 p-3 m-4 rounded-md gap-y-2 shadow-lg flex-1 
                                      min-w-[300px] flex flex-col items-start justify-center hover:shadow-green transition duration-200 
                                      ease-in-out cursor-pointer min-h-[200px] border ${classBorderCard}`}
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
                                        QUANTIDADE Á EXPEDIR:  <strong className="text-yellow-400 text-[15px] font-semibold"> {quantidade}</strong>
                                    </p>
                                    <p className="text-[12px] font-semibold text-slate-500 tracking-[1px]">
                                        QUANTIDADE EXPEDIDA:  <strong className="text-green-400 text-[15px] font-semibold"> {quantidadeExpedida}</strong>
                                    </p>
                                    <p className="text-[12px] font-semibold text-slate-500 tracking-[1px]">
                                        ESTOQUE:  <strong className={`${colorEstoque} text-[15px] font-semibold`}> {estoque}</strong>
                                    </p>
                                    <p className="text-[12px] font-semibold text-slate-500 tracking-[1px]">
                                        BARCODE:  <strong className="text-slate-400 text-[15px] font-semibold"> {barcode}</strong>
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                    {/* Botão de fechar */}
                    <div className="fixed -top-[0.95rem] left-[7.05rem] flex justify-start w-full mt-2 pt-16">
                        <BotaoArrowLeft onClick={fecharTela} stringButtton={`VOLTAR`} iconSize={20}
                            bgColor={"bg-red-700"} bgHoverColor={"hover:bg-red-600"} strokeWidth={3} />
                    </div>
                </div>
            )}

            {/* Modal de detalhes do item - Comportamento fixo */}
            {mostrarTelaExped && itemSelecionado && (
                <div className="fixed inset-0 z-50 bg-[#181818] bg-opacity-100 min-h-[105vh]
                 lg:min-h-[100vh] flex flex-col pt-10
                justify-center items-center p-4">
                    <TitleComponentFixed stringOne={`EXPEDINDO ITEM`} twoPoints={`:`}
                        stringTwo={itemSelecionado?.itemTamanho?.item?.nome} />
                    {/* Exibe detalhes do item selecionado, com largura fixa e centralização */}
                    <div className="p-24 pt-4 rounded-md flex flex-col justify-start w-full border border-transparent min-h-full">
                        <div className="flex justify-between w-full">
                            <div>
                                <BotaoArrowLeftSmall stringButtton={"VOLTAR"} bgColor={"bg-red-700"}
                                    iconSize={19} onClick={fecharTelaExped} bgHoverColor={"hover:bg-red-600"} />
                            </div>
                            <div className="flex gap-x-9">
                                <BotaoBox stringButtton={"FECHAR CAIXA"} iconSize={19} bgColor={"bg-yellow-500"}
                                    bgHoverColor={"hover:bg-yellow-300"} onClick={props.OpenModalGerarCaixa} />
                            </div>
                        </div>
                        <div className={"flex flex-row justify-center items-stretch"}>
                            <div className={"pt-16 flex flex-col justify-stretch items-start w-1/2 h-full gap-y-5"}>
                                <ItemsGradeTextArea value={itemSelecionado?.itemTamanho?.item?.nome}
                                    labelName={`ITEM`} />
                                <ItemsGradeInputText value={itemSelecionado?.itemTamanho?.item?.genero}
                                    labelName={`GÊNERO`} />
                                <ItemsGradeInputText value={itemSelecionado?.itemTamanho?.tamanho?.nome}
                                    labelName={`TAMANHO`} />
                                <ItemsGradeInputText value={itemSelecionado?.itemTamanho?.barcode?.codigo}
                                    labelName={`CÓD. DE BARRAS`} />
                            </div>
                            <div className={"pt-16 flex flex-col justify-start items-end w-1/2 h-full gap-y-5"}>
                                <div className="flex flex-row justify-start items-center gap-x-5">
                                    <ItemsGradeInputText value={String(itemSelecionado.quantidade)}
                                        labelName={`TOTAL DO ITEM À EXPEDIR`} />
                                    <ItemsGradeInputText value={String(itemSelecionado.quantidadeExpedida)}
                                        labelName={`TOTAL DO ITEM JÁ EXPEDIDO`} />
                                </div>
                                <div className="flex flex-row justify-start items-center gap-x-5">
                                    <ItemGradeInputTextState labelName={'NÚMERO DA CAIXA'}
                                        formData={props.formData} setFormData={props.setFormData}
                                        isReadOnly={true}
                                        valueColor={`text-yellow-500`} labelColor={`text-yellow-500`} />
                                </div>
                                <div className="flex flex-row justify-start items-center gap-x-5">
                                    <ItemGradeInputTextState labelName={'QUANTIDADE LIDA'}
                                        formData={props.formData} setFormData={props.setFormData}
                                        isReadOnly={true} />
                                    <ItemGradeInputTextState labelName={'CÓD DE BARRAS LEITURA'}
                                        formData={props.formData} setFormData={props.setFormData}
                                        txtSize={`text-[23px]`}
                                        placeholder={`Mantenha o cursor aqui...`}
                                        isFocus={`border border-emerald-300 focus:border-emeral-500 focus:outline-none 
                                        focus:ring focus:ring-emerald-500`}
                                        labelColor={`text-emerald-500`} 
                                        positionn={`text-left`}
                                        labelposition={`justify-start`}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
