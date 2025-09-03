import { useEffect, useState } from "react";
import { Search, ArrowLeft, Plus, Minus, Box, Eye, ExternalLink } from "react-feather";
import { Escola, EscolaGrade, Grade, GradeItem } from "../../../core";
import Caixa from "../../../core/interfaces/Caixa";
import { Genero } from "../../../core/interfaces/Genero";
import { convertMilharFormat } from "../../../core/utils/tools";
import ModalAlterGradeItem from "../ComponentesInterface/ModalAlterGradeItem";
import ItemGradeInputTextState from "./ItemsGradeImputTextState";
import ItemGradeInputTextStateBar from "./ItemsGradeImputTextStateBar";
import ItemsGradeInputText from './ItemsGradeInputText';
import ItemsGradeInputTextHor from "./ItemsGradeInputTextHor";
import ItemsGradeLinkTextHor from "./ItemsGradeLinkTextHor";
import ItemsGradeTextArea from "./ItemsGradeTextArea";
import Link from "next/link";
import ItemGradeInputTextStateBarMobil from "./ItemsGradeImputTextStateBarMobil";
import ItemGradeInputTextStateMobil from "./ItemsGradeImputTextStateMobil";
import ItemsGradeInputTextMobil from "./ItemsGradeInputTextMobil";


export interface GradeComponentProps {
    grade: Grade;
    escola: Escola;
    formData: { [key: string]: any };
    isPend: boolean | null;
    inputRef: React.RefObject<HTMLInputElement>;
    isFocus: () => void;
    handlerOpnEncGradeMoodify: () => void
    setFormData: (key: string, value: string) => void
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

    const labelVolum = props.grade?.status === 'EXPEDIDA' || props.grade?.status === 'DESPACHADA';

    const abrirTela = () => {
        setMostrarTela(true);
        if (props.isPend) {
            props.OpenModalGerarCaixaError();
        }
    };

    const oneExpedida = props.grade.status === "EXPEDIDA" || props.grade.status === "DESPACHADA";
    const desativado = oneExpedida;

    const statusClass = desativado ? "pointer-events-none opacity-50" : "";

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
        setItemSelecionado(null);
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
            {/* Main Grade Card - Clean Modern Design */}
            <div className={`group lg:max-w-[320px] bg-slate-800/50 backdrop-blur-sm border rounded-2xl p-4 transition-all duration-300 transform hover:scale-105 hover:shadow-xl cursor-pointer ${total === totalExpedido
                ? 'border-emerald-600 hover:border-emerald-500 hover:shadow-emerald-600/20'
                : totalExpedido > 0
                    ? 'border-yellow-600 hover:border-yellow-500 hover:shadow-yellow-500/20'
                    : 'border-slate-700 hover:border-blue-600 hover:shadow-blue-600/20'
                }`}>

