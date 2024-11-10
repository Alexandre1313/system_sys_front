import { FC } from 'react';
import { ProjectItems, Embalagem } from '../../../core';
import ItemGradeInputTextState from '../Componentes_Grade/ItemsGradeImputTextState';
import BotaoArrowLeft from '../Componentes_Interface/BotaoArrowLeft';
import { motion } from 'framer-motion';

interface ModalItemDetailsProps {
    isOpen: boolean;
    item: ProjectItems['itensProject'][0];
    embalagem: Embalagem | null | undefined;
    formData: any;
    setFormData: (form: any) => void;
    onClose: () => void;
}

const ModalItemDetails: FC<ModalItemDetailsProps> = ({ formData, setFormData, isOpen, item, embalagem, onClose }) => {
    if (!isOpen) return null;

    const embNotSelect = embalagem ? 'text-green-500' : 'text-red-500'

    return (

        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
            <motion.div
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className="bg-[#222222] p-5 rounded-md w-full max-w-[60%] min-h-[80vh] flex
             justify-center items-center"
            >
                <div className={`flex w-[60%] p-2 flex-col min-h-[75vh] justify-between`}>
                    <div className={`flex flex-col justify-center items-center gap-y-16`}>
                        <div className={`flex items-center justify-start w-full gap-x-5`}>
                            <span className={`text-2xl text-zinc-500`}>
                                {'EMBALADOR:'}
                            </span>
                            <span className={`text-2xl ${embNotSelect}`}>
                                {embalagem?.nome || 'NÃO SELECIONADO'}
                            </span>
                        </div>
                        <div className={`flex flex-col items-center justify-start w-full gap-y-2`}>
                            <div className={`flex items-center justify-start w-full gap-x-5`}>
                                <div className={`flex items-center justify-center w-auto h-auto gap-x-5`}>
                                    <span className={`text-xl text-zinc-500`}>
                                        {'ITEM:'}
                                    </span>
                                    <span className={`text-xl text-zinc-300`}>
                                        {item.nome}
                                    </span>
                                </div>
                                <div className={`flex items-center justify-center w-auto h-auto gap-x-5`}>
                                    <span className={`text-xl text-zinc-500`}>
                                        {'GÊNERO:'}
                                    </span>
                                    <span className={`text-xl text-zinc-300`}>
                                        {item.genero}
                                    </span>
                                </div>
                            </div>
                            <div className={`flex items-center justify-start w-full gap-x-5`}>
                                <div className={`flex items-center justify-center w-auto h-auto gap-x-5`}>
                                    <span className={`text-xl text-zinc-500`}>
                                        {'TAMANHO:'}
                                    </span>
                                    <span className={`text-xl text-zinc-300`}>
                                        {item.tamanho}
                                    </span>
                                </div>
                                <div className={`flex items-center justify-center w-auto h-auto gap-x-5`}>
                                    <span className={`text-xl text-zinc-500`}>
                                        {'CÒDIGO DE BARRAS:'}
                                    </span>
                                    <span className={`text-xl text-zinc-300`}>
                                        {item.barcode}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="">
                        <BotaoArrowLeft onClick={onClose} stringButtton={`VOLTAR`} iconSize={20}
                            bgColor={"bg-red-700"} bgHoverColor={"hover:bg-red-600"} strokeWidth={3} />
                    </div>
                </div >
                <div className={`flex w-[40%] p-2 flex-col min-h-[75vh] justify-between`}>
                    <div className={``}>
                        <ItemGradeInputTextState labelName={'CÓD DE BARRAS LEITURA'}
                            formData={formData} setFormData={setFormData}
                            txtSize={`text-[23px]`}
                            placeholder={`Informe o código de barras`}
                            isFocus={`border border-emerald-300 focus:border-emeral-500 focus:outline-none 
                                        focus:ring focus:ring-emerald-500`}
                            labelColor={`text-emerald-500`} />
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default ModalItemDetails;
