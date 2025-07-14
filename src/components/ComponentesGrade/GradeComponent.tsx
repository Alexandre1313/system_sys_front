import { useEffect, useState } from "react";
import { ChevronsRight, Search } from "react-feather";
import { Escola, EscolaGrade, Grade, GradeItem } from "../../../core";
import Caixa from "../../../core/interfaces/Caixa";
import { Genero } from "../../../core/interfaces/Genero";
import { convertMilharFormat } from "../../../core/utils/tools";
import BotaoArrowLeft from "../ComponentesInterface/BotaoArrowLeft";
import BotaoArrowLeftSmall from "../ComponentesInterface/BotaoArrowLehtSmall";
import BotaoBox from "../ComponentesInterface/BotaoBox";
import BotaoGradeDesc from "../ComponentesInterface/BotaoGradeDesc";
import BotaoGradeUp from "../ComponentesInterface/BotaoGradeUp";
import ModalAlterGradeItem from "../ComponentesInterface/ModalAlterGradeItem";
import TitleComponentFixed from "../ComponentesInterface/TitleComponentFixed";
import ItemGradeInputTextState from "./ItemsGradeImputTextState";
import ItemGradeInputTextStateBar from "./ItemsGradeImputTextStateBar";
import ItemsGradeInputText from './ItemsGradeInputText';
import ItemsGradeInputTextHor from "./ItemsGradeInputTextHor";
import ItemsGradeLinkTextHor from "./ItemsGradeLinkTextHor";
import ItemsGradeTextArea from "./ItemsGradeTextArea";

export interface GradeComponentProps {
    grade: Grade;
    escola: Escola;
    formData: { [key: string]: any }; // Estado do pai passado como objeto   
    isPend: boolean | null;
    inputRef: React.RefObject<HTMLInputElement>;
    isFocus: () => void;
    handlerOpnEncGradeMoodify: () => void
    setFormData: (key: string, value: string) => void // Função que atualiza o estado no pai    
    handleFormDataChangeDecresc: () => void
    handleItemSelecionado: (item: GradeItem | null) => void
    handleEscolaGradeSelecionada: (escolaGrade: EscolaGrade | null) => void
    handleNumeroDaCaixa: (numeroDaCaixa: string) => void
    OpenModalGerarCaixa: () => void
    OpenModalGerarCaixaError: () => void;
    mutate: () => void;
    printEti: (etiquetas: Caixa[]) => JSX.Element
}

