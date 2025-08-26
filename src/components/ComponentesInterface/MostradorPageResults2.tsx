'use client'

import { useEffect, useState } from 'react'

interface MostradorPageResults2Props {
    tema?: boolean;
    title?: string;
    valor?: string;
    valorColor?: string;
    isBlink?: boolean; // <-- nome mais claro
}

export default function MostradorPageResults2({ tema, title, valor, valorColor, isBlink }: MostradorPageResults2Props) {
    const [blink, setBlink] = useState(false);

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;

        if (isBlink) {
            interval = setInterval(() => {
                setBlink(prev => !prev);
            }, 1000); // Pisca a cada 1 segundo
        } else {
            setBlink(false); // Garante que fique estático se o piscar for desativado
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isBlink]); // <-- adicione a dependência!

    const theme = tema ? {
        title: 'text-[18px] text-black',
        value: 'text-[18px]',
        valueColor: valorColor || 'text-black',
        divGeral: 'border-slate-400',
    } : {
        title: 'text-[18px] text-slate-400',
        value: 'text-[18px]',
        valueColor: valorColor || 'text-slate-400',
        divGeral: 'border-slate-700',
    }

    const blinkingBackground = blink ? 'bg-green-700 bg-opacity-30' : 'bg-green-600 bg-opacity-30';

    return (
        <div className={`flex flex-col w-auto h-[70px] box-border
                        ${isBlink ? blinkingBackground : 'bg-green-700 bg-opacity-30'}
                        hover:bg-orange-600 hover:bg-opacity-30 p-2 rounded-md border-l z-15 ${theme.divGeral}`}>
            <span className={theme.title}>{title}</span>
            <span className={`${theme.value} ${theme.valueColor}`}>{valor}</span>
        </div>
    )
}
