'use client'

import React, { useRef, useEffect } from 'react';
import CaixaCard from './CaixaCard';
import { Caixa } from '../../../core';

interface ListaCaixasProps {
  caixas: Caixa[];
  setTotalGrade?: (n: number, n1: number) => void;
}

const ListaCaixas = ({ caixas, setTotalGrade }: ListaCaixasProps) => {
  // OBS: permitir nulls no array de refs
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Ordenar caixas do maior para o menor número (defina antes do effect)
  const caixasOrdenadas = [...caixas].sort((a, b) => {
    const numA = parseInt(a.caixaNumber || '0');
    const numB = parseInt(b.caixaNumber || '0');
    return numB - numA;
  });

  useEffect(() => {
    const cards = cardRefs.current;
    const handlers: Array<((e: KeyboardEvent) => void) | undefined> = [];

    cards.forEach((card, index) => {
      if (!card) return;

      const handler = (e: KeyboardEvent) => {
        // ENTER → expande ou recolhe
        if (e.key === "Enter") {
          e.preventDefault();
          card.click();
          return;
        }

        // TAB → navegação circular
        if (e.key === "Tab") {
          e.preventDefault();

          if (e.shiftKey) {
            const prev = (index - 1 + cards.length) % cards.length;
            cards[prev]?.focus();
          } else {
            const next = (index + 1) % cards.length;
            cards[next]?.focus();
          }
        }
      };

      handlers[index] = handler;
      card.addEventListener("keydown", handler);
    });

    return () => {
      cards.forEach((card, index) => {
        const h = handlers[index];
        if (card && h) card.removeEventListener("keydown", h);
      });
    };
  }, [caixasOrdenadas.length]);


  useEffect(() => {
    const total = caixas.reduce((acc, caixa) => acc + (caixa.qtyCaixa || 0), 0);
    const totalItems = caixas.reduce((accCaixas, caixa) => {
      const totalItens = caixa.caixaItem?.reduce((accItens, item) => accItens + (item.itemQty || 0), 0) || 0;
      return accCaixas + totalItens;
    }, 0);
    setTotalGrade?.(total, totalItems);
  }, [caixas, setTotalGrade]);

  return (
    <div className="w-full space-y-4">
      {caixasOrdenadas.map((caixa, index) => (
        <div
          key={caixa.id ?? index}
          className="animate-fade-in focus:outline-none focus:ring-1 focus:ring-neutral-400/40 focus:rounded-md"
          style={{
            animationDelay: `${index * 50}ms`,
            animationFillMode: 'both'
          }}
          tabIndex={0}
          ref={(el) => {
            cardRefs.current[index] = el;
          }}
        >
          <CaixaCard caixa={caixa} len={caixas.length} />
        </div>
      ))}
    </div>
  );
};

export default ListaCaixas;
