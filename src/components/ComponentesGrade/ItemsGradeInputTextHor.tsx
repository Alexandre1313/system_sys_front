import { GradeItem } from "../../../core"
import { concat } from "../../../core/utils/tools"

export interface ItemsGradeInputTextHorProps {
    itemSelecionado?: GradeItem
    labelName: string
    value: string | undefined
}

export default function ItemsGradeInputTextHor(props: ItemsGradeInputTextHorProps) {
    return (
        <div className="flex items-center justify-center gap-x-3 bg-[#202020] rounded-md px-3">
            <label htmlFor={`${concat(props.labelName)}-input`} className="flex text-left text-[16px]
            text-zinc-500 tracking-[2px]">
                {props.labelName}
            </label>
            <input className="flex p-1 text-left text-[23px] bg-trans rounded-md  
            outline-none text-emerald-500 h-auto max-w-[150px]"
                type="text"
                name={`${concat(props.labelName)}`}
                id={`${concat(props.labelName)}-input`}
                value={props.value}
                readOnly
            />
        </div>
    )
}
