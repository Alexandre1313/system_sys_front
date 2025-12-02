import { GradeItem } from "../../../core"
import { concat } from "../../../core/utils/tools"

export interface ItemsGradeInputText2Props {
    itemSelecionado?: GradeItem;
    qtyCaixa: number; 
    labelName: string;
    value: number;
    color?: string;
    bgColor?: string;
}

export default function ItemsGradeInputText2(props: ItemsGradeInputText2Props) {
    const value = `${props.value - props.qtyCaixa}` || "";    
    return (
        <div className="flex flex-col items-start justify-center gap-y-3">
            <label htmlFor={`${concat(props.labelName)}-input`} className="flex text-left text-[15px]
            text-zinc-500 tracking-[2px]">
                {props.labelName}
            </label>
            <input className={`flex p-2 w-full text-left text-[27px] bg-trans rounded-md  
            outline-none border border-gray-700 ${props.color ? props.color : 'text-cyan-500'}            
            h-[50px] grade-input-responsive pointer-events-none`}
                style={{
                    backgroundColor: props.bgColor ?? 'transparent',
                }}
                type="text"
                name={`${concat(props.labelName)}`}
                id={`${concat(props.labelName)}-input`}
                value={value}
                readOnly
            />
        </div>
    )
}
