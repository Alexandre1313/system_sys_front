'use client'

import { useAuth } from '@/contexts/AuthContext';
import { siginn } from '@/hooks_api/api'; // Função que chama o backend para pegar o usuário
import bcrypt from 'bcryptjs';
import { setCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function SigIn() {
    const { login, logout } = useAuth();  // Função de login do contexto
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();  // Agora usamos o hook useRouter
    const [isClient, setIsClient] = useState(false); // Estado para verificar se o componente foi montado

    useEffect(() => {
        setIsClient(true);
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

            // Redireciona para a raiz após o login, mas só no lado do cliente
            if (isClient) {
                router.push('/');
            }
        } catch (error: any) {
            setError(error.message || 'Erro ao tentar fazer login');
        }
    };

    return (
        <div className="relative flex items-center justify-center min-h-[100vh] w-[100%] bg-[#181818]">
            <div className="relative z-10 flex flex-col items-center justify-center rounded-2xl w-[500px] bg-[#181818] p-10 gap-y-4">
                <div className={`flex flex-col`}>
                    <div className="flex flex-col items-center justify-center h-auto w-auto gap-y-1">
                        <h1 className={`flex text-[50px] font-semi-bold text-emerald-600`}>
                            <strong className={`flex text-[120px] font-normal text-emerald-600 -mt-20 pr-8`}>
                                SYS
                            </strong>
                            <strong className={`flex text-[120px] font-semi-bold text-blue-600 -mt-[4.8rem]`}>
                                E
                            </strong>
                            XPED
                            <strong className={`text-orange-600 flex -mt-32 text-[120px]`}>
                                .
                            </strong>
                        </h1>
                        <h2 className={`flex text-[21px] text-white`}>LOGIN</h2>
                    </div>

                    <form onSubmit={handleSubmit} className="w-full justify-center flex flex-col items-center
                    p-4 rounded-lg gap-8">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={`rounded-md p-2 w-full min-h-[40px] text-zinc-800 bg-gray-300 font-normal text-[20px] outline-none`}
                            required
                            autoComplete='current-email'
                        />
                        <input
                            type="password"
                            placeholder="Senha"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={`rounded-md p-2 w-full min-h-[40px] text-zinc-800 bg-gray-300 font-normal text-[20px] outline-none`}
                            required
                            autoComplete='current-password'
                        />
                        <div className={`flex flex-col w-full gap-y-14 items-center justify-center`}>
                            <div className={`flex gap-x-5 h-[20px] w-[80%]`}>
                                <button type="submit"
                                    className={`w-[50%] p-4 py-2 h-[45px] text-white cursor-pointer rounded-md 
                                font-semibold text-[14px] outline-none bg-slate-700 hover:bg-slate-500`}>
                                    LOGIN
                                </button>
                                <button type="button"
                                    onClick={logout}
                                    className={`w-[50%] p-4 py-2 h-[45px] text-white cursor-pointer rounded-md 
                                    font-semibold text-[14px] outline-none bg-slate-700 hover:bg-slate-500`}>
                                    LOGOUT
                                </button>
                            </div>
                            <div className={`flex justify-center items-center`}>
                                {error && <p className="text-red-500 text-sm">{error}</p>}
                            </div>
                        </div>
                    </form>
                </div>
                <div className={`row-start-3 flex gap-6 flex-wrap text-[17px] items-center justify-center pt-0 text-zinc-600`}>
                    © {new Date().getFullYear()} - {`SYS Exped`} - All rights reserved.
                </div>
            </div>
        </div>
    );
}
