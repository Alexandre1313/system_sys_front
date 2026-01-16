import { motion } from "framer-motion";
import { CaixaFindItem } from "../../../core";
import { useEffect, useState } from "react";
import { getCaixasFindItem } from "@/hooks_api/api";
import CaixaFind from "./CaixaFind";
import BalloonStatusCheckQty from "../ComponentesInterface/BalloonStatusCheckQty";

export interface GradeBarListBoxesProps {
    isOpenListBoxes: boolean;
    itemSelectId: number | undefined;
    gradeId: number | undefined;
    n1: number | undefined;
    n2: number | undefined;
}

const fechBoxesItem = async (gradeId: string, itemTamanhoId: string): Promise<CaixaFindItem[]> => {
    const boxesDataItem = await getCaixasFindItem(gradeId, itemTamanhoId);
    return boxesDataItem;
}

export default function GradeBarListBoxes(props: GradeBarListBoxesProps) {
    const [isloading, setIsloading] = useState<boolean>(true);
    const [caixas, setCaixas] = useState<CaixaFindItem[]>([]);
    const [caixasTotal, setCaixasTotal] = useState<number>(0);

    const { isOpenListBoxes, itemSelectId, gradeId, n1, n2 } = props;

    const panelVariants = {
        closed: {
            x: "100%",
            transition: {
                duration: 0.55,
                ease: [0.4, 0, 0.2, 1],
            },
        },
        open: {
            x: 0,
            transition: {
                duration: 0.55,
                ease: [0.4, 0, 0.2, 1],
            },
        },
    };

    useEffect(() => {
        // ❌ painel fechado → não faz nada
        if (!isOpenListBoxes) {
            setCaixas([]);
            setCaixasTotal(0);
            setIsloading(false);
            return;
        }

        // ❌ sem item selecionado → não faz fetch
        if (!itemSelectId || !gradeId) {
            setCaixas([]);
            setCaixasTotal(0);
            setIsloading(false);
            return;
        }

        let isMounted = true; // evita setState após unmount
        setIsloading(true);

        async function loadCaixas() {
            try {
                const data = await fechBoxesItem(
                    String(gradeId),
                    String(itemSelectId)
                );

                if (!isMounted) return;

                setCaixas(data ?? []);

                const total = (data ?? []).reduce((acc, caixa) => {
                    const somaItensDaCaixa = caixa.caixaItem.reduce(
                        (subAcc, item) => subAcc + item.itemQty,
                        0
                    );
                    return acc + somaItensDaCaixa;
                }, 0);

                setCaixasTotal(total);
            } catch (error) {
                console.error("Erro ao buscar caixas:", error);
                if (isMounted) {
                    setCaixas([]);
                    setCaixasTotal(0);
                }
            }
            finally {
                if (isMounted) {
                    setIsloading(false);
                }
            }
        }
        loadCaixas();
        return () => { isMounted = false; };
    }, [isOpenListBoxes, itemSelectId, gradeId]);

    return (
        <motion.div
            variants={panelVariants}
            initial={false}
            animate={isOpenListBoxes ? "open" : "closed"}
            className={`
                fixed top-0 right-0 z-[9999]
                h-[100dvh]
                w-[483px]
                bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800
                flex flex-col
                p-3 pt-[1.3rem] justify-start        
                items-center border-l border-slate-800
                rounded-ss-3xl rounded-es-3xl
            `}
            style={{
                pointerEvents: isOpenListBoxes ? "auto" : "none",
            }}
        >
            <div className={`flex justify-center items-center w-full border-b border-slate-800 pb-[0.9rem]`}>
                <h2 className={`text-center break-words text-xl font-semibold text-zinc-400`}>OUTRAS CAIXAS DESTA GRADE COM ESTE ITEM</h2>
            </div>
            {caixasTotal > 0 && (
                <div className={`flex justify-between text-xl items-center w-full border-b
                 border-slate-800 pb-[0.7rem] pt-[0.9rem] pl-3 pr-3`}>
                    <h2 className={`text-center break-words text-slate-400`}>
                        TOTAL DE ITENS:
                    </h2>
                    <span className={`text-zinc-400`}>{caixasTotal} {caixasTotal === 1 ? 'UN' : 'UNS'}</span>
                    <BalloonStatusCheckQty n1={(n1 ?? 0) - (n2 ?? 0)} n2={caixasTotal}/>
                </div>
               
            )}
            <div className="flex-1 relative w-full">
                {/* LOADING */}
                {isloading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex flex-col items-center gap-3">
                            <div className="h-10 w-10 border-4 border-zinc-600 border-t-transparent rounded-full animate-rotate" />
                            <span className="text-sm text-zinc-400">
                                Processando...
                            </span>
                        </div>
                    </div>
                )}

                {/* CONTEÚDO */}
                {!isloading && caixas.length > 0 && (
                    <div className="flex flex-col justify-start items-center w-full h-[82dvh] overflow-y-auto p-0 py-3 space-y-4">
                        {caixas.map((cx) => (
                            <CaixaFind
                                key={cx.id}
                                caixa={cx}
                            />
                        ))}
                    </div>
                )}

                {!isloading && caixas.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex flex-col items-center gap-3">
                            <span className="text-lg text-zinc-400">
                                Item ainda não embalado para esta grade.
                            </span>
                        </div>
                    </div>
                )}

                {caixas.length > 0 && (
                    <div className={`flex justify-center text-xl items-center w-full border-t mt-[0.7rem]
                         border-slate-800 pb-[0.7rem] pt-[0.5rem] pl-3 pr-3`}>
                        <h2 className={`text-center break-words text-slate-400`}> 
                            TOTAL DE CAIXAS:&nbsp; &nbsp;                         
                            <span className={`text-zinc-400`}>{caixas.length} {caixas.length === 1 ? 'CX' : 'CXS'}</span>
                        </h2>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
