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
}: RemessaSelectProps) {
    const [dates, setDates] = useState<number[]>([]);

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
        <select
            id="select-remessas"
            title="Selecione a remessa"
            className="w-full bg-slate-700/50 border border-slate-600 text-slate-300 rounded-lg px-3 py-2 text-xs lg:text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
            onChange={(event) => {
                const remessaValue = Number(event.target.value);
                onSelectChange(remessaValue);
            }}
        >
            <option value="">Selecione a Remessa</option>
            {dates.map((r, index) => (
                <option key={index} value={r}>
                    {`Remessa: ${r}`}
                </option>
            ))}
            {dates.length > 0 && <option value="-1">Todas as Remessas</option>}
        </select>
    );
}
