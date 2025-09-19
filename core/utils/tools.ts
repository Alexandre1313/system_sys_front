import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { Grade, GradesRomaneio, Resumo } from '../interfaces';

/**
 * Endereço IP do servidor local.
 */
const colorLinkExternal = "text-gray-400";

/**
 * Endereço IP do servidor local.
 */
const ip = "192.168.1.169";

/**
 * Porta utilizada pelo servidor.
 */
const port = process.env.NODE_ENV === 'production' ? '4997' : '4997';

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
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
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
function getResumo(
  status: string,
  grades: GradesRomaneio[]
): Resumo {

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

  let gradesValidas = 0, gradesRepo = 0;
  let pesoN = 0, pesoR = 0;
  let cubagemN = 0, cubagemR = 0;
  let expedidosNormais = 0, expedidosRepo = 0;
  let previstoNormais = 0, previstoRepo = 0;
  let volumesN = 0, volumesR = 0;

  const escolasTotaisN = new Set<number>();
  const escolasTotaisR = new Set<number>();
  const escolasAtendidasN = new Set<number>();
  const escolasAtendidasR = new Set<number>();
  const escolasAtendidasT = new Set<number>();
  const escolasTotaisT = new Set<number>();
  const ids: number[] = [];

  const statusExpedido = new Set(['DESPACHADA', 'EXPEDIDA']);

  for (const grade of grades) {
    const escolaId = grade.escolaId;
    const tipo = grade.tipo;
    const tipoNorm = tipo
      ? tipo.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
      : null;
    const isReposicao = tipoNorm === 'reposicao';
    const isExpedido = statusExpedido.has(grade.status);

    escolasTotaisT.add(escolaId!); // adiciona em totais gerais

    if (isReposicao) {
      gradesRepo++;
      pesoR += grade.peso;
      cubagemR += grade.cubagem || 0;
      volumesR += grade.caixas?.length || 0;
      escolasTotaisR.add(escolaId!);

      for (const item of grade.tamanhosQuantidades) {
        expedidosRepo += item.quantidade;
        previstoRepo += item.previsto;
      }

      if (isExpedido) {
        escolasAtendidasR.add(escolaId!);
      }
    } else {
      gradesValidas++;
      pesoN += grade.peso;
      cubagemN += grade.cubagem || 0;
      volumesN += grade.caixas?.length || 0;
      escolasTotaisN.add(escolaId!);

      for (const item of grade.tamanhosQuantidades) {
        expedidosNormais += item.quantidade;
        previstoNormais += item.previsto;
      }

      if (isExpedido) {
        escolasAtendidasN.add(escolaId!);
      }
    }

    if (isExpedido) {
      escolasAtendidasT.add(escolaId!);
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
    escolasTotaisT: convertMilharFormat(escolasTotaisT.size),
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
  
  // ✅ CORRIGIDO: Se busca vazia, retorna todas as grades ordenadas por escola
  if (!termoBusca) {
    return grades.sort((a, b) => {
      const numA = parseInt(a.numeroEscola?.toString() || '0', 10);
      const numB = parseInt(b.numeroEscola?.toString() || '0', 10);
      return numA - numB;
    });
  }

  // ✅ NOVO: Parser de busca avançada
  const parseAdvancedSearch = (term: string): 
    | { tipo: 'campo'; campo: string; valor: string }
    | { tipo: 'multiplas'; valores: string[] }
    | { tipo: 'intervalo'; inicio: number; fim: number }
    | { tipo: 'combinado'; termos: string[] }
    | { tipo: 'normal'; termo: string } => {
    
    // Busca com prefixo específico: "escola: 01,05" ou "genero: feminino"
    const prefixMatch = term.match(/^(\w+):\s*(.+)$/);
    if (prefixMatch) {
      const [, campo, valor] = prefixMatch;
      return { tipo: 'campo', campo, valor: valor.trim() };
    }

    // Múltiplas escolas: "01, 05, 10, 25"
    if (/^\d+(\s*,\s*\d+)+$/.test(term)) {
      const numeros = term.split(',').map(n => n.trim().padStart(2, '0'));
      return { tipo: 'multiplas', valores: numeros };
    }

    // Intervalo de escolas: "15-25" ou "05-15"
    const intervalMatch = term.match(/^(\d+)\s*-\s*(\d+)$/);
    if (intervalMatch) {
      const inicio = parseInt(intervalMatch[1], 10);
      const fim = parseInt(intervalMatch[2], 10);
      return { tipo: 'intervalo', inicio, fim };
    }

    // Busca combinada com múltiplos termos: "camiseta feminino", "polo masculino p"
    if (term.includes(' ')) {
      const termos = term.split(/\s+/).filter(t => t.length > 0);
      if (termos.length > 1) {
        return { tipo: 'combinado', termos };
      }
    }

    // Busca normal
    return { tipo: 'normal', termo: term };
  };

  const searchConfig = parseAdvancedSearch(termoBusca);

  const padroniza = (valor: string | number | undefined | null): string =>
    (valor ?? '').toString().toLowerCase();

  // ✅ NOVO: Filtro por múltiplas escolas
  if (searchConfig.tipo === 'multiplas') {
    const filtradas = grades.filter(grade => {
      const numeroEscola = padroniza(grade.numeroEscola).padStart(2, '0');
      return searchConfig.valores.includes(numeroEscola);
    });
    // Ordenar por número da escola (menor para maior)
    return filtradas.sort((a, b) => {
      const numA = parseInt(padroniza(a.numeroEscola), 10) || 0;
      const numB = parseInt(padroniza(b.numeroEscola), 10) || 0;
      return numA - numB;
    });
  }

  // ✅ NOVO: Filtro por intervalo
  if (searchConfig.tipo === 'intervalo') {
    const filtradas = grades.filter(grade => {
      const numeroEscola = parseInt(padroniza(grade.numeroEscola), 10);
      return numeroEscola >= searchConfig.inicio && numeroEscola <= searchConfig.fim;
    });
    // Ordenar por número da escola (menor para maior)
    return filtradas.sort((a, b) => {
      const numA = parseInt(padroniza(a.numeroEscola), 10) || 0;
      const numB = parseInt(padroniza(b.numeroEscola), 10) || 0;
      return numA - numB;
    });
  }

  // ✅ NOVO: Filtro por campo específico
  if (searchConfig.tipo === 'campo') {
    const { campo, valor } = searchConfig;
    
    // Campos que retornam grade completa
    const camposCompletos = ['escola', 'data'];
    
    const filtradas = grades
      .map(grade => {
        let match = false;
        
        switch (campo) {
          case 'escola':
            match = padroniza(grade.escola).includes(valor) || padroniza(grade.numeroEscola).includes(valor);
            return match ? grade : null; // Grade completa
            
          case 'data':
            match = padroniza(grade.update).includes(valor);
            return match ? grade : null; // Grade completa
            
          case 'genero':
            const itensPorGenero = grade.tamanhosQuantidades.filter(item => 
              padroniza(item.genero).includes(valor)
            );
            return itensPorGenero.length > 0 ? { ...grade, tamanhosQuantidades: itensPorGenero } : null;
            
          case 'item':
            const itensPorNome = grade.tamanhosQuantidades.filter(item => 
              padroniza(item.item).includes(valor)
            );
            return itensPorNome.length > 0 ? { ...grade, tamanhosQuantidades: itensPorNome } : null;
            
          case 'tam': case 'tamanho':
            const tamanhos = valor.split(',').map(t => t.trim());
            const itensPorTamanho = grade.tamanhosQuantidades.filter(item => 
              tamanhos.some(tam => padroniza(item.tamanho).includes(tam))
            );
            return itensPorTamanho.length > 0 ? { ...grade, tamanhosQuantidades: itensPorTamanho } : null;
            
          default:
            return null;
        }
      })
      .filter((grade): grade is GradesRomaneio => grade !== null);

    // Ordenar por número da escola
    return filtradas.sort((a, b) => {
      const numA = parseInt(padroniza(a.numeroEscola), 10) || 0;
      const numB = parseInt(padroniza(b.numeroEscola), 10) || 0;
      return numA - numB;
    });
  }

  // ✅ NOVO: Filtro combinado inteligente
  if (searchConfig.tipo === 'combinado') {
    const { termos } = searchConfig;
    
    // Identificar tipos de termos
    const tamanhosPadrao = new Set([
      "00", "01", "02", "04", "06", "08", "10", "12", "14", "16",
      "6m", "pp", "p", "m", "g", "gg", "xg", "xgg", "eg", "egg", "eg/lg", "exg", "g1", "g2", "g3"
    ]);

    const generos = new Set(["masculino", "feminino", "unissex", "infantil"]);
    
    const termosTamanho = termos.filter(t => tamanhosPadrao.has(t));
    const termosGenero = termos.filter(t => generos.has(t));
    const termosData = termos.filter(t => /^\d{4}-\d{2}-\d{2}$/.test(t) || /^\d{2}\/\d{2}\/\d{4}$/.test(t));
    const termosTexto = termos.filter(t => 
      !tamanhosPadrao.has(t) && !generos.has(t) && 
      !/^\d{4}-\d{2}-\d{2}$/.test(t) && !/^\d{2}\/\d{2}\/\d{4}$/.test(t)
    );

    const filtradas = grades
      .map(grade => {
        // Filtrar por data se especificada
        if (termosData.length > 0) {
          const gradeDataMatch = termosData.some(dataterm => 
            padroniza(grade.update).includes(dataterm)
          );
          if (!gradeDataMatch) return null;
        }

        // Separar termos de escola dos termos de itens
        const termosEscola = termosTexto.filter(termo => 
          padroniza(grade.escola).includes(termo) || 
          padroniza(grade.numeroEscola).includes(termo)
        );
        
        const termosItem = termosTexto.filter(termo => 
          !padroniza(grade.escola).includes(termo) && 
          !padroniza(grade.numeroEscola).includes(termo)
        );

        // Se tem termos de escola, deve atender a eles
        const escolaMatch = termosEscola.length === 0 || termosEscola.length > 0;
        if (!escolaMatch) return null;

        // Se só tem filtros de escola/data (sem item/gênero/tamanho), retorna grade completa
        if (termosItem.length === 0 && termosGenero.length === 0 && termosTamanho.length === 0) {
          return grade; // Retorna grade completa
        }

        // ✅ Se tem filtros de item/gênero/tamanho, filtra apenas esses itens
        const itensFiltrados = grade.tamanhosQuantidades.filter(item => {
          // Verificar nome do item
          const itemMatch = termosItem.length === 0 || 
            termosItem.some(termo => padroniza(item.item).includes(termo));

          // Verificar gênero
          const generoMatch = termosGenero.length === 0 || 
            termosGenero.some(genero => padroniza(item.genero).includes(genero));

          // Verificar tamanho
          const tamanhoMatch = termosTamanho.length === 0 || 
            termosTamanho.some(tamanho => padroniza(item.tamanho).includes(tamanho));

          return itemMatch && generoMatch && tamanhoMatch;
        });

        // Retorna a grade apenas se tiver itens válidos, mas só com os itens filtrados
        if (itensFiltrados.length === 0) return null;

        return { ...grade, tamanhosQuantidades: itensFiltrados };
      })
      .filter((grade): grade is GradesRomaneio => grade !== null);

    // Ordenar por número da escola
    return filtradas.sort((a, b) => {
      const numA = parseInt(padroniza(a.numeroEscola), 10) || 0;
      const numB = parseInt(padroniza(b.numeroEscola), 10) || 0;
      return numA - numB;
    });
  }

  const tamanhosPadrao = new Set([
    "00", "01", "02", "04", "06", "08", "10", "12", "14", "16",
    "6m", "pp 18-21", "p 22-25", "m 26-29", "g 30-33", "gg 34-37",
    "xgg 38-41", "adulto 42-44", "pp", "p", "m", "g", "gg", "xg",
    "xgg", "eg", "egg", "eg/lg", "exg", "g1", "g2", "g3"
  ]);

  // ✅ NOVO: Busca normal melhorada
  if (searchConfig.tipo === 'normal') {
    const termo = searchConfig.termo;
    
    // ✅ CORRIGIDO: Se é um número puro (como "01"), buscar apenas em escola e número
    const isNumericSearch = /^\d+$/.test(termo);
    
    const filtradas = grades
      .map((grade) => {
        let gradeMatch = false;
        
        if (isNumericSearch) {
          // Para busca numérica, buscar apenas em escola e número (não em data)
          const numeroEscolaStr = padroniza(grade.numeroEscola).padStart(2, '0');
          const escolaStr = padroniza(grade.escola);
          
          gradeMatch = numeroEscolaStr.includes(termo.padStart(2, '0')) || 
                      escolaStr.includes(termo);
        } else {
          // Para busca de texto, buscar em todos os campos da grade
          const camposGrade = [
            padroniza(grade.escola),
            padroniza(grade.numeroEscola),
            padroniza(grade.update)
          ];
          
          gradeMatch = camposGrade.some(campo => campo.includes(termo));
        }
        
        // Se é match da grade (escola/número/data), retorna grade completa
        if (gradeMatch) {
          return grade;
        }
        
        // Senão, buscar nos itens e filtrar apenas os que fazem match
        const itensFiltrados = grade.tamanhosQuantidades.filter(item => [
          padroniza(item.item),
          padroniza(item.genero),
          padroniza(item.tamanho)
        ].some(campo => campo.includes(termo)));

        // Se encontrou itens, retorna grade com apenas esses itens
        if (itensFiltrados.length > 0) {
          return { ...grade, tamanhosQuantidades: itensFiltrados };
        }

        return null;
      })
      .filter((grade): grade is GradesRomaneio => grade !== null);

    // Ordenar por número da escola
    return filtradas.sort((a, b) => {
      const numA = parseInt(padroniza(a.numeroEscola), 10) || 0;
      const numB = parseInt(padroniza(b.numeroEscola), 10) || 0;
      return numA - numB;
    });
  }

  // Fallback para busca legacy (não deveria chegar aqui)
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
    .filter((grade) => {
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

      if (!contemTodosTextos) return false;

      // ✅ CORRIGIDO: Apenas verificar se tem itens válidos, sem modificar
      const temItensValidos = grade.tamanhosQuantidades.some((item) => {
        const nome = padroniza(item.item);
        const tamanho = padroniza(item.tamanho);
        const genero = padroniza(item.genero);

        const matchTamanho = termosTamanhos.length === 0 || termosTamanhos.includes(tamanho);
        const matchItemGenero = termosTexto.length === 0 ||
          termosTexto.some(t => nome.includes(t) || genero.includes(t));

        return matchTamanho && matchItemGenero;
      });

      return temItensValidos;
    });
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
function analyzerStatus(grades: Grade[]): { desactiv: boolean, statusClass: string, statusClassBg: string, statusClassBgGrad: string } {
  const STATUS = {
    EXPEDIDA: 'EXPEDIDA',
    DESPACHADA: 'DESPACHADA',
    REPOSICAO: 'REPOSICAO',
    PRONTA: 'PRONTA',
  };

  const COLORS = {
    emerald: 'bg-emerald-700',
    cyan: 'bg-cyan-700',
    red: 'bg-red-700',
    slate: 'bg-slate-200',
    orange: 'bg-orange-600',
    cyan500: 'bg-cyan-700',
  };

  const BGCOLORS = {
    emerald: 'bg-emerald-900/30 border border-emerald-700 hover:bg-emerald-700/50 hover:border-emerald-500/30',
    cyan: 'bg-cyan-900/30 border border-cyan-700 hover:bg-cyan-700/50 hover:border-cyan-500/30',
    red: 'bg-red-900/30 border border-red-700 hover:bg-red-700/50 hover:border-red-500/30',
    slate: 'bg-slate-900/30 border border-slate-700 hover:bg-slate-700/50 hover:border-slate-500/30',
    orange: 'bg-orange-900/30 border border-orange-700 hover:bg-orange-700/50 hover:border-orange-500/30',
    cyan500: 'bg-cyan-900/30 border border-green-500 hover:bg-cyan-700/50 hover:border-emerald-500/30',
  };

  const BGCOLORSGRAD = {
    emerald: 'bg-gradient-to-r from-emerald-900 to-emerald-800',
    cyan: 'bg-gradient-to-r from-cyan-900 to-cyan-800',
    red: 'bg-gradient-to-r from-red-900 to-red-800',
    slate: 'bg-gradient-to-r from-slate-700 to-slate-600',
    orange: 'bg-gradient-to-r from-orange-900 to-orange-800',
    cyan500: 'bg-gradient-to-r from-cyan-900 to-cyan-800',
  };

  let desactiv = false;
  let statusClass = COLORS.slate;
  let statusClassBg = BGCOLORS.slate;
  let statusClassBgGrad = BGCOLORSGRAD.slate;

  if (grades.length === 0) {
    return { desactiv: true, statusClass: COLORS.slate, statusClassBg: BGCOLORS.slate, statusClassBgGrad };
  }

  const todasDespachadas = grades.every(g => g.status === STATUS.DESPACHADA);
  const todasExpedidasOuDespachadas = grades.every(g => g.status === STATUS.EXPEDIDA || g.status === STATUS.DESPACHADA);
  const todasProntasNaoIniciadas = grades.every(g => g.status === STATUS.PRONTA && !g.iniciada);
  const umaProntaNaoIniciada = grades.some(g => g.status === STATUS.PRONTA && !g.iniciada);
  const umaProntaIniciada = grades.some(g => g.status === STATUS.PRONTA && g.iniciada);
  const repo = grades.some((g) => normalize(g.tipo) === STATUS.REPOSICAO && g.status === STATUS.PRONTA && !g.iniciada);
  const repoInit = grades.some((g) => normalize(g.tipo) === STATUS.REPOSICAO && g.status === STATUS.PRONTA && g.iniciada);
  const umaExpedida = grades.some(g => g.status === STATUS.EXPEDIDA);

  if (repo) {
    statusClass = COLORS.red;
    statusClassBg = BGCOLORS.red;
    statusClassBgGrad = BGCOLORSGRAD.red;
  } else if (repoInit) {
    statusClass = COLORS.orange;
    statusClassBg = BGCOLORS.orange;
    statusClassBgGrad = BGCOLORSGRAD.orange;
    desactiv = false;
  } else if (todasDespachadas) {
    statusClass = COLORS.emerald;
    statusClassBg = BGCOLORS.emerald;
    statusClassBgGrad = BGCOLORSGRAD.emerald;
    desactiv = false;
  } else if (todasExpedidasOuDespachadas) {
    statusClass = COLORS.emerald;
    statusClassBg = BGCOLORS.emerald;
    statusClassBgGrad = BGCOLORSGRAD.emerald;
    desactiv = false;
  } else if (todasProntasNaoIniciadas) {
    statusClass = COLORS.slate;
    statusClassBg = BGCOLORS.slate;
    statusClassBgGrad = BGCOLORSGRAD.slate;
    desactiv = false;
  } else if (umaExpedida) {
    statusClass = COLORS.cyan500;
    statusClassBg = BGCOLORS.cyan500;
    statusClassBgGrad = BGCOLORSGRAD.cyan500;
    desactiv = false;
  }
  else if (umaProntaIniciada) {
    statusClass = COLORS.cyan;
    statusClassBg = BGCOLORS.cyan;
    statusClassBgGrad = BGCOLORSGRAD.cyan;
    desactiv = false;
  } else if (umaProntaNaoIniciada) {
    statusClass = COLORS.slate;
    statusClassBg = BGCOLORS.slate;
    statusClassBgGrad = BGCOLORSGRAD.slate;
    desactiv = false;
  }

  return { desactiv, statusClass, statusClassBg, statusClassBgGrad };
}

function formatarTituloRanking(titulo?: string | null): string {
  if (!titulo || typeof titulo !== "string") return "";

  const [prefixo, data] = titulo.split(" - ");

  if (prefixo !== "Ranking" || !/^\d{4}-\d{2}$/.test(data)) {
    return "";
  }

  const [ano, mes] = data.split("-");
  const nomesMeses = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  const indiceMes = parseInt(mes, 10) - 1;
  if (indiceMes < 0 || indiceMes > 11) return "";

  return `${nomesMeses[indiceMes]} de ${ano}`;
}

/**
 * Módulo de utilitários para manipulação de dados, formatação e configurações de rede.
 * Exporta funções para normalização, formatação de números, ordenação, análise de status,
 * e constantes de configuração como IP e porta.
 */
export {
  analyzerStatus, concat, converPercentualFormat,
  convertMilharFormat, convertMilharFormatCUB, convertMilharFormatKG, convertSPTime,
  filtrarGradesPorPrioridade, getResumo, ip, normalize, port, colorLinkExternal, sizeOrders, formatarTituloRanking
};
