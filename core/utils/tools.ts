import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { Grade, GradesRomaneio, Resumo } from '../interfaces';

/**
 * Endereço IP do servidor local.
 */
const ip = "192.168.1.169";

/**
 * Porta utilizada pelo servidor.
 */
const port = "4997";

/**
 * Ordem customizada de tamanhos para uso em ordenação.
 * Inclui tamanhos padrão (PP, P, M...) e variações específicas (EG, EX, G1...).
 */
const sizes = ['PP', 'P', 'M', 'G', 'GG', 'XG', 'EG', 'EX', 'EGG', 'EXG', 'XGG', 'EXGG', 'G1', 'G2', 'G3', 'EG/LG'];

/**
 * Normaliza uma string removendo acentos e espaços em branco nas extremidades.
 *
 * @param {string | undefined | null} value - A string a ser normalizada.
 * @returns {string | undefined} A string normalizada, ou undefined se o valor for null ou undefined.
 *
 * @example
 * normalize(" João ") // retorna "Joao"
 * normalize(null) // retorna undefined
 */
function normalize(value: string | undefined | null) {
  return value?.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
}

/**
 * Converte uma string de data para o horário de São Paulo e formata como 'dd/MM/yyyy HH:mm:ss'.
 *
 * @param {string} dateString - A string da data a ser convertida (ex: '2025-07-14T15:00:00Z').
 * @returns {string} A data formatada no fuso horário de São Paulo.
 *
 * @example
 * convertSPTime('2025-07-14T15:00:00Z'); // '14/07/2025 12:00:00' (dependendo do horário de verão)
 */
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

/**
 * Remove todos os espaços em branco de uma string e normaliza removendo acentos.
 *
 * @param {string} s - A string de entrada.
 * @returns {string} A string sem espaços e sem acentuação.
 *
 * @example
 * concat(' João da Silva ') // 'JoaoDaSilva'
 */
