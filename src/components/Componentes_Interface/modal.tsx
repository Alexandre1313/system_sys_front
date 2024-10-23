import React from 'react';

interface ModalProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, message, onClose }) => {
  if (!isOpen) return null; // Não renderiza se não estiver aberto

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-custonWhite p-12 rounded-md shadow-md min-w-[350px] min-h-[200px] gap-y-4 
      flex flex-col items-center justify-between">
        <h2 className="text-3xl text-black font-semibold">Atenção !</h2>
        <p className={`flex text-[20px] text-black`}>{message}</p>
        <button
          className="mt-4 bg-green-600 text-white px-12 py-2 rounded"
          onClick={onClose}
        >
          Fechar
        </button>
      </div>
    </div>
  );
};

export default Modal
