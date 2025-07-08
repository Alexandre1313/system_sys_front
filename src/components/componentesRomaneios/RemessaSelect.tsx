'use client'

import { useEffect, useState } from 'react';
import { getRemessasGrades } from "@/hooks_api/api";

interface RemessaSelectProps {
    onSelectChange: (RemessaSelected: number) => void;
    projectId: number | null;
    color?: boolean;
}

export default function RemessaSelect({
    onSelectChange,
    projectId,
    color,
}: RemessaSelectProps) {
    const [dates, setDates] = useState<number[]>([]);
    const newColor = color ? 'bg-[#f7f7f7] text-zinc-950' : 'bg-[#181818] text-zinc-400';

    useEffect(() => {
        const fetchDates = async () => {
            if (!projectId) {
                setDates([]);
                return;
            }

            const data = await getRemessasGrades(projectId);
            setDates(data || []);
        };

        fetchDates();
    }, [projectId]);

    return (
        <div className="flex flex-col justify-center items-start">
            <select
                id="select-remessas"
                title="Selecione a remessa"
                className={`flex w-[310px] py-2 px-3 text-[14px] no-arrow ${newColor}
                    outline-none cursor-pointer h-[35px] border border-zinc-800`}
                onChange={(event) => {
                    const remessaValue = Number(event.target.value);
                    onSelectChange(remessaValue);
                }}
            >
                <option value="">SELECIONE A REMESSA</option>
                {dates.map((r, index) => (
                    <option key={index} value={r}>
                        {`REMESSA: ${r}`}
                    </option>
                ))}
                {dates.length > 0 && <option value="-1">TODAS AS REMESSAS</option>}
            </select>
        </div>
    );
}
