'use client';

import ItemsProjects from '@/components/componentesEntradas/ItemsProjects';
import ModalItemDetails from '@/components/componentesEntradas/ModalItemDetails';
import SelectedEntries from '@/components/componentesEntradas/SelectedEntries';
import SelectedEntriesEmb from '@/components/componentesEntradas/SelectedEntriesEmb';
import IsLoading from '@/components/ComponentesInterface/IsLoading';
import Modal from '@/components/ComponentesInterface/modal';
import ModalCancel from '@/components/ComponentesInterface/modalCancel';
import ModalEmbCad from '@/components/ComponentesInterface/ModalEmbCad';
import ModalStockAtualization from '@/components/ComponentesInterface/ModalStockAtualization';
import PageWithDrawer from '@/components/ComponentesInterface/PageWithDrawer';
import { useAuth } from '@/contexts/AuthContext';
import { getEmb, getProdEmbDay, getProjectsItems, getProjectsSimp } from '@/hooks_api/api';
import { useState } from 'react';
import useSWR from 'swr';
import { Embalagem, FormDateInputs, ProjectItems, ProjetosSimp, QtyEmbDay, Stock } from '../../../core';
import { objectsStockEmbs, processarQtdParaEstoque } from '../../../core/utils/regraas_de_negocio';
import { Package, ChevronDown, ChevronUp, Users, Folder, Plus } from 'react-feather';
import { motion, AnimatePresence } from 'framer-motion';

// Função fetcher para carregar todos os dados de produção diária da embalagem
const fetcherTotalsProd = async (embalagemId: number, itemTamanhoId: number): Promise<QtyEmbDay> => {
  const resp = await getProdEmbDay(String(embalagemId), String(itemTamanhoId));
  return resp;
};

// Função fetcher para carregar todos os projetos
const fetcherProjects = async (): Promise<ProjetosSimp[]> => {
  const resp = await getProjectsSimp();
  return resp;
};

// Função fetcher para carregar todas as embalagens
const fetcherEmb = async (): Promise<Embalagem[]> => {
  const resp = await getEmb();
  return resp;
};

// Função fetcher para carregar itens de um projeto específico
const fetcherItems = async (projectId: number): Promise<ProjectItems> => {
  const resp = await getProjectsItems(+projectId);
  return resp;
};

