import { motion } from "framer-motion";

export interface GradeBarListBoxesProps {
    isOpenListBoxes: boolean;
}

export default function GradeBarListBoxes(props: GradeBarListBoxesProps) {
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
                bg-zinc-900
                flex flex-col
            `}
            style={{
                pointerEvents: props.isOpenListBoxes ? "auto" : "none",
            }}
        >
            <div className="flex-1 overflow-y-auto items-start justify-start">
                {/* conteúdo */}
            </div>
        </motion.div>
    );
}
