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
            className={`px-4 py-4 ${bgColor} ${textColor} font-medium rounded-md flex text-[13px] w-[215px]
                items-center justify-center gap-x-3 ${bgHoverColor}
                ${bgHoverColor} transition duration-500`}
        >
            <RotateCcw className={props.IsOpenStock ? 'animate-rotate': ''} size={props.iconSize} color={arrowColor} strokeWidth={strokeWidth} /> {props.stringButtton}
        </button>
    )
}
