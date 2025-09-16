'use client'

import Etiquetas from '@/components/componentesDePrint/Etiquetas';
import GradeComponent from '@/components/ComponentesGrade/GradeComponent';
import IsLoading from '@/components/ComponentesInterface/IsLoading';
import Modal from '@/components/ComponentesInterface/modal';
import ModalEncGrade from '@/components/ComponentesInterface/ModalEncGrade';
import ModalGerarCaixa from '@/components/ComponentesInterface/ModalGerarCaixa';
import PageWithDrawer from '@/components/ComponentesInterface/PageWithDrawer';
import { useAuth } from '@/contexts/AuthContext';
import { getGradesPorEscolas } from '@/hooks_api/api';
import { useParams } from 'next/navigation';
import { useEffect, useRef, useState, useCallback } from 'react';
import useSWR from 'swr';
import { Escola, EscolaGrade, FormData, GradeItem } from '../../../../core';
import Caixa from '../../../../core/interfaces/Caixa';
import { criarCaixa, zerarQuantidadesCaixa, processarCodigoDeBarras, processarCodigoDeBarrasInvert } from '../../../../core/utils/regraas_de_negocio';
import { useRouter } from 'next/navigation';

const fetcher = async (id: number) => {
  console.log('Fetching data for id:', id);
  const escolaComGrades = await getGradesPorEscolas(id);
  return escolaComGrades;
};

