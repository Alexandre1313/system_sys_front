import { motion, AnimatePresence } from 'framer-motion';
import { FC } from 'react';
import { Embalagem, ProjectItems, QtyEmbDay } from '../../../core';
import BotaoEstoqueContabilizacion from '../ComponentesInterface/BotaoEstoqueContabilizacion';
import ItemsEntryImputText from './ItemsEntryImputText';
import ItemsEntryImputTextState from './ItemsEntryImputTextState';
import ItemsEntryImputTextStateBlock from './ItemsEntryImputTextStateBlock';
import { Package, User, Grid, Box, X } from 'react-feather';

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
    
    const embNotSelect = embalagem ? 'text-emerald-400' : 'text-red-400'
    const qtyTotalEmb = totals?.quantidadeTotalEmbalagem ? totals.quantidadeTotalEmbalagem : '0';
    const qtyTotalDiaItem = totals?.quantidadeTotalItem ? totals.quantidadeTotalItem : '0';
    const qtyEstoque = totals?.quantidadeEstoque ? totals.quantidadeEstoque : '0';

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-2 sm:p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        className="bg-slate-800/95 backdrop-blur-sm border border-slate-700 rounded-xl lg:rounded-2xl w-full 
                        max-w-[98%] lg:max-w-[85%] xl:max-w-[1400px] max-h-[96vh] overflow-hidden
                        flex flex-col shadow-2xl"
                    >
                        {/* Header do Modal */}
                        <div className="bg-gradient-to-r from-slate-900/50 to-slate-800/50 border-b border-slate-700 px-3 lg:px-6 py-2 lg:py-4">
                            <div className="flex items-center space-x-2 lg:space-x-3">
                                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-lg lg:rounded-xl flex items-center justify-center">
                                    <Package size={16} className="lg:w-5 lg:h-5 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-base lg:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">
                                        Detalhes do Item
                                    </h2>
                                    <p className="text-slate-400 text-[10px] lg:text-sm hidden sm:block">Entrada de estoque e contabilização</p>
                                </div>
                            </div>
                        </div>

                        {/* Conteúdo Principal - Responsivo */}
                        <div className="flex-1 overflow-y-auto overflow-x-hidden">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-6 p-3 lg:p-6 max-w-full">
                                
                                {/* Coluna Esquerda - Informações do Item */}
                                <div className="space-y-3 lg:space-y-6 min-w-0">
                                    
                                    {/* Embalador */}
                                    <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-lg lg:rounded-xl p-3 lg:p-4">
                                        <div className="flex items-center space-x-3 mb-3">
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${embalagem ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
                                                <User size={16} className={embNotSelect} />
                                            </div>
                                            <span className="text-slate-400 text-sm lg:text-base font-medium">EMBALADOR</span>
                                        </div>
                                        <p className={`text-lg lg:text-xl font-bold ${embNotSelect} pl-11`}>
                                            {embalagem?.nome || 'NÃO SELECIONADO'}
                                        </p>
                                    </div>

                                    {/* Informações Principais do Item */}
                                    <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-lg lg:rounded-xl p-3 lg:p-4 space-y-2 lg:space-y-4">
                                        <div className="flex items-center space-x-2 pb-3 border-b border-slate-700">
                                            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                            <h3 className="text-slate-300 font-semibold text-sm lg:text-base">Informações do Item</h3>
                                        </div>

                                        <div className="space-y-3">
                                            {/* Projeto */}
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                                                <span className="text-slate-500 text-xs lg:text-sm font-medium min-w-[100px]">PROJETO:</span>
                                                <span className="text-slate-300 text-sm lg:text-base font-medium">{formData.PROJETO}</span>
                                            </div>

                                            {/* Item */}
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                                                <span className="text-slate-500 text-xs lg:text-sm font-medium min-w-[100px]">ITEM:</span>
                                                <span className="text-slate-300 text-sm lg:text-base font-medium">{item.nome}</span>
                                            </div>

                                            {/* Gênero */}
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                                                <span className="text-slate-500 text-xs lg:text-sm font-medium min-w-[100px]">GÊNERO:</span>
                                                <span className="text-slate-300 text-sm lg:text-base">{item.genero}</span>
                                            </div>

                                            {/* Tamanho */}
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                                                <span className="text-slate-500 text-xs lg:text-sm font-medium min-w-[100px]">TAMANHO:</span>
                                                <span className="text-yellow-400 text-base lg:text-lg font-semibold">{item.tamanho}</span>
                                            </div>

                                            {/* Composição (se existir) */}
                                            {item.composicao && (
                                                <div className="pt-2">
                                                    <span className="text-slate-500 text-xs lg:text-sm font-medium mb-2 block">COMPOSIÇÃO:</span>
                                                    <div className="bg-slate-800/50 rounded-lg p-3 border-l-4 border-blue-500">
                                                        <ul className="space-y-1.5">
                                                            {item.composicao
                                                                .split(',')
                                                                .map((componente: string) => componente.trim())
                                                                .map((componente: string) => {
                                                                    const [quantidade, ...nome] = componente.split(' ');
                                                                    const nomeComponente = nome.join(' ');
                                                                    return { quantidade: parseInt(quantidade), nome: nomeComponente };
                                                                })
                                                                .sort((a, b) => b.quantidade - a.quantidade)
                                                                .map(({ quantidade, nome }) => (
                                                                    <li key={nome} className="text-slate-300 text-xs lg:text-sm flex items-center">
                                                                        <span className="text-blue-400 font-semibold mr-2 min-w-[30px]">{quantidade}</span>
                                                                        <span>{nome}</span>
                                                                    </li>
                                                                ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Código de Barras */}
                                            <div className="pt-2">
                                                <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
                                                    <div className="flex items-center space-x-2 mb-2">
                                                        <Grid size={16} className="text-slate-400" />
                                                        <span className="text-slate-500 text-xs lg:text-sm font-medium">CÓDIGO DE BARRAS</span>
                                                    </div>
                                                    <p className="text-slate-300 text-sm lg:text-base font-mono pl-6">{item.barcode}</p>
                                                </div>
                                            </div>

                                            {/* Estoque */}
                                            <div className="pt-2">
                                                <div className="bg-yellow-500/10 rounded-lg p-3 border border-yellow-500/30">
                                                    <div className="flex items-center space-x-2 mb-1">
                                                        <Box size={16} className="text-yellow-500" />
                                                        <span className="text-slate-400 text-xs lg:text-sm font-medium">ESTOQUE ATUAL</span>
                                                    </div>
                                                    <p className="text-yellow-400 text-xl lg:text-2xl font-bold pl-6">{qtyEstoque}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Coluna Direita - Controles e Entrada */}
                                <div className="space-y-3 lg:space-y-6 min-w-0">
                                    
                                    {/* Totalizadores */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4 min-w-0 items-start">
                                        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-lg lg:rounded-xl p-3 lg:p-4 min-w-0 overflow-hidden h-full">
                                            <div className="min-w-0 w-full max-w-full [&_input]:!min-w-0 [&_input]:!w-full [&_label]:!min-h-[48px] [&_label]:!flex [&_label]:!items-center">
                                                <ItemsEntryImputText 
                                                    labelName={'CONTABILIZADO TOTAL (NO DIA)'}
                                                    value={String(qtyTotalEmb)} 
                                                />
                                            </div>
                                        </div>
                                        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-lg lg:rounded-xl p-3 lg:p-4 min-w-0 overflow-hidden h-full">
                                            <div className="min-w-0 w-full max-w-full [&_input]:!min-w-0 [&_input]:!w-full [&_label]:!min-h-[48px] [&_label]:!flex [&_label]:!items-center">
                                                <ItemsEntryImputText 
                                                    labelName={'CONTABILIZADO TOTAL (DO ITEM)'}
                                                    value={String(qtyTotalDiaItem)} 
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Controles de Entrada */}
                                    <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-lg lg:rounded-xl p-3 lg:p-4 space-y-3 lg:space-y-5 min-w-0">
                                        <div className="flex items-center space-x-2 pb-3 border-b border-slate-700">
                                            <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                                            <h3 className="text-slate-300 font-semibold text-sm lg:text-base">Entrada de Dados</h3>
                                        </div>

                                        <div className="min-w-0 w-full">
                                            <ItemsEntryImputTextStateBlock 
                                                labelName={'QUANTIDADE CONTABILIZADA'}
                                                formData={formData} 
                                                setFormData={setFormData}
                                                isReadOnly={true} 
                                            />
                                        </div>
                                        
                                        <div className="min-w-0 w-full">
                                            <ItemsEntryImputTextState 
                                                labelName={'LEITURA DO CÓD DE BARRAS'}
                                                formData={formData} 
                                                setFormData={setFormData}
                                                txtSize={`text-base lg:text-xl`}
                                                placeholder={`Mantenha o cursor aqui...`}
                                                isFocus={`border border-emerald-300 focus:border-emerald-500 focus:outline-none 
                                                        focus:ring focus:ring-emerald-500`}
                                                labelColor={`text-emerald-500`} 
                                            />
                                        </div>
                                    </div>

                                    {/* Botão Atualizar Estoque */}
                                    <div className="flex justify-end">
                                        <BotaoEstoqueContabilizacion
                                            bgColor={`bg-green-600`}
                                            bgHoverColor={`hover:bg-green-500`}
                                            textColor={`text-white`}
                                            strokeWidth={2}
                                            iconColor={`#fff`}
                                            iconSize={20}
                                            IsOpenStock={IsOpenStock}
                                            stringButtton={`ATUALIZAR ESTOQUE`}
                                            updateStockEndEntryInput={updateStockEndEntryInput}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer - Botão Voltar */}
                        <div className="bg-slate-900/50 border-t border-slate-700 px-3 lg:px-6 py-3 lg:py-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="w-full lg:w-auto px-4 py-3 bg-red-600 hover:bg-red-500 text-white font-semibold 
                                rounded-lg lg:rounded-xl transition-all duration-300 transform hover:scale-105
                                flex items-center justify-center space-x-2 text-sm lg:text-base"
                            >
                                <X size={18} />
                                <span>VOLTAR</span>
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ModalItemDetails;
