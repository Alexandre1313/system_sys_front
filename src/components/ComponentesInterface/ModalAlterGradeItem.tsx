import { gradeItemModify } from '@/hooks_api/api';
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { Loader } from 'react-feather';
import { GradeItem } from '../../../core';
import ItemGradeModificationAlert from './ItemGradeModificationAlert';

interface ModalAlterGradeItemProps {
  itemSelecionado?: GradeItem | null;
  isOpen: boolean;
  message: string;
  formData: { [key: string]: any };
  fecharTelaExped: () => void;
  onClose: () => void;
  mutate: () => void; 
}

const ModalAlterGradeItem: React.FC<ModalAlterGradeItemProps> = ({ itemSelecionado, formData, isOpen, message, onClose, mutate, fecharTelaExped }) => {
  let id = null, quantidade = null, quantidadeExpedida = null, itemTamanho = null;

  if (itemSelecionado) {
    ({ id, quantidade, quantidadeExpedida, itemTamanho } = itemSelecionado);
  }

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCancel, setIsLoadingCancel] = useState(false);

  const [msg, setMsg] = useState<string>(message);
  const [isError, setIsError] = useState(false);

  const [isErrorCancel, setIsErrorCancel] = useState(false);

  const getSoundForMessage = (message: string) => {
    if (message.includes('Grade finalizada')) {
      return '/caixasound.mp3';
    } else if (message.includes('REALMENTE DESEJA ALTERAR O ITEM DA GRADE ? A OPERAÇÃO NÃO PODE SER REVERTIDA !')) {
      return '/error2.mp3';
    }
    return '/caixasound.mp3';
  };

  useEffect(() => {
    if (isOpen) {
      setMsg(message); // Atualiza a mensagem ao abrir o modal
      const soundFile = getSoundForMessage(message); // Obtém o som baseado na mensagem
      const audio = new Audio(soundFile); // Cria o novo áudio
      audio.play(); // Reproduz o som
    }
  }, [isOpen, message]); // Executa o efeito quando `isOpen` ou `message` mudam

  const handleModifyGradeItem = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      setMsg(`Por favor, aguarde...`);
      const data = await gradeItemModify(id, quantidadeExpedida);
      if (data) {
        if (quantidadeExpedida === 0) {
          setMsg('Item excluído com sucesso!');
          mutate()
        }
        if (quantidadeExpedida! > 0) {
          setMsg('Item atualizado com sucesso!');
          mutate()
        }
        const timeout = setTimeout(() => {
          fecharTelaExped()          
          onClose()
          setMsg('')         
          clearTimeout(timeout)
        }, 500)
      }
      if (!data) {
        if (quantidadeExpedida === 0) {
          setMsg('Item não encontrado no banco de dados!');
        }
        if (quantidadeExpedida! > 0) {
          setMsg('Item não encontrado no banco de dados!');
        }
      }
    } catch (error) {
      console.error("Erro ao  atualizar item da grade:", error);
      setMsg('Erro ao atualizar o item de grade, tente novamente.');
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelarGradeItemModify = () => {
    setIsErrorCancel(false);
    setMsg('Cancelando...')
    setIsLoadingCancel(true);
    const timeout = setTimeout(() => {
      setIsLoadingCancel(false);
      setIsErrorCancel(false);
      onClose();
      clearTimeout(timeout);
    }, 500)
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 pt-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.7 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="bg-white p-8 rounded-md shadow-md max-w-[910px] min-h-[280px] gap-y-4 
         flex flex-col items-center justify-between"
      >
        <h2 className="text-3xl text-black font-semibold">
          <Loader
            className={isLoading || isLoadingCancel ? 'animate-rotate' : ''}
            size={60}
            color={`rgba(255, 0, 0, 0.9)`}
          />
        </h2>
       
        {Number(formData.QUANTIDADENACAIXAATUAL) > 0 ? (
          <p className="flex text-[17px] text-black uppercase font-bold text-center">
            HÁ QUANTIDADES AINDA NÃO CONTABILIZADAS, VERIFIQUE
          </p>
        ) : (
          <p className="flex text-[17px] text-black uppercase font-bold text-center">{msg}</p>
        )}

        <div className={`flex justify-center items-center w-full`}>
          {itemSelecionado ? (
            <ItemGradeModificationAlert
              id={id}
              quantidade={quantidade}
              quantidadeExpedida={quantidadeExpedida}
              itemTamanho={itemTamanho}
              formDataQty={Number(formData.QUANTIDADENACAIXAATUAL)}
            />
          ) : (
            <div className={`text-black font-semibold`}>DADOS INDISPONÍVEIS</div>
          )}
        </div>

        <div className="flex w-full justify-between mt-4 gap-4">
          <button
            className={`w-full text-white px-12 py-2 rounded text-[14px] 
                 ${isLoading || isLoadingCancel ? 'bg-gray-400' : 'bg-gray-900 hover:bg-gray-700'}
               flex items-center justify-center`}
            onClick={handleCancelarGradeItemModify}
            disabled={isLoading || isLoadingCancel}
          >
            {isLoadingCancel ? 'Aguarde...' : isErrorCancel ? 'Tentar Novamente' : 'Cancelar'}
          </button>
          <button
            className={`w-full text-white px-12 py-2 rounded text-[14px]
                ${isLoading || isLoadingCancel || quantidade === quantidadeExpedida || Number(formData.QUANTIDADENACAIXAATUAL) > 0 ? 'bg-gray-400' : 'bg-red-600 hover:bg-red-700'}`}
            onClick={handleModifyGradeItem}
            disabled={isLoading || isLoadingCancel || quantidade === quantidadeExpedida || Number(formData.QUANTIDADENACAIXAATUAL) > 0}
          >
            {isLoading ? 'Aguarde...' : isError ? 'Tentar Novamente' : 'Confirma'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ModalAlterGradeItem;
