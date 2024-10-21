import { concat } from "../../../core/utils/tools";

export interface ItemGradeInputTextStateProps {
    formData: { [key: string]: string }; // Estado do pai passado como objeto
    labelName: string;
    setFormData: (key: string, value: string) => void; // Função que atualiza o estado no pai
}

export default function ItemGradeInputTextState(props: ItemGradeInputTextStateProps) {
    // Acessar o valor correto do formData usando o labelName como chave
    const value = props.formData[props.labelName] || "";

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        // Chamar a função do pai passando o valor e a chave
        props.setFormData(props.labelName, value);
    };

    return (
        <div className="flex flex-col items-start justify-center gap-y-3">
            <label
                htmlFor={`${concat(props.labelName)}-input`}
                className="flex text-left text-[15px] text-zinc-400 tracking-[2px]"
            >
                {props.labelName}
            </label>
            <input
                className="flex p-2 w-full text-left text-[30px] bg-trans rounded-md outline-none border border-gray-600 text-green-500"
                type="text"
                name={`${concat(props.labelName)}`}
                id={`${concat(props.labelName)}-input`}
                value={value} // Usando o valor do estado do pai
                onChange={handleInputChange} // Atualiza o estado no pai quando o valor mudar
            />
        </div>
    );
}
