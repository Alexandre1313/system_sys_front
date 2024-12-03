'use client'

import { useEffect, useState } from 'react';
import bcrypt from 'bcryptjs';
import { useAuth } from '@/contexts/AuthContext';
import { siginn } from '@/hooks_api/api'; // Função que chama o backend para pegar o usuário
import { setCookie } from 'cookies-next';
import Image from 'next/image';

export default function SigIn() {
    const { login } = useAuth();  // Função de login do contexto
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Este código é para garantir que a imagem de fundo seja aplicada corretamente
        document.body.style.backgroundImage = "url('/fundoigin.jpg')";
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "center";
        document.body.style.backgroundRepeat = "no-repeat";
    
        return () => {
          // Limpa o estilo ao sair da página
          document.body.style.backgroundImage = "none";
        };
    }, []); 

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        if (!email || !password) {
            setError('Por favor, preencha todos os campos');
            return;
        }
    
        try {
            const user = await siginn({ email, password });
    
            if (!user) {
                throw new Error('Credenciais inválidas');
            }
    
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                throw new Error('Senha inválida');
            }
    
            // Armazenar o token no cookie
            setCookie('userToken', JSON.stringify(user), { maxAge: 60 * 60 * 24 });  // 1 dia de validade
    
            login(user);
    
            setError(null);
        } catch (error: any) {
            setError(error.message || 'Erro ao tentar fazer login');
        }
    };

    return (
        <div className="relative flex items-center justify-center min-h-[100vh] w-[100%]">
            <div className="absolute inset-0 bg-white opacity-75"></div>
            <div className="relative z-10 flex flex-col items-center justify-start min-h-[100vh] w-[500px] bg-gray-300 p-10 gap-y-10">
                <div className="flex items-center justify-center h-auto w-auto">
                    <h2 className={`flex text-[35px] text-black`}>LOGIN</h2>
                </div>

                <form onSubmit={handleSubmit} className="w-full flex flex-col items-center gap-8">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`p-2 w-full min-h-[40px] text-black font-semibold text-[20px] outline-none`}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`p-2 w-full min-h-[40px] text-black font-semibold text-[20px] outline-none`}
                        required
                    />
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button type="submit"
                        className={`p-2 py-5 w-full min-h-[40px] text-white cursor-pointer rounded-md 
                        font-semibold text-[20px] outline-none bg-slate-700 hover:bg-slate-500`}>
                        FAZER LOGIN
                    </button>
                </form>
            </div>

            <div className="flex items-center justify-center min-h-[100vh] flex-1">
                <div className="flex items-center justify-center h-auto w-auto">
                    <Image 
                        src={`/venturalogo.png`} 
                        alt={`Logo da Empresa`} 
                        className={`z-10`} 
                        height={0} 
                        width={550} />
                </div>
            </div>
        </div>
    );
}
