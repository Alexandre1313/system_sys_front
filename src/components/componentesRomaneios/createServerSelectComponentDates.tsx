import { getDatesGrades } from "@/hooks_api/api";
import { convertSPTime } from "../../../core/utils/tools";

interface CreateServerSelectComponentDatesProps {
  onSelectChange: (dateSelected: string) => void;
  projectId: number | null;
}

export async function CreateServerSelectComponentDates({ onSelectChange, projectId }: CreateServerSelectComponentDatesProps) {
  const dates = await getDatesGrades(projectId);

  return (
    <div className={`flex flex-col justify-center items-start`}>     
      <select
        id="select-dates"
        title="Selecione a data preferida"
        className={`flex w-[310px] bg-[#181818] py-2 px-3 text-[14px] text-zinc-400 no-arrow
                        outline-none cursor-pointer h-[35px] border border-zinc-800`}
        onChange={(event) => {
          const dateValue = event.target.value;
          onSelectChange(dateValue); // Chama o manipulador ao mudar a seleção
        }}
      >
        <option value="">SELECIONE A DATA</option>
        {dates.map((d, index) => (
          <option key={index} value={String(d)}>
            {convertSPTime(String(d))}
          </option>
        ))}
      </select>
    </div>
  );
}
