import { ItensProjects } from "../../../core";

export interface ItemsProjectsProps {
  item: ItensProjects;
  embalagemId: number | undefined;
  itemTamanhoId: number;
  onClick: (item: ItensProjects, embalagemId: number | undefined , itemTamanhoId: number) => void;  
  mutationAll?: () => void;
}

export default function ItemsProjects({ onClick, item, embalagemId, itemTamanhoId }: ItemsProjectsProps) {
  const itemSelect = item;
  const itemGenero = item.genero;
  const itemNome = itemSelect.nome;
  const itemTamanho = itemSelect.tamanho;
  const itemBarcode = itemSelect.barcode;
  const classColor =
    itemGenero === 'FEMININO'
      ? 'text-zinc-300'
      : itemGenero === 'MASCULINO'
      ? 'text-blue-500'
      : 'text-yellow-500';
  return (
    <div
      onClick={() => onClick(item, embalagemId, itemTamanhoId)} // Passando o item como argumento para a função `onClick`
      className={`flex justify-start items-center w-full border-[0.001em] hover:bg-green-600 hover:bg-opacity-30
            border-zinc-900 p-[0.30rem] rounded-md cursor-pointer`}
    >
      <div className={`flex justify-start items-start gap-x-4 w-[35%]`}>
        <span className={`text-[14px] text-zinc-500`}>ITEM:</span>
        <span className={`text-[14px] ${classColor}`}>{itemNome}</span>
      </div>
      <div className={`flex justify-start items-start gap-x-4 w-[20%]`}>
        <span className={`text-[14px] text-zinc-500`}>GÊNERO:</span>
        <span className={`text-[14px] ${classColor}`}>{itemGenero}</span>
      </div>
      <div className={`flex justify-start items-start gap-x-4 w-[20%]`}>
        <span className={`text-[14px] text-zinc-500`}>TAMANHO:</span>
        <span className={`text-[14px] ${classColor}`}>{itemTamanho}</span>
      </div>
      <div className={`flex justify-start items-start gap-x-4 w-[25%]`}>
        <span className={`text-[14px] text-zinc-500`}>CÓDIGO DE BARRAS:</span>
        <span className={`text-[14px] ${classColor}`}>{itemBarcode}</span>
      </div>
    </div>
  );
}
