import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp } from "react-feather";

export default function FooterKeybordTeclas() {
    return (
        <>
            <div>
                <div className="flex items-center justify-center w-full pb-6 pt-6 border-t border-slate-700">
                    <div className="w-16 h-px lg:h-[2px] bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
                    <span className="text-center font-semibold">Atalhos de teclado</span>
                    <div className="w-16 h-px lg:h-[2px] bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
                </div>
            </div>
            <div className="flex text-[20px] px-1 flex-wrap justify-center items-center gap-x-4 gap-y-2 text-slate-300 text-sm">
                <span className="flex items-center gap-2">
                    <kbd className="inline-flex items-center justify-center px-3 py-1 min-w-[36px] h-[30px] bg-slate-800 border border-slate-600 rounded text-slate-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_2px_4px_rgba(0,0,0,0.5)]">
                        <ArrowUp size={18} strokeWidth={2.5} />
                    </kbd>
                    <span>Seta para cima — Lista escolas do projeto</span>
                </span>

                <span className="flex items-center gap-2">
                    <kbd className="inline-flex items-center justify-center px-3 py-1 min-w-[36px] h-[30px] bg-slate-800 border border-slate-600 rounded text-slate-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_2px_4px_rgba(0,0,0,0.5)]">
                        <ArrowDown size={18} strokeWidth={2.5} />
                    </kbd>
                    <span>Seta para baixo — Grade de itens</span>
                </span>

                <span className="flex items-center gap-2">
                    <kbd className="inline-flex items-center justify-center px-3 py-1 min-w-[36px] h-[30px] bg-slate-800 border border-slate-600 rounded text-slate-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_2px_4px_rgba(0,0,0,0.5)]">
                        <ArrowLeft size={18} strokeWidth={2.5} />
                    </kbd>
                    <span>Seta para esquerda — Fechar caixa</span>
                </span>

                <span className="flex items-center gap-2">
                    <kbd className="inline-flex items-center justify-center px-3 py-1 min-w-[36px] h-[30px] bg-slate-800 border border-slate-600 rounded text-slate-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_2px_4px_rgba(0,0,0,0.5)]">
                        <ArrowRight size={18} strokeWidth={2.5} />
                    </kbd>
                    <span>Seta para direita — Confirmar fechar caixa</span>
                </span>

                <span className="flex items-center gap-2">
                    <kbd className="inline-flex items-center justify-center px-3 py-1 min-w-[36px] h-[30px] bg-slate-800 border border-slate-600 rounded text-slate-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_2px_4px_rgba(0,0,0,0.5)] text-base">
                        ,
                    </kbd>
                    <span>Vírgula — Adiciona uma unidade</span>
                </span>

                <span className="flex items-center gap-2">
                    <kbd className="inline-flex items-center justify-center px-3 py-1 min-w-[36px] h-[30px] bg-slate-800 border border-slate-600 rounded text-slate-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_2px_4px_rgba(0,0,0,0.5)] text-base">
                        .
                    </kbd>
                    <span>Ponto — Subtrai uma unidade</span>
                </span>

                <span className="flex items-center gap-2">
                    <kbd className="inline-flex items-center justify-center px-3 py-1 min-w-[36px] h-[30px] bg-slate-800 border border-slate-600 rounded text-slate-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_2px_4px_rgba(0,0,0,0.5)] text-sm">
                        Enter
                    </kbd>
                    <span>Enter — Fecha mensagens</span>
                </span>

                <span className="flex items-center gap-2">
                    <kbd className="inline-flex items-center justify-center px-3 py-1 min-w-[36px] h-[30px] bg-slate-800 border border-slate-600 rounded text-slate-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_2px_4px_rgba(0,0,0,0.5)] text-sm">
                        Esc
                    </kbd>
                    <span>Esc — Cancela fechar caixa</span>
                </span>

                <span className="flex items-center gap-2">
                    <kbd className="inline-flex items-center justify-center px-3 py-1 min-w-[36px] h-[30px] bg-slate-800 border border-slate-600 rounded text-slate-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_2px_4px_rgba(0,0,0,0.5)] text-sm">
                        PgDn
                    </kbd>
                    <span>Page Down — Lista projetos</span>
                </span>

            </div>
        </>
    )
}
