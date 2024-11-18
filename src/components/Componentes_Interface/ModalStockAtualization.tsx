import React, { useEffect, useState } from 'react';
import { Loader } from 'react-feather';
import { motion } from 'framer-motion';
import { Stock } from '../../../core';
import StockQty from './StockQty';
import { stockGenerate } from '@/hooks_api/api';
import EntryInput from '../../../core/interfaces/EntryInput';

interface ModalStockAtualizationProps {
  stock: Stock | null;
  isOpenStock: boolean;
  messageStock: string;
  onCloseStock: () => void;
  mutateStock: () => void; 
  setMessageS: (msg: string) => void;
  stockSucssesZero: () => void;
  setMessageSStoqueAtualization: (msg: string) => void;
}

const ModalStockAtualization: React.FC<ModalStockAtualizationProps> = ({ isOpenStock, messageStock, stock, 
  mutateStock, onCloseStock, setMessageS, stockSucssesZero, setMessageSStoqueAtualization }) => {
  const [msg, setMsg] = useState<string>(messageStock);

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCancel, setIsLoadingCancel] = useState(false);
 
  const [isError, setIsError] = useState(false);
  const [isErrorCancel, setIsErrorCancel] = useState(false);

  const getSoundForMessage = (message: string) => {
    if (message.includes('Estoque atualizado com sucesso.')) {
      return '/caixasound.mp3';
    } else if (message.includes('Erro ao atualizar o estoque, tente novamente.')) {
      return '/error2.mp3';
    }
    return '/caixasound.mp3';
  };

  useEffect(() => {
    if (isOpenStock) {
      setMsg(messageStock); // Atualiza a mensagem ao abrir o modal
      const soundFile = getSoundForMessage(messageStock); // Obtém o som baseado na mensagem
      const audio = new Audio(soundFile); // Cria o novo áudio
      audio.play(); // Reproduz o som
    }
  }, [isOpenStock, messageStock]); // Executa o efeito quando `isOpen` ou `message` mudam

  const handleGerarEstoque = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      setMessageSStoqueAtualization(`Por favor, aguarde...`);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { embalagem, selectedtItem, ...dadosDoStock } = stock!;
      const data: EntryInput | null = await stockGenerate(dadosDoStock);   
      if (!data) {       
        setIsError(true);
        setIsLoading(false);
        setMessageSStoqueAtualization('Erro ao atualizar o estoque, tente novamente.');         
      }
      if (data) {
        setMessageSStoqueAtualization(`Estoque atualizado com sucesso!`);       
        stockSucssesZero();
        const timeout = setTimeout(() => {         
          onCloseStock();    
          mutateStock();       
          setIsLoading(false);
          clearTimeout(timeout);
        }, 1000)      
      }     
    } catch (error) {
      console.log(error);
      setMessageSStoqueAtualization('Erro ao atualizar o estoque, tente novamente.');
      setIsError(true);
      setIsLoading(false);
    } 
  };

  const handleCancelarEstoque = () => {
    setIsError(false);
    setMessageS('Cancelando...')
    setIsLoadingCancel(true);
    const timeout = setTimeout(() => {
      onCloseStock();  
      setIsLoadingCancel(false);   
      setIsErrorCancel(false);        
      clearTimeout(timeout);         
    }, 1500)     
  };

  if (!isOpenStock) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.7 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="bg-white p-8 rounded-md shadow-md min-w-[700px] min-h-[280px] gap-y-4 
      flex flex-col items-center justify-between"
      >
        <h2 className="text-3xl text-black font-semibold">
          <Loader
            className={isLoading || isLoadingCancel ? 'animate-rotate' : ''}
            size={60}
            color={`rgba(0, 128, 0, 0.7)`}
          />
        </h2>
        <p className="flex text-[17px] text-black uppercase font-bold text-center">{msg}</p>
        <div className={`flex justify-center items-center w-full`}>           
            {stock ? <StockQty stock={stock}/> : <div className={`text-black font-semibold`}>DADOS INDISPONÍVEIS</div>}
        </div>
        <div className="flex w-full justify-between mt-4 gap-4">         
          <button
            className={`w-full text-white px-12 py-2 rounded text-[14px] 
              ${isLoading || isLoadingCancel ? 'bg-gray-400' : 'bg-gray-900 hover:bg-gray-700'}
            flex items-center justify-center`}
            onClick={handleCancelarEstoque}
            disabled={isLoading || isLoadingCancel}
          >
            {isLoadingCancel ? 'Aguarde...' : isErrorCancel ? 'Tentar Novamente' : 'Cancelar'}
          </button>
          <button
            className={`w-full text-white px-12 py-2 rounded text-[14px]
             ${isLoading || isLoadingCancel ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'}
            flex items-center justify-center`}
            onClick={handleGerarEstoque}
            disabled={isLoading || isLoadingCancel}
          >
            {isLoading ? 'Aguarde...' : isError ? 'Tentar Novamente' : 'Confirma'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ModalStockAtualization
