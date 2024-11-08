import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import InputMask from "react-input-mask";
import Embalagem from "../../../core/interfaces/Embalagem";
import { Loader } from "react-feather";

interface ModalEmbCadProps {
  isOpen: boolean;
  onClose: () => void;  
}

const ModalEmbCad: React.FC<ModalEmbCadProps> = ({ isOpen, onClose }) => {
  const { control, handleSubmit, setValue } = useForm<Embalagem>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Preencher os campos com os dados passados
  useEffect(() => {    
      setValue("nome", "");
      setValue("email", "");
      setValue("nomefantasia", "");
      setValue("telefone", "");
      setValue("whats", "");   
  }, [setValue, isSubmitting]);

  if (!isOpen) return null;

  // Função para enviar os dados da embalagem para a API
  const onSubmit = async (data: Embalagem) => {
    setIsSubmitting(true);
    try {        
    console.log('')// Fecha o modal após enviar os dados
    } catch (error) {
      console.error("Erro ao enviar dados", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-zinc-900 p-6 rounded-lg max-w-lg w-full flex flex-col justify-center">
        <Loader
            className={ isSubmitting ? 'animate-rotate' : ''}
            size={60}
            color={`rgba(234, 170, 0, 0.7)`}
         />
        <h2 className="text-xl font-semibold mb-4 flex w-full text-center justify-center">CADASTRO</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div>
            <label className="block mb-1 text-[15px] text-zinc-500">Nome:</label>
            <Controller
              name="nome"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  className="w-full px-4 py-2 border border-zinc-700 rounded-lg focus:outline-none 
                  focus:ring-1 focus:ring-green-800 bg-transparent"
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
                  className="w-full px-4 py-2 border border-zinc-700 rounded-lg focus:outline-none
                   focus:ring-1 focus:ring-green-800 bg-transparent"
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
                  className="w-full px-4 py-2 border border-zinc-700 rounded-lg focus:outline-none
                   focus:ring-1 focus:ring-green-800 bg-transparent"
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
                <InputMask mask="(99) 99999-9999" {...field}>
                  {(inputProps: any) => (
                    <input
                      {...inputProps}
                      className="w-full px-4 py-2 border border-zinc-700 rounded-lg focus:outline-none
                       focus:ring-1 focus:ring-green-800 bg-transparent"
                      placeholder="Telefone"
                    />
                  )}
                </InputMask>
              )}
            />
          </div>
          <div>
            <label className="block mb-1 text-[15px] text-zinc-500">WhatsApp:</label>
            <Controller
              name="whats"
              control={control}
              render={({ field }) => (
                <InputMask mask="(99) 99999-9999" {...field}>
                  {(inputProps: any) => (
                    <input
                      {...inputProps}
                      className="w-full px-4 py-2 border border-zinc-700 rounded-lg focus:outline-none
                       focus:ring-2 focus:ring-green-800 bg-transparent"
                      placeholder="WhatsApp"
                    />
                  )}
                </InputMask>
              )}
            />
          </div>
          <div className="flex justify-between gap-4 mt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg w-full"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-green-700 hover:bg-green-600 text-white rounded-lg w-full"
            >
              {isSubmitting ? "Enviando..." : "Cadastrar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalEmbCad;
