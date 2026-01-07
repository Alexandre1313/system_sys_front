import { AnimatePresence, motion } from 'framer-motion';
import React, { useCallback, useEffect } from 'react';
import { AlertTriangle } from 'react-feather';

interface ModalProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, message, onClose }) => {
  // Função para definir o som com base na mensagem
  const getSoundForMessage = (message: string) => {
    if (message.includes('Código de barras')) {
      return '/error3.mp3'; // Som específico para código inválido
    } else if (message.includes('Quantidade total')) {
      return '/error2.mp3'; // Som específico para quantidade excedida
    }
    return '/error1.mp3'; // Som padrão
  };

  // Memoiza a função handleKeyDown para evitar recriações desnecessárias
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Previne comportamento padrão
      event.stopPropagation(); // Impede propagação para outros elementos
      onClose(); // Fecha o modal quando pressionar Enter
    }
  }, [onClose]);

  // Adicionar evento de teclado APENAS quando o modal estiver aberto
  useEffect(() => {
    if (!isOpen) return; // Não adiciona listener se modal estiver fechado

    window.addEventListener("keydown", handleKeyDown);

    // Limpeza do evento ao desmontar o componente
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  useEffect(() => {
    if (isOpen) {
      const soundFile = getSoundForMessage(message); // Determina o som baseado na mensagem
      const audio = new Audio(soundFile); // Cria o novo áudio
      audio.play(); // Reproduz o som
    }
  }, [isOpen, message]); // Executa o efeito quando isOpen ou message mudam

  if (!isOpen) return null; // Não renderiza se não estiver aberto

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className='flex p-8'>
        <AnimatePresence initial={false}>
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{
              opacity: { duration: 0.18 },
              y: { duration: 0.28, ease: [0.22, 1, 0.36, 1] },
              scale: { duration: 0.28, ease: [0.22, 1, 0.36, 1] }
            }}
            style={{ willChange: 'transform, opacity' }}
            className="bg-white lg:p-8 p-4 rounded-md shadow-md lg:min-w-[350px] lg:min-h-[200px] lg:gap-y-4 gap-y-2
                       flex flex-col items-center justify-between"
          >
            <h2 className="lg:text-3xl text-[9px] text-black font-semibold">
              <AlertTriangle size={60} color={`rgba(255, 180, 0, 1)`} />
            </h2>
            <p className={`flex text-[15px] w-full text-wrap text-center lg:text-[20px] whitespace-pre-line
             text-black uppercase font-bold line leading-tight`}>{message}</p>
            <button
              className="mt-2 bg-blue-900 hover:bg-blue-700 text-white px-12 py-2
            rounded lg:text-[18px] text-[13px] flex gap-x-5 items-center justify-center"
              onClick={onClose}
            >
              OK (ENTER)
            </button>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Modal;