export default function GradeComponent(props: GradeComponentProps) {
    const [modalModifyGradeItemOpen, setMmodalModifyGradeItemOpen] = useState<boolean>(false);
    const [modalModifyGradeItemMessage, setmodalModifyGradeItemMessage] = useState<string>('');
    const [mostrarTela, setMostrarTela] = useState(false);
    const [mostrarTelaExped, setMostrarTelaExped] = useState(false);
    const [itemSelecionado, setItemSelecionado] = useState<GradeItem | null>(null);
    const [totalGrade, setTotalGrade] = useState<number | undefined>(0);
    const [busca, setBusca] = useState<string>('');

    useEffect(() => {
        const total = props?.grade?.itensGrade?.reduce((totini, itemGrade) => {
            return totini + itemGrade.quantidade;
        }, 0);
        setTotalGrade(total)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.grade.itensGrade])

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

    let borderColor = total === totalExpedido ? 'border-emerald-950 bg-emerald-950' : 'border-zinc-800 bg-zinc-800';

    const labelVolum = props.grade?.status === 'EXPEDIDA' || props.grade?.status === 'DESPACHADA';

    if (props.grade.tipo?.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim() === "REPOSICAO" && total > totalExpedido) {
        borderColor = 'border-red-900 bg-red-900';
    }

    const abrirTela = () => {
        setMostrarTela(true);
        if (props.isPend) {
            props.OpenModalGerarCaixaError();
        }
    };

    const oneExpedida = props.grade.status === "EXPEDIDA" || props.grade.status === "DESPACHADA";
    const desativado = oneExpedida;

    const statusClass = desativado ? "pointer-events-none opacity-50 hidden" : "";

    const fecharTela = () => {
        setMostrarTela(false);
    };

    const abrirTelaExped = (item: any, escola: Escola, grade: Grade, totalAExpedir: number, totalExpedido: number) => {
        const escolaGrade: EscolaGrade = {
            nomeEscola: escola.nome,
            projeto: escola.projeto?.nome,
            numeroEscola: escola.numeroEscola,
            numberJoin: escola.numberJoin,
            idEscola: escola.id,
            gradeId: grade.id,
            finalizada: grade.finalizada,
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
        //props.handleItemSelecionado(null)
        //props.handleEscolaGradeSelecionada(null)
        setItemSelecionado(null); // Limpa o item selecionado ao fechar a tela
    };

    const handlerItemGrade = () => {
        if (itemSelecionado) {
            setMmodalModifyGradeItemOpen(true);
            setmodalModifyGradeItemMessage('REALMENTE DESEJA ALTERAR O ITEM DA GRADE ? A OPERAÇÃO NÃO PODE SER REVERTIDA !');
        }
    }

    const closeModalModifyGradeItem = () => {
        setMmodalModifyGradeItemOpen(false);
        setmodalModifyGradeItemMessage('');
        if (props.formData.ESCOLA_GRADE?.totalAExpedir === 0 && !props.formData.ESCOLA_GRADE?.finalizada) {
            props.handlerOpnEncGradeMoodify()
        }
    };

    const print = () => { return props.printEti(props.grade.gradeCaixas) }

    const termos = busca.split(/\s+/);

    let itensFiltrados = props.grade.itensGrade.filter((itemGrade) =>
        itemGrade.itemTamanho?.tamanho?.nome.toLowerCase().includes(busca)
    );

    if (itensFiltrados.length === 0) {
        itensFiltrados = props.grade.itensGrade.filter((itemGrade) =>
            itemGrade.itemTamanho?.item?.genero.toLowerCase().includes(busca)
        );
    }

    if (itensFiltrados.length === 0) {
        itensFiltrados = props.grade.itensGrade.filter((itemGrade) =>
            itemGrade.itemTamanho?.item?.nome.toLowerCase().includes(busca)
        );
    }

    if (itensFiltrados.length === 0 && termos.length === 2) {
        const [termoTamanho, termoGenero] = termos;

        itensFiltrados = props.grade.itensGrade.filter((itemGrade) => {
            const tamanho = itemGrade.itemTamanho?.tamanho?.nome.toLowerCase();
            const genero = itemGrade.itemTamanho?.item?.genero.toLowerCase();
            const nome = itemGrade.itemTamanho?.item?.nome.toLowerCase();

            return tamanho?.includes(termoTamanho) && genero?.includes(termoGenero) || tamanho?.includes(termoTamanho) && nome?.includes(termoGenero);
        });
    }

    if (itensFiltrados.length === 0) {
        itensFiltrados = props.grade.itensGrade.filter((itemGrade) => {
            const campos = [
                itemGrade.itemTamanho?.tamanho?.nome.toLowerCase(),
                itemGrade.itemTamanho?.item?.genero.toLowerCase(),
                itemGrade.itemTamanho?.item?.nome.toLowerCase(),
            ];

            return termos.every((termo) =>
                campos.some((campo) => campo?.includes(termo))
            );
        });
    }

    return (
        <>
            {/* Card com informações */}
            <div className={`flex flex-col m-2 p-2  border-[3px] rounded-md gap-y-0 shadow-lg ${borderColor}`}>
                <div className="overflow-hidden">
                    <table className="w-full table-fixed border-collapse">
                        <thead className="">
                            <tr className="text-zinc-400 font-extralight tracking-[1px]">
                                <th className="w-1/4 px-4 py-2 text-center align-middle border-zinc-700 text-sm">GRADE ID</th>
                                <th className="w-1/4 px-4 py-2 text-center align-middle border-zinc-700 text-sm">PREVISTO</th>
                                <th className="w-1/4 px-4 py-2 text-center align-middle border-zinc-700 text-sm">EXPEDIDO</th>
                                <th className="w-1/4 px-4 py-2 text-center align-middle border-zinc-700 text-sm">À EXPEDIR</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="">
                                <td className="px-4 py-2 text-center align-middle border border-zinc-600 text-xl text-zinc-500 font-extralight tracking-[1px]">{props.grade.id}</td>
                                <td className="px-4 py-2 text-center align-middle border border-zinc-600 text-xl text-yellow-400 font-extralight tracking-[1px]">{convertMilharFormat(totalGrade || 0)}</td>
                                <td className="px-4 py-2 text-center align-middle border border-zinc-600 text-xl text-green-400 font-extralight tracking-[1px]">{convertMilharFormat(totalExpedido)}</td>
                                <td className="px-4 py-2 text-center align-middle border border-zinc-600 text-xl text-blue-400 font-extralight tracking-[1px]">{convertMilharFormat(total - totalExpedido)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className={`flex flex-col`}>
                    <div className={`flex flex-col items-center justify-center gap-y-1`}>
                        {props.grade.tipo && (
                            <h2 className="text-[14px] font-normal text-white mt-2 -mb-2">
                                {props.grade.tipo}
                            </h2>
                        )}
                        <span className={`text-[14px] font-normal text-white mt-2 -mb-2`}>{`${labelVolum ? 'VOL. CONSOLIDADOS': 'VOL. PARCIAIS'}: ${props.grade.gradeCaixas.length}`}</span>
                        <h2 className="text-[14px] font-normal text-blue-400 mt-2 mb-0">
                            {uniqueItems.length === 1 ? 'ITEM:' : 'ITENS:'}
                        </h2>
                    </div>
                    {uniqueItems.map((it, index) => {
                        return (
                            <div key={index} className={`flex w-full gap-x-3`}>
                                <div className={`flex items-center justify-end w-1/2`}>
                                    <strong className="ml-0 font-normal text-[16px] text-slate-400">{it.nome}</strong>
                                </div>
                                <div className={`flex items-center justify-start w-1/2`}>
                                    <strong className="ml-0 font-normal text-[16px] text-slate-600">{it.genero}</strong>
                                </div>
                            </div>)
                    })}
                </div>
                {/* Botão que abre o modal */}
                <div className={`flex items-center justify-center gap-x-3 w-full`}>
                    {print()}
                    <button
                        type="button"
                        onClick={abrirTela}
                        className={`flex items-center justify-center mt-3 px-3 py-1 bg-blue-500
                            ${statusClass} hover:bg-green-500 hover:bg-opacity-10 bg-opacity-30 text-white font-normal text-[13px] rounded-md min-w-[200px]`}
                    >
                        ITENS DA GRADE <ChevronsRight className="pl-2 animate-bounceX" size={25} strokeWidth={2} />
                    </button>
                </div>
            </div>

            {/* Modal - Tela de sobreposição para Itens da Grade */}
            {mostrarTela && (
                <div className="absolute inset-0 z-50 bg-[#181818] bg-opacity-100 flex 
                pt-9 flex-col items-center lg:min-h-[101%] min-h-[290vh]">
                    <TitleComponentFixed stringOne={`ESCOLA ${props.escola?.numeroEscola}`} twoPoints={`:`} stringTwo={props.escola?.nome} />
                    <div className="flex w-full justify-center lg:pt-[2.5rem] fixed">
                        <div className="relative w-full lg:w-1/4">
                            {/* Ícone da lupa dentro do input */}
                            <Search
                                color="#ccc"
                                size={21}
                                className="absolute left-3 top-1/3 transform -translate-y-1/2 pointer-events-none"
                                strokeWidth={1}
                            />
                            <input
                                type="text"
                                placeholder="Buscar => 1º tamanho - 2ª Gênero - 3º Nome"
                                className="w-full mb-6 p-2 pl-12 rounded border bg-[#181818] 
                                                    border-neutral-600 text-white placeholder:text-neutral-400 focus:outline-none"
                                value={busca}
                                onChange={(e) => setBusca(e.target.value.toLowerCase())}
                            />
                        </div>
                    </div>
                    <div className="flex flex-wrap justify-center w-full max-w-[1400px] p-8 mt-16">
                        {itensFiltrados.map((itemGrade, index) => {
                            const item = itemGrade?.itemTamanho?.item;
                            const genero = item?.genero;
                            const tamanho = itemGrade?.itemTamanho?.tamanho;
                            const quantidade = itemGrade.quantidade;
                            const quantidadeExpedida = itemGrade.quantidadeExpedida;
                            const estoque = itemGrade?.itemTamanho?.estoque?.quantidade;
                            const barcode = itemGrade?.itemTamanho?.barcode?.codigo;
                            const classBorderCard = quantidade === quantidadeExpedida ? 'border-green-800' : quantidadeExpedida === 0 ? 'border-gray-800' : 'border-yellow-800';
                            const classBgCard = quantidade === quantidadeExpedida ? 'bg-gradient-to-r from-[#0d4127] to-transparent' :
                                quantidadeExpedida === 0 ? 'bg-gradient-to-r from-[#252525] to-transparent' : 'bg-gradient-to-r from-[#4b3d0e] to-transparent';

                            const colorEstoque = estoque! >= 0 ? 'text-slate-400' : 'text-red-500';
                            return (
                                <div
                                    onClick={() => abrirTelaExped(itemGrade, props.escola, props.grade, totalAExpedir, totalExpedido)} // Passa o item ao clicar
                                    key={index}
                                    className={`bg-zinc-950 bg-opacity-15 p-3 m-4 rounded-md gap-y-2 shadow-lg flex-1 
                                      min-w-[300px] flex flex-col items-start justify-start hover:shadow-green transition duration-200 
                                      ease-in-out cursor-pointer min-h-[200px] border ${classBorderCard}`}
                                >
                                    <div className={`flex flex-col ${classBgCard} gap-y-2`}>
                                        <p className={`text-[13px] px-3 pt-2 font-semibold text-slate-500 tracking-[1px] w-full`}>
                                            <strong className="text-slate-400 text-[19px] font-normal"> {item?.nome}</strong>
                                        </p>
                                        <p className={`text-[13px] px-3 -mt-[7px] font-semibold text-slate-500 tracking-[1px] w-full`}>
                                            <strong className="text-slate-400 text-[19px] font-normal"> {genero}</strong>
                                        </p>
                                        <p className={`text-[13px] px-3 pb-2 -mt-[7px] font-semibold text-slate-500 tracking-[1px] w-full`}>
                                            TAMANHO: <strong className="text-slate-200 text-[20px] font-normal"> {tamanho?.nome}</strong>
                                        </p>
                                    </div>
                                    <p className="text-[13px] px-3 font-semibold text-slate-500 tracking-[1px]">
                                        QUANTIDADE PREVISTA:  <strong className="text-yellow-400 text-[20px] font-normal"> {quantidade}</strong>
                                    </p>
                                    <p className="text-[13px] px-3 font-semibold text-slate-500 tracking-[1px]">
                                        QUANTIDADE EXPEDIDA:  <strong className="text-green-400 text-[20px] font-normal"> {quantidadeExpedida}</strong>
                                    </p>
                                    <p className="text-[13px] px-3 font-semibold text-slate-500 tracking-[1px]">
                                        QUANTIDADE Á EXPEDIR:  <strong className="text-blue-400 text-[20px] font-normal"> {quantidade - quantidadeExpedida}</strong>
                                    </p>
                                    <p className="text-[13px] px-3 font-semibold text-slate-500 tracking-[1px]">
                                        ESTOQUE:  <strong className={`${colorEstoque} text-[20px] font-normal`}> {estoque}</strong>
                                    </p>
                                    <p className="text-[13px] px-3 font-semibold text-slate-500 tracking-[1px]">
                                        BARCODE:  <strong className="text-slate-400 text-[20px] font-normal"> {barcode}</strong>
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                    {/* Botão de fechar */}
                    <div className="fixed top-[0.35rem] left-[8.07rem] w-auto flex justify-start mt-2 pt-16">
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
                    <div className="p-24 pt-5 rounded-md flex flex-col justify-start w-full border border-transparent min-h-full">
                        <div className="flex lg:flex-row flex-col justify-between w-full bg-[#252525] p-4 pb-6 shadow-[0px_0px_30px_5px_rgba(0,0,0,0.25)] rounded-md">
                            <div className="flex gap-x-9">
                                <BotaoArrowLeftSmall stringButtton={""} bgColor={"bg-red-700"}
                                    iconSize={19} onClick={fecharTelaExped} bgHoverColor={"hover:bg-red-600"} width={`min-w-[55px] max-w-[55px]`}
                                    shadow={`shadow-[0px_20px_40px_rgba(0,0,0,0.3)] hover:shadow-[0px_8px_15px_rgba(0,0,0,0.3)] hover:translate-y-1 transition-all duration-300`} />
                                <BotaoGradeUp stringButtton={""} iconSize={19} bgColor={"bg-green-700"}
                                    bgHoverColor={"hover:bg-green-600"} onClick={handlerItemGrade} width={`min-w-[55px] max-w-[55px]`}
                                    shadow={`shadow-[0px_20px_40px_rgba(0,0,0,0.3)] hover:shadow-[0px_8px_15px_rgba(0,0,0,0.3)] hover:translate-y-1 transition-all duration-300`} />
                                <BotaoGradeDesc stringButtton={""} iconSize={19} bgColor={"bg-blue-800"}
                                    bgHoverColor={"hover:bg-blue-700"} onClick={props.handleFormDataChangeDecresc} width={`min-w-[55px] max-w-[55px]`}
                                    shadow={`shadow-[0px_20px_40px_rgba(0,0,0,0.3)] hover:shadow-[0px_8px_15px_rgba(0,0,0,0.3)] hover:translate-y-1 transition-all duration-300`} />
                                <ItemsGradeLinkTextHor labelName={`GRADE ID:`} value={String(props.grade.id)} baseUrl={`/caixas_por_grade/`} />
                                <ItemsGradeInputTextHor value={props.escola?.numeroEscola}
                                    labelName={`ESCOLA Nº :`} />
                                <ItemsGradeInputTextHor value={String(props.grade.gradeCaixas.length)}
                                    labelName={`VOLUMES :`} />
                            </div>
                            <div className="lg:flex lg:gap-x-9">
                                <BotaoBox stringButtton={"FECHAR CAIXA"} iconSize={19} bgColor={"bg-yellow-600"}
                                    bgHoverColor={"hover:bg-yellow-500"} onClick={props.OpenModalGerarCaixa}
                                    shadow={`shadow-[0px_20px_40px_rgba(0,0,0,0.3)] hover:shadow-[0px_8px_15px_rgba(0,0,0,0.3)] hover:translate-y-1 transition-all duration-300`} />
                            </div>
                        </div>
                        <div className={"flex flex-row justify-center items-stretch px-4"}>
                            <div className={"pt-16 flex flex-col justify-stretch items-start w-1/2 h-full gap-y-5"}>
                                <ItemsGradeTextArea value={itemSelecionado?.itemTamanho?.item?.nome}
                                    labelName={`ITEM`} />
                                <ItemsGradeInputText value={itemSelecionado?.itemTamanho?.item?.genero}
                                    labelName={`GÊNERO`} />
                                <ItemsGradeInputText value={itemSelecionado?.itemTamanho?.tamanho?.nome}
                                    labelName={`TAMANHO`} />
                                <ItemsGradeInputText value={itemSelecionado?.itemTamanho?.barcode?.codigo}
                                    labelName={`CÓDIGO DE BARRAS`} />
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
                                        isReadOnly={true} bgBackGround={`bg-black`}
                                        valueColor={`text-yellow-500`} labelColor={`text-yellow-500`}
                                        height={`h-[80px]`} txtSize={`text-[56px]`} maxWhidth={`max-w-[300px]`}
                                        colorBorder={`border-yellow-500`} />
                                </div>
                                <div className="flex flex-row justify-start items-center gap-x-5">
                                    <ItemGradeInputTextState labelName={'QUANTIDADE NA CAIXA ATUAL'}
                                        formData={props.formData} setFormData={props.setFormData}
                                        isReadOnly={true}
                                        valueColor={`text-white`} labelColor={`text-whitw`}
                                        bgBackGround={`bg-black`} txtSize={`text-[56px]`}
                                        maxWhidth={`max-w-[300px]`}
                                        height={`h-[80px]`}
                                        colorBorder={`border-white`} />
                                </div>
                                <div className="flex flex-row justify-start items-center gap-x-5">
                                    <ItemGradeInputTextState labelName={'QUANTIDADE LIDA'}
                                        formData={props.formData} setFormData={props.setFormData}
                                        isReadOnly={true} />
                                    <ItemGradeInputTextStateBar labelName={'CÓD DE BARRAS LEITURA'}
                                        formData={props.formData} setFormData={props.setFormData}
                                        txtSize={`text-[23px]`}
                                        inputRef={props.inputRef}
                                        isFocuss={props.isFocus}
                                        placeholder={`Mantenha o cursor aqui...`}
                                        isFocus={`border border-emerald-300 focus:border-emeral-500 focus:outline-none 
                                        focus:ring focus:ring-emerald-500`}
                                        labelColor={`text-emerald-500`}
                                        positionn={`text-left`}
                                        labelposition={`justify-start`} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Componente ModalGerarCaixa com o mutate passado */}
            <ModalAlterGradeItem
                itemSelecionado={itemSelecionado}
                isOpen={modalModifyGradeItemOpen}
                message={modalModifyGradeItemMessage}
                formData={props.formData}
                fecharTelaExped={fecharTelaExped}
                onClose={closeModalModifyGradeItem}
                mutate={props.mutate}
            />
        </>
    );
}
