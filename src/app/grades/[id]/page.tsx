'use client'

import useSWR, { mutate } from 'swr'; // Importa o mutate
import { useParams } from 'next/navigation';
import { Escola, GradeItem, FormData, EscolaGrade } from '../../../../core';
import { getGradesPorEscolas } from '@/hooks_api/api';
import TitleComponentFixed from '@/components/Componentes_Interface/TitleComponentFixed';
import GradeComponent from '@/components/Componentes_Grade/GradeComponent';
import { useState } from 'react';
import Modal from '@/components/Componentes_Interface/modal';
import { processarCodigoDeBarras } from '../../../../core/utils/regraas_de_negocio';

const fetcher = async (id: number) => {
  const escolaComGrades = await getGradesPorEscolas(id);
  return escolaComGrades;
}

export default function Grades() {
  const { id } = useParams();

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string>('');

  const [formData, setFormData] = useState<FormData>({   
    CODDEBARRASLEITURA: '',
    ITEM_SELECIONADO: null,
    ESCOLA_GRADE: null,
    QUANTIDADELIDA: '0',
    NUMERODACAIXA: '',
  });

  const handleFormDataChange = (key: string, value: string) => {
    if (key === 'CODDEBARRASLEITURA') {
      // Chama a função encapsulada que processa o código de barras
      processarCodigoDeBarras(value, formData, setFormData, setModalMessage, setModalOpen);
    } else {
      // Atualiza os outros campos normalmente
      setFormData((prevData) => ({
        ...prevData,
        [key]: value,
      }));
    }
  };

  // Função para fechar o modal
  const closeModal = () => {
    setModalOpen(false);
    setModalMessage('');
  };

  const handleItemSelecionado = (item: GradeItem | null) => {
    setFormData((prevData) => ({
      ...prevData,
      ITEM_SELECIONADO: item, // Atualiza o item selecionado
    }));
  };

  const handleEscolaGradeSelecionada = (escolaGrade: EscolaGrade | null) => {
    setFormData((prevData) => ({
      ...prevData,
      QUANTIDADELIDA: String(escolaGrade?.totalExpedido),
      ESCOLA_GRADE: escolaGrade, 
    }));
  };

  const handleNumeroDaCaixa = (numeroDaCaixa: string) => {
    setFormData((prevData) => ({
      ...prevData,
      NUMERODACAIXA: numeroDaCaixa,
    }));
  };

 

  // Usando SWR para buscar dados da escola e suas grades
  const { data, error } = useSWR(id ? ['grades', id] : null, () => fetcher(+id));

  if (!data && !error) {
    return <div className='flex w-full min-h-[95vh] items-center justify-center text-2xl'>Carregando...</div>;
  }

  if (error) {
    return (
      <div className='flex items-center justify-center min-h-[95vh] w-[100%]'>
        <p style={{ color: 'red', fontSize: '25px', fontWeight: '700' }}>Erro: {error.message || 'Erro desconhecido'}</p>
      </div>
    );
  }

  const escola = data as Escola;
  const grades = escola?.grades || [];

  // Divide as grades em três partes
  const terco = Math.ceil(grades.length / 3);
  const primeiraParte = grades.slice(0, terco);
  const segundaParte = grades.slice(terco, terco * 2);
  const terceiraParte = grades.slice(terco * 2);

  return (
    <div className='flex flex-col p-2 lg:p-3'>
      <div className="flex flex-col items-center min-h-[95vh] pt-7 lg:pt-7 rounded-md">
        <TitleComponentFixed stringOne={`GRADES DA ESCOLA`} twoPoints={`:`} stringTwo={escola?.nome} />
        <div className="flex flex-col lg:flex-row justify-between lg:min-h-[95vh] p-2 lg:p-7 rounded-md lg:pt-12 w-full pt-7">
          {/* Primeira parte das grades */}
          <div className="flex flex-col justify-start pl-5 w-[100%] lg:w-1/3 p-2 gap-y-3 border-l border-neutral-700">
            {primeiraParte.map((grade) => (
              <GradeComponent
                key={grade.id}
                grade={grade}
                escola={escola}
                mutate={mutate}
                formData={formData}
                setFormData={handleFormDataChange}
                handleItemSelecionado={handleItemSelecionado}
                handleEscolaGradeSelecionada={handleEscolaGradeSelecionada}
                handleNumeroDaCaixa={handleNumeroDaCaixa}
              />
            ))}
          </div>

          {/* Segunda parte das grades */}
          <div className="flex flex-col justify-start pl-5 w-[100%] lg:w-1/3 p-2 gap-y-3 border-l border-neutral-700">
            {segundaParte.map((grade) => (
              <GradeComponent
                key={grade.id}
                grade={grade}
                escola={escola}
                mutate={mutate}
                formData={formData}
                setFormData={handleFormDataChange}
                handleItemSelecionado={handleItemSelecionado}
                handleEscolaGradeSelecionada={handleEscolaGradeSelecionada}
                handleNumeroDaCaixa={handleNumeroDaCaixa}
              />
            ))}
          </div>

          {/* Terceira parte das grades */}
          <div className="flex flex-col justify-start pl-5 w-[100%] lg:w-1/3 p-2 gap-y-3 border-l border-neutral-700">
            {terceiraParte.map((grade) => (
              <GradeComponent
                key={grade.id}
                grade={grade}
                escola={escola}
                mutate={mutate}
                formData={formData}
                setFormData={handleFormDataChange}
                handleItemSelecionado={handleItemSelecionado}
                handleEscolaGradeSelecionada={handleEscolaGradeSelecionada}
                handleNumeroDaCaixa={handleNumeroDaCaixa}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Componente Modal */}
      <Modal isOpen={modalOpen} message={modalMessage} onClose={closeModal} />
    </div>
  );
}
