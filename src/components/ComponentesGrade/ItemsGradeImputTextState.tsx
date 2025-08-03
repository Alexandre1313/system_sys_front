import { concat } from "../../../core/utils/tools";

export interface ItemGradeInputTextStateProps {
    formData: { [key: string]: string }; // Estado do pai passado como objeto
    labelName: string;
    isReadOnly?: boolean; 
    placeholder?: string;
    txtSize?: string;
    isFocus?: string;
    labelColor?: string;
    valueColor?: string;
    positionn?: string;
    labelposition?: string;
    bgBackGround?: string;
    maxWhidth?: string;
    height?: string;
    colorBorder?: string;
    setFormData: (key: string, value: any) => void; // Função que atualiza o estado no pai   
}

export default function ItemGradeInputTextState(props: ItemGradeInputTextStateProps) {
    // Acessar o valor correto do formData usando o labelName como chave   
    const labelName = concat(props.labelName);
    const value = props.formData[labelName] || "";

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {       
        const { value } = event.target;      
        props.setFormData(labelName, value);            
    };

    return (
        <div className="flex flex-col items-start justify-center gap-y-3 w-full">
            <label
                htmlFor={`${labelName}-input`}
                className={`flex ${props.labelposition ? props.labelposition: 'justify-end'} w-full text-[15px]
                ${props.labelColor ? props.labelColor: 'text-zinc-400'} tracking-[2px]`}
            >
                {props.labelName}
            </label>
            <input
                className={`flex p-2 ${props.maxWhidth ? props.maxWhidth: 'w-full'} text-left ${props.txtSize ? props.txtSize: 'text-[27px]'}
                ${props.bgBackGround ? props.bgBackGround : 'bg-trans'}
                ${props.isFocus ? props.isFocus: 'outline-none  pointer-events-none'} 
                rounded-md  border h-[50px] min-w-[374px] ${props.positionn ? props.positionn: 'text-right'} bg-opacity-30
                ${props.valueColor ? props.valueColor: 'text-green-400'} 
                placeholder:text-[rgba(333,333,333,0.1)] ${props.height ? props.height: ''}
                ${props.colorBorder ? props.colorBorder: 'border-gray-700'}`}
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
