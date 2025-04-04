import { getRemessasGrades } from "@/hooks_api/api";

interface CreateServerSelectComponentRemessaProps {
  onSelectChange: (RemessaSelected: number) => void;
  projectId: number | null;
}

export async function CreateServerSelectComponentRemessa({ onSelectChange, projectId }: CreateServerSelectComponentRemessaProps) {
  const dates = await getRemessasGrades(projectId);

  return (
    <div className={`flex flex-col justify-center items-start`}>
      <select
        id="select-remessas"
        title="Selecione a remessa preferida"
        className={`flex w-[310px] bg-[#181818] py-2 px-3 text-[14px] text-zinc-400 no-arrow
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
