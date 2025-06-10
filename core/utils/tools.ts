import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { GradesRomaneio, Resumo } from '../interfaces';

const ip = "192.168.1.169";
const port = "4997";
const sizes = ['PP', 'P', 'M', 'G', 'GG', 'XG', 'EG', 'EX', 'EGG', 'EXG', 'XGG', 'EXGG', 'G1', 'G2', 'G3', 'EG/LG'];

function convertSPTime(dateString: string): string {
  const timeZone = 'America/Sao_Paulo';
  let date = new Date(dateString);
  if (isNaN(date.getTime())) {
    console.error('Invalid Date:', dateString);
    date = new Date();
  }
  const zonedDate = toZonedTime(date, timeZone);
  return format(zonedDate, 'dd/MM/yyyy HH:mm:ss');
}

function concat(s: string): string {
  // Remove espaços em branco e normaliza a string para remover acentos
  return s.replace(/\s+/g, '').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function convertMilharFormatKG(peso: number): string {
  return `${peso.toLocaleString('pt-BR', {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3
  })} Kg`
}

function convertMilharFormatCUB(cubagem: number): string {
  return `${cubagem.toLocaleString('pt-BR', {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3
  })} m³`
}

function convertMilharFormat(value: number): string {
  return `${value.toLocaleString('pt-BR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  })}`
}

function getResumo(grades: GradesRomaneio[] | null): Resumo {
  const gradesPedValid = grades?.filter(grade => !grade.tipo).length || 0;
  const gradesRepo = grades?.filter(grade => grade.tipo).length || 0;

  if (!grades || grades.length === 0) {
    return {
      volumes: convertMilharFormat(0),
      gradesValidas: convertMilharFormat(0),
      gradesRepo: convertMilharFormat(0),
      peso: convertMilharFormatKG(0),
      cubagem: convertMilharFormatCUB(0),
      reposicoes: convertMilharFormat(0),
      escolasAtendidas: convertMilharFormat(0),
      expedidos: convertMilharFormat(0),
      despachados: convertMilharFormat(0),
      prontas: convertMilharFormat(0),
    };
  }
  return {
    volumes: convertMilharFormat(grades.reduce((acc, g) => acc + (g.caixas?.length || 0), 0)),
    gradesValidas: convertMilharFormat(gradesPedValid),
    gradesRepo: convertMilharFormat(gradesRepo),
    peso: convertMilharFormatKG(grades.reduce((acc, g) => g.peso + acc, 0)),
    cubagem: convertMilharFormatCUB(grades.reduce((acc, g) => acc + (g.cubagem || 0), 0)),
    escolasAtendidas: convertMilharFormat((Array.from(new Set(grades.map(grade => grade.escola)))).length),

    reposicoes: convertMilharFormat(grades.filter(g => g.tipo === 'R').length),
    
    
    expedidos: convertMilharFormat(grades.filter(g => g.status === 'EXPEDIDA').length),
    despachados: convertMilharFormat(grades.filter(g => g.status === 'DESPACHADA').length),
    prontas: convertMilharFormat(grades.filter(g => g.status === 'PRONTA').length),
  };
}

// Função para ordenar tamanhos
const sizeOrders = (tamanhos: string[]): string[] => {
  const numTamanhos = tamanhos.filter(tamanho => /^[0-9]+$/.test(tamanho)); // Filtra tamanhos numéricos
  const letraTamanhos = tamanhos.filter(tamanho => !/^[0-9]+$/.test(tamanho)); // Filtra tamanhos com letras

  // Ordena tamanhos numéricos (convertendo para inteiro)
  numTamanhos.sort((a, b) => parseInt(a) - parseInt(b));

  // Ordena tamanhos com letras conforme a ordem desejada
  const ordem = sizes;
  letraTamanhos.sort((a, b) => ordem.indexOf(a) - ordem.indexOf(b));

  return [...numTamanhos, ...letraTamanhos];
};

function filtrarGradesPorPrioridade(grades: GradesRomaneio[], busca: string) {
  const termoBusca = busca.trim().toLowerCase();

  // 1. Filtrar por nome da escola
  let filtradas = grades.filter((grade) =>
    grade.escola.toLowerCase().includes(termoBusca)
  );

  // 2. Se nada encontrado, filtrar por número da escola
  if (filtradas.length === 0) {
    filtradas = grades.filter((grade) =>
      grade.numeroEscola.toString().includes(termoBusca)
    );
  }

  // 3. Se ainda nada, filtrar por data de update
  if (filtradas.length === 0) {
    filtradas = grades.filter((grade) =>
      grade.update.toLowerCase().includes(termoBusca)
    );
  }

  // 4. Se ainda nada, filtrar por nome do item
  if (filtradas.length === 0) {
    filtradas = grades.filter((grade) =>
      grade.tamanhosQuantidades.some((item) =>
        item.item.toLowerCase().includes(termoBusca)
      )
    );
  }

  // 5 - Busca combinada com melhoria
  if (filtradas.length === 0 && termoBusca.includes(' ')) {
    const termos = termoBusca.split(/\s+/);

    const tamanhosPadrao = [
      "00", "01", "02", "04", "06", "08", "10", "12", "14", "16", // Numéricos
      "6m", // Meses
      "pp 18-21", "p 22-25", "m 26-29", "g 30-33", "gg 34-37", "xgg 38-41", "adulto 42-44", // Faixas com medidas
      "pp", "p", "m", "g", "gg", "xg", "xgg", // Letras
      "eg", "egg", "eg/lg", "exg", // Extra grandes
      "g1", "g2", "g3" // Plus size
    ];

    const termosTamanhos = termos.filter(t => tamanhosPadrao.includes(t));
    const termosTexto = termos.filter(t => !tamanhosPadrao.includes(t));

    // Filtra grades com base nos termos combinados (nome, número, update, item)
    filtradas = grades.filter((grade) => {
      const campos = [
        grade.escola.toLowerCase(),
        grade.numeroEscola.toString(),
        grade.update.toLowerCase(),
        ...grade.tamanhosQuantidades.map(item => item.item.toLowerCase()),
      ];

      return termosTexto.every((termo) =>
        campos.some((campo) => campo.includes(termo))
      );
    });

    // Agora filtra os itens dentro das grades encontradas
    if (filtradas.length > 0) {
      filtradas = filtradas
        .map((grade) => {
          const itensFiltrados = grade.tamanhosQuantidades.filter((item) => {
            const itemNome = item.item.toLowerCase();
            const itemTamanho = item.tamanho.toLowerCase();

            const combinaTamanho = termosTamanhos.length === 0 || termosTamanhos.includes(itemTamanho);
            const combinaItem = termosTexto.length === 0 || termosTexto.some((termo) => itemNome.includes(termo));

            return combinaTamanho && combinaItem;
          });

          return {
            ...grade,
            tamanhosQuantidades: itensFiltrados,
          };
        })
        .filter((grade) => grade.tamanhosQuantidades.length > 0);
    }
  }

  return filtradas;
}

export { concat, convertSPTime, convertMilharFormatKG, convertMilharFormatCUB,
         convertMilharFormat, getResumo, sizeOrders, filtrarGradesPorPrioridade, ip, port };
