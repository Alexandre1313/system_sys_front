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
    const novaCaixa = criarCaixa(formData, user?.id);
    if (novaCaixa) {
      setCaixa(novaCaixa);
      setModalGerarCaixaOpen(true);
      setModalGerarCaixaMessage('Deseja mesmo encerrar a caixa ? Confira as quantidades.');
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
    try {
      const boxSave0 = localStorage.getItem('saveBox');
      if (boxSave0) {
        setIsPend(null);
        localStorage.removeItem('saveBox');
      }
    } catch (error) {
      console.error('Erro ao descartar a saveBox', error);
    }
  }

  const handlerCaixaPend2 = () => {
    try {
      const boxSave0 = localStorage.getItem('saveBox');
      if (boxSave0) {
        setIsPend(null);
        localStorage.removeItem('saveBox');
        closeModalGerarCaixa()
      }
    } catch (error) {
      console.error('Erro ao descartar a saveBox', error);
    }
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

  // Função auxiliar para converter a data no formato "2025-01-13 16:35:56.052" para um objeto Date
  const parseDate = (dateString: any) => {
    // Substitui o espaço por 'T' para tornar o formato compatível com o ISO 8601
    const formattedDateString = dateString.replace(' ', 'T');
    return new Date(formattedDateString);
  };

  // Função para verificar se a data de atualização está mais de 1 dia atrás
  const isMoreThanOneDayAgo = (updateDate: any) => {
    // Verifique se a data é válida antes de tentar acessar getTime()
    if (isNaN(updateDate.getTime())) {
      return false; // Retorna false se a data não for válida
    }

    const currentDate = new Date();
    const differenceInTime = currentDate.getTime() - updateDate.getTime(); // getTime() retorna o timestamp (número de milissegundos)
    const differenceInDays = differenceInTime / (1000 * 3600 * 24); // Converte de milissegundos para dias
    return differenceInDays > 1;
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

  // Filtrando grades com base nos critérios especificados
  const filteredGrades = grades.filter((grade) => {
    // Verifique se dataUpdate existe e é válida
    if (!grade.updatedAt) {
      return true; // Se não houver data de atualização, mantemos a grade
    }

    const updateDate = parseDate(grade.updatedAt); // Converta a data de atualização
    return grade.status !== 'DESPACHADA' || !isMoreThanOneDayAgo(updateDate);
  });

  // Calculando a divisão em 3 partes
  const terco = Math.ceil(filteredGrades.length / 3);
  const primeiraParte = filteredGrades.slice(0, terco);
  const segundaParte = filteredGrades.slice(terco, terco * 2);
  const terceiraParte = filteredGrades.slice(terco * 2);

  return (
    <div className="flex flex-col p-2 lg:p-1">
      <div className="flex flex-col items-center min-h-[95vh] pt-7 lg:pt-1 rounded-md">
        <TitleComponentFixed stringOne={`${escola?.nome} - `} twoPoints={`${escola?.numeroEscola} - `} stringTwo={escola?.projeto?.nome}/>
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
        handlerCaixaPend2={handlerCaixaPend2}
        mutate={swrMutate}
        box={caixa}
        isPend={isPend}
      />
    </div>
  );
}
