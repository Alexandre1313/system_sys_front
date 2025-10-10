import { concat } from "../../../core/utils/tools";

export interface ItemsEntryImputTextStateProps {
    formData: { [key: string]: string }; // Estado do pai passado como objeto
    labelName: string;
    isReadOnly?: boolean; 
    placeholder?: string;
    txtSize?: string;
    isFocus?: string;
    labelColor?: string;
    valueColor?: string;
    setFormData: (key: string, value: any) => void; // Função que atualiza o estado no pai
   
}

export default function ItemsEntryImputTextState(props: ItemsEntryImputTextStateProps) {
    // Acessar o valor correto do formData usando o labelName como chave   
    const labelName = concat(props.labelName);
    const value = props.formData[labelName] || "";

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {       
        const { value } = event.target;      
        props.setFormData(labelName, value);            
    };

    return (
        <div className="flex flex-col items-start justify-center gap-y-1.5 lg:gap-y-3">
            <label
                htmlFor={`${labelName}-input`}
                className={`flex text-left text-[10px] lg:text-[13px]
                ${props.labelColor ? props.labelColor: 'text-zinc-400'} tracking-[1px] lg:tracking-[2px]`}
            >
                {props.labelName}
            </label>
            <input
                className={`flex p-1.5 lg:p-2 w-full text-left ${props.txtSize ? props.txtSize: 'text-base lg:text-[27px]'} 
                ${props.isFocus ? props.isFocus: 'outline-none'} 
                bg-trans rounded-md border h-9 lg:h-[50px] min-w-0
                border-gray-700 ${props.valueColor ? props.valueColor: 'text-green-400'} 
                placeholder:text-[rgba(333,333,333,0.2)]`}
                type="text"   
                placeholder={props.placeholder}  
                readOnly={props.isReadOnly}           
                name={`${labelName}`}
                id={`${labelName}-input`}
                value={value} // Usando o valor do estado do pai
                onChange={handleInputChange} // Atualiza o estado no pai quando o valor mudar
            />
        </div>
    );
}
