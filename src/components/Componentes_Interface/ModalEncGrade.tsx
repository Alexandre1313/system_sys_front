import React, { useEffect, useState } from 'react';
import { Loader, X } from 'react-feather';

interface ModalEncGradeProps {
    isOpen: boolean;
    message: string;
    onClose: () => void;
    mutate: () => void; // Recebe o mutate da página principal como prop
}

const ModalEncGrade: React.FC<ModalEncGradeProps> = ({ isOpen, message, onClose, mutate }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [msg, setMsg] = useState<string>(message);
    const [isError, setIsError] = useState(false);

    const getSoundForMessage = (message: string) => {
        if (message.includes('Grade finalizada')) {
            return '/sucsses.mp3';
        } else if (message.includes('Erro ao encerrar a grade')) {
            return '/error2.mp3';
        }
        return '/sucsses.mp3';
    };

    useEffect(() => {
        if (isOpen) {
            setMsg(message); // Atualiza a mensagem ao abrir o modal
            const soundFile = getSoundForMessage(message); // Obtém o som baseado na mensagem
            const audio = new Audio(soundFile); // Cria o novo áudio
            audio.play(); // Reproduz o som
        }
    }, [isOpen, message]); // Executa o efeito quando `isOpen` ou `message` mudam

    const handleFinalizeGrade = async () => {
        setIsLoading(true);
        setIsError(false); // Reset error state on new attempt
        try {
            await new Promise((resolve) => setTimeout(resolve, 4000));
            mutate();
            setMsg('Grade finalizada com sucesso!'); // Atualiza mensagem para sucesso
            const timeout = setTimeout(() => {
                onClose()
                clearTimeout(timeout)
            }, 1500)
        } catch (error) {
            setMsg('Erro ao encerrar a grade, tente novamente.' + error);
            setIsError(true);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-md shadow-md min-w-[350px] min-h-[250px] gap-y-4 
            flex flex-col items-center justify-between">
                <h2 className="text-3xl text-black font-semibold">
                    <Loader
                        className={isLoading ? 'animate-rotate' : ''}
                        size={70}
                        color={`rgba(0, 128, 0, 0.7)`}
                    />
                </h2>
                <p className="flex text-[16px] text-black uppercase font-semibold text-center">{msg}</p>
                <div className="flex w-full justify-between mt-4 gap-4">
                    {/* Botão Encerrar Grade */}
                    <button
                        className={`w-full text-white px-12 py-2 rounded text-[14px] ${isLoading ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-700'}
                              flex items-center justify-center`}
                        onClick={handleFinalizeGrade}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Finalizando...' : isError ? 'Tentar Novamente' : 'Encerrar Grade'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalEncGrade;
