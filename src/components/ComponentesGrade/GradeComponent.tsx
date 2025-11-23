import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Box, ExternalLink, Eye, Minus, Plus, Search } from "react-feather";
import { Escola, EscolaGrade, Grade, GradeItem } from "../../../core";
import Caixa from "../../../core/interfaces/Caixa";
import { Genero } from "../../../core/interfaces/Genero";
import { colorLinkExternal, convertMilharFormat } from "../../../core/utils/tools";
import ModalAlterGradeItem from "../ComponentesInterface/ModalAlterGradeItem";
import ItemGradeInputTextState from "./ItemsGradeImputTextState";
import ItemGradeInputTextStateBar from "./ItemsGradeImputTextStateBar";
import ItemGradeInputTextStateBarMobil from "./ItemsGradeImputTextStateBarMobil";
import ItemGradeInputTextStateMobil from "./ItemsGradeImputTextStateMobil";
import ItemsGradeInputText from './ItemsGradeInputText';
import ItemsGradeInputTextMobil from "./ItemsGradeInputTextMobil";
import ItemsGradeTextArea from "./ItemsGradeTextArea";

export interface GradeComponentProps {
    grade: Grade;
    escola: Escola;
    formData: { [key: string]: any };
    isPend: boolean | null;
    inputRef: React.RefObject<HTMLInputElement>;
    userId?: number | undefined | null;
    isMobile: boolean;
    isFocus: () => void;
    handlerOpnEncGradeMoodify: () => void
    setFormData: (key: string, value: string) => void
    handleFormDataChangeDecresc: () => void
    handleItemSelecionado: (item: GradeItem | null) => void
    handleEscolaGradeSelecionada: (escolaGrade: EscolaGrade | null) => void
    handleNumeroDaCaixa: (numeroDaCaixa: string) => void
    OpenModalGerarCaixa: () => void
    OpenModalGerarCaixaError: () => void;
    setModalMessage: (message: string) => void;
    setModalOpen: (open: boolean) => void;
    mutate: () => void;
    printEti: (etiquetas: Caixa[], isprint: boolean) => JSX.Element
}