export default function EntradasEmbalagem() {
  const [expandedNome, setExpandedNome] = useState<string | null>(null);

  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [selectedItem, setSelectedItem] = useState<ProjectItems['itensProject'][0] | null>(null);
  const [selectedEmbalagem, setSelectedEmbalagem] = useState<Embalagem | null | undefined>(null);
  const [totalsProdEmb, setTotalsProdEmb] = useState<QtyEmbDay | null>(null);
  const [embalagemId, setEmbalagemId] = useState<number | null | undefined>(null);
  const [itemTamanhoId, setItemTamanhoId] = useState<number | null>(null);

  const [isModalOpen, setModalOpen] = useState(false);
  const [isModalOpenCodeInvalid, setModalOpenCodeInvalid] = useState(false);
  const [modalMessage, setModalMessage] = useState<string>('');
  const [isOpenCancel, setIsOpenCancel] = useState<boolean>(false);
  const [modalMessageCancel, setModalMessageCancel] = useState<string>('');

  const [isOpenStock, setIsOpenStock] = useState<boolean>(false);
  const [messageStock, setMessageStock] = useState<string>('');
  const [stock, setStock] = useState<Stock | null>(null);

  const { user } = useAuth();

  const [isModalOpenEmb, setModalOpenEmb] = useState(false);
  const [formData, setFormData] = useState<FormDateInputs>(
    {
      LEITURADOCODDEBARRAS: '',
      QUANTIDADECONTABILIZADA: '0',
      ITEM_SELECIONADO: null,
      PROJETO: null
    }
  );

  const handleFormDataChange = (key: string, value: string) => {
    if (key === 'LEITURADOCODDEBARRAS') {
      processarQtdParaEstoque(value, formData, user, selectedEmbalagem, setFormData, setModalMessage, setModalOpenCodeInvalid);
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [key]: value,
      }));
    }
  };

  // Carregar todos os dados da produção da embalagem usando SWR
  const { error: errorSumsTotal, isValidating: isValidatingSumsTotal, mutate: swrMutateStock } = useSWR(
    isModalOpen && embalagemId && itemTamanhoId ? [embalagemId, itemTamanhoId] : null,
    () => fetcherTotalsProd(embalagemId!, itemTamanhoId!),
    {
      revalidateOnFocus: false,
      refreshInterval: 120 * 1000,
      onSuccess: (data) => {
        // Atualiza o estado diretamente quando os dados são recebidos
        setTotalsProdEmb(data);
      },
    }
  );

  // Carregar todos os projetos usando SWR
  const { data: projetos, error: errorProjetos, isValidating: isValidatingProjetos } = useSWR<ProjetosSimp[]>('projetos', fetcherProjects, {
    revalidateOnFocus: false,
    refreshInterval: 5 * 60 * 60 * 1000,
  });

  // Carregar todas as embalagens usando SWR
  const { data: embalagens, error: errorEmbalagens, isValidating: isValidatingEmbalagens, mutate: swrMutate } = useSWR<Embalagem[] | null | undefined>('embalagens', fetcherEmb, {
    revalidateOnFocus: false,
    refreshInterval: 5 * 60 * 60 * 1000,
  });

  // Carregar itens do projeto selecionado usando SWR
  const { data: projectItems, error: errorItems, isValidating: isValidatingItems, mutate: swrMutateItems } = useSWR(
    selectedProjectId ? String(selectedProjectId) : null,
    () => fetcherItems(+selectedProjectId!),
    {
      revalidateOnFocus: false,
      refreshInterval: 120 * 1000,
    }
  );

  const groupedByNomeGenero = projectItems?.itensProject?.reduce((acc, item) => {
    const nome = (item.nome ?? 'Sem Nome').trim().toUpperCase();
    const genero = (item.genero ?? 'Sem Gênero').trim().toUpperCase();
    const key = `${nome} - ${genero}`;

    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {} as Record<string, typeof projectItems.itensProject>) ?? {};

  const handleProjectChange = (projectId: number) => {
    setSelectedProjectId(projectId);
  };

  const handleEmbalagemChange = (embalagem: Embalagem | null | undefined) => {
    setSelectedEmbalagem(embalagem);
  };

  const mutationAll = () => {
    swrMutateItems();
  }

  const mutationStock = () => {
    swrMutateStock();
  }

  const handleItemClick = (item: ProjectItems['itensProject'][0], embalagemId: number | undefined,
    itemTamanhoId: number, projeto: ProjectItems) => {
    setSelectedItem(item);
    setEmbalagemId(embalagemId);
    setItemTamanhoId(itemTamanhoId);
    setModalOpen(true);
    setFormData((prevData) => ({
      ...prevData,
      ITEM_SELECIONADO: item,
      PROJETO: projeto.nome,
    }));
  };

  const handleCloseModal = () => {
    if (parseInt(formData.QUANTIDADECONTABILIZADA, 10) === 0) {
      setModalOpen(false);
      setSelectedItem(null);
    } else {
      setModalMessageCancel('Há itens não efetivados no Banco de Dados, cancelar operação?');
      setIsOpenCancel(true);
    }
  };

  const handleCloseModalCancel = () => {
    setIsOpenCancel(false);
    setModalMessageCancel('');
    setModalOpen(false);
    setSelectedItem(null);
    formData.QUANTIDADECONTABILIZADA = '0';
  }

  const handleCloseModalContinue = () => {
    setIsOpenCancel(false);
    setModalMessageCancel('');
  }

  const handleCloseModalEmb = () => {
    setModalOpenEmb(false);
  };

  const closeModal = () => {
    setModalOpenCodeInvalid(false);
    setModalMessage('');
  };

  const updateStockEndEntryInput = () => {
    if (parseInt(formData.QUANTIDADECONTABILIZADA, 10) > 0) {
      setIsOpenStock(true);
      setMessageStock("Deseja adicionar a quantidade contabilizada ao estoque?");
      const stockR = objectsStockEmbs(embalagemId!, formData, selectedItem!, selectedEmbalagem!, user?.id);
      if (stockR) {
        setStock(stockR);
      } else {
        console.log('Stock não criado.')
      }
    }
  }

  const onCloseStock = () => {
    setIsOpenStock(false);
    setMessageStock("");
  }

  const setMessageS = (msg: string) => {
    setMessageStock(msg);
    setStock(null);
  }

  const setMessageSStoqueAtualization = (msg: string) => {
    setMessageStock(msg);
  }

  const stockSucssesZero = () => {
    formData.QUANTIDADECONTABILIZADA = '0';
  }

  // Função para abrir/fechar grupo
  const toggleNome = (nome: string) => {
    setExpandedNome(prev => (prev === nome ? null : nome));
  };

  if (isValidatingProjetos && !isValidatingItems && !isValidatingEmbalagens && !isValidatingSumsTotal) return <IsLoading />;

  if (errorProjetos || errorItems || errorEmbalagens || errorSumsTotal) {
    return (
      <PageWithDrawer sectionName="Erro" currentPage="entradas_embalagem">
        <div className="flex items-center justify-center min-h-[100dvh] px-4">
          <div className="relative z-10 max-w-md w-full">
            <div className="bg-red-900/20 border border-red-800 rounded-2xl p-6 sm:p-8 text-center">
              <div className="w-16 h-16 bg-red-900/50 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-red-400 text-2xl">⚠️</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-red-400 mb-4">Erro no Sistema</h2>
              <p className="text-red-300 text-sm sm:text-base mb-6">
                {errorProjetos?.message || errorItems?.message || errorEmbalagens?.message || errorSumsTotal?.message}
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

  return (
    <PageWithDrawer 
      sectionName="Entradas de Embalagem" 
      currentPage="entradas_embalagem"
      projectName={projectItems?.nome}
    >
      {/* Header Fixo */}
      <div className="lg:fixed lg:top-0 lg:left-0 lg:right-0 lg:z-20 lg:bg-slate-900/95 lg:backdrop-blur-sm lg:border-b lg:border-slate-700">
        <div className="px-4 pt-16 pb-4 lg:pt-6 lg:pb-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            
            {/* Header Principal */}
            <div className="flex items-center justify-between mb-4 lg:mb-6">
              {/* Título e Ícone */}
              <div className="flex items-center space-x-3 lg:space-x-4">
                <div className="w-9 h-9 lg:w-12 lg:h-12 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-lg lg:rounded-2xl flex items-center justify-center shadow-lg">
                  <Package size={16} className="lg:w-6 lg:h-6 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-base lg:text-2xl xl:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-600 truncate">
                    Entradas de Embalagem
                  </h1>
                  <p className="text-slate-400 text-xs lg:text-sm hidden lg:block">
                    {projectItems?.nome ? `Projeto: ${projectItems.nome}` : 'Controle de entrada de itens'}
                  </p>
                </div>
              </div>
              
              {/* Estatísticas Rápidas - Desktop */}
              <div className="hidden lg:flex items-center space-x-3">
                {projectItems && (
                  <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl px-4 py-2">
                    <div className="flex items-center space-x-2">
                      <Folder size={16} className="text-blue-400" />
                      <span className="text-slate-300 text-sm font-medium">
                        {Object.keys(groupedByNomeGenero).length} grupos
                      </span>
                    </div>
                  </div>
                )}
                {selectedEmbalagem && (
                  <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl px-4 py-2">
                    <div className="flex items-center space-x-2">
                      <Users size={16} className="text-emerald-400" />
                      <span className="text-slate-300 text-sm font-medium">
                        {selectedEmbalagem.nome}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Controles de Seleção */}
            <div className="bg-slate-800/30 lg:bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl lg:rounded-2xl p-3 lg:p-4 shadow-lg">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                
                {/* Seleção de Projeto */}
                <div className="flex-1">
                  <SelectedEntries projetos={projetos} onSelectChange={handleProjectChange} />
                </div>
                
                {/* Seleção de Embalagem */}
                <div className="flex-1">
                  <SelectedEntriesEmb embalagens={embalagens} onSelectChangeEmb={handleEmbalagemChange} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="px-4 pt-4 lg:pt-[15rem] pb-8 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Contador de Resultados - Mobile */}
          <div className="lg:hidden flex items-center justify-center mb-6">
            <div className="bg-slate-800/50 border border-slate-700 rounded-full px-4 py-2">
              <span className="text-slate-300 text-xs font-medium">
                {projectItems ? `${Object.keys(groupedByNomeGenero).length} grupos de itens` : 'Selecione um projeto'}
              </span>
            </div>
          </div>

          {/* Lista de Itens */}
          <div className="space-y-4 lg:space-y-6">
            {(projectItems && projectItems.itensProject && projectItems.itensProject.length > 0) ? (
              Object.entries(groupedByNomeGenero).map(([nome, itens], groupIndex) => (
                <motion.div 
                  key={nome}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: groupIndex * 0.1 }}
                  className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl overflow-hidden"
                >
                  {/* Header do Grupo */}
                  <button
                    onClick={() => toggleNome(nome)}
                    className={`w-full flex justify-between items-center px-4 lg:px-6 py-3 lg:py-4
                       bg-slate-700/30 hover:bg-slate-700/50 transition-all duration-300 
                       ${expandedNome === nome ? 'bg-slate-700/50' : ''}`}
                     >
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 lg:w-3 lg:h-3 rounded-full ${
                        expandedNome === nome ? 'bg-emerald-400' : 'bg-slate-400'
                      }`}></div>
                      <span className={`text-sm lg:text-base font-semibold ${
                        expandedNome === nome ? 'text-emerald-400' : 'text-slate-300'
                      }`}>
                        {nome}
                      </span>
                      <span className="text-slate-500 text-xs lg:text-sm">
                        ({itens.length} item{itens.length !== 1 ? 's' : ''})
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-slate-400 text-xs lg:text-sm ${
                        expandedNome === nome ? 'text-emerald-400' : ''
                      }`}>
                        {expandedNome === nome ? 'R' : 'E'}
                      </span>
                      {expandedNome === nome ? (
                        <ChevronUp size={16} className="text-emerald-400" />
                      ) : (
                        <ChevronDown size={16} className="text-slate-400" />
                      )}
                    </div>
                  </button>

                  {/* Conteúdo do Grupo */}
                  <AnimatePresence>
                    {expandedNome === nome && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="p-4 lg:p-6 space-y-3">
                          {itens.map((item, index) => (
                            <motion.div
                              key={item.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.2, delay: index * 0.05 }}
                            >
                              <ItemsProjects
                                item={item}
                                index={index}
                                onClick={() =>
                                  handleItemClick(item, selectedEmbalagem?.id, item.id, projectItems)
                                }
                                itemTamanhoId={item.id}
                                embalagemId={selectedEmbalagem?.id}
                              />
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))
            ) : (projectItems && projectItems.itensProject && projectItems.itensProject.length === 0) ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="text-center py-12 lg:py-16"
              >
                <div className="w-16 h-16 lg:w-20 lg:h-20 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4 lg:mb-6 border border-slate-700">
                  <Folder size={32} className="lg:w-10 lg:h-10 text-blue-500" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl lg:text-2xl font-semibold text-blue-400 mb-3 lg:mb-4">
                  Projeto sem itens
                </h3>
                <p className="text-slate-500 text-sm lg:text-base max-w-md mx-auto mb-4 lg:mb-6">
                  Este projeto ainda não possui itens cadastrados. Selecione outro projeto para continuar.
                </p>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="text-center py-12 lg:py-16"
              >
                <div className="w-16 h-16 lg:w-20 lg:h-20 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4 lg:mb-6 border border-slate-700">
                  <Package size={32} className="lg:w-10 lg:h-10 text-emerald-500" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl lg:text-2xl font-semibold text-emerald-400 mb-3 lg:mb-4">
                  Configure a Entrada
                </h3>
                <div className="space-y-2 text-slate-400 text-sm lg:text-base">
                  <p>1. Selecione um projeto</p>
                  <p>2. Selecione o embalador</p>
                  <p>3. Escolha os itens para entrada</p>
                </div>
              </motion.div>
            )}
          </div>

          {/* Botão de Cadastro - Mobile */}
          <div className="lg:hidden mt-8">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-4 text-center">
              <p className="text-slate-500 text-xs mb-3">NÃO POSSUI CADASTRO?</p>
              <button 
                onClick={() => setModalOpenEmb(true)}
                type="button"
                disabled={true}
                className="w-full px-4 py-3 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <Plus size={16} />
                <span>CADASTRAR EMBALADOR</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modais */}
      {selectedItem && (
        <ModalItemDetails
          totals={totalsProdEmb}
          isOpen={isModalOpen}
          item={selectedItem}
          embalagem={selectedEmbalagem}
          formData={formData}
          IsOpenStock={isOpenStock}
          setFormData={handleFormDataChange}
          onClose={handleCloseModal}
          mutationAll={mutationAll}
          updateStockEndEntryInput={updateStockEndEntryInput}
        />
      )}
      
      {/* Componente Modal */}
      <Modal isOpen={isModalOpenCodeInvalid} message={modalMessage} onClose={closeModal} />
      <ModalCancel isOpenCancel={isOpenCancel} finalizarOp={handleCloseModalContinue} messageCancel={modalMessageCancel} onCloseCancel={handleCloseModalCancel} />
      <ModalEmbCad isModalOpenEmb={isModalOpenEmb} handleCloseModalEmb={handleCloseModalEmb} mutate={swrMutate} />
      <ModalStockAtualization
        isOpenStock={isOpenStock}
        messageStock={messageStock}
        onCloseStock={onCloseStock}
        setMessageS={setMessageS}
        stock={stock}
        mutateStock={mutationStock}
        stockSucssesZero={stockSucssesZero}
        setMessageSStoqueAtualization={setMessageSStoqueAtualization}
      />
    </PageWithDrawer>
  );
}
