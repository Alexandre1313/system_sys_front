'use client'

import Etiquetas from '@/components/componentesDePrint/Etiquetas';
import GradeComponent from '@/components/ComponentesGrade/GradeComponent';
import IsLoading from '@/components/ComponentesInterface/IsLoading';
import Modal from '@/components/ComponentesInterface/modal';
import ModalEncGrade from '@/components/ComponentesInterface/ModalEncGrade';
import ModalGerarCaixa from '@/components/ComponentesInterface/ModalGerarCaixa';
import TitleComponentFixed from '@/components/ComponentesInterface/TitleComponentFixed';
import { useAuth } from '@/contexts/AuthContext';
import { getGradesPorEscolas } from '@/hooks_api/api';
import { useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import useSWR from 'swr';
import { Escola, EscolaGrade, FormData, GradeItem } from '../../../../core';
import Caixa from '../../../../core/interfaces/Caixa';
import { criarCaixa, processarCodigoDeBarras, processarCodigoDeBarrasInvert } from '../../../../core/utils/regraas_de_negocio';

const fetcher = async (id: number) => {
  console.log('Fetching data for id:', id);
  const escolaComGrades = await getGradesPorEscolas(id);
  return escolaComGrades;
};

export default function Grades() {
  const { id } = useParams();
  
  const inputRef = useRef<HTMLInputElement>(null);

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string>('');
  const [modalEncGradeOpen, setModalEncGradeOpen] = useState<boolean>(false);
  const [modalEncGradeMessage, setModalEncGradeMessage] = useState<string>('');
  const [modalGerarCaixaMessage, setModalGerarCaixaMessage] = useState<string>('');
  const [modalGerarCaixaOpen, setModalGerarCaixaOpen] = useState<boolean>(false);
  const [isPend, setIsPend] = useState<boolean | null>(null);
  const [caixa, setCaixa] = useState<Caixa | null>(null);

  useEffect(() => {
    try {
      const boxSave0 = localStorage.getItem('saveBox');
      if (boxSave0) {
        setIsPend(true);
        setCaixa(JSON.parse(boxSave0));
      }
    } catch (error) {
      console.error('Erro ao parsear o localStorage saveBox', error);
    }
  }, []);

  const { user } = useAuth();

  const [formData, setFormData] = useState<FormData>({
    CODDEBARRASLEITURA: '',
    ITEM_SELECIONADO: null,
    ESCOLA_GRADE: null,
    QUANTIDADELIDA: '0',
    QUANTIDADENACAIXAATUAL: '0',
    NUMERODACAIXA: '',
  });

  const isFocus = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }

  const handleFormDataChange = (key: string, value: string) => {
    if (key === 'CODDEBARRASLEITURA') {
      processarCodigoDeBarras(
        value,
        formData,
        user,
        setFormData,
        setModalMessage,
        setModalOpen,
        OpenModalGerarCaixa
      );
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [key]: value,
      }));
    }
  };

  const handleFormDataChangeDecresc = () => {
    processarCodigoDeBarrasInvert(
      formData,
      setFormData,
    );
  };

  const handleFormDataCaixaAtualChange = (key: string, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalMessage('');
  };

  const closeModalEncGrade = () => {
    setModalEncGradeOpen(false);
    setModalEncGradeMessage('');
  };

  const closeModalGerarCaixa = () => {
    setModalGerarCaixaOpen(false);
    setModalGerarCaixaMessage('');
    setCaixa(null);
    isFocus();
    if (formData.ESCOLA_GRADE?.totalAExpedir === 0) {
      setModalEncGradeOpen(true);
      setModalEncGradeMessage('Grade finalizada');
    }
  };

  const OpenModalGerarCaixa = () => {
    // console 02
    console.log(`item selecionado antes: ${JSON.stringify(formData.ITEM_SELECIONADO, null, 4)}`)

    // console 03
    console.log(`itens grade antes: ${JSON.stringify(formData.ESCOLA_GRADE?.grade?.itensGrade, null, 4)}`)

    const novaCaixa = criarCaixa(formData, user?.id);

    // console 04
    console.log(`item selecionado depois: ${JSON.stringify(formData.ITEM_SELECIONADO, null, 4)}`)

    // console 05
    console.log(`itens grade depois: ${JSON.stringify(formData.ESCOLA_GRADE?.grade?.itensGrade, null, 4)}`)

    // console 06
    console.log(`caixa depois: ${JSON.stringify(novaCaixa, null, 4)}`)

    if (novaCaixa) {
      setCaixa(novaCaixa);
      setModalGerarCaixaOpen(true);
      setModalGerarCaixaMessage('Deseja encerrar a caixa ?');
    } else {
      console.log("Nenhuma caixa foi criada.");
    }
  };

  const OpenModalGerarCaixaError = () => {
    if (isPend) {
      setModalGerarCaixaOpen(true);
      setModalGerarCaixaMessage('Deseja encerrar a caixa pendente ?');
    } else {
      console.log("Caixa pendente não resolvida.");
    }
  };

  const handlerCaixaPend = () => {
    localStorage.removeItem('saveBox');
    setIsPend(null);
  }

  const handleItemSelecionado = (item: GradeItem | null) => {
    setFormData((prevData) => ({
      ...prevData,
      ITEM_SELECIONADO: item,
    }));
  };

  const handleEscolaGradeSelecionada = (escolaGrade: EscolaGrade | null) => {
    setFormData((prevData) => ({
      ...prevData,
      QUANTIDADELIDA: String(escolaGrade?.totalExpedido),
      ESCOLA_GRADE: escolaGrade,
    }));
  };

  const handlerOpnEncGradeMoodify = () => {
    setModalEncGradeOpen(true);
    setModalEncGradeMessage('Grade finalizada');
  }

  const handleNumeroDaCaixa = (numeroDaCaixa: string) => {
    setFormData((prevData) => ({
      ...prevData,
      NUMERODACAIXA: numeroDaCaixa,
    }));
  };

  const handleNumberBox = (numeroDaCaixa: string) => {
    const numero = parseInt(numeroDaCaixa, 10) + 1
    setFormData((prevData) => ({
      ...prevData,
      NUMERODACAIXA: String(numero),
    }));
  };

  const printEti = (etiquetas: Caixa[]) => {
    return (<Etiquetas etiquetas={etiquetas} />)
  }

  // Usando SWR para buscar dados da escola e suas grades
  const { data, error, mutate: swrMutate } = useSWR(id ? ['grades', id] : null, () => fetcher(+id!), {
    revalidateOnFocus: false, 
    revalidateOnReconnect: false
  });

  if (!data && !error) {
    return <IsLoading />
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[95vh] w-[100%]">
        <p style={{ color: 'red', fontSize: '25px', fontWeight: '700' }}>
          Erro: {error.message || 'Erro desconhecido'}
        </p>
      </div>
    );
  }

  const escola = data as Escola;
  const grades = escola?.grades || [];

  const terco = Math.ceil(grades.length / 3);
  const primeiraParte = grades.slice(0, terco);
  const segundaParte = grades.slice(terco, terco * 2);
  const terceiraParte = grades.slice(terco * 2);

  return (
    <div className="flex flex-col p-2 lg:p-1">
      <div className="flex flex-col items-center min-h-[95vh] pt-7 lg:pt-1 rounded-md">
        <TitleComponentFixed stringOne={`GRADES DA ESCOLA`} twoPoints={`:`} stringTwo={escola?.nome} />
        <div className="flex flex-col lg:flex-row justify-between lg:min-h-[95vh] p-2 lg:p-7 rounded-md lg:pt-12 w-full pt-7">
          <div className="flex flex-col justify-start pl-5 w-[100%] lg:w-1/3 p-2 gap-y-3 border-l border-neutral-700">
            {primeiraParte.map((grade) => (
              <GradeComponent
                key={grade.id}
                grade={grade}
                escola={escola}
                formData={formData}
                isPend={isPend}
                inputRef={inputRef}
                isFocus={isFocus}
                handleFormDataChangeDecresc={handleFormDataChangeDecresc}
                handlerOpnEncGradeMoodify={handlerOpnEncGradeMoodify}
                setFormData={handleFormDataChange}
                handleItemSelecionado={handleItemSelecionado}
                handleEscolaGradeSelecionada={handleEscolaGradeSelecionada}
                handleNumeroDaCaixa={handleNumeroDaCaixa}
                OpenModalGerarCaixa={OpenModalGerarCaixa}
                OpenModalGerarCaixaError={OpenModalGerarCaixaError}
                printEti={printEti}
                mutate={swrMutate}
              />
            ))}
          </div>
          <div className="flex flex-col justify-start pl-5 w-[100%] lg:w-1/3 p-2 gap-y-3 border-l border-neutral-700">
            {segundaParte.map((grade) => (
              <GradeComponent
                key={grade.id}
                grade={grade}
                escola={escola}
                formData={formData}
                isPend={isPend}
                inputRef={inputRef}
                isFocus={isFocus}
                handlerOpnEncGradeMoodify={handlerOpnEncGradeMoodify}
                handleFormDataChangeDecresc={handleFormDataChangeDecresc}
                setFormData={handleFormDataChange}
                handleItemSelecionado={handleItemSelecionado}
                handleEscolaGradeSelecionada={handleEscolaGradeSelecionada}
                handleNumeroDaCaixa={handleNumeroDaCaixa}
                OpenModalGerarCaixaError={OpenModalGerarCaixaError}
                OpenModalGerarCaixa={OpenModalGerarCaixa}
                printEti={printEti}
                mutate={swrMutate}
              />
            ))}
          </div>
          <div className="flex flex-col justify-start pl-5 w-[100%] lg:w-1/3 p-2 gap-y-3 border-l border-neutral-700">
            {terceiraParte.map((grade) => (
              <GradeComponent
                key={grade.id}
                grade={grade}
                escola={escola}
                formData={formData}
                isPend={isPend}
                inputRef={inputRef}
                isFocus={isFocus}
                handlerOpnEncGradeMoodify={handlerOpnEncGradeMoodify}
                setFormData={handleFormDataChange}
                handleItemSelecionado={handleItemSelecionado}
                handleEscolaGradeSelecionada={handleEscolaGradeSelecionada}
                handleFormDataChangeDecresc={handleFormDataChangeDecresc}
                handleNumeroDaCaixa={handleNumeroDaCaixa}
                OpenModalGerarCaixaError={OpenModalGerarCaixaError}
                OpenModalGerarCaixa={OpenModalGerarCaixa}
                printEti={printEti}
                mutate={swrMutate}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Componente Modal */}
      <Modal isOpen={modalOpen} message={modalMessage} onClose={closeModal} />

      {/* Componente ModalEncGrade com o mutate passado */}
      <ModalEncGrade
        isOpen={modalEncGradeOpen}
        message={modalEncGradeMessage}
        onClose={closeModalEncGrade}
        mutate={swrMutate}
        escolaGrade={formData.ESCOLA_GRADE}
      />
      {/* Componente ModalGerarCaixa com o mutate passado */}
      <ModalGerarCaixa
        isOpen={modalGerarCaixaOpen}
        message={modalGerarCaixaMessage}
        setFormData={handleFormDataCaixaAtualChange}
        handleNumberBox={handleNumberBox}
        onClose={closeModalGerarCaixa}
        handlerCaixaPend={handlerCaixaPend}
        mutate={swrMutate}
        box={caixa}
      />
    </div>
  );
}
