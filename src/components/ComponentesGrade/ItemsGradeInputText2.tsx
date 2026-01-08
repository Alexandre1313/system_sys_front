import { GradeItem } from "../../../core"
import { concat } from "../../../core/utils/tools"
import { Icon } from 'react-feather';

export interface ItemsGradeInputText2Props {
    itemSelecionado?: GradeItem;
    qtyCaixa: number; 
    labelName: string;
    value: number;
    // estilo
    color?: string;
    bgColor?: string;
    positionn?: string;
    labelposition?: string;
    border_col?: string;
    opacit?: string;
    // novo
    rightIcon?: Icon;
    onRightIconClick?: () => void;
}

export default function ItemsGradeInputText2(props: ItemsGradeInputText2Props) {
    const value = `${props.value - props.qtyCaixa}` || "";
    const RightIcon = props.rightIcon;

    return (
        <div className={`flex flex-col gap-y-3 ${props.opacit ?? 'opacity-100'}`}>
            <label
                htmlFor={`${concat(props.labelName)}-input`}
                className={`flex text-[15px] w-full text-zinc-500 tracking-[2px]
                ${props.labelposition ?? 'justify-start'}`}
            >
                {props.labelName}
            </label>

            {/* wrapper RELATIVE */}
            <div className="relative w-full">
                <input
                    className={`
                        w-full h-[50px] p-2 pr-12 text-[27px] rounded-md
                        outline-none border pointer-events-none
                        ${props.border_col ?? 'border-gray-700'}
                        ${props.color ?? 'text-cyan-500'}
                        ${props.positionn ?? 'text-left'}
                    `}
                    style={{
                        backgroundColor: props.bgColor ?? 'transparent',
                        boxShadow: `
                            inset 2px 2px 4px rgba(0,0,0,0.6),
                            inset -2px -2px 4px rgba(255,255,255,0.05)
                        `,
                    }}
                    type="text"
                    id={`${concat(props.labelName)}-input`}
                    value={value}
                    readOnly
                />

                {/* ÍCONE À DIREITA */}
                {RightIcon && (
                    <button
                        type="button"
                        onClick={props.onRightIconClick}
                        className="
                            absolute right-3 top-1/2 -translate-y-1/2
                            text-zinc-600 hover:text-zinc-200
                            transition-colors
                        "
                        tabIndex={-1}
                    >
                        <RightIcon size={20} />
                    </button>
                )}
            </div>
        </div>
    );
}
