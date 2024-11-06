export interface SelectedEntiesProps {
    selectedItems: () => void
}

export default function SelectedEnties(props: SelectedEntiesProps){
    return (
        <select className="outline-none flex bg-transparent border cursor-pointer 
        rounded-md p-2 w-full border-zinc-700" name={``} id={``}
            onChange={props.selectedItems}
        >
            <option value="">SELECIONE O PROJETO</option>   
      </select>
    )   
}
