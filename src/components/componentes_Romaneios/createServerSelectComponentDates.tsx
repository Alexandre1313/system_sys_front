import { getDatesGrades } from "@/hooks_api/api";
import { convertSPTime } from "../../../core/utils/tools";

interface CreateServerSelectComponentDatesProps {
  onSelectChange: (dateSelected: string) => void;
  projectId: number | null;
}

export async function CreateServerSelectComponentDates({ onSelectChange, projectId }: CreateServerSelectComponentDatesProps) {
  const dates = await getDatesGrades(projectId);

  return (
    <div className={`flex flex-col justify-center items-start gap-y-1 w-[350px]`}>     
      <select
        id="select-dates"
        className={`flex w-full bg-zinc-900 p-2 text-lg text-zinc-400 outline-none cursor-pointer`}
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
