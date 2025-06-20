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

function converPercentualFormat(value: number): string {
  return `${value.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}%`
}

function getResumo(status: string, grades: GradesRomaneio[]): Resumo {
  if (!grades || grades.length === 0) {
    return {
      volumes: convertMilharFormat(0),
      volumesR: convertMilharFormat(0),
      volumesN: convertMilharFormat(0),
      gradesValidas: convertMilharFormat(0),
      gradesRepo: convertMilharFormat(0),
      pesoR: convertMilharFormatKG(0),
      cubagemR: convertMilharFormatCUB(0),
      pesoN: convertMilharFormatKG(0),
      cubagemN: convertMilharFormatCUB(0),
      pesoT: convertMilharFormatKG(0),
      cubagemT: convertMilharFormatCUB(0),
      expedidos: convertMilharFormat(0),
      aExpedir: convertMilharFormat(0),
      previstoN: convertMilharFormat(0),
      expRepo: convertMilharFormat(0),
      prevRepo: convertMilharFormat(0),
      aExpRepo: convertMilharFormat(0),
      escolasAtendidasN: convertMilharFormat(0),
      escolasAtendidasR: convertMilharFormat(0),
      previstoT: convertMilharFormat(0),
      gradesT: convertMilharFormat(0),
      expedidosT: convertMilharFormat(0),
      aExpedirT: convertMilharFormat(0),
      escolasAtendidasT: convertMilharFormat(0),
      escolasTotaisN: convertMilharFormat(0),
      escolasTotaisR: convertMilharFormat(0),
      escolasTotaisT: convertMilharFormat(0),
      percErr: converPercentualFormat(0),
      ids: [],
    };
  }

  let gradesValidas = 0, gradesRepo = 0;
  let pesoN = 0, pesoR = 0;
  let cubagemN = 0, cubagemR = 0;
  let expedidosNormais = 0, expedidosRepo = 0;
  let previstoNormais = 0, previstoRepo = 0;
  let volumesN = 0, volumesR = 0;

  const escolasTotais = new Set<string>();
  const escolasTotaisN = new Set<string>();
  const escolasTotaisR = new Set<string>();
  const escolasAtendidasN = new Set<string>();
  const escolasAtendidasR = new Set<string>();
  const escolasAtendidasT = new Set<string>();
  const ids: number[] = [];

  for (const grade of grades) {
    const isReposicao = !!grade.tipo;
    const escola = grade.escola;

    escolasTotais.add(escola);

    if (isReposicao) {
      gradesRepo++;
      pesoR += grade.peso;
      cubagemR += grade.cubagem || 0;
      volumesR += grade.caixas?.length || 0;
      escolasTotaisR.add(escola);

      for (const item of grade.tamanhosQuantidades) {
        expedidosRepo += item.quantidade;
        previstoRepo += item.previsto;
      }

      if (['DESPACHADA', 'EXPEDIDA'].includes(grade.status)) {
        escolasAtendidasR.add(escola);
        escolasAtendidasT.add(escola);
      }
    } else {
      gradesValidas++;
      pesoN += grade.peso;
      cubagemN += grade.cubagem || 0;
      volumesN += grade.caixas?.length || 0;
      escolasTotaisN.add(escola);

      for (const item of grade.tamanhosQuantidades) {
        expedidosNormais += item.quantidade;
        previstoNormais += item.previsto;
      }

      if (['DESPACHADA', 'EXPEDIDA'].includes(grade.status)) {
        escolasAtendidasN.add(escola);
        escolasAtendidasT.add(escola);
      }
    }

    if (['DESPACHADA', 'EXPEDIDA'].includes(grade.status)) {
      escolasAtendidasT.add(escola);
    }

    if (status === 'EXPEDIDA') {
      ids.push(grade.id);
    }
  }

  const aExpedirNormais = previstoNormais - expedidosNormais;
  const aExpedirRepos = previstoRepo - expedidosRepo;
  const previstoT = previstoNormais + previstoRepo;
  const expedidosT = expedidosNormais + expedidosRepo;
  const aExpedirT = aExpedirNormais + aExpedirRepos;
  const percErr = previstoNormais ? (previstoRepo / previstoNormais) * 100 : 0;
  
  return {
    volumes: convertMilharFormat(volumesN + volumesR),
    volumesR: convertMilharFormat(volumesR),
    volumesN: convertMilharFormat(volumesN),
    gradesValidas: convertMilharFormat(gradesValidas),
    gradesRepo: convertMilharFormat(gradesRepo),
    pesoR: convertMilharFormatKG(pesoR),
    cubagemR: convertMilharFormatCUB(cubagemR),
    pesoN: convertMilharFormatKG(pesoN),
    cubagemN: convertMilharFormatCUB(cubagemN),
    pesoT: convertMilharFormatKG(pesoR + pesoN),
    cubagemT: convertMilharFormatCUB(cubagemR + cubagemN),
    expedidos: convertMilharFormat(expedidosNormais),
    aExpedir: convertMilharFormat(aExpedirNormais),
    previstoN: convertMilharFormat(previstoNormais),
    expRepo: convertMilharFormat(expedidosRepo),
    prevRepo: convertMilharFormat(previstoRepo),
    aExpRepo: convertMilharFormat(aExpedirRepos),
    previstoT: convertMilharFormat(previstoT),
    gradesT: convertMilharFormat(grades.length),
    expedidosT: convertMilharFormat(expedidosT),
    aExpedirT: convertMilharFormat(aExpedirT),
    escolasTotaisN: convertMilharFormat(escolasTotaisN.size),
    escolasTotaisR: convertMilharFormat(escolasTotaisR.size),
    escolasTotaisT: convertMilharFormat(escolasTotais.size),
    escolasAtendidasN: convertMilharFormat(escolasAtendidasN.size),
    escolasAtendidasR: convertMilharFormat(escolasAtendidasR.size),
    escolasAtendidasT: convertMilharFormat(escolasAtendidasT.size),
    percErr: converPercentualFormat(percErr),
    ids
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

export {
  concat, convertSPTime, convertMilharFormatKG, convertMilharFormatCUB, converPercentualFormat,
  convertMilharFormat, getResumo, sizeOrders, filtrarGradesPorPrioridade, ip, port
};
