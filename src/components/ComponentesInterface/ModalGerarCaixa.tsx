import { inserirCaixa } from '@/hooks_api/api';
import { motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';
import { Loader } from 'react-feather';
import Caixa from '../../../core/interfaces/Caixa';
import CaixaResume from './CaixarResume';

interface ModalGerarCaixaProps {
  box: Caixa | null;
  isOpen: boolean;
  message: string;
  isPend: boolean | null;
  setFormData: (key: string, value: string) => void;
  onClose: () => void;
  mutate: () => void;
  handleNumberBox: (numeracaixa: string) => void;
  handlerCaixaPend: () => void;
  handlerCaixaPend2: () => void;
}

const ModalGerarCaixa: React.FC<ModalGerarCaixaProps> = ({ isOpen, message, box, isPend, setFormData, onClose, mutate, handleNumberBox, handlerCaixaPend, handlerCaixaPend2 }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [msg, setMsg] = useState<string>(message);
  const [isError, setIsError] = useState(false);

  const encerrarCaixaRef = useRef<HTMLButtonElement>(null);

  const handleCaixaAtualChange = () => {
    const value = '0';
    setFormData('QUANTIDADENACAIXAATUAL', value);
  };

  const getSoundForMessage = (message: string) => {
    if (message.includes('Grade finalizada')) {
      return '/caixasound.mp3';
    } else if (message.includes('Erro ao encerrar a grade')) {
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

  const handleGerarCaixa = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      setMsg(`Por favor, aguarde...`);
      const data = await inserirCaixa(box);
      if (data) {
        mutate();
        setMsg(`Caixa encerrada com sucesso!`);
        handlerCaixaPend();
        handleNumberBox(String(data.caixaNumber))
        const timeout = setTimeout(() => {
          handleCaixaAtualChange()
          onClose()
          clearTimeout(timeout)
        }, 200)
      }
    } catch (error) {
      console.error("Erro ao encerrar a caixa:", error);
      localStorage.setItem('saveBox', JSON.stringify(box));
      setMsg('Erro ao encerrar a caixa, tente novamente.');
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Adicionar um evento de teclado global para o evento de seta direita
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        if (encerrarCaixaRef.current) {
          encerrarCaixaRef.current.click(); // Aciona o clique do botão "Encerrar Caixa"
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Limpeza do evento ao desmontar o componente
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []); // O hook é executado apenas uma vez quando o componente é montado

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start lg:items-center justify-center z-50 pt-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.7 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="bg-[#f7f7f7] p-4 rounded-md shadow-md lg:min-w-[40%] min-w-[90%] lg:min-h-[380px] min-h-[75%] gap-y-4 
        flex flex-col items-center justify-between m-8"
      >
        <h2 className="text-3xl text-black font-semibold">
          <Loader
            className={isLoading ? 'animate-rotate' : ''}
            size={30}
            color={`rgba(234, 170, 0, 0.7)`}
          />
        </h2>       
        <p className="text-red-500 flex lg:text-[17px] text-[10px] uppercase font-bold text-center">{msg}</p>
        <div className={`flex justify-center items-center w-full`}>
          <CaixaResume caixa={box} />
        </div>
        <div className="flex lg:flex-row flex-col w-full lg:justify-between justify-center mt-4 gap-4">
          {/* Botão Encerrar Grade */}
          <button
            ref={encerrarCaixaRef}
            className={`w-full text-white px-12 py-2 rounded text-[14px] ${isLoading ? 'bg-gray-400' : 'bg-yellow-500 hover:bg-yellow-700'}
            flex items-center justify-center`}
            onClick={handleGerarCaixa}
            disabled={isLoading}
          >
            {isLoading ? 'Finalizando...' : isError ? 'Tentar Novamente' : 'Encerrar Caixa'}
          </button>
          {isPend && (<button
            className={`w-full text-white px-12 py-2 rounded text-[14px] ${isLoading ? 'bg-gray-400' : 'bg-red-500 hover:bg-red-700'}
            flex items-center justify-center`}
            onClick={handlerCaixaPend2}
            disabled={isLoading}
          >
            {'Limpar Caixa'}
          </button>)}
        </div>
      </motion.div>
    </div>
  );
};

export default ModalGerarCaixa;
