'use client'

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect, useCallback } from 'react';
import { Search, Filter, X, Info, BookOpen } from 'react-feather';
import { createPortal } from 'react-dom';

interface AdvancedFilterProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  onEnter?: (value: string) => void; // Nova prop para controle manual
}

interface FilterExample {
  pattern: string;
  description: string;
  example: string;
}

const filterExamples: FilterExample[] = [
  {
    pattern: "Múltiplas escolas",
    description: "Números separados por vírgula",
    example: "01, 05, 10, 25"
  },
  {
    pattern: "Intervalo de escolas", 
    description: "Use hífen entre números",
    example: "15-25"
  },
  {
    pattern: "Item + Gênero",
    description: "Combine item e gênero",
    example: "camiseta feminino"
  },
  {
    pattern: "Item + Gênero + Tamanho",
    description: "Busca completa por item",
    example: "polo masculino p"
  },
  {
    pattern: "Busca por campo",
    description: "Use campo: valor",
    example: "escola: maria"
  },
  {
    pattern: "Com data específica",
    description: "Adicione data na busca",
    example: "camiseta feminino 2024-01-15"
  },
  {
    pattern: "Por gênero",
    description: "Filtre apenas por gênero",
    example: "genero: feminino"
  },
  {
    pattern: "Por tamanho",
    description: "Filtre por tamanhos",
    example: "tam: pp,p,m"
  }
];

