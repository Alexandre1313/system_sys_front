import { stockGenerate } from '@/hooks_api/api';
import { motion, AnimatePresence } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { Loader, CheckCircle, XCircle, AlertTriangle } from 'react-feather';
import { Stock } from '../../../core';
import EntryInput from '../../../core/interfaces/EntryInput';
import StockQty from './StockQty';

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
      setMsg(messageStock);
      const soundFile = getSoundForMessage(messageStock);
      const audio = new Audio(soundFile);
      audio.play();
    }
  }, [isOpenStock, messageStock]);

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
    }, 1000)     
  };

  // Determinar o ícone e cor baseado no estado
  const getStatusIcon = () => {
    if (isLoading || isLoadingCancel) {
      return <Loader className="animate-spin text-blue-400" size={48} />;
    }
    if (isError) {
      return <XCircle className="text-red-400" size={48} />;
    }
    if (msg.includes('sucesso')) {
      return <CheckCircle className="text-emerald-400" size={48} />;
    }
    return <AlertTriangle className="text-yellow-400" size={48} />;
  };

  const getStatusColor = () => {
    if (isError) return 'border-red-500/30 bg-red-500/10';
    if (msg.includes('sucesso')) return 'border-emerald-500/30 bg-emerald-500/10';
    if (isLoading || isLoadingCancel) return 'border-blue-500/30 bg-blue-500/10';
    return 'border-yellow-500/30 bg-yellow-500/10';
  };

  return (
    <AnimatePresence>
      {isOpenStock && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="bg-slate-800/95 backdrop-blur-sm border border-slate-700 rounded-xl lg:rounded-2xl 
            w-full max-w-[98%] sm:max-w-[600px] lg:max-w-[700px] shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-900/50 to-slate-800/50 border-b border-slate-700 px-3 lg:px-6 py-2 lg:py-4">
              <h2 className="text-lg lg:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">
                Atualização de Estoque
              </h2>
              <p className="text-slate-400 text-xs lg:text-sm">Confirme a operação de entrada</p>
            </div>

            {/* Content */}
            <div className="p-3 lg:p-6 space-y-3 lg:space-y-6">
              
              {/* Status Icon and Message */}
              <div className={`flex flex-col items-center justify-center space-y-3 lg:space-y-4 p-3 lg:p-6 rounded-lg lg:rounded-xl border ${getStatusColor()}`}>
                <div className="flex items-center justify-center w-12 h-12 lg:w-20 lg:h-20 rounded-full bg-slate-900/50">
                  {getStatusIcon()}
                </div>
                <p className="text-center text-slate-200 text-xs lg:text-base font-semibold uppercase px-2 lg:px-4">
                  {msg}
                </p>
              </div>

              {/* Stock Data */}
              <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-lg lg:rounded-xl p-3 lg:p-4">
                {stock ? (
                  <StockQty stock={stock}/>
                ) : (
                  <div className="flex items-center justify-center space-x-2 py-4">
                    <AlertTriangle size={20} className="text-red-400" />
                    <span className="text-red-400 font-semibold text-sm lg:text-base">DADOS INDISPONÍVEIS</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
                <button
                  className={`flex-1 px-4 lg:px-6 py-3 rounded-xl font-semibold text-sm lg:text-base
                    transition-all duration-300 transform hover:scale-105
                    flex items-center justify-center space-x-2
                    ${isLoading || isLoadingCancel 
                      ? 'bg-slate-600 cursor-not-allowed opacity-50' 
                      : 'bg-slate-700 hover:bg-slate-600 text-white'
                    }`}
                  onClick={handleCancelarEstoque}
                  disabled={isLoading || isLoadingCancel}
                >
                  {isLoadingCancel ? (
                    <>
                      <Loader className="animate-spin" size={18} />
                      <span>Aguarde...</span>
                    </>
                  ) : isErrorCancel ? (
                    <span>Tentar Novamente</span>
                  ) : (
                    <>
                      <XCircle size={18} />
                      <span>Cancelar</span>
                    </>
                  )}
                </button>

                <button
                  className={`flex-1 px-4 lg:px-6 py-3 rounded-xl font-semibold text-sm lg:text-base
                    transition-all duration-300 transform hover:scale-105
                    flex items-center justify-center space-x-2
                    ${isLoading || isLoadingCancel 
                      ? 'bg-slate-600 cursor-not-allowed opacity-50' 
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    }`}
                  onClick={handleGerarEstoque}
                  disabled={isLoading || isLoadingCancel}
                >
                  {isLoading ? (
                    <>
                      <Loader className="animate-spin" size={18} />
                      <span>Aguarde...</span>
                    </>
                  ) : isError ? (
                    <>
                      <AlertTriangle size={18} />
                      <span>Tentar Novamente</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle size={18} />
                      <span>Confirmar</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ModalStockAtualization
