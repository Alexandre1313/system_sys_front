import { ChevronsLeft } from "react-feather";

interface BotaoArrowLeftProps {
    onClick?: () => void
    stringButtton: string
    iconSize: number
    bgColor?: string
    bgHoverColor?:string
    textColor?: string
    arrowColor?: string
    strokeWidth?: number
    shadow?: string
}

export default function BotaoArrowLeft(props: BotaoArrowLeftProps) {
    const bgColor = props.bgColor ? props.bgColor: 'bg-emerald-600'
    const bgHoverColor = props.bgHoverColor ? props.bgHoverColor: 'hover:bg-emerald-500'
    const textColor = props.textColor ? props.textColor: 'text-white'
    const arrowColor = props.arrowColor ? props.arrowColor: 'white'
    const strokeWidth = props.strokeWidth ? props.strokeWidth: 2
    const shadow = props.shadow ? props.shadow : 'shadow-[0px_0px_0px_0px_rgba(0,0,0,0.0)]'
    return (
        <button
            type="button"
            onClick={props.onClick} 
            className={`px-4 py-4 ${bgColor} ${textColor} font-medium rounded-md flex text-[13px] w-[115px]
            items-center justify-center gap-x-3 ${bgHoverColor}
            ${bgHoverColor} transition duration-500 ${shadow}`}
        >
            <ChevronsLeft className="animate-bounceXL" size={props.iconSize} color={arrowColor} strokeWidth={strokeWidth}/> {props.stringButtton}
        </button>
    )
}