export default function GradeComponent(props: GradeComponentProps) {
    const [modalModifyGradeItemOpen, setMmodalModifyGradeItemOpen] = useState<boolean>(false);
    const [modalModifyGradeItemMessage, setmodalModifyGradeItemMessage] = useState<string>('');
    const [mostrarTela, setMostrarTela] = useState(false);
    const [mostrarTelaExped, setMostrarTelaExped] = useState(false);
    const [itemSelecionado, setItemSelecionado] = useState<GradeItem | null>(null);
    const [totalGrade, setTotalGrade] = useState<number | undefined>(0);
    const [busca, setBusca] = useState<string>('');

    const router = useRouter();

    const btnRef = useRef<HTMLButtonElement>(null);
    const btnRef1 = useRef<HTMLButtonElement>(null);
    const btnRef2 = useRef<HTMLButtonElement>(null);

    // refs para manter os valores atualizados sem re-registrar o listener
    const projetoIdRef = useRef(props.escola.projetoId);
    const pushRef = useRef<(path: string) => void>(() => { });

    // atualiza os refs quando os valores mudarem
    useEffect(() => { projetoIdRef.current = props.escola.projetoId; }, [props.escola.projetoId]);
    useEffect(() => { pushRef.current = (path: string) => router.push(path); }, [router]);

    // Adiciona o evento de keydown quando o componente for montado   
    useEffect(() => {
        const handleGlobalKeyDown = (event: KeyboardEvent) => {
            if (event.key === "ArrowLeft") {
                if (btnRef.current) {
                    btnRef.current.click(); // Simula o clique no botão
                }
            }
            if (event.key === "ArrowDown") {
                event.preventDefault();
                btnRef1.current?.click();
            }
            if (event.key === "ArrowUp") {
                event.preventDefault();
                pushRef.current(`/escolas/${projetoIdRef.current}`);
            }
        };

        // Adiciona o evento para o evento global de keydown
        window.addEventListener("keydown", handleGlobalKeyDown);

        // Limpa o evento quando o componente for desmontado
        return () => {
            window.removeEventListener("keydown", handleGlobalKeyDown);
        };
    }, []); // Esse useEffect é executado uma vez quando o componente é montado

    useEffect(() => {
        const total = props?.grade?.itensGrade?.reduce((totini, itemGrade) => {
            return totini + itemGrade.quantidade;
        }, 0);
        setTotalGrade(total)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.grade.itensGrade])

    // ✅ CORREÇÃO: Sincronizar itemSelecionado com formData.ITEM_SELECIONADO em tempo real
    // Isso garante que a interface seja atualizada imediatamente quando há mudanças nas quantidades
    useEffect(() => {
        if (props.formData?.ITEM_SELECIONADO && itemSelecionado?.id === props.formData.ITEM_SELECIONADO.id) {
            // Atualizar itemSelecionado local com os dados atualizados do formData
            setItemSelecionado(props.formData.ITEM_SELECIONADO);
        }
    }, [props.formData?.ITEM_SELECIONADO?.quantidadeExpedida, props.formData?.ITEM_SELECIONADO?.qtyPCaixa, itemSelecionado?.id, props.formData?.ITEM_SELECIONADO?.id, props.formData?.ITEM_SELECIONADO]);

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

    const volms = (): any[] => {
        if (props.grade?.status === 'EXPEDIDA' || props.grade?.status === 'DESPACHADA') {
            return ['Consolidados', 'Encerrado', 'linear-gradient(to bottom right, #047857, #022c22)', '#475569', true];
        } else if (props.grade.gradeCaixas.length === 0) {
            return ['Não iniciado', 'Primeira Caixa', 'linear-gradient(to bottom right, #0e7490, #083344)', '#475569', false];
        } else {
            return ['Parciais', 'Próxima Caixa', 'linear-gradient(to bottom right, #a16207, #422006)', '#fb923c', false];
        }
    }

    //const labelVolum = props.grade?.status === 'EXPEDIDA' || props.grade?.status === 'DESPACHADA';

    const abrirTela = () => {
        setMostrarTela(true);
        if (props.isPend) {
            props.OpenModalGerarCaixaError();
        }
    };

    const oneExpedida = props.grade.status === "EXPEDIDA" || props.grade.status === "DESPACHADA";
    const desativado = oneExpedida;

    const statusClass = desativado ? "opacity-[0.2] cursor-not-allowed" : "";

    const fecharTela = () => {
        setMostrarTela(false);
    };

    // ✅ FUNÇÃO CORRIGIDA: Verificar se há caixas pendentes em QUALQUER grade
    const verificarCaixasPendentes = (gradeAtual: Grade) => {
        // Se estamos tentando entrar na mesma grade que já está ativa, não há problema
        if (props.formData?.ESCOLA_GRADE?.gradeId === gradeAtual.id) {
            return { temPendencia: false };
        }

        // Verificar se há pendências na grade que está atualmente no formData
        if (props.formData?.ESCOLA_GRADE?.grade?.itensGrade) {
            const temCaixaPendente = props.formData.ESCOLA_GRADE.grade.itensGrade.some((item: any) => item.qtyPCaixa > 0);
            if (temCaixaPendente) {
                return {
                    temPendencia: true,
                    gradePendente: `Grade ${props.formData.ESCOLA_GRADE?.gradeId || 'anterior'}`
                };
            }
        }

        // ✅ NOVA VERIFICAÇÃO: Verificar se há pendências na grade atual
        if (gradeAtual?.itensGrade) {
            const temCaixaPendenteNaGradeAtual = gradeAtual.itensGrade.some((item: any) => item.qtyPCaixa > 0);
            if (temCaixaPendenteNaGradeAtual) {
                return {
                    temPendencia: true,
                    gradePendente: `Grade ${gradeAtual.id}`
                };
            }
        }

        // ✅ VERIFICAÇÃO ADICIONAL: Verificar todas as outras grades da escola
        if (props.escola?.grades) {
            for (const grade of props.escola.grades) {
                if (grade.id !== gradeAtual.id && grade.id !== props.formData?.ESCOLA_GRADE?.gradeId) {
                    if (grade.itensGrade?.some((item: any) => item.qtyPCaixa > 0)) {
                        return {
                            temPendencia: true,
                            gradePendente: `Grade ${grade.id}`
                        };
                    }
                }
            }
        }

        return { temPendencia: false };
    };

    const abrirTelaExped = (item: any, escola: Escola, grade: Grade, totalAExpedir: number, totalExpedido: number) => {
        // ✅ VALIDAÇÃO: Verificar se há caixas pendentes em outras grades
        const verificacaoPendencia = verificarCaixasPendentes(grade);
        if (verificacaoPendencia.temPendencia) {
            // Abrir modal de aviso sobre caixa pendente usando o modal genérico
            props.setModalMessage(`⚠️ HÁ CAIXAS PENDENTES!\n\nHá caixas pendentes na ${verificacaoPendencia.gradePendente}.\n\nEncerre a caixa pendente antes de trocar de grade.`);
            props.setModalOpen(true);
            return;
        }

        // ✅ CORREÇÃO CRÍTICA: Cada grade deve ser completamente isolada
        // Se estamos trocando de grade, usar apenas os dados da grade atual
        let gradeAtualizada = grade;
        let itemAtualizado = item;

        // ✅ CORREÇÃO: Só usar dados do formData se for a MESMA grade
        if (props.formData?.ESCOLA_GRADE?.gradeId === grade.id && props.formData?.ESCOLA_GRADE?.grade?.itensGrade) {
            gradeAtualizada = props.formData.ESCOLA_GRADE.grade;

            // Encontrar o item atualizado correspondente
            const itemAtualizadoEncontrado = gradeAtualizada.itensGrade?.find(
                (gradeItem: any) => gradeItem.id === item.id
            );

            if (itemAtualizadoEncontrado) {
                itemAtualizado = itemAtualizadoEncontrado;
            }
        }

        // ✅ CORREÇÃO CRÍTICA: Limpar isCount de TODOS os itens primeiro
        gradeAtualizada.itensGrade?.forEach((gradeItem: any) => {
            gradeItem.isCount = false;
        });

        // ✅ CORREÇÃO: Definir isCount = true APENAS para o item selecionado
        itemAtualizado.isCount = true;

        // ✅ CORREÇÃO ADICIONAL: Garantir que todos os itens com qtyPCaixa > 0 tenham isCount = true
        gradeAtualizada.itensGrade?.forEach((gradeItem: any) => {
            if (gradeItem.qtyPCaixa > 0) {
                gradeItem.isCount = true;
            }
        });

        // ✅ CORREÇÃO: Usar totais da grade atual, não do formData
        const totalAExpedirAtualizado = props.formData?.ESCOLA_GRADE?.gradeId === grade.id
            ? (props.formData?.ESCOLA_GRADE?.totalAExpedir ?? totalAExpedir)
            : totalAExpedir;
        const totalExpedidoAtualizado = props.formData?.ESCOLA_GRADE?.gradeId === grade.id
            ? (props.formData?.ESCOLA_GRADE?.totalExpedido ?? totalExpedido)
            : totalExpedido;

        const escolaGrade: EscolaGrade = {
            nomeEscola: escola.nome,
            projeto: escola.projeto?.nome,
            numeroEscola: escola.numeroEscola,
            numberJoin: escola.numberJoin,
            idEscola: escola.id,
            gradeId: grade.id,
            finalizada: grade.finalizada,
            totalAExpedir: totalAExpedirAtualizado,
            totalExpedido: totalExpedidoAtualizado,
            grade: gradeAtualizada
        }

        // console.log("🔍 abrirTelaExped - Grade isolada:", {
        //     gradeId: grade.id,
        //     nome: itemAtualizado?.itemTamanho?.item?.nome,
        //     quantidadeExpedida: itemAtualizado.quantidadeExpedida,
        //     qtyPCaixa: itemAtualizado.qtyPCaixa,
        //     isCount: itemAtualizado.isCount
        // });

        setItemSelecionado(itemAtualizado);
        props.handleItemSelecionado(itemAtualizado)
        props.handleEscolaGradeSelecionada(escolaGrade)
        props.handleNumeroDaCaixa(String(grade.gradeCaixas?.length + 1))
        setMostrarTelaExped(true);
    };

    const fecharTelaExped = () => {
        setMostrarTelaExped(false);
        setItemSelecionado(null);
    };

    // Verificar se há caixas para gerar (itens com quantidade na caixa atual > 0)
    const temCaixasParaGerar = props.grade.itensGrade?.some(item =>
        (item.qtyPCaixa || 0) > 0
    );

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

    const print = () => { return props.printEti(props.grade.gradeCaixas, volms()[4]) }

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
            <div className={`group max-w-[300px] lg:max-w-[320px] lg:min-w-[319px] bg-slate-800/50 backdrop-blur-sm
            h-fit border rounded-2xl p-4 transition-all duration-300 transform hover:shadow-xl cursor-pointer ${total === totalExpedido
                    ? 'border-emerald-600 hover:border-emerald-500 hover:shadow-emerald-600/20'
                    : totalExpedido > 0
                        ? 'border-yellow-600 hover:border-yellow-500 hover:shadow-yellow-500/20'
                        : 'border-blue-600 hover:border-blue-500 hover:shadow-blue-500/20'
                }`}
                style={{ background: `${total === totalExpedido ? 'rgba(16, 185, 129, 0.05)' : totalExpedido > 0 ? 'rgba(234, 179, 8, 0.05)' : 'rgba(59, 130, 246, 0.05)'}` }}
            >

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
                    <div className="bg-slate-800/10 rounded-xl p-2 text-center border border-slate-700/50 flex flex-col
                     items-center justify-start" style={{ boxShadow: 'inset 7px 7px 15px 1px rgba(0,0,0,0.15)' }}>
                        <p className="text-slate-400 text-xs uppercase tracking-wider mb-2 font-medium">Escola nº</p>
                        <div className="flex w-12 h-12 justify-center items-center p-2 pt-[0.77rem] pl-[0.55rem] rounded-full text-white text-lg lg:text-[1.220rem]
                        font-extralight"  style={{ boxShadow: '1px 1px 30px 1px rgba(0,0,0,0.4)', background: `${volms()[2]}` }}>
                            {props.escola?.numeroEscola}</div>
                    </div>

                    {/* Volumes */}
                    <div className="bg-slate-900/10 rounded-xl p-2 text-center border border-slate-700/50">
                        <p className="text-slate-400 text-xs uppercase tracking-wider mb-2 font-medium">Volumes</p>
                        <p className="text-purple-400 text-lg lg:text-[1.620rem] lg:leading-[1.5] font-extralight">{props.grade.gradeCaixas.length}</p>
                        <p className="text-xs text-slate-500 mt-1">{volms()[0]}</p>
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
                    <div className="bg-slate-900/10 rounded-xl p-2 text-center border border-slate-700/50">
                        <p className="text-slate-400 text-xs uppercase tracking-wider mb-2 font-medium">Previsto</p>
                        <p className="text-yellow-400 text-lg lg:text-[1.620rem] lg:leading-[1.5] font-extralight">{convertMilharFormat(totalGrade || 0)}</p>
                    </div>
                    <div className="bg-slate-900/10 rounded-xl p-2 text-center border border-slate-700/50">
                        <p className="text-slate-400 text-xs uppercase tracking-wider mb-2 font-medium">Expedido</p>
                        <p className={`text-lg lg:text-[1.620rem] lg:leading-[1.5] font-extralight ${total === totalExpedido ? 'text-emerald-400' : 'text-slate-300'}`}>
                            {convertMilharFormat(totalExpedido)}
                        </p>
                    </div>
                    <div className="bg-slate-900/10 rounded-xl p-2 text-center border border-slate-700/50">
                        <p className="text-slate-400 text-xs uppercase tracking-wider mb-2 font-medium">À Expedir</p>
                        <p className={`text-lg lg:text-[1.620rem] lg:leading-[1.5] font-extralight ${totalAExpedir > 0 ? 'text-blue-400' : 'text-slate-400'
                            }`}>
                            {convertMilharFormat(totalAExpedir)}
                        </p>
                    </div>
                    <div className="bg-slate-900/10 rounded-xl p-2 text-center border border-slate-700/50">
                        <p className="text-slate-400 text-xs uppercase tracking-wider mb-2 font-medium">{volms()[1]}</p>
                        <p className="text-lg lg:text-[1.620rem] lg:leading-[1.5] font-extralight"
                            style={{ color: `${volms()[3]}` }}
                        >
                            {total === totalExpedido ? 'X' : (props.grade.gradeCaixas.length + 1)}
                        </p>
                    </div>
                </div>

                {/* Items Summary */}
                <div className="mb-6">
                    <h3 className="text-slate-400 text-sm font-semibold mb-3 flex items-center">
                        <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                        {uniqueItems.length === 1 ? 'Item:' : `Itens (${uniqueItems.length}):`}
                    </h3>
                    <div className="space-y-2">
                        {uniqueItems.slice(0, 5).map((it, index) => (
                            <div key={index} className="flex items-center justify-between py-1.5 px-2 bg-slate-900/20 rounded-lg">
                                <span className="text-white text-sm font-medium truncate flex-1 mr-2">{it.nome}</span>
                                <span className="text-slate-400 text-sm bg-slate-800/50 px-2 py-1 rounded">{it.genero}</span>
                            </div>
                        ))}
                        {uniqueItems.length > 5 && (
                            <div className="text-slate-500 text-xs text-center py-2 bg-slate-900/30 rounded-lg">
                                +{uniqueItems.length - 5} itens adicionais
                            </div>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                    {print()}
                    <button
                        type="button"
                        disabled={volms()[4]}
                        onClick={abrirTela}
                        className={`${statusClass} flex-1 bg-slate-700 hover:bg-slate-600 border border-slate-600
                        text-slate-300 font-medium py-3 px-4 rounded-lg transition-all duration-300 flex items-center
                        justify-center space-x-2 hover:scale-100 text-[13px]`}
                    >
                        <Eye size={18} className="mr-2" />
                        {uniqueItems.length < 2 ? 'VER ITEM' : 'VER ITENS'}
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
                    <div className="fixed z-20 bg-slate-900/80 backdrop-blur-sm border-b border-slate-700 top-0 left-0 
                    right-0 w-full lg:min-h-[93px] lg:max-h-[93px]" style={{ margin: 0, padding: 0, position: 'fixed', top: 0 }}>
                        <div className="flex items-center max-w-7xl mx-auto flex-col p-2 lg:p-3 w-full">
                            <div className="flex relative items-center justify-between max-w-7xl mx-auto w-full lg:flex-row flex-col">
                                <button
                                    onClick={fecharTela}
                                    className="flex items-center space-x-2 px-2 lg:px-4 py-2 bg-emerald-600 hover:bg-emerald-500
                                     text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-100
                                       absolute top-14 lg:top-4 left-[0.6rem]"
                                >
                                    <ArrowLeft size={20} />
                                    <span className="hidden lg:visible">VOLTAR</span>
                                </button>
                                <div className="pl-16 pt-1 lg:pt-0 w-full">
                                    <h1 className="text-xl lg:pl-16 lg:text-2xl font-bold w-full text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">
                                        ESCOLA {props.escola?.numeroEscola}
                                    </h1>
                                    <p className="text-sm lg:pl-16 text-emerald-400 truncate w-[90%]">{props.escola?.nome}</p>
                                </div>
                                <div className="text-left w-full pl-16">
                                    <div className="flex items-center space-x-2 mb-1 lg:justify-end w-full">
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500 font-bold lg:text-2xl text-xl lg:pl-16">GRADE ID:</span>
                                        <span className="lg:text-rose-400 text-rose-400 font-bold lg:text-2xl text-xl">{props.grade.id}</span>
                                    </div>
                                    <p className="text-emerald-400 text-sm lg:text-right font-medium lg:pl-16 -mt-1">{itensFiltrados.length} ITE{itensFiltrados.length !== 1 ? 'NS' : 'M'} ENCONTRADO{itensFiltrados.length !== 1 ? 'S' : ''}</p>
                                </div>
                            </div>
                            {/* Search Bar - Positioned over content with proper spacing (Mobile & Desktop) */}
                            <div className="absolute top-[130px] lg:top-[110px] left-1/2 transform -translate-x-1/2 z-30 w-[90%] max-w-[500px] px-2 lg:px-4">
                                <div className="relative">
                                    <Search
                                        size={16}
                                        className="absolute left-3 lg:left-4 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none lg:w-[18px] lg:h-[18px]"
                                        strokeWidth={1.5}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Filtrar -> 1º Tam, 2º Gênero, 3º Item"
                                        className="w-full h-10 lg:h-12 pl-9 lg:pl-12 pr-3 lg:pr-4 bg-slate-800/95 backdrop-blur-lg border border-slate-600 rounded-lg lg:rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 text-sm lg:text-base shadow-2xl shadow-slate-900/50"
                                        value={busca}
                                        onChange={(e) => setBusca(e.target.value.toLowerCase())}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content - Responsive spacing for mobile and desktop */}
                    <div className="relative z-10 flex-1 overflow-auto flex items-start justify-center pt-[60px] lg:pt-[64px]" style={{ marginTop: '100px', paddingBottom: '80px' }}>
                        <div className="max-w-7xl mx-auto p-6 lg:pt-3">
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
                                    const colorGenero = genero?.includes('MASC') ? 'bg-blue-900/50' : genero?.includes('FEM') ? 'bg-rose-900/50' : 'bg-slate-700/50';

                                    return (
                                        <div
                                            onClick={() => abrirTelaExped(itemGrade, props.escola, props.grade, totalAExpedir, totalExpedido)}
                                            key={index}
                                            className={`group bg-slate-800/50 backdrop-blur-sm border rounded-2xl lg:p-6 p-3 transition-all
                                                duration-300 transform hover:scale-[1.0] hover:shadow-xl cursor-pointer min-w-[295px]
                                                ${isCompleted
                                                    ? 'border-emerald-500 hover:border-emerald-400 hover:shadow-emerald-500/20'
                                                    : isPartial
                                                        ? 'border-yellow-500 hover:border-yellow-400 hover:shadow-yellow-500/20'
                                                        : 'border-blue-500 hover:border-blue-500 hover:shadow-blue-500/20'
                                                }`}
                                            style={{
                                                background: `${isCompleted ? 'rgba(16, 185, 129, 0.05)' : isPartial ? 'rgba(234, 179, 8, 0.05)' : 'rgba(59, 130, 246, 0.05)'}`,
                                                pointerEvents: `${isCompleted ? 'auto' : 'auto'}`, cursor: `${isCompleted ? 'not-allowed' : 'pointer'}`
                                            }}
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
                                                    <span className={`text-slate-400 text-sm px-2 py-1 rounded ${colorGenero}`}>{genero}</span>
                                                    <div className="flex items-center space-x-2">
                                                        <span className="text-slate-500 text-sm">Tam:</span>
                                                        <span className="text-yellow-200 font-medium text-[20px] lg:text-[23px] bg-slate-700/50 px-2 py-1 rounded">{tamanho?.nome}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Stats Grid */}
                                            <div className="grid grid-cols-2 gap-[0.10rem] mb-4">
                                                <div className="bg-slate-900/10 rounded-lg p-2 text-center border border-slate-700/50">
                                                    <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Previsto</p>
                                                    <p className="text-yellow-400 text-base lg:text-[1.620rem] lg:leading-[1.5] font-extralight">{convertMilharFormat(quantidade)}</p>
                                                </div>
                                                <div className="bg-slate-900/10 rounded-lg p-2 text-center border border-slate-700/50">
                                                    <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Expedido</p>
                                                    <p className={`text-base lg:text-[1.620rem] lg:leading-[1.5] font-extralight ${isCompleted ? 'text-emerald-400' : 'text-slate-300'}`}>
                                                        {convertMilharFormat(quantidadeExpedida)}
                                                    </p>
                                                </div>
                                                <div className="bg-slate-900/10 rounded-lg p-2 text-center border border-slate-700/50">
                                                    <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Estoque</p>
                                                    <p className={`text-base font-extralight ${colorEstoque}`}>
                                                        {convertMilharFormat(estoque!)}
                                                    </p>
                                                </div>
                                                <div className="bg-slate-900/10 rounded-lg p-2 text-center border border-slate-700/50">
                                                    <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">À Expedir</p>
                                                    <p className={`text-base lg:text-[1.620rem] lg:leading-[1.5] font-extralight ${quantidade - quantidadeExpedida > 0 ? 'text-blue-400' : 'text-slate-400'
                                                        }`}>
                                                        {convertMilharFormat(quantidade - quantidadeExpedida)}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Barcode */}
                                            <div className="bg-slate-900/10 rounded-lg p-3 border border-slate-700/50">
                                                <div className="flex items-center space-x-2 mb-2">
                                                    <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                                                    <p className="text-slate-400 text-xs uppercase tracking-wider font-medium">Código de Barras</p>
                                                </div>
                                                <p className="text-slate-300 text-lg font-mono break-all">{barcode}</p>
                                            </div>

                                            {/* Click to Expand Indicator */}
                                            <div className="mt-4 pt-4 border-t border-slate-700 flex items-center justify-center">
                                                <span className="text-slate-500 text-xs group-hover:text-slate-300 transition-colors duration-300">
                                                    {isCompleted ? 'Encerrado' : isPartial ? 'Continuar expedição →' : 'Iniciar expedição →'}
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

            {/* Modal 3: Expedition Control Mobile */}
            {mostrarTelaExped && itemSelecionado && props.isMobile && (
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
                                    <p className="pl-14 text-sm text-zinc-400 font-medium text-left w-full flex">{`${itemSelecionado?.itemTamanho?.item?.genero}`}</p>
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
                                    <div className="grid grid-cols-2 md:grid-cols-2 gap-2">
                                        <ItemsGradeInputTextMobil value={String(itemSelecionado.quantidade)}
                                            labelName={`PREVISTO`} color={`text-yellow-400`} />
                                        <ItemsGradeInputTextMobil value={String(itemSelecionado.quantidadeExpedida)}
                                            bgColor={`${itemSelecionado.quantidade === itemSelecionado.quantidadeExpedida ? 'rgba(52, 211, 153, 0.1)' : 'rgba(52, 211, 153, 0)'}`}
                                            labelName={`EXPEDIDO`}
                                            color={`${itemSelecionado.quantidade === itemSelecionado.quantidadeExpedida ? 'text-emerald-400' : 'text-slate-300'}`} />
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-2 gap-2">
                                        <ItemGradeInputTextStateMobil labelName={'QUANTIDADE LIDA'}
                                            formData={props.formData} setFormData={props.setFormData}
                                            isReadOnly={true} maxWhidth={`w-full`}
                                            valueColor={`text-zinc-400`}
                                            labelposition={`justify-start`}
                                            positionn={`text-left`}
                                            tot={String(totalGrade)} />
                                        <ItemsGradeInputTextMobil value={String(itemSelecionado.quantidade - itemSelecionado.quantidadeExpedida)}
                                            bgColor={`${itemSelecionado.quantidade - itemSelecionado.quantidadeExpedida > 0 ? 'rgba(96, 165, 250, 0.1)' : 'rgba(96, 165, 250, 0)'}`}
                                            labelName={`À EXPEDIR`}
                                            color={`${itemSelecionado.quantidade - itemSelecionado.quantidadeExpedida > 0 ? 'text-blue-400' : 'text-slate-400'}`} />
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
                                            ref={btnRef2}
                                            onClick={fecharTelaExped}
                                            className="flex flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-500
                                             text-white font-medium rounded-lg transition-all duration-300
                                              transform hover:scale-100 h-6 justify-center items-center"
                                        >
                                            <ArrowLeft size={15} />
                                        </button>
                                        {props?.userId === 1 && (
                                            <button
                                                onClick={handlerItemGrade}
                                                className={`flex flex-1 px-4 py-2 bg-green-700 hover:bg-green-600
                                             text-white font-medium rounded-lg transition-all duration-300
                                              transform hover:scale-100 h-6 justify-center items-center`}
                                            >
                                                <Plus size={15} />
                                            </button>
                                        )}
                                        <button
                                            onClick={props.handleFormDataChangeDecresc}
                                            className="flex flex-1 px-4 py-2 bg-blue-800 hover:bg-blue-700
                                             text-white font-medium rounded-lg transition-all duration-300
                                              transform hover:scale-100 h-6 justify-center items-center"
                                        >
                                            <Minus size={15} />
                                        </button>
                                        <button
                                            onClick={props.OpenModalGerarCaixa}
                                            className={`flex flex-1 px-4 py-2 text-white font-medium rounded-lg transition-all duration-300
                                              transform hover:scale-100 h-6 justify-center items-center
                                              ${temCaixasParaGerar
                                                    ? 'bg-green-600 hover:bg-green-500 btn-ripple cursor-pointer'
                                                    : 'bg-yellow-600 hover:bg-yellow-500 opacity-50 cursor-not-allowed pointer-events-none'
                                                }`}
                                        >
                                            <Box size={15} />
                                        </button>
                                    </div>

                                    {/* Horizontal Info */}

                                    <div className="grid grid-cols-2 gap-[0.50rem] mb-0">
                                        <div className="flex flex-col items-center justify-center border border-slate-700 p-1 px-3
                                            min-w-[100%] max-w-[100%] bg-slate-800/50 backdrop-blur-sm rounded-ee-3xl rounded-ss-3xl">
                                            <Link href={`/caixas_por_grade/${String(props.grade.id)}`}>

                                                <p className="text-slate-400 text-xs uppercase tracking-wider mb-0">GRADE ID</p>
                                                <p className={`text-base font-semibold gap-x-1 text-rose-400 flex items-center justify-center`}>
                                                    {String(props.grade.id)}
                                                    <ExternalLink className={`${colorLinkExternal}`} size={12} />
                                                </p>

                                            </Link>
                                        </div>
                                        <div className="flex flex-col items-center justify-center border border-slate-700 p-1 px-3
                                            min-w-[100%] max-w-[100%] bg-slate-800/50 backdrop-blur-sm rounded-ee-3xl rounded-ss-3xl">
                                            <p className="text-slate-400 text-xs uppercase tracking-wider mb-0">VOLUMES</p>
                                            <p className={`text-base font-semibold text-red-500`}>
                                                {String(props.grade.gradeCaixas.length)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div >
            )
            }

            {/* Modal 2: Expedition Control */}
            {
                mostrarTelaExped && itemSelecionado && !props.isMobile && (
                    <div className="fixed hidden inset-0 z-50 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 lg:flex flex-col top-0 left-0 right-0 bottom-0 h-screen" style={{ margin: 0, padding: 0 }}>
                        {/* Background Patterns */}
                        <div className="fixed inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(120,119,198,0.1),transparent_70%)] pointer-events-none"></div>
                        <div className="fixed inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(16,185,129,0.1),transparent_70%)] pointer-events-none"></div>

                        {/* Header */}
                        <div className="fixed z-20 bg-slate-900/80 backdrop-blur-sm border-b border-slate-700 min-h-[93px] max-h-[93px] top-0 left-0 right-0" style={{ margin: 0, padding: 0, position: 'fixed', top: 0 }}>
                            <div className="flex items-start justify-around gap-x-2 max-w-[78.5rem] mx-auto p-2 lg:p-3">
                                <div className="text-left">
                                    <div className="flex flex-col items-center justify-center border border-slate-700 p-1 px-3
                                min-w-[250px] max-w-[250px] bg-slate-800/50 backdrop-blur-sm rounded-ee-3xl rounded-ss-3xl">
                                        <p className="text-sm text-white font-medium truncate">{`${props.escola.projeto?.nome}`}</p>
                                        <p className="text-sm text-emerald-400 font-medium truncate">{`${`PROJETO`}`}</p>
                                    </div>
                                </div>
                                <div className="text-left">
                                    <div className="flex flex-col items-center justify-center border border-slate-700 p-1 px-3
                                min-w-[250px] max-w-[250px] bg-slate-800/50 backdrop-blur-sm rounded-ee-3xl rounded-ss-3xl">
                                        <Link href={`/caixas_por_grade/${String(props.grade.id)}`}
                                            className="flex items-center justify-start gap-x-2"
                                        >
                                            <h1 className="text-xl lg:text-4xl font-bold text-rose-400">
                                                {`${props.grade.id}`}
                                            </h1>
                                            <ExternalLink className={`${colorLinkExternal}`} size={12} />
                                        </Link>
                                        <p className="text-sm text-emerald-400 font-medium">GRADE ID</p>
                                    </div>
                                </div>
                                <div className="text-left">
                                    <div className="flex flex-col items-center justify-center border border-slate-700 p-1 px-3
                                min-w-[250px] max-w-[250px] bg-slate-800/50 backdrop-blur-sm rounded-ee-3xl rounded-ss-3xl">
                                        <h1 className="text-xl lg:text-4xl font-bold text-zinc-300">
                                            {`${props.escola?.numeroEscola}`}
                                        </h1>
                                        <p className="text-sm text-emerald-400 font-medium">NÚMERO DA UNIDADE ESCOLAR</p>
                                    </div>
                                </div>
                                <div className="text-left">
                                    <div className="flex flex-col items-center justify-center border border-slate-700 p-1 px-3 rounded-ee-3xl rounded-ss-3xl
                                min-w-[250px] max-w-[250px] bg-slate-800/50 backdrop-blur-sm">
                                        <h1 className={`text-xl lg:text-4xl font-bold ${props.grade.gradeCaixas.length === 0 ? 'text-slate-700' : 'text-red-500'}`}>
                                            {`${props.grade.gradeCaixas.length}`}
                                        </h1>
                                        {props.grade.gradeCaixas.length > 1 && (
                                            <p className="text-sm text-emerald-400 font-medium">VOLUMES JÁ CONSOLIDADOS</p>
                                        )}
                                        {props.grade.gradeCaixas.length === 1 && (
                                            <p className="text-sm text-emerald-400 font-medium">VOLUME CONSOLIDADO</p>
                                        )}
                                        {props.grade.gradeCaixas.length === 0 && (
                                            <p className="text-sm text-emerald-400 font-medium">NÃO HÁ VOLUMES GERADOS</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="relative z-10 flex-1 overflow-auto" style={{ marginTop: '80px' }}>
                            <div className="max-w-[92rem] mx-auto p-6">

                                {/* Actions Bar */}
                                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-2 mb-6">
                                    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">

                                        {/* Action Buttons */}
                                        <div className="flex flex-wrap gap-3">
                                            <button
                                                ref={btnRef1}
                                                onClick={fecharTelaExped}
                                                className={`flex items-center space-x-2 px-2 py-2 bg-emerald-600 hover:bg-emerald-500
                                             text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-100
                                             min-w-[70px] justify-center`}
                                            >
                                                <ArrowLeft size={19} />
                                                <span className="hidden"></span>
                                            </button>
                                            <button
                                                onClick={handlerItemGrade}
                                                className={`flex items-center space-x-2 px-2 py-2 bg-green-700 hover:bg-green-600
                                             text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-100
                                             min-w-[50px] justify-center ${props?.userId === 1 ? 'pointer-events-auto cursor-pointer opacity-100' :
                                                        'pointer-events-none cursor-not-allowed opacity-30'}`}
                                            >
                                                <Plus size={19} />
                                                <span className="hidden"></span>
                                            </button>
                                            <button
                                                onClick={props.handleFormDataChangeDecresc}
                                                className="flex items-center justify-center px-2 py-2 bg-blue-800
                                             hover:bg-blue-700 text-white font-medium rounded-lg transition-all
                                              duration-300 transform hover:scale-100 min-w-[50px]"
                                            >
                                                <Minus size={19} />
                                                <span className="hidden"></span>
                                            </button>
                                        </div>

                                        {/* Close Box Button */}
                                        <div className="flex justify-end">
                                            <button
                                                ref={btnRef}
                                                onClick={props.OpenModalGerarCaixa}
                                                className={`flex items-center space-x-2 px-4 py-2 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-100
                                                  ${temCaixasParaGerar
                                                        ? 'bg-green-600 hover:bg-green-500 btn-ripple cursor-pointer'
                                                        : 'bg-yellow-600 hover:bg-yellow-500 opacity-50 cursor-not-allowed pointer-events-none'
                                                    }`}
                                            >
                                                <Box size={29} />
                                                <span>FECHAR CAIXA</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Main Content Grid */}
                                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

                                    {/* Left Column - Item Information */}
                                    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-2 space-y-6">
                                        <div className="flex items-center space-x-2 mb-4">
                                            <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                                            <h3 className="text-lg font-semibold text-white">Informações do Item</h3>
                                        </div>
                                        <div className="space-y-4">
                                            <ItemsGradeTextArea value={itemSelecionado?.itemTamanho?.item?.nome}
                                                labelName={`ITEM`} color={`text-zinc-400`} />
                                            <div className="grid grid-cols-2 gap-4">

                                                <ItemsGradeInputText value={itemSelecionado?.itemTamanho?.item?.genero}
                                                    labelName={`GÊNERO`} color={`text-zinc-400`}
                                                    bgColor={
                                                        itemSelecionado?.itemTamanho?.item?.genero.includes('MASC')
                                                            ? 'rgba(30, 58, 138, 0.5)'   // azul masculino
                                                            : itemSelecionado?.itemTamanho?.item?.genero.includes('FEM')
                                                                ? 'rgba(136, 19, 55, 0.5)'   // rosa feminino
                                                                : 'rgba(51, 65, 85, 0.5)'    // neutro
                                                    } />
                                                <ItemsGradeInputText value={itemSelecionado?.itemTamanho?.barcode?.codigo}
                                                    labelName={`CÓDIGO DE BARRAS`} color={`text-zinc-400`} />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <ItemsGradeInputText value={itemSelecionado?.itemTamanho?.tamanho?.nome}
                                                    labelName={`TAMANHO`} color={`text-yellow-200`} />
                                                <ItemsGradeInputText value={props.grade.status}
                                                    labelName={`GRADE STATUS`} color={`text-zinc-400`} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column - Expedition Control */}
                                    <div className={`bg-[#181818]/20 backdrop-blur-sm border border-slate-700 rounded-2xl p-3 space-y-6`}>
                                        <div className="flex items-center justify-between space-x-2 mb-4">
                                            <div className={`flex items-center space-x-2`}>
                                                <div className={`w-3 h-3 ${temCaixasParaGerar ? 'bg-emerald-400 ' : 'bg-slate-700'} rounded-full`}></div>
                                                <h3 className={`text-lg font-semibold text-white`}>Controle de Expedição</h3>
                                            </div>
                                            <div className={`flex items-center space-x-2`}>
                                                <h3 className={`text-lg font-semibold text-green-500`}>{temCaixasParaGerar ? 'Caixa em aberto' : ''}</h3>
                                            </div>
                                        </div>

                                        {/* Quantities in Row */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <ItemsGradeInputText value={String(itemSelecionado.quantidade)}
                                                labelName={`PREVISTO`} color={`text-yellow-400`} />
                                            <ItemsGradeInputText value={String(itemSelecionado.quantidadeExpedida)}
                                                labelName={`EXPEDIDO`} color={`${itemSelecionado.quantidade === itemSelecionado.quantidadeExpedida ? 'text-emerald-400' : 'text-slate-300'}`}
                                                bgColor={`${itemSelecionado.quantidade === itemSelecionado.quantidadeExpedida ? 'rgba(52, 211, 153, 0.1)' : 'rgba(52, 211, 153, 0)'}`} />
                                            <ItemsGradeInputText value={String(itemSelecionado.quantidade - itemSelecionado.quantidadeExpedida)}
                                                labelName={"À EXPEDIR"} color={`${itemSelecionado.quantidade - itemSelecionado.quantidadeExpedida > 0 ? 'text-blue-400' : 'text-slate-400'}`}
                                                bgColor={`${itemSelecionado.quantidade - itemSelecionado.quantidadeExpedida > 0 ? 'rgba(96, 165, 250, 0.1)' : 'rgba(96, 165, 250, 0)'}`} />
                                        </div>

                                        {/* Special Fields */}
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
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
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                                                <ItemGradeInputTextState labelName={'QUANTIDADE LIDA'}
                                                    formData={props.formData} setFormData={props.setFormData}
                                                    isReadOnly={true} maxWhidth={`w-full`}
                                                    valueColor={`text-zinc-400`}
                                                    labelposition={`justify-start`}
                                                    positionn={`text-left`}
                                                    tot={String(totalGrade)} />
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
                    </div>
                )
            }

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
