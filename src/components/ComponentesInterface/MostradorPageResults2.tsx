interface MostradorPageResults2Props {
    tema?: boolean;
    title?: string;
    valor?: string;
    valorColor?: string;
}

export default function MostradorPageResults2({ tema, title, valor, valorColor }: MostradorPageResults2Props) {
    const theme = tema ? {
        title: 'text-[18px] text-black',
        value: 'text-[18px]',
        valueColor: valorColor ? valorColor : 'text-black',
        divGeral: 'border-slate-400',
    } : {
        title: 'text-[18px] text-slate-400',
        value: 'text-[18px]',
        valueColor: valorColor ? valorColor : 'text-slate-400',
        divGeral: 'border-slate-700',
    }

    return (
        <div className={`flex flex-col w-auto h-[70px] box-border p-2 rounded-md border-l z-15 ${theme.divGeral}`}>
            <span className={`${theme.title}`}>{title}</span>
            <span className={`${theme.value} ${theme.valueColor}`}>{valor}</span>
        </div>
    )
}
