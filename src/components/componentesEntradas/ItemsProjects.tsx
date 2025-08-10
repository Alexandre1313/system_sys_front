import { ItensProjects } from "../../../core";

export interface ItemsProjectsProps {
  item: ItensProjects;
  embalagemId: number | undefined;
  itemTamanhoId: number;
  index: number;
  onClick: (item: ItensProjects, embalagemId: number | undefined , itemTamanhoId: number) => void;  
  mutationAll?: () => void;
}

export default function ItemsProjects({ onClick, item, index, embalagemId, itemTamanhoId }: ItemsProjectsProps) {
  const itemSelect = item;
  const itemGenero = item.genero;
  const itemNome = itemSelect.nome;
  const itemTamanho = itemSelect.tamanho;
  const itemBarcode = itemSelect.barcode;
  const bgColor = index % 2 === 0 ? `bg-gray-400 bg-opacity-10`: ``;
  const classColor =
    itemGenero === 'FEMININO'
      ? 'text-zinc-300'
      : itemGenero === 'MASCULINO'
      ? 'text-zinc-300'
      : 'text-zinc-300';
  return (
    <div
      onClick={() => onClick(item, embalagemId, itemTamanhoId)} // Passando o item como argumento para a função `onClick`
      className={`group flex justify-start items-center w-full border-[0.000em] hover:bg-green-500 hover:bg-opacity-20
            border-zinc-900 p-[0.60rem] rounded-md cursor-pointer ${bgColor}`}
    >
      <div className={`flex justify-start items-start gap-x-4 w-[35%] text-zinc-500`}>
        <span className={`text-[14px]`}>ITEM:</span>
        <span className={`text-[14px] ${classColor}`}>{itemNome}</span>
      </div>
      <div className={`flex justify-start items-start gap-x-4 w-[20%] text-zinc-500`}>
        <span className={`text-[14px] text-zinc-500`}>GÊNERO:</span>
        <span className={`text-[14px] ${classColor}`}>{itemGenero}</span>
      </div>
      <div className={`flex justify-start items-center gap-x-4 w-[20%] text-zinc-500`}>
        <span className={`text-[14px] text-zinc-500`}>TAMANHO:</span>
        <span className={`text-[17px] ${classColor} group-hover:text-cyan-500`}>{itemTamanho}</span>
      </div>
      <div className={`flex justify-start items-center gap-x-4 w-[25%] text-zinc-500`}>
        <span className={`text-[14px] text-zinc-500`}>CÓDIGO DE BARRAS:</span>
        <span className={`text-[17px] font-thin ${classColor} group-hover:text-yellow-500`}>{itemBarcode}</span>
      </div>
    </div>
  );
}
