import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { Grade, GradesRomaneio, Resumo } from '../interfaces';

const ip = "192.168.1.169";
const port = "4997";
const sizes = ['PP', 'P', 'M', 'G', 'GG', 'XG', 'EG', 'EX', 'EGG', 'EXG', 'XGG', 'EXGG', 'G1', 'G2', 'G3', 'EG/LG'];

function normalize(value: string | undefined | null) {
  return value?.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
}

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
    const zero = () => convertMilharFormat(0);
    const zeroKG = () => convertMilharFormatKG(0);
    const zeroCUB = () => convertMilharFormatCUB(0);
    return {
      volumes: zero(),
      volumesR: zero(),
      volumesN: zero(),
      gradesValidas: zero(),
      gradesRepo: zero(),
      pesoR: zeroKG(),
      cubagemR: zeroCUB(),
      pesoN: zeroKG(),
      cubagemN: zeroCUB(),
      pesoT: zeroKG(),
      cubagemT: zeroCUB(),
      expedidos: zero(),
      aExpedir: zero(),
      previstoN: zero(),
      expRepo: zero(),
      prevRepo: zero(),
      aExpRepo: zero(),
      previstoT: zero(),
      gradesT: zero(),
      expedidosT: zero(),
      aExpedirT: zero(),
      escolasAtendidasN: zero(),
      escolasAtendidasR: zero(),
      escolasAtendidasT: zero(),
      escolasTotaisN: zero(),
      escolasTotaisR: zero(),
      escolasTotaisT: zero(),
      percErr: converPercentualFormat(0),
      ids: [],
    };
  }

  // Cache de valores
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

  const statusExpedido = new Set(['DESPACHADA', 'EXPEDIDA']);

  for (const grade of grades) {
    const escola = grade.escola;
    escolasTotais.add(escola);

    const tipo = grade.tipo;
    const tipoNorm = tipo
      ? tipo.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
      : null;
    const isReposicao = tipoNorm === 'reposicao';

    const isExpedido = statusExpedido.has(grade.status);

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

      if (isExpedido) {
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

      if (isExpedido) {
        escolasAtendidasN.add(escola);
        escolasAtendidasT.add(escola);
      }
    }

    if (isExpedido) {
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

  const padroniza = (texto: string | number) => texto.toString().toLowerCase();
  const isMatch = (campo: string) => campo.includes(termoBusca);

  let filtradas: GradesRomaneio[] = [];

  // Pré-processa campos e busca no mesmo laço
  for (const grade of grades) {
    const escola = padroniza(grade.escola);
    const numeroEscola = padroniza(grade.numeroEscola);
    const update = padroniza(grade.update);
    const itens = grade.tamanhosQuantidades.map(item => padroniza(item.item));

    if (isMatch(escola)) {
      filtradas.push(grade);
      continue;
    }

    if (isMatch(numeroEscola)) {
      filtradas.push(grade);
      continue;
    }

    if (isMatch(update)) {
      filtradas.push(grade);
      continue;
    }

    if (itens.some(isMatch)) {
      filtradas.push(grade);
      continue;
    }
  }

  // Busca combinada com termos separados e tamanhos padrão
  if (filtradas.length === 0 && termoBusca.includes(' ')) {
    const termos = termoBusca.split(/\s+/);
    const tamanhosPadrao = new Set([
      "00", "01", "02", "04", "06", "08", "10", "12", "14", "16",
      "6m", "pp 18-21", "p 22-25", "m 26-29", "g 30-33", "gg 34-37",
      "xgg 38-41", "adulto 42-44", "pp", "p", "m", "g", "gg", "xg",
      "xgg", "eg", "egg", "eg/lg", "exg", "g1", "g2", "g3"
    ]);

    const termosTamanhos = termos.filter(t => tamanhosPadrao.has(t));
    const termosTexto = termos.filter(t => !tamanhosPadrao.has(t));

    filtradas = grades
      .map((grade) => {
        const campos = [
          padroniza(grade.escola),
          padroniza(grade.numeroEscola),
          padroniza(grade.update),
          ...grade.tamanhosQuantidades.map(item => padroniza(item.item)),
        ];

        const atende = termosTexto.every((termo) =>
          campos.some((campo) => campo.includes(termo))
        );

        if (!atende) return null;

        const itensFiltrados = grade.tamanhosQuantidades.filter((item) => {
          const nome = padroniza(item.item);
          const tamanho = padroniza(item.tamanho);

          const matchTamanho = termosTamanhos.length === 0 || termosTamanhos.includes(tamanho);
          const matchItem = termosTexto.length === 0 || termosTexto.some(t => nome.includes(t));

          return matchTamanho && matchItem;
        });

        if (itensFiltrados.length === 0) return null;

        return { ...grade, tamanhosQuantidades: itensFiltrados };
      })
      .filter((grade): grade is GradesRomaneio => grade !== null);
  }

  return filtradas;
}

function analyzerStatus(grades: Grade[]): { desactiv: boolean; statusClass: string } {
  const STATUS = {
    EXPEDIDA: 'EXPEDIDA',
    DESPACHADA: 'DESPACHADA',
    REPOSICAO: 'REPOSICAO',
    PRONTA: 'PRONTA',
  };

  const COLORS = {
    emerald: 'text-emerald-500',
    cyan: 'text-cyan-500',
    red: 'text-red-500',
    slate: 'text-slate-200',
  };  

  let desactiv = false;
  let statusClass = COLORS.slate;

  if (grades.length === 0) {  
    return { desactiv: true, statusClass: COLORS.slate };
  }

  const todasDespachadas = grades.every(g => g.status === STATUS.DESPACHADA);

  const todasExpedidasOuDespachadas = grades.every( g => g.status === STATUS.EXPEDIDA || g.status === STATUS.DESPACHADA);

  const todasProntasNaoIniciadas = grades.every(g => g.status === STATUS.PRONTA && !g.iniciada);

  const umaProntaNaoIniciada = grades.some(g => g.status === STATUS.PRONTA && !g.iniciada);

  const umaProntaIniciada = grades.some(g => g.status === STATUS.PRONTA && g.iniciada);

  const repo = grades.some((g) => normalize(g.tipo) === STATUS.REPOSICAO && g.status === STATUS.PRONTA);

  if (repo) {
    statusClass = COLORS.red;
  } else if (todasDespachadas) {
    statusClass = COLORS.emerald;
    desactiv = false;
  } else if (todasExpedidasOuDespachadas) {
    statusClass = COLORS.emerald;
    desactiv = false;
  } else if (todasProntasNaoIniciadas) {
    statusClass = COLORS.slate;
    desactiv = false;
  } else if (umaProntaNaoIniciada) {
    statusClass = COLORS.slate;
    desactiv = false;
  } else if (umaProntaIniciada) {
    statusClass = COLORS.cyan;
    desactiv = false;
  }

  return { desactiv, statusClass };
}

export {
  ip, port,
  concat, converPercentualFormat,
  convertMilharFormat, convertMilharFormatCUB, convertMilharFormatKG, convertSPTime,
  filtrarGradesPorPrioridade, getResumo, sizeOrders, analyzerStatus, normalize
};
