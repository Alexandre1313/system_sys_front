import { motion } from "framer-motion";
import { GradeItem } from "../../../core";
import { useState } from "react";

export interface GradeBarListBoxesProps {
    isOpenListBoxes: boolean;
    itemSelect: GradeItem | null;
}

export default function GradeBarListBoxes(props: GradeBarListBoxesProps) {
    const [isloading, setIsloading] = useState<boolean>(true);

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
            <div className="flex-1 relative">
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
                {!isloading && (
                    <div className="h-full overflow-y-auto p-4 space-y-4">
                        {/* itens */}
                    </div>
                )}
            </div>
        </motion.div>
    );
}
