interface MostradorPageResultsProps {
    tema?: boolean;
    title?: string;
    valor?: string;
    valorColor?: string;
}

export default function MostradorPageResults({ tema, title, valor, valorColor }: MostradorPageResultsProps) {
    const theme = tema ? {
        title: 'text-[18px] text-black',
        value: 'text-[18px]',
        valueColor: valorColor ? valorColor : 'text-black',
          divGeral: 'border-slate-400 bg-gradient-to-r from-slate-100 to-transparent',
    } : {
        title: 'text-[18px] text-slate-400',
        value: 'text-[18px]',
        valueColor: valorColor ? valorColor : 'text-slate-400',
        divGeral: 'border-slate-700 bg-gradient-to-r from-slate-800 to-transparent',
    }

    return (
        <div className={`flex flex-col w-full h-[70px] pl-4 rounded-md ${theme.divGeral}`}>
            <span className={`${theme.title}`}>{title}</span>
            <span className={`${theme.value} ${theme.valueColor}`}>{valor}</span>
        </div>
    )
}
