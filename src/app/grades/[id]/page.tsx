'use client'

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation'; // Agora use o useParams
import { Escola, Grade } from '../../../../core';
import { getGradesPorEscolas } from '@/hooks_api/api';
import TitleComponentFixed from '@/components/Componentes_Interface/TitleComponentFixed';
import GradeComponent from '@/components/Componentes_Grade/GradeComponent';



export default function Grades() {
    const { id } = useParams();
    
    const [escola, setEscola] = useState<Escola | null>(null);
    const [primeiraParte, setPrimeiraParte] = useState<Grade[]>([]);
    const [segundaParte, setSegundaParte] = useState<Grade[]>([]);
    const [terceiraParte, setTerceiraParte] = useState<Grade[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        //if (!id) return; // Só faz a chamada se o 'id' estiver disponível

        const fetchData = async () => {
            setLoading(true);
            try {
                // Faz a chamada para obter a escola com grades baseado no ID
                const escolaComGrades = await getGradesPorEscolas(+id);

                if (escolaComGrades && escolaComGrades.grades) {
                    const grades = escolaComGrades.grades;

                    const gradesOrdenadas = grades;

                    // Divide as grades em duas metades
                    const terco = Math.ceil(gradesOrdenadas.length / 3);
                    setPrimeiraParte(gradesOrdenadas.slice(0, terco));
                    setSegundaParte(gradesOrdenadas.slice(terco, terco * 2));
                    setTerceiraParte(gradesOrdenadas.slice(terco * 2));
                    // Define o projeto no estado
                    setEscola(escolaComGrades as Escola);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Erro desconhecido');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading) {
        return <div className='flex w-full min-h-[95vh] items-center justify-center text-2xl'>Carregando...</div>;
    }

    if (error) {
        return (
            <div className='flex items-center justify-center min-h-[95vh] w-[100%]'>
                <p style={{ color: 'red', fontSize: '25px', fontWeight: '700' }}>Erro: {error}</p>
            </div>
        );
    }
    return (
        <div className='flex flex-col p-2 lg:p-7'>
            <div className="flex flex-col items-center min-h-[95vh]  pt-12 lg:pt-7 rounded-md">
                <TitleComponentFixed stringOne={`GRADES DA ESCOLA`} twoPoints={`:`} stringTwo={escola?.nome} />
                <div className="flex flex-col lg:flex-row justify-between lg:min-h-[95vh]
                p-2 lg:p-7 rounded-md lg:pt-12 w-full pt-7">
                    {/* Primeira parte das grades */}
                    <div className="flex flex-col justify-start pl-5 w-[100%] lg:w-1/3 p-2 gap-y-3 border-l border-neutral-700">
                        {primeiraParte.map((grade) => (
                            <GradeComponent key={grade.id} grade={grade} escola={escola}/>
                        ))}
                    </div>

                    {/* Segunda parte das grades */}
                    <div className="flex flex-col justify-start pl-5 w-[100%] lg:w-1/3 p-2 gap-y-3 border-l border-neutral-700">
                        {segundaParte.map((grade) => (
                            <GradeComponent key={grade.id} grade={grade} escola={escola} />
                        ))}
                    </div>
                    {/* Segunda parte das grades */}
                    <div className="flex flex-col justify-start pl-5 w-[100%] lg:w-1/3 p-2 gap-y-3 border-l border-neutral-700">
                        {terceiraParte.map((grade) => (
                            <GradeComponent key={grade.id} grade={grade} escola={escola} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