                {/* Header with Status and Grade ID */}
                <div className="flex items-center justify-between mb-4">
                    {/* Status Badge */}
                    <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg ${total === totalExpedido
                        ? 'bg-emerald-900/30 border border-emerald-700'
                        : totalExpedido > 0
                            ? 'bg-yellow-900/30 border border-yellow-700'
                            : 'bg-blue-900/30 border border-blue-700'
                        }`}>
                        <div className={`w-2.5 h-2.5 rounded-full ${total === totalExpedido ? 'bg-emerald-400' : totalExpedido > 0 ? 'bg-yellow-400' : 'bg-blue-400'
                            }`}></div>
                        <span className={`text-xs font-semibold ${total === totalExpedido ? 'text-emerald-300' : totalExpedido > 0 ? 'text-yellow-300' : 'text-blue-300'
                            }`}>
                            {total === totalExpedido ? 'Completa' : totalExpedido > 0 ? 'Parcial' : 'Pendente'}
                        </span>
                    </div>

                    {/* Grade ID - Critical Info */}
                    <div className="flex items-center space-x-3">
                        <span className="text-slate-400 text-sm font-medium">Grade ID</span>
                        <span className="text-white font-bold text-2xl">{props.grade.id}</span>
                    </div>
                </div>

                {/* Critical Expedition Information */}
                <div className="grid grid-cols-2 gap-[0.10rem] mb-2">
                    {/* Escola */}
                    <div className="bg-slate-900/50 rounded-xl p-2 text-center border border-slate-700/50">
                        <p className="text-slate-400 text-xs uppercase tracking-wider mb-2 font-medium">Escola</p>
                        <p className="text-blue-400 text-lg font-bold">#{props.escola?.numeroEscola}</p>
                    </div>

                    {/* Volumes */}
                    <div className="bg-slate-900/50 rounded-xl p-2 text-center border border-slate-700/50">
                        <p className="text-slate-400 text-xs uppercase tracking-wider mb-2 font-medium">Volumes</p>
                        <p className="text-purple-400 text-lg font-bold">{props.grade.gradeCaixas.length}</p>
                        <p className="text-xs text-slate-500 mt-1">{labelVolum ? 'Consolidados' : 'Parciais'}</p>
                    </div>
                </div>

                {/* Grade Type Badge */}
                {props.grade.tipo && (
                    <div className="mb-2">
                        <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${props.grade.tipo?.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim() === "REPOSICAO"
                            ? 'bg-red-900/30 text-red-300 border border-red-700'
                            : 'bg-slate-900/50 text-slate-300 border border-slate-600'
                            }`}>
                            {props.grade.tipo}
                        </span>
                    </div>
                )}

                {/* Statistics Grid */}
                <div className="grid grid-cols-2 gap-[0.10rem] mb-6">
                    <div className="bg-slate-900/50 rounded-xl p-2 text-center border border-slate-700/50">
                        <p className="text-slate-400 text-xs uppercase tracking-wider mb-2 font-medium">Previsto</p>
                        <p className="text-yellow-400 text-lg font-bold">{convertMilharFormat(totalGrade || 0)}</p>
                    </div>
                    <div className="bg-slate-900/50 rounded-xl p-2 text-center border border-slate-700/50">
                        <p className="text-slate-400 text-xs uppercase tracking-wider mb-2 font-medium">Expedido</p>
                        <p className={`text-lg font-bold ${total === totalExpedido ? 'text-emerald-400' : 'text-slate-300'}`}>
                            {convertMilharFormat(totalExpedido)}
                        </p>
                    </div>
                    <div className="bg-slate-900/50 rounded-xl p-2 text-center border border-slate-700/50">
                        <p className="text-slate-400 text-xs uppercase tracking-wider mb-2 font-medium">À Expedir</p>
                        <p className={`text-lg font-bold ${totalAExpedir > 0 ? 'text-blue-400' : 'text-slate-400'
                            }`}>
                            {convertMilharFormat(totalAExpedir)}
                        </p>
                    </div>
                    <div className="bg-slate-900/50 rounded-xl p-2 text-center border border-slate-700/50">
                        <p className="text-slate-400 text-xs uppercase tracking-wider mb-2 font-medium">Próxima Caixa</p>
                        <p className="text-orange-400 text-lg font-bold">{props.grade.gradeCaixas.length + 1}</p>
                    </div>
                </div>

                {/* Items Summary */}
                <div className="mb-6">
                    <h3 className="text-slate-400 text-sm font-semibold mb-3 flex items-center">
                        <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                        {uniqueItems.length === 1 ? 'Item:' : `Itens (${uniqueItems.length}):`}
                    </h3>
                    <div className="space-y-2">
                        {uniqueItems.slice(0, 3).map((it, index) => (
                            <div key={index} className="flex items-center justify-between py-1.5 px-2 bg-slate-900/30 rounded-lg">
                                <span className="text-white text-sm font-medium truncate flex-1 mr-2">{it.nome}</span>
                                <span className="text-slate-400 text-sm bg-slate-800/50 px-2 py-1 rounded">{it.genero}</span>
                            </div>
                        ))}
                        {uniqueItems.length > 3 && (
                            <div className="text-slate-500 text-xs text-center py-2 bg-slate-900/30 rounded-lg">
                                +{uniqueItems.length - 3} itens adicionais
                            </div>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                    {print()}
                    <button
                        type="button"
                        onClick={abrirTela}
                        className={`${statusClass} flex-1 bg-slate-700 hover:bg-slate-600 border border-slate-600
                         text-slate-300 font-medium py-3 px-4 rounded-lg transition-all duration-300 flex items-center
                           justify-center space-x-2 hover:scale-105 text-[13px]`}
                    >
                        <Eye size={18} className="mr-2" />
                        VER ITENS
                    </button>
                </div>
            </div>

            {/* Modal 1: Items List View */}
            {mostrarTela && (
                <div className="fixed inset-0 z-50 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex flex-col top-0 left-0 right-0 bottom-0 h-screen" style={{ margin: 0, padding: 0 }}>
                    {/* Background Patterns */}
                    <div className="fixed inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(120,119,198,0.1),transparent_70%)] pointer-events-none"></div>
                    <div className="fixed inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(16,185,129,0.1),transparent_70%)] pointer-events-none"></div>

                    {/* Header */}
                    <div className="fixed z-20 bg-slate-900/80 backdrop-blur-sm border-b border-slate-700 top-0 left-0 right-0 w-full" style={{ margin: 0, padding: 0, position: 'fixed', top: 0 }}>
                        <div className="flex items-center max-w-7xl mx-auto flex-col p-2 lg:p-3 w-full">
                            <div className="flex relative items-center justify-between max-w-7xl mx-auto w-full flex-col">
                                <button
                                    onClick={fecharTela}
                                    className="flex items-center space-x-2 px-2 lg:px-4 py-2 bg-red-600 hover:bg-red-500
                                     text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-105
                                       absolute top-14 lg:top-2 left-[0.6rem]"
                                >
                                    <ArrowLeft size={20} />
                                    <span className="hidden lg:visible">VOLTAR</span>
                                </button>
                                <div className="pl-16 pt-1 lg:pt-0 w-full">
                                    <h1 className="text-xl lg:pl-16 lg:text-2xl font-bold w-full text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">
                                        ESCOLA {props.escola?.numeroEscola}
                                    </h1>
                                    <p className="text-sm lg:pl-16 text-slate-400 truncate w-[90%]">{props.escola?.nome}</p>
                                </div>
                                <div className="text-left w-full pl-16">
                                    <div className="flex items-center space-x-2 mb-1 justify-start w-full">
                                        <span className="text-slate-400 text-sm lg:pl-16">Grade ID:</span>
                                        <span className="text-white font-bold text-lg">{props.grade.id}</span>
                                    </div>
                                    <p className="text-emerald-400 text-sm font-medium lg:pl-16">{itensFiltrados.length} ite{itensFiltrados.length !== 1 ? 'ns' : 'm'} encontrado{itensFiltrados.length !== 1 ? 's' : ''}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="relative z-10 flex-1 overflow-auto flex items-start justify-center" style={{ marginTop: '115px', paddingBottom: '80px' }}>
                        <div className="max-w-7xl mx-auto p-6">
                            {/* Search Bar */}
                            <div className="flex justify-center mb-8 w-full lg:pt-5">
                                <div className="flex-1 relative max-w-[500px]">
                                    <Search
                                        size={18}
                                        className="absolute left-3 lg:left-4 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none"
                                        strokeWidth={1.5}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Buscar escola..."
                                        className="w-full h-12 lg:h-12 pl-10 lg:pl-12 pr-4 bg-slate-700/50 border border-slate-600 rounded-lg lg:rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 text-sm lg:text-base"
                                        value={busca}
                                        onChange={(e) => setBusca(e.target.value.toLowerCase())}
                                    />
                                </div>
                            </div>
                            {/* Items Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {itensFiltrados.map((itemGrade, index) => {
                                    const item = itemGrade?.itemTamanho?.item;
                                    const genero = item?.genero;
                                    const tamanho = itemGrade?.itemTamanho?.tamanho;
                                    const quantidade = itemGrade.quantidade;
                                    const quantidadeExpedida = itemGrade.quantidadeExpedida;
                                    const estoque = itemGrade?.itemTamanho?.estoque?.quantidade;
                                    const barcode = itemGrade?.itemTamanho?.barcode?.codigo;
                                    const isCompleted = quantidade === quantidadeExpedida;
                                    const isPartial = quantidadeExpedida > 0 && quantidadeExpedida < quantidade;
                                    const colorEstoque = estoque! >= 0 ? 'text-slate-400' : 'text-red-500';

                                    return (
                                        <div
                                            onClick={() => abrirTelaExped(itemGrade, props.escola, props.grade, totalAExpedir, totalExpedido)}
                                            key={index}
                                            className={`group bg-slate-800/50 backdrop-blur-sm border rounded-2xl lg:p-6 p-3 transition-all
                                                duration-300 transform hover:scale-105 hover:shadow-xl cursor-pointer ${isCompleted
                                                    ? 'border-emerald-500 hover:border-emerald-400 hover:shadow-emerald-500/20'
                                                    : isPartial
                                                        ? 'border-yellow-500 hover:border-yellow-400 hover:shadow-yellow-500/20'
                                                        : 'border-slate-700 hover:border-blue-500 hover:shadow-blue-500/20'
                                                }`}
                                        >
                                            {/* Status Badge */}
                                            <div className="flex items-center justify-between mb-4">
                                                <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg ${isCompleted
                                                    ? 'bg-emerald-900/30 border border-emerald-700'
                                                    : isPartial
                                                        ? 'bg-yellow-900/30 border border-yellow-700'
                                                        : 'bg-blue-900/30 border border-blue-700'
                                                    }`}>
                                                    <div className={`w-2.5 h-2.5 rounded-full ${isCompleted ? 'bg-emerald-400' : isPartial ? 'bg-yellow-400' : 'bg-blue-400'
                                                        }`}></div>
                                                    <span className={`text-xs font-semibold ${isCompleted ? 'text-emerald-300' : isPartial ? 'text-yellow-300' : 'text-blue-300'
                                                        }`}>
                                                        {isCompleted ? 'Completo' : isPartial ? 'Parcial' : 'Pendente'}
                                                    </span>
                                                </div>
                                                <span className="text-slate-400 text-xs font-medium bg-slate-700/50 px-2 py-1 rounded">#{index + 1}</span>
                                            </div>

                                            {/* Item Info */}
                                            <div className="mb-4">
                                                <h3 className="lg:text-lg text-sm font-semibold text-zinc-400 group-hover:text-emerald-300 transition-colors duration-300 mb-2">
                                                    {item?.nome}
                                                </h3>
                                                <div className="flex items-center justify-between mb-3">
                                                    <span className="text-slate-400 text-sm bg-slate-700/50 px-2 py-1 rounded">{genero}</span>
                                                    <div className="flex items-center space-x-2">
                                                        <span className="text-slate-500 text-sm">Tam:</span>
                                                        <span className="text-white font-medium bg-slate-700/50 px-2 py-1 rounded">{tamanho?.nome}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Stats Grid */}
                                            <div className="grid grid-cols-2 gap-[0.10rem] mb-4">
                                                <div className="bg-slate-900/50 rounded-lg p-3 text-center border border-slate-700/50">
                                                    <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Previsto</p>
                                                    <p className="text-yellow-400 text-base font-semibold">{convertMilharFormat(quantidade)}</p>
                                                </div>
                                                <div className="bg-slate-900/50 rounded-lg p-2 text-center border border-slate-700/50">
                                                    <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Expedido</p>
                                                    <p className={`text-base font-semibold ${isCompleted ? 'text-emerald-400' : 'text-slate-300'}`}>
                                                        {convertMilharFormat(quantidadeExpedida)}
                                                    </p>
                                                </div>
                                                <div className="bg-slate-900/50 rounded-lg p-2 text-center border border-slate-700/50">
                                                    <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Estoque</p>
                                                    <p className={`text-base font-semibold ${colorEstoque}`}>
                                                        {convertMilharFormat(estoque!)}
                                                    </p>
                                                </div>
                                                <div className="bg-slate-900/50 rounded-lg p-2 text-center border border-slate-700/50">
                                                    <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">À Expedir</p>
                                                    <p className={`text-base font-semibold ${quantidade - quantidadeExpedida > 0 ? 'text-blue-400' : 'text-slate-400'
                                                        }`}>
                                                        {convertMilharFormat(quantidade - quantidadeExpedida)}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Barcode */}
                                            <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/50">
                                                <div className="flex items-center space-x-2 mb-2">
                                                    <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                                                    <p className="text-slate-400 text-xs uppercase tracking-wider font-medium">Código de Barras</p>
                                                </div>
                                                <p className="text-slate-300 text-sm font-mono break-all">{barcode}</p>
                                            </div>

                                            {/* Click to Expand Indicator */}
                                            <div className="mt-4 pt-4 border-t border-slate-700 flex items-center justify-center">
                                                <span className="text-slate-500 text-xs group-hover:text-slate-300 transition-colors duration-300">
                                                    Clique para expedição →
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal 2: Expedition Control */}
            {mostrarTelaExped && itemSelecionado && (
                <div className="fixed hidden inset-0 z-50 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 lg:flex flex-col top-0 left-0 right-0 bottom-0 h-screen" style={{ margin: 0, padding: 0 }}>
                    {/* Background Patterns */}
                    <div className="fixed inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(120,119,198,0.1),transparent_70%)] pointer-events-none"></div>
                    <div className="fixed inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(16,185,129,0.1),transparent_70%)] pointer-events-none"></div>

                    {/* Header */}
                    <div className="fixed z-20 bg-slate-900/80 backdrop-blur-sm border-b border-slate-700 top-0 left-0 right-0" style={{ margin: 0, padding: 0, position: 'fixed', top: 0 }}>
                        <div className="flex items-center justify-between max-w-7xl mx-auto p-2 lg:p-3">
                            <div className="flex items-center space-x-4">
                                <div>
                                    <h1 className="text-xl lg:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">
                                        EXPEDINDO ITEM
                                    </h1>
                                    <p className="text-sm text-emerald-400 font-medium">{itemSelecionado?.itemTamanho?.item?.nome}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="flex items-center space-x-2 mb-1">
                                    <span className="text-slate-400 text-sm">Grade</span>
                                    <span className="text-white font-bold text-lg">#{props.grade.id}</span>
                                </div>
                                <p className="text-emerald-400 text-sm">Escola {props.escola?.numeroEscola}</p>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="relative z-10 flex-1 overflow-auto" style={{ marginTop: '80px' }}>
                        <div className="max-w-7xl mx-auto p-6">

                            {/* Actions Bar */}
                            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 mb-8">
                                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">

                                    {/* Action Buttons */}
                                    <div className="flex flex-wrap gap-3">
                                        <button
                                            onClick={fecharTelaExped}
                                            className="flex items-center space-x-2 px-4 py-2 bg-red-700 hover:bg-red-600 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-105"
                                        >
                                            <ArrowLeft size={19} />
                                            <span>Voltar</span>
                                        </button>
                                        <button
                                            onClick={handlerItemGrade}
                                            className="flex items-center space-x-2 px-4 py-2 bg-green-700 hover:bg-green-600 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-105"
                                        >
                                            <Plus size={19} />
                                            <span>Up</span>
                                        </button>
                                        <button
                                            onClick={props.handleFormDataChangeDecresc}
                                            className="flex items-center space-x-2 px-4 py-2 bg-blue-800 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-105"
                                        >
                                            <Minus size={19} />
                                            <span>Down</span>
                                        </button>
                                    </div>

                                    {/* Horizontal Info */}
                                    <div className="flex flex-wrap gap-3 text-sm">
                                        <ItemsGradeLinkTextHor labelName={`GRADE ID:`} value={String(props.grade.id)} baseUrl={`/caixas_por_grade/`} />
                                        <ItemsGradeInputTextHor value={props.escola?.numeroEscola}
                                            labelName={`ESCOLA Nº :`} color={`text-zinc-400`} />
                                        <ItemsGradeInputTextHor value={String(props.grade.gradeCaixas.length)}
                                            labelName={`VOLUMES :`} color={`text-red-600`} />
                                    </div>

                                    {/* Close Box Button */}
                                    <div className="flex justify-end">
                                        <button
                                            onClick={props.OpenModalGerarCaixa}
                                            className="flex items-center space-x-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-105"
                                        >
                                            <Box size={19} />
                                            <span>FECHAR CAIXA</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Main Content Grid */}
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

                                {/* Left Column - Item Information */}
                                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 space-y-6">
                                    <div className="flex items-center space-x-2 mb-4">
                                        <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                                        <h3 className="text-lg font-semibold text-white">Informações do Item</h3>
                                    </div>
                                    <div className="space-y-4">
                                        <ItemsGradeTextArea value={itemSelecionado?.itemTamanho?.item?.nome}
                                            labelName={`ITEM`} color={`text-zinc-400`} />
                                        <ItemsGradeInputText value={itemSelecionado?.itemTamanho?.item?.genero}
                                            labelName={`GÊNERO`} color={`text-zinc-400`} />
                                        <ItemsGradeInputText value={itemSelecionado?.itemTamanho?.tamanho?.nome}
                                            labelName={`TAMANHO`} color={`text-zinc-400`} />
                                        <ItemsGradeInputText value={itemSelecionado?.itemTamanho?.barcode?.codigo}
                                            labelName={`CÓDIGO DE BARRAS`} color={`text-zinc-400`} />
                                    </div>
                                </div>

                                {/* Right Column - Expedition Control */}
                                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 space-y-6">
                                    <div className="flex items-center space-x-2 mb-4">
                                        <div className="w-3 h-3 bg-emerald-400 rounded-full"></div>
                                        <h3 className="text-lg font-semibold text-white">Controle de Expedição</h3>
                                    </div>

                                    {/* Quantities in Row */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <ItemsGradeInputText value={String(itemSelecionado.quantidade)}
                                            labelName={`TOTAL À EXPEDIR`} color={`text-zinc-400`} />
                                        <ItemsGradeInputText value={String(itemSelecionado.quantidadeExpedida)}
                                            labelName={`JÁ EXPEDIDO`} />
                                    </div>

                                    {/* Special Fields */}
                                    <div className="space-y-4">
                                        <ItemGradeInputTextState labelName={'NÚMERO DA CAIXA'}
                                            formData={props.formData} setFormData={props.setFormData}
                                            isReadOnly={true}
                                            valueColor={`text-yellow-500`} labelColor={`text-yellow-500`}
                                            height={`h-[80px]`} txtSize={`text-[40px] lg:text-[48px]`} maxWhidth={`w-full`} />

                                        <ItemGradeInputTextState labelName={'QUANTIDADE NA CAIXA ATUAL'}
                                            formData={props.formData} setFormData={props.setFormData}
                                            isReadOnly={true}
                                            valueColor={`text-white`} labelColor={`text-white`}
                                            txtSize={`text-[40px] lg:text-[48px]`} maxWhidth={`w-full`}
                                            height={`h-[80px]`} />

                                        <ItemGradeInputTextState labelName={'QUANTIDADE LIDA'}
                                            formData={props.formData} setFormData={props.setFormData}
                                            isReadOnly={true} maxWhidth={`w-full`}
                                            valueColor={`text-zinc-400`} />

                                        <ItemGradeInputTextStateBar labelName={'CÓD DE BARRAS LEITURA'}
                                            formData={props.formData} setFormData={props.setFormData}
                                            txtSize={`text-[18px] lg:text-[20px]`} maxWhidth={`w-full`}
                                            inputRef={props.inputRef}
                                            isFocuss={props.isFocus}
                                            placeholder={`Mantenha o cursor aqui...`}
                                            isFocus={`border border-emerald-300 focus:border-emerald-500 focus:outline-none 
                                            focus:ring focus:ring-emerald-500`}
                                            labelColor={`text-emerald-500`}
                                            positionn={`text-left`}
                                            labelposition={`justify-start`} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal 3: Expedition Control Mobile */}
            {mostrarTelaExped && itemSelecionado && (
                <div className="fixed lg:hidden inset-0 z-50 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex flex-col top-0 left-0 right-0 bottom-0 h-screen" style={{ margin: 0, padding: 0 }}>
                    {/* Background Patterns */}
                    <div className="fixed inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(120,119,198,0.1),transparent_70%)] pointer-events-none"></div>
                    <div className="fixed inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(16,185,129,0.1),transparent_70%)] pointer-events-none"></div>

                    {/* Header */}
                    <div className="fixed z-20 bg-slate-900/80 backdrop-blur-sm border-b border-slate-700 top-0 left-0 right-0" style={{ margin: 0, padding: 0, position: 'fixed', top: 0 }}>
                        <div className="flex items-center justify-start max-w-7xl mx-auto p-2 pt-[0.75rem]">
                            <div className="flex items-center justify-start space-x-4 flex-col w-full">
                                <div className="flex w-full">
                                    <p className="pl-16 text-sm text-emerald-400 font-medium text-left w-[99%] truncate flex">{itemSelecionado?.itemTamanho?.item?.nome}</p>
                                </div>
                                <div className="flex w-full">
                                    <p className="pl-14 text-sm text-zinc-400 font-medium text-left w-full flex">{`GÊN: ${itemSelecionado?.itemTamanho?.item?.genero}`}</p>
                                </div>
                                <div className="flex w-full">
                                    <p className="pl-14 text-sm text-zinc-400 font-medium text-left w-full flex">{`TAM: ${itemSelecionado?.itemTamanho?.tamanho?.nome}`}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="relative z-10 flex-1 overflow-auto" style={{ marginTop: '70px' }}>
                        <div className="max-w-7xl mx-auto p-4 pt-6">
                            {/* Main Content Grid */}
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-2">

                                {/* Right Column - Expedition Control */}
                                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-2 space-y-2">
                                    {/* Quantities in Row */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                        <ItemsGradeInputTextMobil value={String(itemSelecionado.quantidade)}
                                            labelName={`TOTAL À EXPEDIR`} color={`text-zinc-400`} />
                                        <ItemsGradeInputTextMobil value={String(itemSelecionado.quantidadeExpedida)}
                                            labelName={`JÁ EXPEDIDO`} />
                                    </div>

                                    {/* Special Fields */}
                                    <div className="space-y-2">
                                        <ItemGradeInputTextStateMobil labelName={'NÚMERO DA CAIXA'}
                                            formData={props.formData} setFormData={props.setFormData}
                                            isReadOnly={true}
                                            valueColor={`text-yellow-500`} labelColor={`text-yellow-500`}
                                            height={`h-[40px]`} txtSize={`text-[40px] lg:text-[48px]`} maxWhidth={`w-full`} />

                                        <ItemGradeInputTextStateMobil labelName={'QUANTIDADE NA CAIXA ATUAL'}
                                            formData={props.formData} setFormData={props.setFormData}
                                            isReadOnly={true}
                                            valueColor={`text-white`} labelColor={`text-white`}
                                            txtSize={`text-[40px] lg:text-[48px]`} maxWhidth={`w-full`}
                                            height={`h-[40px]`} />

                                        <ItemGradeInputTextStateBarMobil labelName={'CÓD DE BARRAS LEITURA'}
                                            formData={props.formData} setFormData={props.setFormData}
                                            txtSize={`text-[13px]`} maxWhidth={`w-full`}
                                            inputRef={props.inputRef}
                                            isFocuss={props.isFocus}
                                            placeholder={`Mantenha o cursor aqui...`}
                                            isFocus={`border border-emerald-300 focus:border-emerald-500 focus:outline-none 
                                            focus:ring focus:ring-emerald-500`}
                                            labelColor={`text-emerald-500`}
                                            positionn={`text-left`}
                                            labelposition={`justify-start`} />
                                    </div>
                                </div>
                            </div>

                            {/* Actions Bar */}
                            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-2 mb-2">
                                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">

                                    {/* Action Buttons */}
                                    <div className="flex flex-wrap gap-3 justify-center">
                                        <button
                                            onClick={fecharTelaExped}
                                            className="flex flex-1 px-4 py-2 bg-red-700 hover:bg-red-600
                                             text-white font-medium rounded-lg transition-all duration-300
                                              transform hover:scale-105 h-6 justify-center items-center"
                                        >
                                            <ArrowLeft size={15} />
                                        </button>
                                        <button
                                            onClick={handlerItemGrade}
                                            className="flex flex-1 px-4 py-2 bg-green-700 hover:bg-green-600
                                             text-white font-medium rounded-lg transition-all duration-300
                                              transform hover:scale-105 h-6 justify-center items-center"
                                        >
                                            <Plus size={15} />
                                        </button>
                                        <button
                                            onClick={props.handleFormDataChangeDecresc}
                                            className="flex flex-1 px-4 py-2 bg-blue-800 hover:bg-blue-700
                                             text-white font-medium rounded-lg transition-all duration-300
                                              transform hover:scale-105 h-6 justify-center items-center"
                                        >
                                            <Minus size={15} />
                                        </button>
                                        <button
                                            onClick={props.OpenModalGerarCaixa}
                                            className="flex flex-1  px-4 py-2 bg-yellow-600 hover:bg-yellow-500
                                             text-white font-medium rounded-lg transition-all duration-300
                                              transform hover:scale-105 h-6 justify-center items-center"
                                        >
                                            <Box size={15} />
                                        </button>
                                    </div>

                                    {/* Horizontal Info */}

                                    <div className="grid grid-cols-2 gap-[0.10rem] mb-0">
                                        <Link href={`/caixas_por_grade/${String(props.grade.id)}`} target="_blank">
                                            <div className="bg-slate-900/50 rounded-lg p-2 text-center border border-slate-700/50">
                                                <p className="text-slate-400 text-xs uppercase tracking-wider mb-0">GRADE ID</p>
                                                <p className={`text-base font-semibold gap-x-1 text-indigo-500 flex items-center justify-center`}>
                                                    {String(props.grade.id)}
                                                    <ExternalLink className="" size={12} />
                                                </p>
                                            </div>
                                        </Link>
                                        <div className="bg-slate-900/50 rounded-lg p-2 text-center border border-slate-700/50">
                                            <p className="text-slate-400 text-xs uppercase tracking-wider mb-0">VOLUMES</p>
                                            <p className={`text-base font-semibold text-red-600`}>
                                                {String(props.grade.gradeCaixas.length)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Component */}
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
