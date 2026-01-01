import { inserirCaixa } from '@/hooks_api/api';
import { motion } from 'framer-motion';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowRight, Loader } from 'react-feather';
import Caixa from '../../../core/interfaces/Caixa';
import CaixaResume from './CaixarResume';

interface ModalGerarCaixaProps {
  box: Caixa | null;
  isOpen: boolean;
  message: string;
  isPend: boolean | null;
  setFormData: (key: string, value: string) => void;
  onClose: () => void;
  openEncGrade: () => void;
  mutate: () => void;
  handleNumberBox: (numeracaixa: string) => void;
  handlerCaixaPend: () => void;
  handlerCaixaPend2: () => void;
  zerarQuantidadesCaixa?: () => void; // ✅ NOVA PROP: Função para zerar quantidades após confirmar
}

const ModalGerarCaixa: React.FC<ModalGerarCaixaProps> = ({ isOpen, message, box, isPend, setFormData, openEncGrade, onClose, mutate, handleNumberBox, handlerCaixaPend, handlerCaixaPend2, zerarQuantidadesCaixa }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [msg, setMsg] = useState<string>(message);
  const [isError, setIsError] = useState(false);

  const encerrarCaixaRef = useRef<HTMLButtonElement>(null);

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

  const handleGerarCaixa = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      setMsg(`Por favor, aguarde...`);
      const data = await inserirCaixa(box);
      if (data) {
        // ✅ CORREÇÃO CRÍTICA: mutate() PRIMEIRO, depois zerarQuantidadesCaixa()
        // Isso garante que os dados do banco sejam recarregados ANTES de zerar os campos locais
        mutate();

        // ✅ CORREÇÃO: Zerar quantidades APÓS recarregar dados do banco
        if (zerarQuantidadesCaixa) {
          zerarQuantidadesCaixa();
        }

        setMsg(`Caixa encerrada com sucesso!`);
        handlerCaixaPend();
        handleNumberBox(String(data.caixaNumber))
        const timeout = setTimeout(() => {
          setFormData('TOTALNACAIXAATUAL', '0');
          onClose()
          openEncGrade()
          clearTimeout(timeout)
        }, 200)
      }
    } catch (error) {
      console.error("Erro ao encerrar a caixa:", error);
      localStorage.setItem('saveBox', JSON.stringify(box));
      setMsg('❌ Erro ao encerrar a caixa! Verifique sua conexão e tente novamente.');
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [box, zerarQuantidadesCaixa, mutate, handlerCaixaPend, handleNumberBox, setFormData, onClose, openEncGrade]);

  // Adicionar um evento de teclado global para diferentes ações
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isLoading) return; // Não permite ações durante carregamento

      if (event.key === "ArrowRight") {
        if (encerrarCaixaRef.current) {
          encerrarCaixaRef.current.click(); // Aciona o clique do botão principal
        }
      } else if (event.key === "Escape") {
        onClose(); // Fecha o modal quando pressionar ESC
      } else if (event.key === "Enter" && isError) {
        handleGerarCaixa(); // Tenta novamente quando há erro (Enter)
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Limpeza do evento ao desmontar o componente
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isLoading, onClose, isError, handleGerarCaixa]); // Adiciona isLoading, onClose, isError e handleGerarCaixa como dependências

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start lg:items-center justify-center z-50 pt-8 lg:pt-0">
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.7 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="bg-slate-800 border border-slate-600 p-4 rounded-md shadow-md lg:min-w-[659px] min-w-[90%] lg:min-h-[380px] min-h-[75%] gap-y-4 
        flex flex-col gap-x-3 items-center justify-between m-8"
      >
        <h2 className="text-3xl text-black font-semibold">
          <Loader
            className={isLoading ? 'animate-rotate' : ''}
            size={40}
            color={`rgba(234, 170, 0, 0.7)`}
          />
        </h2>
        <p className={`flex lg:text-[17px] text-[13px] uppercase font-bold text-center ${isError ? 'text-red-600' : 'text-emerald-600'
          }`}>
          {msg}
        </p>
        {isError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 w-full">
            <p className="text-red-700 text-sm text-center">
              💡 <strong>Dica:</strong> Use as teclas para navegar:<br />
              <span className="text-xs">→ Tentar Novamente | Enter Tentar Novamente | ESC Fechar</span>
            </p>
          </div>
        )}
        <div className={`flex justify-center items-center w-full`}>
          <CaixaResume caixa={box} />
        </div>
        <div className="flex lg:flex-row flex-col w-full lg:justify-between justify-center mt-1 gap-4">
          {/* Botão Cancelar Modal */}
          <button
            className={`w-full text-white px-12 py-3 rounded-xl text-[17px] ${isLoading ? 'bg-gray-400' : 'bg-gray-500 hover:bg-gray-700'}
            flex items-center justify-center`}
            onClick={onClose}
            disabled={isLoading}
          >
            CANCELAR (ESC)
          </button>

          {/* Botão Principal - Encerrar/Tentar Novamente */}
          <button
            ref={encerrarCaixaRef}
            className={`w-full text-white px-12 py-3 rounded-xl text-[17px] ${isLoading ? 'bg-gray-400' : 'bg-emerald-600 hover:bg-emerald-700'}
            flex items-center justify-center`}
            onClick={handleGerarCaixa}
            disabled={isLoading}
          >
            {isLoading ? 'Finalizando...' : isError ? 'Tentar Novamente' : (
              <span className="flex items-center gap-2">
                <span>FECHAR CAIXA</span>
                <span className="flex items-center gap-0 opacity-80">
                  (<ArrowRight size={18} strokeWidth={3}/>)
                </span>
              </span>
            )}
          </button>

          {/* Botão Cancelar Caixa - Removido quando há erro de persistência */}
          {/* Mantém apenas Cancelar + Tentar Novamente para preservar localStorage */}

          {/* Botão Limpar Caixa - Aparece quando há caixa pendente */}
          {isPend && !isError && (
            <button
              className={`w-full text-white px-12 py-3 rounded-xl text-[17px] ${isLoading ? 'bg-gray-400' : 'bg-orange-500 hover:bg-orange-700'}
              flex items-center justify-center`}
              onClick={handlerCaixaPend2}
              disabled={isLoading}
            >
              Limpar Caixa
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ModalGerarCaixa;
