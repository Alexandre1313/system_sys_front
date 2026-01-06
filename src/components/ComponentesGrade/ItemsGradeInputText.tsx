import { GradeItem } from "../../../core"
import { concat } from "../../../core/utils/tools"

export interface ItemsGradeInputTextProps {
    itemSelecionado?: GradeItem;
    labelName: string;
    value: string | undefined;
    color?: string;
    bgColor?: string;
    positionn?: string;
    labelposition?: string;
    border_col?: string;
    labelColor?: string;
    opacit?: string;
    height?: string;
    txtSize?: string;
}

export default function ItemsGradeInputText(props: ItemsGradeInputTextProps) {
    return (
        <div className={`flex flex-col items-start justify-center gap-y-3 ${props.opacit ? props.opacit: 'opacity-100'}`}>
            <label htmlFor={`${concat(props.labelName)}-input`} className={`flex w-full text-[15px]
            ${props.labelColor ? props.labelColor: 'text-zinc-500'} tracking-[2px] ${props.labelposition ? props.labelposition : 'justify-start'}`}>
                {props.labelName}
            </label>
            <input className={`flex p-2 w-full text-left bg-trans rounded-md
            outline-none border ${props.border_col ? props.border_col : 'border-gray-700'} ${props.color ? props.color : 'text-cyan-500'}            
            grade-input-responsive pointer-events-none ${props.positionn ? props.positionn : 'text-left'}
            ${props.height ? props.height : 'h-[50px]'} ${props.txtSize ? props.txtSize : 'text-[27px]'}`}
                style={{
                    backgroundColor: props.bgColor ?? 'transparent',
                    boxShadow: `inset 2px 2px 4px rgba(0, 0, 0, 0.6),
                                inset -2px -2px 4px rgba(255, 255, 255, 0.05)`.trim(),
                }}

                type="text"
                name={`${concat(props.labelName)}`}
                id={`${concat(props.labelName)}-input`}
                value={props.value}
                readOnly
            />
        </div>
    )
}
