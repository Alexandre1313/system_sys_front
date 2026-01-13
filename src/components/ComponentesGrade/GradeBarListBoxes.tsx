import { motion } from "framer-motion";
import { CaixaFindItem, GradeItem } from "../../../core";
import { useEffect, useState } from "react";
import { getCaixasFindItem } from "@/hooks_api/api";
import CaixaFind from "./CaixaFind";

export interface GradeBarListBoxesProps {
    isOpenListBoxes: boolean;
    itemSelectId: number | undefined;
    gradeId: number | undefined;
}

const fechBoxesItem = async (gradeId: string, itemTamanhoId: string): Promise<CaixaFindItem[]> => {
    const boxesDataItem = await getCaixasFindItem(gradeId, itemTamanhoId);
    return boxesDataItem;
}

export default function GradeBarListBoxes(props: GradeBarListBoxesProps) {
    const [isloading, setIsloading] = useState<boolean>(true);
    const [caixas, setCaixas] = useState<CaixaFindItem[]>([]);

    console.log(props.itemSelectId)

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
        if (!props.isOpenListBoxes) {
            setCaixas([]);
            setIsloading(false);
            return;
        }

        // ❌ sem item selecionado → não faz fetch
        if (!props.itemSelectId || !props.gradeId) {
            setCaixas([]);
            setIsloading(false);
            return;
        }

        let isMounted = true; // evita setState após unmount
        setIsloading(true);

        async function loadCaixas() {
            try {
                const data = await fechBoxesItem(
                    String(props.gradeId),
                    String(props.itemSelectId)
                );

                if (!isMounted) return;

                setCaixas(data ?? []);
            } catch (error) {
                console.error("Erro ao buscar caixas:", error);
                if (isMounted) {
                    setCaixas([]);
                }
            } finally {
                if (isMounted) {
                    setIsloading(false);
                }
            }
        }
        loadCaixas();
        return () => { isMounted = false; };
    }, [props.isOpenListBoxes, props.itemSelectId]);

    return (
        <motion.div
            variants={panelVariants}
            initial={false}
            animate={props.isOpenListBoxes ? "open" : "closed"}
            className={`
                fixed top-0 right-0 z-[9999]
                h-[100dvh]
                w-[483px]
                bg-[#101010]
                flex flex-col
                p-4 pt-[1.3rem] justify-start        
                items-center border-l border-slate-800
                rounded-ss-3xl rounded-es-3xl
            `}
            style={{
                pointerEvents: props.isOpenListBoxes ? "auto" : "none",
            }}
        >
            <div className={`flex justify-center items-center w-full border-b border-slate-800 pb-[0.9rem]`}>
                <h2 className={`text-center break-words text-xl font-semibold text-zinc-400`}>OUTRAS CAIXAS DESTA GRADE COM ESTE ITEM</h2>
            </div>
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
                    <div className="flex flex-col justify-start items-center w-full h-[90dvh] overflow-y-auto p-4 space-y-4">
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
                            <div className="h-10 w-10 border-4 border-zinc-600 border-t-transparent rounded-full animate-rotate" />
                            <span className="text-sm text-zinc-400">
                                Item ainda não emblado para esta grade.
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