export default function Grades() {
  const { id } = useParams();

  const router = useRouter();

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
    if (!id) return;

    const channel = new BroadcastChannel("grades-tabs");

    // Avisar outras abas que esta URL está sendo aberta
    channel.postMessage({ type: "open", id });

    // Ouvir mensagens de outras abas
    channel.onmessage = (event) => {
      const { type, id: incomingId } = event.data;

      // Se outra aba tentar abrir a mesma grade, esta aba fecha
      if (type === "open" && incomingId === id) {
        // window.close() só funciona se for aberto por window.open
        // então redirecionamos para uma tela neutra
        router.push("/"); // ou para outra página segura, como dashboard
      }
    };

    return () => channel.close();
  }, [id, router]);

  // ✅ REMOVIDO: useEffect que verificava caixa pendente baseado no ID da escola
  // A verificação agora é feita apenas quando uma grade é selecionada através de verificarCaixaPendente()

  const { user } = useAuth();

  const [formData, setFormData] = useState<FormData>({
    CODDEBARRASLEITURA: '',
    ITEM_SELECIONADO: null,
    ESCOLA_GRADE: null,
    QUANTIDADELIDA: '0',
    QUANTIDADENACAIXAATUAL: '0',
    NUMERODACAIXA: '',
  });

  // ✅ CORREÇÃO: Verificar caixa pendente - SEMPRE mostrar se existir
  const verificarCaixaPendente = useCallback(() => {
    try {
      const boxSave0 = localStorage.getItem('saveBox');
      if (boxSave0) {
        const caixaPendente = JSON.parse(boxSave0);
        
        // ✅ SEMPRE mostrar caixa pendente, independentemente da grade selecionada
        // O usuário deve resolver a pendência antes de continuar qualquer fluxo
        setIsPend(true);
        setCaixa(caixaPendente);
        console.log('⚠️ Caixa pendente encontrada - deve ser resolvida:', caixaPendente.caixaNumber);
      } else {
        setIsPend(null);
        setCaixa(null);
      }
    } catch (error) {
      console.error('Erro ao verificar caixa pendente:', error);
      setIsPend(null);
      setCaixa(null);
    }
  }, []); // ✅ Removida dependência da grade - sempre verificar

  // ✅ useEffect: Verificar caixa pendente sempre que a página carrega
  useEffect(() => {
    verificarCaixaPendente();
  }, [verificarCaixaPendente]);

  // ✅ useEffect: Verificar caixa pendente sempre que o ID da escola mudar (reload da página)
  useEffect(() => {
    verificarCaixaPendente();
  }, [id, verificarCaixaPendente]);

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

  // ✅ NOVA FUNÇÃO: Zerar quantidades após confirmar a caixa
  const handleZerarQuantidadesCaixa = () => {
    zerarQuantidadesCaixa(formData);
  };

  const handlerCaixaPend = () => {
    try {
      const boxSave0 = localStorage.getItem('saveBox');
      if (boxSave0) {
        setIsPend(null);
        setCaixa(null); // ✅ CORREÇÃO: Limpar também o estado da caixa
        localStorage.removeItem('saveBox');
      }
    } catch (error) {
      console.error('Erro ao descartar a saveBox', error);
      // ✅ CORREÇÃO: Limpar estado mesmo em caso de erro
      setIsPend(null);
      setCaixa(null);
    }
  }

  const handlerCaixaPend2 = () => {
    try {
      const boxSave0 = localStorage.getItem('saveBox');
      if (boxSave0) {
        setIsPend(null);
        setCaixa(null); // ✅ CORREÇÃO: Limpar também o estado da caixa
        localStorage.removeItem('saveBox');
        closeModalGerarCaixa()
      }
    } catch (error) {
      console.error('Erro ao descartar a saveBox', error);
      // ✅ CORREÇÃO: Limpar estado mesmo em caso de erro
      setIsPend(null);
      setCaixa(null);
    }
  }

  const handleItemSelecionado = (item: GradeItem | null) => {
    setFormData((prevData) => ({
      ...prevData,
      ITEM_SELECIONADO: item,
    }));
  };

  const handleEscolaGradeSelecionada = (escolaGrade: EscolaGrade | null) => {
    // Calcular quantidade na caixa atual (soma das qtyPCaixa dos itens)
    const quantidadeNaCaixaAtual = escolaGrade?.grade?.itensGrade?.reduce((total, item) => {
      return total + (item.qtyPCaixa || 0);
    }, 0) || 0;

    setFormData((prevData): FormData => ({
      ...prevData,
      // ✅ CORREÇÃO CRÍTICA: Isolamento total entre grades
      ESCOLA_GRADE: escolaGrade,
      // ✅ CORREÇÃO: Inicializar com quantidade total expedida da grade
      QUANTIDADELIDA: String(escolaGrade?.totalExpedido ?? 0),
      // ✅ CORREÇÃO: Mostrar quantidade pendente na caixa atual
      QUANTIDADENACAIXAATUAL: String(quantidadeNaCaixaAtual),
      NUMERODACAIXA: '1',
    }));
  };

  // ✅ FUNÇÃO: Sincronizar dados da grade com formData (APENAS para grade ativa)
  const sincronizarGradeComFormData = (grade: any) => {
    // ✅ PRINCÍPIO: Cada grade é completamente independente
    // Só sincronizar se for a grade ativa no formData
    if (formData.ESCOLA_GRADE?.gradeId === grade.id && formData.ESCOLA_GRADE?.grade?.itensGrade) {
      return {
        ...grade,
        itensGrade: formData.ESCOLA_GRADE.grade.itensGrade.map((itemAtualizado: any) => {
          // Encontrar o item correspondente na grade original
          const itemOriginal = grade.itensGrade.find((item: any) => item.id === itemAtualizado.id);
          if (itemOriginal) {
            // Retornar o item original com as quantidades atualizadas
            return {
              ...itemOriginal,
              quantidadeExpedida: itemAtualizado.quantidadeExpedida,
              qtyPCaixa: itemAtualizado.qtyPCaixa,
              isCount: itemAtualizado.isCount
            };
          }
          return itemOriginal;
        })
      };
    }
    
    // ✅ IMPORTANTE: Retornar grade original sem modificações
    // Isso garante que cada grade seja completamente independente
    return grade;
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
      <PageWithDrawer sectionName="Erro" currentPage="grades">
        <div className="flex items-center justify-center min-h-[100dvh] px-4">
          <div className="relative z-10 max-w-md w-full">
            <div className="bg-red-900/20 border border-red-800 rounded-2xl p-6 sm:p-8 text-center">
              <div className="w-16 h-16 bg-red-900/50 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-red-400 text-2xl">⚠️</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-red-400 mb-4">Erro no Sistema</h2>
              <p className="text-red-300 text-sm sm:text-base mb-6">
                {error.message || 'Erro desconhecido ao carregar as grades.'}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="w-full h-12 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                Tentar Novamente
              </button>
            </div>
          </div>
        </div>
      </PageWithDrawer>
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
    <PageWithDrawer
      projectName={escola?.projeto?.nome}      
      sectionName={`${escola?.nome} - Escola #${escola?.numeroEscola}`}
      currentPage="grades"
      projectId={escola?.projeto?.id as number}
    >
      <div className="px-6 pt-14 lg:pt20 pb-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="lg:fixed lg:top-0 lg:left-0 lg:right-0 lg:z-20
                         lg:bg-slate-900/95 lg:backdrop-blur-sm lg:border-b lg:border-slate-700 flex flex-col
                         justify-center items-center lg:py-7 mb-7">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-transparent
             bg-clip-text bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-600 mb-2 lg:mb-2">
              Grades
            </h1>
            <div className="flex items-center lg:flex-row flex-col justify-center text-slate-400 text-sm lg:text-lg">
              <span className='text-center'>{escola?.nome}</span>
              <span className='hidden lg:flex lg:pr-2 lg:pl-2'>•</span>
              <span className="text-center">ESCOLA #{escola?.numeroEscola}</span>
            </div>
            <div className="flex items-center justify-center">
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
              <span>{filteredGrades.length} grade{filteredGrades.length !== 1 ? 's' : ''}</span>
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
            </div>
          </div>

          {/* Grades Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-8 lg:pt-[8rem]">
            {/* Primeira Coluna */}
            <div className="space-y-4">
              {primeiraParte.map((grade) => (
                <GradeComponent
                  key={grade.id}
                  grade={sincronizarGradeComFormData(grade)}
                  escola={escola}
                  formData={formData}
                  isPend={isPend}
                  inputRef={inputRef}                  
                  userId={user?.id}
                  isFocus={isFocus}
                  handleFormDataChangeDecresc={handleFormDataChangeDecresc}
                  handlerOpnEncGradeMoodify={handlerOpnEncGradeMoodify}
                  setFormData={handleFormDataChange}
                  handleItemSelecionado={handleItemSelecionado}
                  handleEscolaGradeSelecionada={handleEscolaGradeSelecionada}
                  handleNumeroDaCaixa={handleNumeroDaCaixa}
                  OpenModalGerarCaixa={OpenModalGerarCaixa}
                  OpenModalGerarCaixaError={OpenModalGerarCaixaError}
                  setModalMessage={setModalMessage}
                  setModalOpen={setModalOpen}
                  printEti={printEti}
                  mutate={swrMutate}
                />
              ))}
            </div>

            {/* Segunda Coluna */}
            <div className="space-y-4">
              {segundaParte.map((grade) => (
                <GradeComponent
                  key={grade.id}
                  grade={sincronizarGradeComFormData(grade)}
                  escola={escola}
                  formData={formData}
                  isPend={isPend}
                  inputRef={inputRef}                 
                  userId={user?.id}
                  isFocus={isFocus}
                  handlerOpnEncGradeMoodify={handlerOpnEncGradeMoodify}
                  handleFormDataChangeDecresc={handleFormDataChangeDecresc}
                  setFormData={handleFormDataChange}
                  handleItemSelecionado={handleItemSelecionado}
                  handleEscolaGradeSelecionada={handleEscolaGradeSelecionada}
                  handleNumeroDaCaixa={handleNumeroDaCaixa}
                  OpenModalGerarCaixaError={OpenModalGerarCaixaError}
                  OpenModalGerarCaixa={OpenModalGerarCaixa}
                  setModalMessage={setModalMessage}
                  setModalOpen={setModalOpen}
                  printEti={printEti}
                  mutate={swrMutate}
                />
              ))}
            </div>

            {/* Terceira Coluna */}
            <div className="space-y-4">
              {terceiraParte.map((grade) => (
                <GradeComponent
                  key={grade.id}
                  grade={sincronizarGradeComFormData(grade)}
                  escola={escola}
                  formData={formData}
                  isPend={isPend}
                  inputRef={inputRef}                  
                  userId={user?.id}
                  isFocus={isFocus}
                  handlerOpnEncGradeMoodify={handlerOpnEncGradeMoodify}
                  setFormData={handleFormDataChange}
                  handleItemSelecionado={handleItemSelecionado}
                  handleEscolaGradeSelecionada={handleEscolaGradeSelecionada}
                  handleFormDataChangeDecresc={handleFormDataChangeDecresc}
                  handleNumeroDaCaixa={handleNumeroDaCaixa}
                  OpenModalGerarCaixaError={OpenModalGerarCaixaError}
                  OpenModalGerarCaixa={OpenModalGerarCaixa}
                  setModalMessage={setModalMessage}
                  setModalOpen={setModalOpen}
                  printEti={printEti}
                  mutate={swrMutate}
                />
              ))}
            </div>
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
        zerarQuantidadesCaixa={handleZerarQuantidadesCaixa}
      />
    </PageWithDrawer>
  );
}