export default function AdvancedFilter({ 
  value, 
  onChange, 
  placeholder = "Busca avançada...",
  className = "",
  onEnter
}: AdvancedFilterProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showExamples, setShowExamples] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [localValue, setLocalValue] = useState(value);
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);
  const [inputRect, setInputRect] = useState<DOMRect | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Verificar se está montado no cliente
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Sincronizar estado local com prop externa
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Atualizar posição do input quando necessário
  const updateInputRect = useCallback(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setInputRect(rect);
    }
  }, []);

  // Atualizar posição quando expande
  useEffect(() => {
    if (isExpanded || showExamples) {
      updateInputRect();
      
      const handleResize = () => updateInputRect();
      const handleScroll = () => updateInputRect();
      
      window.addEventListener('resize', handleResize);
      window.addEventListener('scroll', handleScroll);
      
      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, [isExpanded, showExamples, updateInputRect]);

  // Detectar tipo de filtro ativo - usando localValue para responsividade
  useEffect(() => {
    if (!localValue.trim()) {
      setActiveFilters([]);
      return;
    }

    const filters: string[] = [];
    const term = localValue.toLowerCase().trim();

    if (/^\d+(\s*,\s*\d+)+$/.test(term)) {
      filters.push('múltiplas');
    } else if (/^(\d+)\s*-\s*(\d+)$/.test(term)) {
      filters.push('intervalo');
    } else if (term.includes(':')) {
      const campo = term.split(':')[0].trim();
      filters.push(`${campo}:`);
    } else if (term.includes(' ')) {
      const termos = term.split(/\s+/);
      const tamanhos = ['pp', 'p', 'm', 'g', 'gg', 'xg', 'xgg'];
      const generos = ['masculino', 'feminino', 'unissex', 'infantil'];
      
      const temTamanho = termos.some(t => tamanhos.includes(t));
      const temGenero = termos.some(t => generos.includes(t));
      const temData = termos.some(t => /^\d{4}-\d{2}-\d{2}$/.test(t));
      
      if (temTamanho) filters.push('tamanho');
      if (temGenero) filters.push('gênero');
      if (temData) filters.push('data');
      if (!temTamanho && !temGenero && !temData) filters.push('combinado');
    } else if (/^\d+$/.test(term)) {
      filters.push('escola');
    } else {
      filters.push('texto');
    }

    setActiveFilters(filters);
  }, [localValue]);

  // Debounce para onChange (opcional - apenas se não usar onEnter)
  const debouncedChange = useCallback((newValue: string) => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    // Se tem onEnter, não faz debounce automático
    if (onEnter) {
      return;
    }

    const timer = setTimeout(() => {
      onChange(newValue);
    }, 500); // 500ms de delay

    setDebounceTimer(timer);
  }, [debounceTimer, onChange, onEnter]);

  // Cleanup do timer
  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);

  const handleClear = () => {
    setLocalValue('');
    onChange('');
    inputRef.current?.focus();
  };

  const handleExampleClick = (example: string) => {
    setLocalValue(example);
    onChange(example); // Sempre atualiza o estado externo
    if (onEnter) {
      onEnter(example); // E aplica o filtro se tem onEnter
    }
    setShowExamples(false);
    setIsExpanded(false);
    
    // Garantir que o foco seja mantido no input
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    
    // Se não tem onEnter, faz debounce automático
    if (!onEnter) {
      debouncedChange(newValue);
    }
  };


  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setShowExamples(false);
      setIsExpanded(false);
      return;
    }

    if (e.key === 'Enter' && onEnter) {
      e.preventDefault();
      onEnter(localValue);
      setIsExpanded(false);
    }
  };

  const handleSearch = () => {
    if (onEnter) {
      onEnter(localValue);
    }
    setIsExpanded(false);
  };

  // Condição para mostrar o painel
  const shouldShowPanel = (isExpanded || showExamples) && inputRect;

  return (
    <div className={`relative ${className}`}>
      {/* Container principal */}
      <motion.div
        ref={containerRef}
        className={`
          relative bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 
          rounded-lg transition-all duration-300 overflow-visible h-10
          ${isExpanded ? 'shadow-2xl shadow-cyan-500/20' : 'shadow-lg'}
        `}
      >
        {/* Input principal */}
        <div className="flex items-center px-3 h-full">
          <Search className="w-4 h-4 text-slate-400 mr-3 flex-shrink-0" />
          
          <div className="flex-1 min-w-0 pr-2">
            <input
              ref={inputRef}
              type="text"
              value={localValue}
              onChange={handleInputChange}
              onFocus={() => {
                updateInputRect();
                setIsExpanded(true);
              }}
              onBlur={(e) => {
                // Se o painel estiver aberto, manter o foco no input
                if (isExpanded || showExamples) {
                  e.target.focus();
                  return;
                }
                // Delay para permitir cliques no painel
                setTimeout(() => {
                  setIsExpanded(false);
                  setShowExamples(false);
                }, 200);
              }}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="
                w-full bg-transparent text-white placeholder-slate-400 
                focus:outline-none text-sm
                overflow-hidden text-ellipsis
              "
            />
          </div>

          {/* Filtros ativos - apenas desktop */}
          <AnimatePresence>
            {activeFilters.length > 0 && !isExpanded && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="hidden lg:flex items-center gap-1 ml-2"
              >
                {activeFilters.slice(0, 2).map((filter, index) => (
                  <span
                    key={index}
                    className="
                      px-2 py-0.5 bg-cyan-500/20 text-cyan-400 text-xs 
                      rounded-full border border-cyan-500/30 truncate max-w-20
                    "
                  >
                    {filter}
                  </span>
                ))}
                {activeFilters.length > 2 && (
                  <span className="text-cyan-400 text-xs">+{activeFilters.length - 2}</span>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Botões de ação */}
          <div className="flex items-center gap-1 flex-shrink-0">
            {localValue && (
              <button
                onClick={handleClear}
                className="p-1 text-slate-400 hover:text-white transition-colors hover:bg-slate-700/50 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {onEnter && localValue && (
              <button
                onClick={handleSearch}
                className="p-1 text-cyan-400 hover:text-cyan-300 transition-colors hover:bg-cyan-500/20 rounded-lg"
                title="Aplicar filtro (Enter)"
              >
                <Filter className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={() => {
                updateInputRect();
                setShowExamples(!showExamples);
              }}
              className="p-1 text-slate-400 hover:text-cyan-400 transition-colors hover:bg-slate-700/50 rounded-lg"
              title="Ver exemplos"
            >
              <Info className="w-4 h-4" />
            </button>
          </div>
        </div>

      </motion.div>


      {/* Portal único para mobile e desktop */}
      {isMounted && shouldShowPanel && createPortal(
        <div
          className="fixed bg-slate-800/95 backdrop-blur-sm border border-slate-600/50 rounded-xl shadow-2xl"
          style={{
            top: inputRect ? inputRect.bottom + 8 : 0,
            left: inputRect ? inputRect.left : 0,
            width: inputRect ? Math.max(inputRect.width, 300) : 300,
            maxWidth: '90vw',
            zIndex: 2147483647
          }}
          onMouseDown={(e) => {
            // Prevenir que o input perca foco quando clicar no painel
            e.preventDefault();
          }}
          onClick={() => {
            // Garantir que o foco volte para o input após qualquer clique no painel
            if (inputRef.current) {
              inputRef.current.focus();
            }
          }}
        >
          <div className="p-3 sm:p-4 max-h-80 overflow-y-auto">
            {/* Header responsivo */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <h4 className="text-sm font-medium text-cyan-400">
                  Exemplos de Busca
                </h4>
              </div>
              {onEnter && (
                <div className="text-xs text-cyan-300 bg-cyan-500/20 px-2 py-1 rounded self-start sm:self-center">
                  Enter para filtrar
                </div>
              )}
            </div>

            {/* Exemplos responsivos */}
            <div className="space-y-2">
              {filterExamples.slice(0, 6).map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleExampleClick(item.example)}
                  className="
                    w-full text-left p-2 sm:p-3 bg-slate-700/30 hover:bg-slate-700/50 
                    rounded-lg border border-slate-600/30 hover:border-cyan-500/50
                    transition-all duration-200 group
                  "
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="text-sm font-medium text-white group-hover:text-cyan-400">
                      {item.pattern}
                    </div>
                    <div className="text-xs text-cyan-400 font-mono bg-slate-800/50 px-2 py-1 rounded self-start">
                      {item.example}
                    </div>
                  </div>
                  <div className="text-xs text-slate-400 mt-1 sm:hidden">
                    {item.description}
                  </div>
                </button>
              ))}
            </div>

            {/* Dicas responsivas */}
            <div className="mt-4 pt-3 border-t border-slate-600/30">
              <div className="text-xs text-slate-400">
                {/* Mobile: layout vertical */}
                <div className="space-y-3 sm:hidden">
                  <div className="flex items-start gap-2">
                    <span className="text-base flex-shrink-0">💡</span>
                    <div className="flex flex-col">
                      <strong className="text-slate-300">Múltiplas:</strong>
                      <span className="text-cyan-400 font-mono">01,05,10</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-base flex-shrink-0">📊</span>
                    <div className="flex flex-col">
                      <strong className="text-slate-300">Intervalo:</strong>
                      <span className="text-cyan-400 font-mono">15-25</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-base flex-shrink-0">🎯</span>
                    <div className="flex flex-col">
                      <strong className="text-slate-300">Campo:</strong>
                      <span className="text-cyan-400 font-mono">escola:nome</span>
                    </div>
                  </div>
                </div>
                
                {/* Desktop: layout vertical também para evitar sobreposição */}
                <div className="hidden sm:block space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-base">💡</span>
                    <strong className="text-slate-300">Múltiplas:</strong>
                    <span className="text-cyan-400 font-mono">01,05,10</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-base">📊</span>
                    <strong className="text-slate-300">Intervalo:</strong>
                    <span className="text-cyan-400 font-mono">15-25</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-base">🎯</span>
                    <strong className="text-slate-300">Campo:</strong>
                    <span className="text-cyan-400 font-mono">escola:nome</span>
                  </div>
                </div>
              </div>
              
              {onEnter && (
                <div className="mt-4 text-center">
                  <div className="text-xs text-cyan-300 bg-cyan-500/10 px-3 py-2 rounded-lg border border-cyan-500/30 inline-block max-w-full">
                    ⚡ Pressione <strong>Enter</strong> ou toque no ícone de filtro para aplicar
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
