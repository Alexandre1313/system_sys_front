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
import TitleComponentFixed from '@/components/ComponentesInterface/TitleComponentFixed';
import { useAuth } from '@/contexts/AuthContext';
import { getEmb, getProdEmbDay, getProjectsItems, getProjectsSimp } from '@/hooks_api/api';
import { useState } from 'react';
import useSWR from 'swr';
import { Embalagem, FormDateInputs, ProjectItems, ProjetosSimp, QtyEmbDay, Stock } from '../../../core';
import { objectsStockEmbs, processarQtdParaEstoque } from '../../../core/utils/regraas_de_negocio';

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
      <div className="flex items-center justify-center min-h-[96vh] w-[100%]">
        <p style={{ color: 'red', fontSize: '25px', fontWeight: '700' }}>
          Erro: {errorProjetos?.message || errorItems?.message || errorEmbalagens?.message || errorSumsTotal?.message}
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-w-screen min-h-screen justify-start items-start px-3 py-3 gap-x-3">
      <TitleComponentFixed stringOne={`EMBALAGENS`} twoPoints={`${projectItems?.nome ? '-': ''}`}
       stringTwo={`${projectItems?.nome ? projectItems.nome: ''}`} />
      <div className="sticky top-14 flex flex-col max-w-[400px] min-w-[400px] bg-[#1F1F1F] 
        rounded-md p-5 justify-between items-start min-h-[92.7vh] gap-y-5">
        <div className="flex flex-col w-full justify-start items-start gap-y-5">
          <SelectedEntries projetos={projetos} onSelectChange={handleProjectChange} />
          <SelectedEntriesEmb embalagens={embalagens} onSelectChangeEmb={handleEmbalagemChange} />
        </div>
        <div className="flex flex-col w-full justify-center items-center gap-y-5">
          <p className={`text-[15px] text-zinc-600`}>NÃO POSSUI CADASTRO?</p>
          <button onClick={() => setModalOpenEmb(true)}
            type="button"
            disabled={true}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg w-full"
          >
            CADASTRE-SE
          </button>
        </div>
      </div>
      <div className="flex pt-12 flex-col border-0 gap-y-3 border-zinc-700 flex-1 rounded-md p-0 justify-start items-start min-h-[95.7vh]">
        {(projectItems && projectItems.itensProject && projectItems.itensProject.length > 0) ? (
          Object.entries(groupedByNomeGenero).map(([nome, itens]) => (
            <div key={nome} className="w-full rounded-md">
              <button
                onClick={() => toggleNome(nome)}
                className={`w-full flex justify-between items-center px-2 py-3 bg-[#1f1f1f]
                ${expandedNome === nome ? 'bg-zinc-700' : ''} hover:bg-zinc-700 text-zinc-500 font-semibold rounded-t`}
              >
                <span className={`${expandedNome === nome ? 'text-green-600' : ''}`}>{nome}</span>
                <span className={`${expandedNome === nome ? 'text-green-600' : ''}`}>{expandedNome === nome ? '▲' : '▼'}</span>
              </button>
              {expandedNome === nome && (
                <div className="flex flex-col w-full">
                  {itens.map((item, index) => (
                    <ItemsProjects
                      key={item.id}
                      item={item}
                      index={index}
                      onClick={() =>
                        handleItemClick(item, selectedEmbalagem?.id, item.id, projectItems)
                      }
                      itemTamanhoId={item.id}
                      embalagemId={selectedEmbalagem?.id}
                    />
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (projectItems && projectItems.itensProject && projectItems.itensProject.length === 0) ? (
          <div className={`flex justify-center items-center h-full flex-1 w-full flex-col`}>
            <p className={`text-xl text-blue-500`}>PROJETO AINDA NÃO POSSUI ITENS CADASTRADOS, SELECIONE OUTRO.</p>
          </div>
        ) : (
          <div className={`flex justify-center items-center h-full flex-1 w-full flex-col`}>
            <p className={`text-xl text-green-500`}>1 - SELECIONE UM PROJETO.</p>
            <p className={`text-xl text-green-500`}>2 - SELECIONE O EMBALADOR.</p>
          </div>
        )}
      </div>
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
    </div>
  );
}
