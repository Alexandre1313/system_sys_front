import { getRemessasGrades } from "@/hooks_api/api";

interface CreateServerSelectComponentRemessaProps {
  onSelectChange: (RemessaSelected: number) => void;
  projectId: number | null;
  color?: boolean;
}

export async function CreateServerSelectComponentRemessa({ onSelectChange, projectId, color }: CreateServerSelectComponentRemessaProps) {
  const dates = await getRemessasGrades(projectId);
  const newColor = color ? 'bg-[#f7f7f7] text-zinc-950': 'bg-[#181818] text-zinc-400';

  return (
    <div className={`flex flex-col justify-center items-start`}>
      <select
        id="select-remessas"
        title="Selecione a remessa preferida"
        className={`flex w-[310px] py-2 px-3 text-[14px] no-arrow ${newColor}
                        outline-none cursor-pointer h-[35px] border border-zinc-800`}
        onChange={(event) => {
          const remessaValue = Number(event.target.value);
          onSelectChange(remessaValue); // Chama o manipulador ao mudar a seleção
        }}
      >
        <option value="">SELECIONE A REMESSA</option>
        {dates.map((r, index) => (
          <option key={index} value={Number(r)}>{`REMESSA: ${r}`}</option>
        ))}
        {dates.length > 0 && (
          <option value="-1">TODAS AS REMESSAS</option>
        )}
      </select>
    </div>
  );
}
