import { RotateCcw } from "react-feather";

interface BotaoEstoqueContabilizacionProps {
    bgColor: string;
    bgHoverColor: string;
    textColor?: string;
    strokeWidth: number;
    iconColor: string;
    iconSize: number;
    stringButtton: string;
    IsOpenStock: boolean;
    updateStockEndEntryInput: () => void,
}


export default function BotaoEstoqueContabilizacion(props: BotaoEstoqueContabilizacionProps) {
    const bgColor = props.bgColor ? props.bgColor : 'bg-emerald-600'
    const bgHoverColor = props.bgHoverColor ? props.bgHoverColor : 'hover:bg-emerald-500'
    const textColor = props.textColor ? props.textColor : 'text-white'
    const arrowColor = props.iconColor ? props.iconColor : 'white'
    const strokeWidth = props.strokeWidth ? props.strokeWidth : 2
    return (
        <button
            type="button"
            onClick={props.updateStockEndEntryInput}  // Use a função onClick passada via props
            className={`px-3 lg:px-4 py-2 lg:py-3 ${bgColor} ${textColor} font-semibold rounded-lg lg:rounded-md 
                flex items-center justify-center gap-x-2 lg:gap-x-3 ${bgHoverColor}
                transition duration-500 w-full lg:w-[215px] h-10 lg:h-[45px] text-xs lg:text-[13px]`}
        >
            <RotateCcw 
                className={`w-3.5 h-3.5 lg:w-5 lg:h-5 ${props.IsOpenStock ? 'animate-rotate' : ''}`}
                color={arrowColor} 
                strokeWidth={strokeWidth} 
            /> 
            <span>{props.stringButtton}</span>
        </button>
    )
}
