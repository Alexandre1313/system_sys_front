import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp } from "react-feather";

const teclaClassName = `
    inline-flex items-center justify-center
    px-3 py-1 min-w-[36px] h-[30px]
    bg-slate-800/90
    border border-slate-600
    rounded
    shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_2px_4px_rgba(0,0,0,0.5)]
    transition-all duration-200 ease-in-out
    group-hover:bg-emerald-500/15
    group-hover:border-emerald-400/60
    group-hover:text-emerald-300
    group-hover:shadow-[0_0_8px_rgba(52,211,153,0.12)]
`;

const opcaoClassName = `
    atalho-hover
    group flex items-center gap-2
    rounded-md px-2 py-1
    text-slate-300
    cursor-default
`;

export default function FooterKeybordTeclas() {
    return (
        <>
            <div className="flex items-center justify-center w-full pb-6 pt-6 border-t border-slate-700">
                <div className="w-16 h-px lg:h-[2px] bg-gradient-to-r from-transparent via-slate-600 to-transparent" />

                <span className="text-center font-semibold text-slate-300 px-2">
                    Atalhos de teclado
                </span>

                <div className="w-16 h-px lg:h-[2px] bg-gradient-to-r from-transparent via-slate-600 to-transparent" />
            </div>

            <div className="flex text-[20px] px-1 flex-wrap justify-center items-center gap-x-4 gap-y-2 text-sm">
                <span className={opcaoClassName}>
                    <kbd className={teclaClassName}>
                        <ArrowUp size={18} strokeWidth={2.5} />
                    </kbd>
                    <span>Seta para cima — Lista escolas do projeto</span>
                </span>

                <span className={opcaoClassName}>
                    <kbd className={teclaClassName}>
                        <ArrowDown size={18} strokeWidth={2.5} />
                    </kbd>
                    <span>Seta para baixo — Grade de itens</span>
                </span>

                <span className={opcaoClassName}>
                    <kbd className={teclaClassName}>
                        <ArrowLeft size={18} strokeWidth={2.5} />
                    </kbd>
                    <span>Seta para esquerda — Fechar caixa</span>
                </span>

                <span className={opcaoClassName}>
                    <kbd className={teclaClassName}>
                        <ArrowRight size={18} strokeWidth={2.5} />
                    </kbd>
                    <span>Seta para direita — Confirmar fechar caixa</span>
                </span>

                <span className={opcaoClassName}>
                    <kbd className={`${teclaClassName} text-base`}>,</kbd>
                    <span>Vírgula — Adiciona uma unidade</span>
                </span>

                <span className={opcaoClassName}>
                    <kbd className={`${teclaClassName} text-base`}>.</kbd>
                    <span>Ponto — Subtrai uma unidade</span>
                </span>

                <span className={opcaoClassName}>
                    <kbd className={`${teclaClassName} text-base`}>;</kbd>
                    <span>Ponto e vírgula — Mostra outras caixas com o item</span>
                </span>

                <span className={opcaoClassName}>
                    <kbd className={`${teclaClassName} text-sm`}>Enter</kbd>
                    <span>Enter — Fecha mensagens</span>
                </span>

                <span className={opcaoClassName}>
                    <kbd className={`${teclaClassName} text-sm`}>Esc</kbd>
                    <span>Esc — Cancela fechar caixa</span>
                </span>

                <span className={opcaoClassName}>
                    <kbd className={`${teclaClassName} text-sm`}>PgDn</kbd>
                    <span>Page Down — Lista projetos</span>
                </span>
            </div>
        </>
    );
}
