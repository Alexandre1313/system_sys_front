import { ItemTamanho } from "../../../core";

interface ItemGradeModificationAlertProps {
    id: number | null | undefined;
    quantidade: number | null;
    formDataQty: number | null;
    quantidadeExpedida: number | null;
    itemTamanho: ItemTamanho | null | undefined;
}

export default function ItemGradeModificationAlert({ id, quantidade, quantidadeExpedida, itemTamanho, formDataQty }: ItemGradeModificationAlertProps) {
    return (
        <div className={'text-red-800 text-[20px] font-bold flex flex-col items-start justify-center max-w-[80%] gap-y-5'}>
            <div className={'flex items-center justify-center text-center w-full'}>
                {`O ITEM DE GRADE DE IDENTIFICADOR ${id} SERÁ EXCLUÍDO / ALTERADO, VOCÊ CONFIRMA ?`}
            </div>
            <div className={`flex flex-col border border-red-500 w-full p-3`}>
                <div className={'flex items-center justify-start w-full'}>
                    <p>{`Item: ${itemTamanho?.item?.nome}`}</p>
                </div>
                <div className={'flex items-center justify-start w-full'}>
                    <p>{`Tamanho: ${itemTamanho?.tamanho?.nome}`}</p>
                </div>
                <div className={'flex items-center justify-start w-full'}>
                    <p>{`Gênero: ${itemTamanho?.item?.genero}`}</p>
                </div>
                <div className={'flex items-center justify-start w-full'}>
                    <p>{`Quantidade à ser expedida: ${quantidade}`}</p>
                </div>
                <div className={'flex items-center justify-start w-full'}>
                    <p>{`Quantidade já expedida: ${quantidadeExpedida}`}</p>
                </div>
            </div>
            {formDataQty! > 0 ?
                <div className={'flex items-center justify-center text-center w-full'}>
                    {`ANTES DE PROSSEGUIR, ENCERRE A CAIXA CORRENTE COM AS QUANTIDADES JÁ EXPEDIDAS E TENTE NOVAMENTE`}
                </div> : quantidadeExpedida! === 0 ?
                <div className={'flex items-center justify-center text-center w-full'}>
                    {`COMO NENHUM ITEM AINDA FOI EXPEDIDO, SE PROSSEGUIR O ITEM EM QUESTÃO SERÁ EXCLUÍDO DESTA GRADE`}
                </div> : (quantidadeExpedida! > 0 && quantidadeExpedida != quantidade) && formDataQty === 0 ?
                <div className={'flex items-center justify-center text-center w-full'}>
                    {`COMO JÁ FOI EXPEDIDO UMA OU MAIS UNIDADES DESTE ITEM, A QUANTIDADE À EXPEDIR SERÁ EQUIPARADA COM O TOTAL JÁ EXPEDIDO`}
                </div> : quantidade === quantidadeExpedida ?
                <div className={'flex items-center justify-center text-center w-full'}>
                    {`COMO A QUANTIDADE À SER EXPEDIDA JA FOI SATISFEITA, NÃO HÁ NADA A SER FEITO`}
                </div> :
                <div className={'flex items-center justify-center text-center w-full'}>
                    {`DADOS INDISPONÍVEIS`}
                </div>
            }
        </div>
    )
}
