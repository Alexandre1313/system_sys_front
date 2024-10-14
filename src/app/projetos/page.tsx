'use client';

import { useEffect, useState } from 'react';
import ProjetoComponent from "@/components/Componentes_Projeto/ProjetoComponent";
import Skeleton from 'react-loading-skeleton'; // Importe o Skeleton da biblioteca
import 'react-loading-skeleton/dist/skeleton.css'; // Importe o CSS do Skeleton
import { get } from "../../hooks_api/api"; 
import { Projeto } from '../../../core'; // Importa a interface Projeto

export default function Projetos() {
    const [projetos, setProjetos] = useState<Projeto[]>([]); 
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true); // Estado de carregamento

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true); // Começa o carregamento
            try {
                const data = await get("P");
                setProjetos(data as Projeto[]);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Erro desconhecido');
            } finally {
                setLoading(false); // Finaliza o carregamento
            }
        };
        fetchData();
    }, []);

    if (error) {
        return <p style={{ color: 'red' }}>Erro: {error}</p>;
    }

    return (
        <div className="flexRRC p-4">
            <div className="flexRRC min-h-[96vh] border border-transparent rounded-lg bg-zinc-900">
                {loading ? (
                    // Exibe o skeleton enquanto carrega
                    Array.from({ length: 3 }).map((_, index) => (
                        <div key={index} className="flexColCS border border-gray-800">
                            <Skeleton height={200} /> {/* Para a imagem */}
                            <Skeleton height={30} width={`60%`} /> {/* Para o nome */}
                            <Skeleton height={20} width={`40%`} /> {/* Para a descrição */}
                        </div>
                    ))
                ) : (
                    projetos.map((p) => (
                        <ProjetoComponent key={p.id} projeto={p} />
                    ))
                )}
            </div>
        </div>
    );
}
