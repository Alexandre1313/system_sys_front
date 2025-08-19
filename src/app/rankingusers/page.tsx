'use client';

import TitleComponentFixed from "@/components/ComponentesInterface/TitleComponentFixed";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ptBR } from "date-fns/locale";
import { format, startOfMonth } from "date-fns";
import { useEffect, useState } from "react";
import { getRanking } from "@/hooks_api/api";
import { convertMilharFormat, formatarTituloRanking } from "../../../core/utils/tools";

registerLocale("pt-BR", ptBR);

const fetcher = async (month: string): Promise<{
    rankingPorMes: Record<string, any[]>;
    rankingGeral: any[];
}> => {
    const ranking = await getRanking(month);
    return ranking;
};

export default function Ranking() {
    const [selectedDate, setSelectedDate] = useState<Date | null>(startOfMonth(new Date()));
    const [rankingData, setRankingData] = useState<{
        rankingPorMes: Record<string, any[]>;
        rankingGeral: any[];
    } | null>(null);

    // Interpreta null como "T"
    const mesFormatado = selectedDate ? format(selectedDate, "yyyy-MM") : "T";

    useEffect(() => {
        const buscarRanking = async () => {
            if (mesFormatado) {
                try {
                    const data = await fetcher(mesFormatado);
                    setRankingData(data);
                } catch (error) {
                    console.error("Erro ao buscar ranking:", error);
                }
            }
        };

        buscarRanking();
    }, [mesFormatado]);

    return (
        <div className="flex flex-col lg:flex-row w-full items-start justify-between bg-[#181818] px-4 pb-10">
            <TitleComponentFixed stringOne={`RANKING EXPEDIDORES`} />
            <div className={`flex flex-col`}>
                <div className="mt-16 fixed top-0 items-start justify-start left-16 mb-6 flex gap-4 w-full flex-col lg:min-w-[15%] lg:max-w-[15%]">
                    <DatePicker
                        selected={selectedDate}
                        onChange={(date: Date | null) => setSelectedDate(date)}
                        dateFormat="MM/yyyy"
                        showMonthYearPicker
                        locale="pt-BR"
                        className="bg-[#181818] flex text-zinc-100 border outline-none cursor-pointer border-zinc-700 px-3 py-1 rounded h-[35px] w-full"
                        placeholderText="Selecione o mês"
                    />

                    <button
                        onClick={() => setSelectedDate(null)}
                        className="text-sm px-2 py-1 text-zinc-400 rounded
                         hover:bg-zinc-600 hover:text-black transition"
                    >
                        Mostrar todos os meses
                    </button>
                </div>
            </div>

            {/* RENDERIZAÇÃO DO RANKING GERAL */}
            <div className={`w-full items-center flex justify-start flex-col uppercase pt-16 min-h-[101vh]`}>
                <h2 className="text-zinc-400 uppercase text-lg">Quantidades expedidas (em peças avulsas)</h2>
                <div className="w-full mt-8 text-zinc-300 max-w-7xl">
                    <h2 className="text-lg text-zinc-500 font-extralight mb-2 uppercase">
                        Ranking Geral
                    </h2>
                    <table className="w-full border border-zinc-700 bg-zinc-600 bg-opacity-30">
                        <thead className="bg-zinc-800 text-zinc-400">
                            <tr>
                                <th className="p-2 text-left border-r border-zinc-700 w-[15%]">#</th>
                                <th className="p-2 text-left border-r border-zinc-700 w-[60%]">Nome</th>
                                <th className="p-2 text-left w-[25%]">Peças Expedidas</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rankingData?.rankingGeral.map((item, idx) => (
                                <tr key={idx} className="border-t border-zinc-700 hover:bg-zinc-800 text-[18px]">
                                    <td className="p-2 text-yellow-400">{`${idx + 1}º`}</td>
                                    <td className="p-2">{item.nome}</td>
                                    <td className="p-2">{convertMilharFormat(item.total_pecas_expedidas_geral)}</td>
                                </tr>
                            ))}
                            <tr className="border-t border-zinc-700 hover:bg-zinc-800 text-[18px]">
                                <td className="p-2">{``}</td>
                                <td className="p-2 text-zinc-400 text-right">{`total geral:`}</td>
                                <td className="p-2 text-green-500 bg-green-500 bg-opacity-10">{convertMilharFormat(
                                    rankingData?.rankingGeral?.reduce(
                                        (acc, item) => acc + (item.total_pecas_expedidas_geral || 0),
                                        0 // Valor inicial obrigatório
                                    ) || 0
                                )
                                }</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* RANKING POR MÊS */}
                <div className="w-full mt-10 max-w-7xl text-zinc-300">
                    {mesFormatado === "T" ? (
                        Object.entries(rankingData?.rankingPorMes || {}).map(([mes, ranking]) => (
                            <div key={mes} className="mt-10">
                                <h2 className="text-lg text-zinc-500 font-semibold mb-2">
                                    {formatarTituloRanking(`Ranking - ${mes}`)}
                                </h2>
                                <table className="w-full border border-zinc-700">
                                    <thead className="bg-zinc-800 text-zinc-400">
                                        <tr>
                                            <th className="p-2 text-left border-r border-zinc-700 w-[15%]">#</th>
                                            <th className="p-2 text-left border-r border-zinc-700 w-[60%]">Nome</th>
                                            <th className="p-2 text-left border-r border-zinc-700 w-[25%]">Peças Mês</th>

                                        </tr>
                                    </thead>
                                    <tbody>
                                        {ranking.map((item, idx) => (
                                            <tr key={idx} className="border-t border-zinc-700 hover:bg-zinc-800">
                                                <td className="p-2 text-yellow-400 w-[15%]">{`${item.rank_mes}º`}</td>
                                                <td className="p-2 w-[60%]">{item.nome}</td>
                                                <td className="p-2 w-[25%]">{convertMilharFormat(item.total_pecas_expedidas)}</td>
                                            </tr>
                                        ))}
                                        <tr className="border-t border-zinc-700 hover:bg-zinc-800 text-[18px]">
                                            <td className="p-2">{``}</td>
                                            <td className="p-2 text-zinc-400 text-right">{`total:`}</td>
                                            <td className="p-2 text-zinc-400 bg-zinc-600 bg-opacity-30">{convertMilharFormat(
                                                ranking.reduce(
                                                    (acc, item) => acc + (item.total_pecas_expedidas || 0),
                                                    0 // Valor inicial obrigatório
                                                ) || 0
                                            )
                                            }</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        ))
                    ) : (
                        mesFormatado &&
                        rankingData?.rankingPorMes[mesFormatado] && (
                            <div className="mt-10">
                                <h2 className="text-lg text-zinc-500 font-semibold mb-2">
                                    {formatarTituloRanking(`Ranking - ${mesFormatado}`)}
                                </h2>
                                <table className="w-full border border-zinc-700">
                                    <thead className="bg-zinc-800 text-zinc-400">
                                        <tr>
                                            <th className="p-2 text-left border-r border-zinc-700 w-[15%]">#</th>
                                            <th className="p-2 text-left border-r border-zinc-700 w-[60%]">Nome</th>
                                            <th className="p-2 text-left border-r border-zinc-700 w-[25%]">Peças Mês</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rankingData.rankingPorMes[mesFormatado].map((item, idx) => (
                                            <tr key={idx} className="border-t border-zinc-700 hover:bg-zinc-800">
                                                <td className="p-2 text-yellow-400">{`${item.rank_mes}º`}</td>
                                                <td className="p-2">{item.nome}</td>
                                                <td className="p-2">{item.total_pecas_expedidas.toLocaleString()}</td>
                                            </tr>
                                        ))}
                                        <tr className="border-t border-zinc-700 hover:bg-zinc-800 text-[18px]">
                                            <td className="p-2">{``}</td>
                                            <td className="p-2 text-zinc-400 text-right">{`total:`}</td>
                                            <td className="p-2 text-zinc-400 bg-zinc-600 bg-opacity-30">{convertMilharFormat(
                                                rankingData.rankingPorMes[mesFormatado].reduce(
                                                    (acc, item) => acc + (item.total_pecas_expedidas || 0), 0) || 0)
                                            }</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}