function concat(s: string): string {
  // Remove espaços em branco e normaliza a string para remover acentos
  return s.replace(/\s+/g, '').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

/**
 * Formata um valor de peso com separador de milhar no padrão brasileiro,
 * exibindo exatamente 3 casas decimais, seguido da unidade "Kg".
 *
 * @param {number} peso - O valor do peso a ser formatado.
 * @returns {string} Uma string formatada no padrão "pt-BR" com unidade de medida (ex: "1.234,567 Kg").
 *
 * @example
 * convertMilharFormatKG(1234.567); // "1.234,567 Kg"
 */
function convertMilharFormatKG(peso: number): string {
  return `${peso.toLocaleString('pt-BR', {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3
  })} Kg`
}

/**
 * Formata um valor de cubagem (volume) com separador de milhar no padrão brasileiro
 * e exatamente 3 casas decimais, seguido da unidade "m³".
 *
 * @param {number} cubagem - O valor de cubagem a ser formatado.
 * @returns {string} Uma string formatada no padrão "pt-BR" com unidade de medida (ex: "1.234,567 m³").
 *
 * @example
 * convertMilharFormatCUB(1234.567); // "1.234,567 m³"
 */
function convertMilharFormatCUB(cubagem: number): string {
  return `${cubagem.toLocaleString('pt-BR', {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3
  })} m³`
}

/**
 * Formata um número no padrão brasileiro, com separador de milhar e sem casas decimais.
 *
 * @param {number} value - O número a ser formatado.
 * @returns {string} Uma string com o número formatado no padrão "pt-BR" (ex: "1.000").
 *
 * @example
 * convertMilharFormat(12345); // "12.345"
 */
function convertMilharFormat(value: number): string {
  return `${value.toLocaleString('pt-BR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  })}`
}

/**
 * Converte um número em uma string percentual formatada no padrão brasileiro.
 *
 * @param {number} value - O valor numérico a ser convertido (por exemplo: 25.5).
 * @returns {string} Uma string formatada como percentual (por exemplo: "25,50%").
 *
 * @example
 * converPercentualFormat(12.345); // "12,35%"
 */
function converPercentualFormat(value: number): string {
  return `${value.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}%`
}

/**
 * Gera um resumo estatístico a partir de uma lista de grades de romaneio.
 * 
 * Retorna dados como volumes, pesos, cubagem, totais expedidos, previstos,
 * escolas atendidas e percentuais de erro. Separa também dados de reposição e normais.
 * 
 * @param {string} status - Status do romaneio utilizado para capturar os IDs relevantes.
 * @param {GradesRomaneio[]} grades - Lista de grades a serem processadas.
 * 
 * @returns {Resumo} Objeto contendo todos os totais calculados e formatados.
 */
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

/**
 * Ordena um array de tamanhos, separando tamanhos numéricos dos tamanhos com letras.
 * 
 * Tamanhos numéricos são ordenados em ordem crescente.
 * Tamanhos com letras são ordenados com base em uma ordem predefinida (`sizes`).
 * 
 * @param {string[]} tamanhos - Um array contendo tamanhos em formato de string (ex: ['P', 'M', 'G', '38', '40']).
 * @returns {string[]} Um novo array com os tamanhos ordenados.
 * 
 * @example
 * sizeOrders(['38', 'M', 'P', '40']);
 * // Retorna: ['38', '40', 'P', 'M']
 */
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

/**
 * Função para filtrar grades com base em critérios como data, número da escola, nome da escola, nome do item e tamanho.
 *
 * @param {Grade[]} grades - Um array de objetos do tipo Grade.
 * @param {string} busca - Termo de busca a ser aplicado nos campos relevantes.
 * @returns {Grade[]} Um array filtrado de grades que correspondem aos critérios de busca.
 *
 * @example
 * filtrarGradesPorPrioridade(grades, 'escola 01');
 */
function filtrarGradesPorPrioridade(grades: GradesRomaneio[], busca: string): GradesRomaneio[] {
  const termoBusca = busca.trim().toLowerCase();
  if (!termoBusca) return [];

  const padroniza = (valor: string | number | undefined | null): string =>
    (valor ?? '').toString().toLowerCase();

  const tamanhosPadrao = new Set([
    "00", "01", "02", "04", "06", "08", "10", "12", "14", "16",
    "6m", "pp 18-21", "p 22-25", "m 26-29", "g 30-33", "gg 34-37",
    "xgg 38-41", "adulto 42-44", "pp", "p", "m", "g", "gg", "xg",
    "xgg", "eg", "egg", "eg/lg", "exg", "g1", "g2", "g3"
  ]);

  const matchCampo = (valor: string) => valor.includes(termoBusca);

  // Pré-filtro direto: busca simples
  let filtradas = grades.filter((grade) => {
    const campos = [
      padroniza(grade.escola),
      padroniza(grade.numeroEscola),
      padroniza(grade.update),
      ...grade.tamanhosQuantidades.flatMap(item => [
        padroniza(item.item),
        padroniza(item.genero)
      ])
    ];

    return campos.some(matchCampo);
  });

  // Se encontrou no pré-filtro, retorna direto
  if (filtradas.length > 0 || !termoBusca.includes(' ')) return filtradas;

  // Filtro mais elaborado (busca composta)
  const termos = termoBusca.split(/\s+/);
  const termosTamanhos = termos.filter(t => tamanhosPadrao.has(t));
  const termosTexto = termos.filter(t => !tamanhosPadrao.has(t));

  return grades
    .map((grade) => {
      const camposGerais = [
        padroniza(grade.escola),
        padroniza(grade.numeroEscola),
        padroniza(grade.update),
        ...grade.tamanhosQuantidades.flatMap(item => [
          padroniza(item.item),
          padroniza(item.genero)
        ])
      ];

      const contemTodosTextos = termosTexto.every(termo =>
        camposGerais.some(campo => campo.includes(termo))
      );

      if (!contemTodosTextos) return null;

      const itensFiltrados = grade.tamanhosQuantidades.filter((item) => {
        const nome = padroniza(item.item);
        const tamanho = padroniza(item.tamanho);
        const genero = padroniza(item.genero);

        const matchTamanho = termosTamanhos.length === 0 || termosTamanhos.includes(tamanho);
        const matchItemGenero = termosTexto.length === 0 ||
          termosTexto.some(t => nome.includes(t) || genero.includes(t));

        return matchTamanho && matchItemGenero;
      });

      if (itensFiltrados.length === 0) return null;

      return { ...grade, tamanhosQuantidades: itensFiltrados };
    })
    .filter((grade): grade is GradesRomaneio => grade !== null);
}

/**
 * Função que retorna a cor do texto e o estado de desativação para a tela de escolas,
 * com base nas propriedades das grades recebidas.
 *
 * @param {Grade[]} grades - Um array de objetos do tipo Grade.
 * @returns {{ statusClass: string, desactiv: boolean }} Objeto contendo a cor do texto e o estado de desativação.
 *
 * @example
 * analyzerStatus(grades); // Retorna: { statusClass: 'text-red-500', desactiv: true }
 */
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
    orange: 'text-orange-400',
  };

  let desactiv = false;
  let statusClass = COLORS.slate;

  if (grades.length === 0) {
    return { desactiv: true, statusClass: COLORS.slate };
  }

  const todasDespachadas = grades.every(g => g.status === STATUS.DESPACHADA);

  const todasExpedidasOuDespachadas = grades.every(g => g.status === STATUS.EXPEDIDA || g.status === STATUS.DESPACHADA);

  const todasProntasNaoIniciadas = grades.every(g => g.status === STATUS.PRONTA && !g.iniciada);

  const umaProntaNaoIniciada = grades.some(g => g.status === STATUS.PRONTA && !g.iniciada);

  const umaProntaIniciada = grades.some(g => g.status === STATUS.PRONTA && g.iniciada);

  const repo = grades.some((g) => normalize(g.tipo) === STATUS.REPOSICAO && g.status === STATUS.PRONTA && !g.iniciada);

  const repoInit = grades.some((g) => normalize(g.tipo) === STATUS.REPOSICAO && g.status === STATUS.PRONTA && g.iniciada);

  if (repo) {
    statusClass = COLORS.red;
  } else if (repoInit) {
    statusClass = COLORS.orange;
    desactiv = false;
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

/**
 * Módulo de utilitários para manipulação de dados, formatação e configurações de rede.
 * Exporta funções para normalização, formatação de números, ordenação, análise de status,
 * e constantes de configuração como IP e porta.
 */
export {
  analyzerStatus, concat, converPercentualFormat,
  convertMilharFormat, convertMilharFormatCUB, convertMilharFormatKG, convertSPTime,
  filtrarGradesPorPrioridade, getResumo, ip, normalize, port, sizeOrders
};
