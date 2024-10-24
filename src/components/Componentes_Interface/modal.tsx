import React from 'react';
import { AlertTriangle, X } from 'react-feather';

interface ModalProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, message, onClose }) => {
  if (!isOpen) return null; // Não renderiza se não estiver aberto

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-md shadow-md min-w-[350px] min-h-[200px] gap-y-4 
      flex flex-col items-center justify-between">
        <h2 className="text-3xl text-black font-semibold">
          <AlertTriangle size={70} color={`rgba(255, 0, 0, 1)`}/>          
        </h2>
        <p className={`flex text-[16px] text-black uppercase font-semibold`}>{message}</p>
        <button
          className="mt-4 bg-blue-900 hover:bg-blue-700 text-white px-12 py-2
           rounded text-[14px] flex gap-x-5 items-center justify-center"
          onClick={onClose}
        >
          <X size={15}/>
          FECHAR
        </button>
      </div>
    </div>
  );
};

export default Modal
