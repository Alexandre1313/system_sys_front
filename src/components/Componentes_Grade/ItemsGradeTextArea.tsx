import { GradeItem } from "../../../core"
import { concat } from "../../../core/utils/tools"

export interface ItemsGradeInputTextProps {
    itemSelecionado?: GradeItem
    labelName: string
    value: string | undefined
}

export default function ItemsGradeInputText( props : ItemsGradeInputTextProps) {    
    return (
        <div className="flex flex-col items-start justify-center gap-y-3">
            <label htmlFor={`${concat(props.labelName)}-input`} className="text-left text-[15px] text-zinc-400 tracking-[2px]">
                {props.labelName}
            </label>
            <textarea 
                className="p-2 w-full text-left text-[27px] bg-transparent rounded-md outline-none border border-gray-700 text-cyan-500 resize-none min-w-[374px] overflow-hidden"
                name={`${concat(props.labelName)}`}
                id={`${concat(props.labelName)}-input`}
                value={props.value}
                readOnly
                rows={2} 
            />
        </div>
    )
}
