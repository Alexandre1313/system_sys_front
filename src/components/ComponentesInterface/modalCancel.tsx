import { motion, AnimatePresence } from 'framer-motion';
import React, { useEffect } from 'react';
import { CheckCircle, AlertTriangle, X } from 'react-feather';

interface modalCancelProps {
  isOpenCancel: boolean;
  messageCancel: string;
  onCloseCancel: () => void;
  finalizarOp: () => void;
}

const ModalCancel: React.FC<modalCancelProps> = ({ isOpenCancel, messageCancel, onCloseCancel, finalizarOp }) => {
  // Função para definir o som com base na mensagem
  const getSoundForMessage = (message: string) => {
    if (message.includes('Código de barras inválido')) {
      return '/error3.mp3';
    } else if (message.includes('Quantidade excedida')) {
      return '/error2.mp3';
    }
    return '/error1.mp3';
  };

  useEffect(() => {
    if (isOpenCancel) {
      const soundFile = getSoundForMessage(messageCancel);
      const audio = new Audio(soundFile);
      audio.play();
    }
  }, [isOpenCancel, messageCancel]);

  return (
    <AnimatePresence>
      {isOpenCancel && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="bg-slate-800/95 backdrop-blur-sm border border-slate-700 rounded-xl lg:rounded-2xl 
            w-full max-w-[98%] sm:max-w-[500px] lg:max-w-[600px] shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-900/50 to-slate-800/50 border-b border-slate-700 px-3 lg:px-6 py-2 lg:py-4">
              <h2 className="text-lg lg:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-500">
                Atenção
              </h2>
              <p className="text-slate-400 text-xs lg:text-sm">Confirmação necessária</p>
            </div>

            {/* Content */}
            <div className="p-3 lg:p-6 space-y-3 lg:space-y-6">
              
              {/* Icon and Message */}
              <div className="flex flex-col items-center justify-center space-y-3 lg:space-y-4 p-3 lg:p-6 rounded-lg lg:rounded-xl border border-yellow-500/30 bg-yellow-500/10">
                <div className="flex items-center justify-center w-12 h-12 lg:w-20 lg:h-20 rounded-full bg-slate-900/50">
                  <AlertTriangle className="text-yellow-400" size={40} />
                </div>
                <p className="text-center text-slate-200 text-xs lg:text-base font-semibold px-2 lg:px-4">
                  {messageCancel}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 lg:gap-4">
                <button
                  className="flex-1 px-4 lg:px-6 py-3 rounded-xl font-semibold text-sm lg:text-base
                    transition-all duration-300 transform hover:scale-105
                    flex items-center justify-center space-x-2
                    bg-slate-700 hover:bg-slate-600 text-white"
                  onClick={finalizarOp}
                >
                  <X size={18} />
                  <span>Continuar</span>
                </button>

                <button
                  className="flex-1 px-4 lg:px-6 py-3 rounded-xl font-semibold text-sm lg:text-base
                    transition-all duration-300 transform hover:scale-105
                    flex items-center justify-center space-x-2
                    bg-red-600 hover:bg-red-500 text-white"
                  onClick={onCloseCancel}
                >
                  <CheckCircle size={18} />
                  <span>Finalizar Operação</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ModalCancel;
