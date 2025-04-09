import { useEffect, useRef } from "react";
import { Box } from "react-feather";

interface BotaoBoxProps {
    onClick?: () => void; // Define a prop onClick que o componente pai deve passar
    stringButtton: string
    iconSize: number
    bgColor?: string
    bgHoverColor?: string
    textColor?: string
    arrowColor?: string
    strokeWidth?: number
    shadow?: string
}

export default function BotaoBox(props: BotaoBoxProps) {
    const btnRef = useRef<HTMLButtonElement>(null);   

    // Adiciona o evento de keydown quando o componente for montado
    useEffect(() => {
        // Adiciona o ouvinte de evento global para a tecla "Enter"
        const handleGlobalKeyDown = (event: KeyboardEvent) => {
            if (event.key === "ArrowLeft") {
                if (btnRef.current) {
                    btnRef.current.click(); // Simula o clique no botão
                }
            }
        };

        // Adiciona o evento para o evento global de keydown
        window.addEventListener("keydown", handleGlobalKeyDown);

        // Limpa o evento quando o componente for desmontado
        return () => {
            window.removeEventListener("keydown", handleGlobalKeyDown);
        };
    }, []); // Esse useEffect é executado uma vez quando o componente é montado

    const bgColor = props.bgColor ? props.bgColor : 'bg-emerald-600';
    const bgHoverColor = props.bgHoverColor ? props.bgHoverColor : 'hover:bg-emerald-500';
    const textColor = props.textColor ? props.textColor : 'text-white';
    const arrowColor = props.arrowColor ? props.arrowColor : 'white';
    const strokeWidth = props.strokeWidth ? props.strokeWidth : 2;
    const shadow = props.shadow ? props.shadow : 'shadow-[0px_0px_0px_0px_rgba(0,0,0,0.0)]';

    return (
        <button
            ref={btnRef} // Referência para o botão
            type="button"
            onClick={props.onClick} // Use a função onClick passada via props
            className={`px-4 py-4 ${bgColor} ${textColor} font-medium rounded-md flex text-[13px]
            items-center justify-center gap-x-3 ${bgHoverColor}
            transition duration-500 ${shadow}`}
        >
            <Box className={"animate-bounceY"} size={props.iconSize} color={arrowColor} strokeWidth={strokeWidth} />
            {props.stringButtton}
        </button>
    );
}
