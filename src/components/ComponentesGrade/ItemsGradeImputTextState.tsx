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
    tot?: string;
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
                className={`flex ${props.labelposition ? props.labelposition : 'justify-end'} w-full text-[15px]
                ${props.labelColor ? props.labelColor : 'text-zinc-500'} tracking-[2px]`}
            >
                {props.labelName}
            </label>
            <div className="relative">
                <input
                    className={`flex p-2 ${props.maxWhidth ? props.maxWhidth : 'w-full'} text-left ${props.txtSize ? props.txtSize : 'text-[27px]'}
                    ${props.bgBackGround ? props.bgBackGround : 'bg-trans'}
                    ${props.isFocus ? props.isFocus : 'outline-none  pointer-events-none'} 
                    rounded-md  border h-[50px] grade-input-responsive ${props.positionn ? props.positionn : 'text-right'} bg-opacity-30
                    ${props.valueColor ? props.valueColor : 'text-green-400'} 
                    placeholder:text-[rgba(333,333,333,0.1)] ${props.height ? props.height : ''}
                    ${props.colorBorder ? props.colorBorder : 'border-gray-700'}`}
                    type="text"
                    placeholder={props.placeholder}
                    readOnly={props.isReadOnly}
                    name={`${labelName}`}
                    id={`${labelName}-input`}
                    value={value}
                    onChange={handleInputChange}
                />

                {/* Overlay com posicionamento baseado no valor */}
                {props.tot && (
                    <div
                        className="absolute inset-0 flex items-center pointer-events-none"
                        style={{
                            paddingLeft: `calc(4rem + ${value.toString().length * 1}ch)` // Ajuste baseado no tamanho do texto
                        }}
                    >
                        <span className="text-blue-500 text-[20px] pr-[0.6rem]">
                            de
                        </span>
                        <span className={`${props.txtSize ? props.txtSize : 'text-[27px]'} text-orange-400`}>
                            {props.tot}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
