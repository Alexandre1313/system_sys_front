import { motion } from 'framer-motion';
import { FC } from 'react';
import { Embalagem, ProjectItems, QtyEmbDay } from '../../../core';
import BotaoArrowLeft from '../ComponentesInterface/BotaoArrowLeft';
import BotaoEstoqueContabilizacion from '../ComponentesInterface/BotaoEstoqueContabilizacion';
import ItemsEntryImputText from './ItemsEntryImputText';
import ItemsEntryImputTextState from './ItemsEntryImputTextState';
import ItemsEntryImputTextStateBlock from './ItemsEntryImputTextStateBlock';

interface ModalItemDetailsProps {
    isOpen: boolean;
    item: ProjectItems['itensProject'][0];
    embalagem: Embalagem | null | undefined;
    totals: QtyEmbDay | null;
    formData: { [key: string]: any };
    IsOpenStock: boolean;
    setFormData: (key: string, value: string) => void;
    onClose: () => void;
    mutationAll?: () => void;
    updateStockEndEntryInput: () => void,
}

const ModalItemDetails: FC<ModalItemDetailsProps> = ({ totals, formData, setFormData, isOpen, item, embalagem, IsOpenStock,
    onClose, updateStockEndEntryInput }) => {
    if (!isOpen) return null;

    const embNotSelect = embalagem ? 'text-green-500' : 'text-red-500'
    const qtyTotalEmb = totals?.quantidadeTotalEmbalagem ? totals.quantidadeTotalEmbalagem : '0';
    const qtyTotalDiaItem = totals?.quantidadeTotalItem ? totals.quantidadeTotalItem : '0';
    const qtyEstoque = totals?.quantidadeEstoque ? totals.quantidadeEstoque : '0';

    return (

        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
            <motion.div
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className="bg-zinc-900 p-5 rounded-md w-full max-w-[70%] min-h-[75vh] flex
             justify-center items-center border border-zinc-600"
            >
                <div className={`flex w-[60%] p-2 flex-col min-h-[75vh] justify-between`}>
                    <div className={`flex flex-col justify-center items-center gap-y-8`}>
                        <div className={`flex items-center justify-start w-full gap-x-5 border-b pb-2 border-zinc-700`}>
                            <span className={`text-xl text-zinc-500`}>
                                {'EMBALADOR:'}
                            </span>
                            <span className={`text-xl ${embNotSelect}`}>
                                {embalagem?.nome || 'NÃO SELECIONADO'}
                            </span>
                        </div>
                        <div className={`flex flex-col items-center justify-start w-full gap-y-3 border-b pb-2 border-zinc-700`}>
                            <div className={`flex flex-col items-start justify-start w-full gap-y-2`}>
                                <div className={`flex items-center justify-center w-auto h-auto gap-x-3`}>
                                    <span className={`text-lg text-zinc-500`}>
                                        {'PROJETO:'}
                                    </span>
                                    <span className={`text-lg text-zinc-400`}>
                                        {formData.PROJETO}
                                    </span>
                                </div>
                                <div className={`flex items-center justify-center w-auto h-auto gap-x-3`}>
                                    <span className={`text-lg text-zinc-500`}>
                                        {'ITEM:'}
                                    </span>
                                    <span className={`text-lg text-zinc-400`}>
                                        {item.nome}
                                    </span>
                                </div>
                                <div className={`flex items-center justify-center w-auto h-auto gap-x-3`}>
                                    <span className={`text-lg text-zinc-500`}>
                                        {'GÊNERO:'}
                                    </span>
                                    <span className={`text-lg text-zinc-400`}>
                                        {item.genero}
                                    </span>
                                </div>
                            </div>
                            <div className={`flex flex-col items-start justify-start w-full gap-y-2`}>
                                <div className={`flex items-center justify-center w-auto h-auto gap-x-3`}>
                                    <span className={`text-lg text-zinc-500`}>
                                        {'TAMANHO:'}
                                    </span>
                                    <span className={`text-lg text-zinc-400`}>
                                        {item.tamanho}
                                    </span>
                                </div>
                                {item.composicao && (
                                    <div className={`flex items-start justify-center w-auto h-auto gap-x-3`}>
                                        <span className={`text-lg text-zinc-500`}>
                                            {'COMPOSIÇÃO:'}
                                        </span>
                                        <div className={`text-[15px] text-zinc-400 text-justify pl-2 pr-4 text-lg border-l border-zinc-700`}>
                                            <ul>
                                                {item.composicao
                                                    .split(',')  // Dividir pela vírgula
                                                    .map((componente: string) => componente.trim())  // Remover espaços extras
                                                    .map((componente: string) => {
                                                        // Dividir cada componente em quantidade e nome
                                                        const [quantidade, ...nome] = componente.split(' ');
                                                        const nomeComponente = nome.join(' ');
                                                        return { quantidade: parseInt(quantidade), nome: nomeComponente };
                                                    })
                                                    .sort((a, b) => b.quantidade - a.quantidade) // Ordenar pela quantidade, em ordem decrescente
                                                    .map(({ quantidade, nome }) => (
                                                        <li key={nome} className="">
                                                            <span className="pr-2">{quantidade}</span> {nome}
                                                        </li>
                                                    ))}
                                            </ul>
                                        </div>
                                    </div>
                                )}
                                <div className={`flex items-center justify-center w-auto h-auto gap-x-3`}>
                                    <span className={`text-lg text-zinc-500`}>
                                        {'CÒDIGO DE BARRAS:'}
                                    </span>
                                    <span className={`text-lg text-zinc-400`}>
                                        {item.barcode}
                                    </span>
                                </div>
                                <div className={`flex items-center justify-center w-auto h-auto gap-x-3`}>
                                    <span className={`text-lg text-zinc-500`}>
                                        {'ESTOQUE:'}
                                    </span>
                                    <span className={`text-lg text-yellow-500`}>
                                        {qtyEstoque}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={`flex w-full justify-start items-center gap-x-5`}>
                        <BotaoArrowLeft onClick={onClose} stringButtton={`VOLTAR`} iconSize={20}
                            bgColor={"bg-red-700"} bgHoverColor={"hover:bg-red-600"} strokeWidth={3} />
                    </div>
                </div >
                <div className={`flex w-[40%] p-2 pl-7 flex-col min-h-[75vh] justify-between border-l border-zinc-700`}>
                    <div className={`flex flex-col w-full gap-y-8`}>
                        <div className={`flex flex-col w-ull gap-y-5`}>
                            <ItemsEntryImputText labelName={'CONTABILIZADO TOTAL (NO DIA)'}
                                value={String(qtyTotalEmb)} />
                            <ItemsEntryImputText labelName={'CONTABILIZADO TOTAL (DO ITEM)'}
                                value={String(qtyTotalDiaItem)} />
                        </div>
                        <div className={`flex flex-col w-full gap-y-5`}>
                            <ItemsEntryImputTextStateBlock labelName={'QUANTIDADE CONTABILIZADA'}
                                formData={formData} setFormData={setFormData}
                                isReadOnly={true} />
                            <ItemsEntryImputTextState labelName={'LEITURA DO CÓD DE BARRAS'}
                                formData={formData} setFormData={setFormData}
                                txtSize={`text-[23px]`}
                                placeholder={`Mantenha o cursor aqui...`}
                                isFocus={`border border-emerald-300 focus:border-emeral-500 focus:outline-none 
                                        focus:ring focus:ring-emerald-500`}
                                labelColor={`text-emerald-500`} />
                        </div>
                    </div>
                    <div className={`flex flex-col w-full gap-y-16`}>
                        <div className={`flex w-full items-center justify-end`}>
                            <BotaoEstoqueContabilizacion
                                bgColor={`bg-green-800`}
                                bgHoverColor={`hover:bg-green-700`}
                                textColor={`text-[#fff]`}
                                strokeWidth={3}
                                iconColor={`#fff`}
                                iconSize={20}
                                IsOpenStock={IsOpenStock}
                                stringButtton={`ATUALIZAR ESTOQUE`}
                                updateStockEndEntryInput={updateStockEndEntryInput}
                            />
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default ModalItemDetails;
