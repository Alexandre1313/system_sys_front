import { GradeItem } from "../../../core"
import { concat } from "../../../core/utils/tools"

export interface ItemsGradeTextAreaProps {
    itemSelecionado?: GradeItem
    labelName: string
    value: string | undefined
    color?: string
    colorBorder?: string
}

export default function ItemsGradeTextArea( props : ItemsGradeTextAreaProps) {    
    return (
        <div className="flex flex-col items-start justify-center gap-y-3">
            <label htmlFor={`${concat(props.labelName)}-input`} className="text-left text-[15px] text-zinc-500 tracking-[2px]">
                {props.labelName}
            </label>
            <textarea 
                className={`p-2 w-full text-left text-[27px] bg-transparent rounded-md outline-none pointer-events-none
                            border border-gray-700 ${props.color ? props.color: 'text-cyan-500'} resize-none min-w-[374px] overflow-hidden
                            ${props.colorBorder ? props.colorBorder : 'border-gray-700'}`}
                style={{boxShadow: `inset 2px 2px 4px rgba(0, 0, 0, 0.6),
                        inset -2px -2px 4px rgba(255, 255, 255, 0.05)`.trim(),
                }}
                name={`${concat(props.labelName)}`}
                id={`${concat(props.labelName)}-input`}
                value={props.value}                
                readOnly
                rows={2} 
            />
        </div>
    )
}
