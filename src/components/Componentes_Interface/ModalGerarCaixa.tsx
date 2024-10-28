import React, { useEffect, useState } from 'react';
import { Loader } from 'react-feather';
import Caixa from '../../../core/interfaces/Caixa';
import CaixaResume from './CaixarResume';
import { inserirCaixa } from '@/hooks_api/api';

interface ModalGerarCaixaProps {
  box: Caixa | null;
  isOpen: boolean;
  message: string;
  onClose: () => void;
  mutate: () => void;
  handleNumberBox: (numeracaixa: string) => void;
}

const ModalGerarCaixa: React.FC<ModalGerarCaixaProps> = ({ isOpen, message, box, onClose, mutate, handleNumberBox }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [msg, setMsg] = useState<string>(message);
  const [isError, setIsError] = useState(false);

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
      const data = await inserirCaixa(box);      
      if (data) {
        mutate(); 
        setMsg(`Caixa encerrada com sucesso!`); 
        handleNumberBox(String(data.caixaNumber))
        const timeout = setTimeout(() => {
          onClose()
          clearTimeout(timeout)
        }, 1500)
      }
    } catch (error) {      
      console.error("Erro ao encerrar a caixa:", error); 
      setMsg('Erro ao encerrar a caixa, tente novamente.'); 
      setIsError(true); 
    } finally {      
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-md shadow-md min-w-[550px] min-h-[280px] gap-y-4 
      flex flex-col items-center justify-between">
        <h2 className="text-3xl text-black font-semibold">
          <Loader
            className={isLoading ? 'animate-rotate' : ''}
            size={60}
            color={`rgba(234, 170, 0, 0.7)`}
          />
        </h2>
        <p className="flex text-[16px] text-black uppercase font-semibold text-center">{msg}</p>
        <div className={`flex justify-center items-center w-full`}>
          <CaixaResume caixa={box} />
        </div>
        <div className="flex w-full justify-between mt-4 gap-4">
          {/* Botão Encerrar Grade */}
          <button
            className={`w-full text-white px-12 py-2 rounded text-[14px] ${isLoading ? 'bg-gray-400' : 'bg-yellow-500 hover:bg-yellow-700'}
            flex items-center justify-center`}
            onClick={handleGerarCaixa}
            disabled={isLoading}
          >
            {isLoading ? 'Finalizando...' : isError ? 'Tentar Novamente' : 'Encerrar Caixa'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalGerarCaixa;
