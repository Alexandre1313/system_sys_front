import { motion } from 'framer-motion';
import React, { useEffect } from 'react';
import { AlertTriangle, X } from 'react-feather';

interface ModalProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, message, onClose }) => {
  // Função para definir o som com base na mensagem
  const getSoundForMessage = (message: string) => {
    if (message.includes('Código de barras inválido')) {
      return '/error3.mp3'; // Som específico para código inválido
    } else if (message.includes('Quantidade excedida')) {
      return '/error2.mp3'; // Som específico para quantidade excedida
    }
    return '/error1.mp3'; // Som padrão
  };

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
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.7 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="bg-white p-8 rounded-md shadow-md min-w-[350px] min-h-[200px] gap-y-4 
      flex flex-col items-center justify-between"
      >
        <h2 className="text-3xl text-black font-semibold">
          <AlertTriangle size={70} color={`rgba(255, 0, 0, 1)`} />
        </h2>
        <p className={`flex text-[16px] text-black uppercase font-semibold`}>{message}</p>
        <button
          className="mt-4 bg-blue-900 hover:bg-blue-700 text-white px-12 py-2
           rounded text-[14px] flex gap-x-5 items-center justify-center"
          onClick={onClose}
        >
          <X size={15} />
          FECHAR
        </button>
      </motion.div>
    </div>
  );
};

export default Modal;
