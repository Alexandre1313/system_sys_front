"use client"

// Tipo dos dados, apenas para validação e autocompletar
type ItemQuantities = { [key: string]: number };
type Grade = {
  idGrade: number;
  itens: { [item: string]: ItemQuantities };
  totalGradeItens: number;
};
type Escola = {
  nome: string;
  numeroEscola: string;
  numberJoin: string;
  grades: Grade[];
  totalEscolaItens: number;
  totalCaixasEscola: number;
};
type Projeto = {
  nomeProjeto: string;
  escolas: Escola[];
  totalGeralItens: number;
  totalGeralCaixas: number;
};

const Home = () => {
  const projeto: Projeto = {
    nomeProjeto: "SANTOS",
    escolas: [
      {
        nome: "UME - CRECHE SONHO DE CRIANÇA - CECAJAS",
        numeroEscola: "37",
        numberJoin: "RM 123",
        grades: [
          {
            idGrade: 1179,
            itens: {
              "KIT UNIFORME": { "04": 78, "02": 53 }
            },
            totalGradeItens: 131
          }
        ],
        totalEscolaItens: 131,
        totalCaixasEscola: 6
      },
      {
        nome: "UME - TREZE DE MAIO - CASA DA CRIANÇA STOS",
        numeroEscola: "13",
        numberJoin: "RM 99",
        grades: [
          {
            idGrade: 1169,
            itens: {
              "KIT UNIFORME": { "02": 73, "04": 65, "06": 49, "08": 11 }
            },
            totalGradeItens: 198
          }
        ],
        totalEscolaItens: 198,
        totalCaixasEscola: 11
      },
      // Adicione outras escolas conforme necessário
    ],
    totalGeralItens: 3909,
    totalGeralCaixas: 231
  };

  return (
    <div className="bg-[#181818] bg-opacity-80 min-h-screen p-8">
      <h1 className="text-3xl text-white mb-8">{projeto.nomeProjeto}</h1>

      {/* Renderizando as escolas */}
      {projeto.escolas.map((escola) => (
        <div key={escola.numeroEscola} className="bg-[#252525] rounded-lg shadow-lg mb-6 p-6">
          <h2 className="text-xl text-white mb-4">{escola.nome}</h2>
          <p className="text-sm text-zinc-400">Número da Escola: {escola.numeroEscola}</p>
          <p className="text-sm text-zinc-400">Número de Join: {escola.numberJoin}</p>
          <p className="text-sm text-zinc-400">Total de Caixas: {escola.totalCaixasEscola}</p>

          {/* Renderizando as grades de cada escola */}
          {escola.grades.map((grade) => (
            <div key={grade.idGrade} className="bg-[#333] rounded-lg mb-4 p-4">
              <h3 className="text-lg text-white">Grade ID: {grade.idGrade}</h3>
              <div className="mt-4">
                {/* Renderizando os itens da grade */}
                {Object.entries(grade.itens).map(([itemName, quantities]) => (
                  <div key={itemName} className="mb-2">
                    <h4 className="text-md text-white">{itemName}</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(quantities).map(([size, quantity]) => (
                        <div key={size} className="text-sm text-zinc-400">
                          <p>{size}: {quantity}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-2 text-sm text-zinc-400">Total de Itens na Grade: {grade.totalGradeItens}</p>
            </div>
          ))}

          <p className="mt-4 text-sm text-white">Total de Itens na Escola: {escola.totalEscolaItens}</p>
          <p className="text-sm text-white">Total de Caixas na Escola: {escola.totalCaixasEscola}</p>
        </div>
      ))}

      <div className="mt-8 text-white">
        <p>Total de Itens: {projeto.totalGeralItens}</p>
        <p>Total de Caixas: {projeto.totalGeralCaixas}</p>
      </div>
    </div>
  );
};

export default Home;
