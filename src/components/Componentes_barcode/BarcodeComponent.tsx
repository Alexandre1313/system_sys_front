"use client"

import { useState, useEffect } from 'react';

export default function BarcodeScanner() {
  const [barcode, setBarcode] = useState<string>('');
  const [typingTimeout, setTypingTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);
  const expectedLength = 3;

  function handleKeyDown (event: KeyboardEvent) {
    // Se a tecla pressionada não for uma tecla alfanumérica, ignore
    if (!event.key.match(/^[0-9a-zA-Z]+$/)) return;

    // Adiciona o caractere digitado ao estado do código de barras
    setBarcode((prev) => prev + event.key);

    // Limpa o timeout anterior, se existir
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    // Define um novo timeout para processar a leitura
    const newTimeout = setTimeout(() => {
      if (barcode.length >= expectedLength) {
        processBarcode(barcode); // Processa o código de barras se atingir o comprimento esperado
        setBarcode(''); // Limpa o campo após o uso
      }
    }, 100); // Tempo de espera em milissegundos

    setTypingTimeout(newTimeout);
  };

  const processBarcode = (barcode: string) => {
    console.log('Código de barras lido:', barcode);
    // Aqui você pode adicionar a lógica para processar o código de barras
  };

  useEffect(() => {
    // Adiciona o evento de teclado ao documento
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      // Remove o evento quando o componente é desmontado
      document.removeEventListener('keydown', handleKeyDown);
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
    };
  }, [barcode]); // Remover `typingTimeout` da dependência

  return (
    <div className='flex flex-col gap-1 p-3 border border-x-zinc-50 rounded-md'>
      <label className='flex text-start text-zinc-300 text-base'>Código de Barras</label>
      <input
        type="text"
        value={barcode}
        readOnly       
        placeholder="Leia o código de barras aqui"
        className='flex text-lg text-black text-start p-3 outline-1 outline-green-700 rounded-md min-w-[300px]'
      />
    </div>
  );
}
