import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import MaskedInput from "react-text-mask";
import { Embalagem } from "../../../core";
import { Loader } from "react-feather";
import { inserirEmb } from "@/hooks_api/api";
import { motion } from "framer-motion";

interface ModalEmbCadProps {
  isModalOpenEmb: boolean;
  handleCloseModalEmb: () => void;
  mutate: () => void;
}

const ModalEmbCad: React.FC<ModalEmbCadProps> = ({ isModalOpenEmb, handleCloseModalEmb, mutate }) => {
  const { control, handleSubmit, setValue } = useForm<Embalagem>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    // Preenche os campos com valores padrão ao abrir o modal
    setValue("nome", "");
    setValue("email", "");
    setValue("nomefantasia", "");
    setValue("telefone", "");
    setValue("whats", "");
  }, [setValue, isSubmitting]);

  if (!isModalOpenEmb) return null;

  const onSubmit = async (data: Embalagem) => {
    const formattedData: Embalagem = {
      ...data,
      nome: data.nome?.toUpperCase() || '',
      email: data.email?.toLowerCase() || '',
      nomefantasia: data.nomefantasia?.toUpperCase() || '',
    };
    setIsSubmitting(true);
    setMessage('Enviando dados, aguarde...')
    try {
      const response: Embalagem | null = await inserirEmb(formattedData);      
      if (!response) {
        setMessage('Ocorreu um erro, tente novamente.'); 
        const timeout = setTimeout(() => {
          setMessage('');
          clearTimeout(timeout);
        }, 2500)      
      }
      if (response) {
        setMessage('Cadastro efetuado com sucesso!');
        const timeout = setTimeout(() => {
          setMessage('');
          handleCloseModalEmb();
          mutate();
          clearTimeout(timeout);
        }, 2500)      
      }     
    } catch (error) {
      console.error(error)
      setMessage('Ocorreu um erro, tente novamente.'); 
      const timeout = setTimeout(() => {
        setMessage('');
        clearTimeout(timeout);
      }, 2500)      
    }finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.7 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="bg-zinc-900 p-6 rounded-lg max-w-lg w-full flex flex-col items-center"
      >
        <Loader
          className={isSubmitting ? "animate-rotate mb-4" : 'mb-4'}
          size={40}
          color="rgba(234, 170, 0, 0.7)"
        />
        <span className={`mb-5 flex w-full text-center text-zinc-500 text-[17px] h-[18px] justify-center items-center`}>{message}</span>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full">
          <div>
            <label className="block mb-1 text-[15px] text-zinc-500">Nome:</label>
            <Controller
              name="nome"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  className="w-full px-4 py-2 border border-zinc-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-800 bg-transparent"
                  placeholder="Nome da Embalagem"
                />
              )}
            />
          </div>
          <div>
            <label className="block mb-1 text-[15px] text-zinc-500">Email:</label>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  className="w-full px-4 py-2 border border-zinc-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-800 bg-transparent"
                  placeholder="Email de contato"
                />
              )}
            />
          </div>
          <div>
            <label className="block mb-1 text-[15px] text-zinc-500">Nome Fantasia:</label>
            <Controller
              name="nomefantasia"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  className="w-full px-4 py-2 border border-zinc-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-800 bg-transparent"
                  placeholder="Nome Fantasia (opcional)"
                />
              )}
            />
          </div>
          <div>
            <label className="block mb-1 text-[15px] text-zinc-500">Telefone:</label>
            <Controller
              name="telefone"
              control={control}
              render={({ field }) => (
                <MaskedInput
                  {...field}
                  mask={['(', /[1-9]/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                  className="w-full px-4 py-2 border border-zinc-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-800 bg-transparent"
                  placeholder="Telefone (opcional)"
                />
              )}
            />
          </div>
          <div>
            <label className="block mb-1 text-[15px] text-zinc-500">WhatsApp:</label>
            <Controller
              name="whats"
              control={control}
              render={({ field }) => (
                <MaskedInput
                  {...field}
                  mask={['(', /[1-9]/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                  className="w-full px-4 py-2 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-800 bg-transparent"
                  placeholder="WhatsApp"
                />
              )}
            />
          </div>
          <div className="flex justify-between gap-4 mt-4">
            <button
              type="button"
              onClick={handleCloseModalEmb}
              disabled={isSubmitting}
              className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg w-full"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-green-700 hover:bg-green-600 text-white rounded-lg w-full transition"
            >
              {isSubmitting ? "Enviando..." : "Cadastrar"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ModalEmbCad;
