import { finalizarGrades } from '@/hooks_api/api';
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { Loader } from 'react-feather';
import { EscolaGrade } from '../../../core';
import { Status } from '../../../core/interfaces/Status';

interface ModalEncGradeProps {
    isOpen: boolean;
    message: string;
    onClose: () => void;
    mutate: () => void; // Recebe o mutate da página principal como prop
    escolaGrade: EscolaGrade | null;
}

const ModalEncGrade: React.FC<ModalEncGradeProps> = ({ isOpen, message, onClose, mutate, escolaGrade }) => {
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
        // ✅ CORREÇÃO: Verificar se escolaGrade é válido
        if (!escolaGrade?.gradeId) {
            setMsg('Erro: Dados da grade não encontrados');
            setIsError(true);
            return;
        }

        setIsLoading(true);
        setIsError(false); // Reset error state on new attempt
        try {
            console.log('🔍 Finalizando grade:', { 
                gradeId: escolaGrade.gradeId, 
                finalizada: true, 
                status: Status.EXPEDIDA 
            });
            
            const data = await finalizarGrades({ 
                id: escolaGrade.gradeId, 
                finalizada: true, 
                status: Status.EXPEDIDA 
            });
            
            if (data) {
                console.log('✅ Grade finalizada com sucesso:', data);
                setMsg('Grade finalizada com sucesso!');
                
                // ✅ CORREÇÃO: Chamar mutate antes de fechar
                mutate();
                
                const timeout = setTimeout(() => {
                    onClose();
                    clearTimeout(timeout);
                }, 1500);
            } else {
                throw new Error('Resposta inválida do servidor');
            }
        } catch (error) {
            console.error('❌ Erro ao finalizar grade:', error);
            setMsg(`Erro ao encerrar a grade: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
            setIsError(true);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start lg:items-center justify-center z-50 pt-8">
            <motion.div
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className="bg-white p-4 lg:p-8 rounded-md shadow-md lg:min-w-[400px] min-w-[90%] lg:min-h-[250px] min-h-[20%] gap-y-4 
                flex flex-col items-center justify-center m-4 lg:m-8"
            >
                <h2 className="text-3xl text-black font-semibold">
                    <Loader
                        className={isLoading ? 'animate-rotate' : ''}
                        size={70}
                        color={`rgba(0, 128, 0, 0.7)`}
                    />
                </h2>
                
                <p className={`flex lg:text-[16px] text-[14px] text-black uppercase font-semibold text-center ${
                    isError ? 'text-red-600' : 'text-green-600'
                }`}>
                    {msg}
                </p>
                
                {isError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 w-full">
                        <p className="text-red-700 text-sm text-center">
                            💡 <strong>Dica:</strong> Verifique se a grade possui dados válidos e tente novamente.
                        </p>
                    </div>
                )}
                
                <div className="flex lg:flex-row flex-col w-full lg:justify-center justify-center mt-4 gap-4">
                    {/* Botão Cancelar */}
                    <button
                        className={`w-full text-white px-6 lg:px-12 py-2 rounded text-[14px] ${isLoading ? 'bg-gray-400' : 'bg-gray-500 hover:bg-gray-700'}
                            items-center justify-center hidden`}
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        Cancelar
                    </button>
                    
                    {/* Botão Encerrar Grade */}
                    <button
                        className={`w-full text-white px-6 lg:px-12 py-2 rounded text-[14px] ${isLoading ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-700'}
                              flex items-center justify-center`}
                        onClick={handleFinalizeGrade}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Finalizando...' : isError ? 'Tentar Novamente' : 'Encerrar Grade'}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default ModalEncGrade;
