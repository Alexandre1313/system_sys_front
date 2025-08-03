import { GradeItem } from "../../../core"
import { concat } from "../../../core/utils/tools"

export interface ItemsGradeLinkTextHorProps {
    itemSelecionado?: GradeItem;
    labelName: string;
    value: string;
    baseUrl: string;
    color?: string
}

export default function ItemsGradeLinkTextHor(props: ItemsGradeLinkTextHorProps) {
    const link = props.value ? `${props.baseUrl}/${props.value}` : "#"

    return (
        <div className="flex items-center justify-start gap-x-3 
         bg-gradient-to-r from-[#1d1818] to-transparent px-3 min-w-[150px]">

            <label htmlFor={`${concat(props.labelName)}-link`} className="flex text-left text-[16px]
        text-zinc-500 tracking-[2px]">
                {props.labelName}
            </label>

            <a
                id={`${concat(props.labelName)}-link`}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center p-1 text-left text-[26px] 
                            ${props.color ? props.color: 'text-indigo-500'} bg-transparent rounded-md h-auto min-w-[150px] 
                            hover:underline focus:outline-none cursor-pointer`}
                style={{ fontFamily: 'inherit', textDecoration: 'none' }}
            >
                {props.value}
            </a>
        </div>
    )
}
