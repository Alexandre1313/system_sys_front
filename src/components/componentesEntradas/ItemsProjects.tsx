import { ItensProjects } from "../../../core";

export interface ItemsProjectsProps {
  item: ItensProjects;
  embalagemId: number | undefined;
  itemTamanhoId: number;
  index: number;
  onClick: (item: ItensProjects, embalagemId: number | undefined, itemTamanhoId: number) => void;
  mutationAll?: () => void;
}

export default function ItemsProjects({ onClick, item, index, embalagemId, itemTamanhoId }: ItemsProjectsProps) {
  const itemSelect = item;
  const itemGenero = item.genero;
  const itemNome = itemSelect.nome;
  const itemTamanho = itemSelect.tamanho;
  const itemBarcode = itemSelect.barcode;
  const itemTamId = itemSelect.id;
  const bgColor = index % 2 === 0 ? `bg-slate-700/20` : ``;
  
  return (
    <div
      onClick={() => onClick(item, embalagemId, itemTamanhoId)}
      className={`group flex flex-col sm:flex-row justify-between items-start sm:items-center w-full border border-slate-700/50 hover:border-emerald-500/50 hover:bg-emerald-500/5 rounded-xl p-4 transition-all duration-300 cursor-pointer ${bgColor}`}
    >
      {/* Informações Principais */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 w-full">
        {/* ID do Item */}
        <div className="flex items-center space-x-2">
          <span className="text-slate-500 text-xs lg:text-sm font-medium">ID:</span>
          <span className="text-slate-300 text-xs lg:text-sm font-mono group-hover:text-emerald-400 transition-colors duration-300">
            {itemTamId}
          </span>
        </div>

        {/* Nome do Item */}
        <div className="flex items-center space-x-2">
          <span className="text-slate-500 text-xs lg:text-sm font-medium">Item:</span>
          <span className="text-white text-xs lg:text-sm font-medium group-hover:text-emerald-400 transition-colors duration-300 truncate max-w-[150px] lg:max-w-[200px]" title={itemNome}>
            {itemNome}
          </span>
        </div>

        {/* Gênero */}
        <div className="flex items-center space-x-2">
          <span className="text-slate-500 text-xs lg:text-sm font-medium">Gênero:</span>
          <span className="text-slate-300 text-xs lg:text-sm group-hover:text-emerald-400 transition-colors duration-300">
            {itemGenero}
          </span>
        </div>
      </div>

      {/* Informações Secundárias */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 w-full sm:w-auto mt-3 sm:mt-0">
        {/* Tamanho */}
        <div className="flex items-center space-x-2">
          <span className="text-slate-500 text-xs lg:text-sm font-medium">Tamanho:</span>
          <span className="text-cyan-400 text-sm lg:text-xl font-extralight group-hover:text-cyan-300 group-hover:scale-110 transition-all duration-300">
            {itemTamanho}
          </span>
        </div>

        {/* Código de Barras */}
        <div className="flex items-center space-x-2">
          <span className="text-slate-500 text-xs lg:text-sm font-medium">Código:</span>
          <span className="text-yellow-400 text-xs lg:text-xl font-extralight group-hover:text-yellow-300 group-hover:scale-105 transition-all duration-300" title={itemBarcode}>
            {itemBarcode}
          </span>
        </div>
      </div>

      {/* Indicador de Clique */}
      <div className="hidden sm:flex items-center justify-center w-8 h-8 rounded-full bg-slate-700/50 group-hover:bg-emerald-500/20 transition-all duration-300 ml-4">
        <div className="w-2 h-2 rounded-full bg-slate-400 group-hover:bg-emerald-400 transition-colors duration-300"></div>
      </div>
    </div>
  );
}
