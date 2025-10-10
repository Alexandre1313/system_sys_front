import { GradeItem } from "../../../core"
import { concat } from "../../../core/utils/tools"

export interface ItemsEntryImputTextProps {
    itemSelecionado?: GradeItem
    labelName: string
    value: string | undefined
}

export default function ItemsEntryImputText( props : ItemsEntryImputTextProps) {    
    return (
        <div className="flex flex-col items-start justify-center gap-y-1.5 lg:gap-y-3">
            <label htmlFor={`${concat(props.labelName)}-input`} className="flex text-left text-[10px] lg:text-[13px]
            text-zinc-500 tracking-[1px] lg:tracking-[2px]">
                {props.labelName}
            </label>
            <input className="flex p-1.5 lg:p-2 w-full text-left text-base lg:text-[27px] bg-trans rounded-md  
            outline-none border border-gray-700 text-zinc-400 h-9 lg:h-[50px] min-w-0 pointer-events-none"
                type="text"
                name={`${concat(props.labelName)}`}
                id={`${concat(props.labelName)}-input`}
                value={props.value}
                readOnly
            />
        </div>
    )
}
