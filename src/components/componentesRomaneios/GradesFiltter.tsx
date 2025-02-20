import { useEffect, useMemo, useState } from 'react';
import { GradesRomaneio } from '../../../core';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'react-feather';
import { alterarPDespachadas } from '@/hooks_api/api';

interface GradeFilterProps {
  expedicaoData: GradesRomaneio[];
  setDesp: (status: string) => void;
}

const fetcherAlterStatus = async (ids: number[]): Promise<number[] | null> => {
  try {
    const resp = await alterarPDespachadas(ids);
    return resp;
  } catch (error) {
    console.error("Erro ao atualizar status das grades:", error);
    return null;
  }
};

export default function GradesFilter({ expedicaoData, setDesp }: GradeFilterProps) {

  const [expedidasIds, setExpedidasIds] = useState<number[]>([]);
  const [ajustStatus, setAjustStatus] = useState(false); 
  const [message, setMessage] = useState<string>(`GERE OS RELATÓRIOS ANTES DA ALTERAÇÃO`);  

  const groupedByStatus = useMemo(() => {
    return expedicaoData.reduce((acc, grade) => {
      if (!acc[grade.status]) acc[grade.status] = [];
      acc[grade.status].push(grade);
      return acc;
    }, {} as Record<string, GradesRomaneio[]>);
  }, [expedicaoData]);

  useEffect(() => {
    const ids = expedicaoData
      .filter(grade => grade.status === "EXPEDIDA")
      .map(grade => grade.id);
    setExpedidasIds(ids);
  }, [expedicaoData]);

  const abrirModalAjustStatus = () => {
    setAjustStatus(ajustStatus ? false : true);    
  }

  const fecharModalAjustStatus = () => {
    setAjustStatus(ajustStatus ? false : true);    
  }

  const ajustarStatus = async (ids: number[]) => {
    const resp = await fetcherAlterStatus(ids);
    if(resp){
        setMessage(`GRADES ALTERADAS COM OS SEGUINTES IDs: ${resp}`);
        const timeout = setTimeout(() => {
          setDesp("DESPACHADA");
          setMessage(`GERE OS RELATÓRIOS ANTES DA ALTERAÇÃO`);
          setAjustStatus(false);
          setExpedidasIds([]);
          clearTimeout(timeout);
        }, 1500);
        return
    } 
    setMessage(`ERRO AO MUDAR STATUS DAS GRADES`);
    const timeout = setTimeout(() => {
      setMessage(`TENTE NOVAMENTE`);     
      clearTimeout(timeout);
    }, 1500);
    return  
  }

  // Cores mais suaves para as bordas conforme status (opacidade reduzida)
  const statusBorders: any = {
    EXPEDIDA: 'border-green-600',
    DESPACHADA: 'border-blue-500',
    PRONTA: 'border-gray-500',
    IMPRESSA: 'border-purple-400',
    TODAS: 'border-pink-500',
  };

  // Fundo com transparência mínima e bordas mais suaves
  const statusBackgrounds: any = {
    EXPEDIDA: 'bg-green-600 bg-opacity-[1%]',
    DESPACHADA: 'bg-blue-600 bg-opacity-[1%]',
    PRONTA: 'bg-gray-300 bg-opacity-[1%]',
    IMPRESSA: 'bg-purple-600 bg-opacity-[1%]',
    TODAS: 'bg-gray-800 bg-opacity-[1%]',
  };

  const buttonBaseClassTheme =
    "rounded px-4 py-2 cursor-pointer transition-colors duration-300 fixed bottom-5 left-1/2 transform -translate-x-1/2 min-w-[400px]";

  const buttonBaseClassTheme2 =
    "rounded px-4 py-2 cursor-pointer transition-colors duration-300 fixed bottom-24 left-1/2 transform -translate-x-1/2 min-w-[400px]";

  const buttonClassTheme = `${buttonBaseClassTheme} bg-gray-700 text-gray-200 hover:bg-gray-600`;

  const buttonClassTheme2 = `${buttonBaseClassTheme2} bg-red-500 text-white hover:bg-red-600`;

  return (
    <div className="w-full px-6 py-4 bg-[#181818]">
      {Object.entries(groupedByStatus).map(([status, grades]) => {
        const totalItens = grades.reduce(
          (sum, grade) => sum + grade.tamanhosQuantidades.reduce((acc, item) => acc + item.quantidade, 0),
          0
        );
        const totalCaixas = grades.reduce((sum, grade) => sum + grade.caixas.length, 0);

        return (
          <div
            key={status}
            className={`mb-10 p-6 border ${statusBorders[status] || 'border-gray-600'} rounded-lg ${statusBackgrounds[status]}
             border-opacity-40 mb-24`}
          >
            <h2 className="text-3xl font-semibold text-yellow-700 mb-4 uppercase"><span className='text-cyan-500 text-3xl pl-5'>{`STATUS: ${status}`}</span></h2>
            {grades.map((grade) => {
              const totalQuantidade = grade.tamanhosQuantidades.reduce((sum, item) => sum + item.quantidade, 0);
              return (
                <div
                  key={grade.id}
                  className={`mb-6 p-4 border ${statusBorders[status] || 'border-gray-400'} rounded-md ${statusBackgrounds[status]} border-opacity-40`}
                >
                  <h3 className="text-2xl font-semibold text-teal-700 uppercase">
                    {`PROJETO: ${grade.projectname} - ${grade.company} - GRADE ID: `}<span className="text-cyan-500 pl-3 font-normal text-xl">{grade.id}</span>
                  </h3>
                  <p className="text-green-600 uppercase text-xl">Escola: {grade.escola} (Nº {grade.numeroEscola})</p>
                  <p className="text-green-600 uppercase text-xl">Número Join: {grade.numberJoin}</p>
                  <div className="mt-4">
                    <h4 className="text-md font-semibold text-zinc-300 mb-2 uppercase">Itens Expedidos:</h4>
                    <table className="w-full text-zinc-400 border-collapse">
                      <thead>
                        <tr className={`border-b ${statusBorders[status]} border-opacity-30`}>
                          <th className="py-2 px-4 text-left uppercase w-[25%]">Item</th>
                          <th className="py-2 px-4 text-left uppercase w-[25%]">Gênero</th>
                          <th className="py-2 px-4 text-left uppercase w-[25%]">Tamanho</th>
                          <th className="py-2 px-4 text-left uppercase w-[25%]">Quantidade</th>
                        </tr>
                      </thead>
                      <tbody>
                        {grade.tamanhosQuantidades.map((item, index) => (
                          <tr key={index} className={`border-b ${statusBorders[status]} border-opacity-30`}>
                            <td className="py-2 px-4 uppercase text-left">{item.item}</td>
                            <td className="py-2 px-4 uppercase text-left">{item.genero}</td>
                            <td className="py-2 px-4 uppercase text-left">{item.tamanho}</td>
                            <td className="py-2 px-4 uppercase text-left">{item.quantidade}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-teal-400 mt-2 uppercase">
                    Total de itens expedidos para a escola: <span className="text-orange-500 pl-3 font-normal text-xl">{totalQuantidade}</span>
                  </p>
                  <p className="text-teal-400 uppercase">
                    Total de volumes para a escola: <span className="text-orange-500 pl-3 font-normal text-xl">{grade.caixas.length}</span>
                  </p>
                </div>
              );
            })}
            <div className="text-right text-teal-500 font-semibold uppercase">
              <p className="text-lg">Total de itens do grupo: <span className="text-orange-500 pl-3 font-normal text-xl">{totalItens}</span></p>
              <p className="text-lg">Total de caixas: <span className="text-orange-500 pl-3 font-normal text-xl">{totalCaixas}</span></p>
            </div>
          </div>
        );
      })}
      <div className="flex items-center justify-center fixed bottom-0 left-0 px-14 h-[80px] bg-[#1F1F1F] w-full
       text-center text-orange-400 text-2xl font-normal mt-10 uppercase">
        <div className='flex gap-x-24 items-center justify-start w-1/2'>
          <p>Total Geral de Itens expedidos:<span className='text-cyan-500 text-3xl pl-5'>{expedicaoData.reduce((sum, grade) => sum + grade.tamanhosQuantidades.reduce((acc, item) => acc + item.quantidade, 0), 0)}</span></p>
          <p>Total de volumes gerados:<span className='text-cyan-500 text-3xl pl-5'>{expedicaoData.reduce((sum, grade) => sum + grade.caixas.length, 0)}</span></p>
        </div>
        <div className='flex gap-x-10 items-center justify-end w-1/2'>
          <button onClick={() => ""} className="flex items-center justify-center text-[16px] px-6 py-1 min-w-[250px] h-[34px]
           bg-zinc-700 text-white rounded-md hover:bg-zinc-600">
            GERAR ROMANEIOS
          </button>
          <button onClick={abrirModalAjustStatus} className="flex items-center justify-center text-[16px] px-6 py-1 min-w-[250px] h-[34px] bg-red-700 text-white rounded-md hover:bg-red-600">
            MUDAR STATUS
          </button>
        </div>
      </div>

      {expedidasIds.length > 0 && ajustStatus && (
        <div className={`fixed inset-0 z-50 bg-[#181818] bg-opacity-80 min-h-[105vh]
                lg:min-h-[100vh] flex flex-col pt-10
                justify-center items-center p-4`}>

          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="bg-white p-8 rounded-md shadow-md min-w-[30%] min-h-[40%]
                        flex flex-col items-center justify-center"
          >
            <div>
              <AlertTriangle size={90} color={`rgba(255, 0, 0, 1)`} />
            </div>
            <div className={`flex flex-col text-black w-full items-center justify-center`}>
              <h2 className={`text-[50px] font-bold`}>{`MUDANÇA DE STATUS`}</h2>
              <h2 className={`text-[30px] font-bold`}>{message}</h2>
              <h2 className={`text-[30px] font-bold`}>{`GRADES DE ID: ${expedidasIds}`}</h2>
              <span className={`text-[17px] font-bold`}>DESEJA MESMO ALTERAR O STATUS DAS GRADES?</span>
              <span className={`text-[17px] font-bold`}>A OPERAÇÃO NÃO PODERÁ SER REVERTIDA</span>
            </div>
          </motion.div>
          <button
            onClick={() => ajustarStatus(expedidasIds)}
            className={`${buttonClassTheme} hover:bg-green-600`}
          >
            {"AJUSTAR"}
          </button>
          <button
            onClick={fecharModalAjustStatus}
            className={buttonClassTheme2}
          >
            {"CANCELAR"}
          </button>
        </div>
      )}
    </div>
  );

}
