import { GradeItem } from "../../../core"
import { concat } from "../../../core/utils/tools"

export interface ItemsGradeInputTextMobilProps {
    itemSelecionado?: GradeItem
    labelName: string
    value: string | undefined
    color?: string
    bgColor?: string
}

export default function ItemsGradeInputTextMobil(props: ItemsGradeInputTextMobilProps) {
    return (
        <div className="flex flex-col items-start justify-center gap-y-3">
            <label htmlFor={`${concat(props.labelName)}-input`} className="flex text-left text-[10px]
            text-zinc-500 tracking-[2px]">
                {props.labelName}
            </label>
            <input className={`flex p-2 w-full text-left text-[15px] bg-trans rounded-md  
            outline-none border border-gray-700 ${props.color ? props.color : 'text-cyan-500'} h-[25px] grade-input-responsive pointer-events-none`}
                style={{
                    backgroundColor: props.bgColor ?? 'transparent',
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
