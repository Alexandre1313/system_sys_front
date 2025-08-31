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
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();  // Agora usamos o hook useRouter
    const [isClient, setIsClient] = useState(false); // Estado para verificar se o componente foi montado

    useEffect(() => {
        setIsClient(true);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        if (!email || !password) {
            setError('Por favor, preencha todos os campos');
            setIsLoading(false);
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
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[100dvh] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 relative flex items-center justify-center px-4 py-8">
            {/* Background Pattern */}
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(120,119,198,0.1),transparent_70%)] pointer-events-none"></div>
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(16,185,129,0.1),transparent_70%)] pointer-events-none"></div>

            {/* Login Card */}
            <div className="relative z-10 w-full max-w-md">
                {/* Header Card */}
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 sm:p-8 mb-6">
                    {/* Logo Section */}
                    <div className="text-center mb-8">
                        <div className="flex items-center justify-center mb-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-xl flex items-center justify-center mr-4">
                                <span className="text-white font-bold text-xl">S</span>
                            </div>
                            <div className="text-left">
                                <h1 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-600">
                                    SYS<span className="text-blue-400 ml-1">E</span><span className="text-slate-300 ml-1">XPED</span>
                                </h1>
                                <p className="text-slate-400 text-sm">Sistema de Expedição</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center justify-center mb-6">
                            <div className="w-16 h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
                            <span className="mx-4 text-slate-400 text-sm font-medium">LOGIN</span>
                            <div className="w-16 h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
                        </div>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email Input */}
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-slate-300 text-sm font-medium">
                                Email
                            </label>
                            <div className="relative">
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="Digite seu email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full h-12 px-4 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                                    required
                                    autoComplete="email"
                                />
                                <div className="absolute inset-y-0 right-4 flex items-center">
                                    <span className="text-slate-500 text-sm">📧</span>
                                </div>
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="space-y-2">
                            <label htmlFor="password" className="text-slate-300 text-sm font-medium">
                                Senha
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type="password"
                                    placeholder="Digite sua senha"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full h-12 px-4 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                                    required
                                    autoComplete="current-password"
                                />
                                <div className="absolute inset-y-0 right-4 flex items-center">
                                    <span className="text-slate-500 text-sm">🔒</span>
                                </div>
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-900/20 border border-red-800 rounded-xl p-4">
                                <p className="text-red-400 text-sm flex items-center">
                                    <span className="mr-2">⚠️</span>
                                    {error}
                                </p>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="space-y-4">
                            <button 
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-12 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 disabled:from-slate-700 disabled:to-slate-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                                        Entrando...
                                    </>
                                ) : (
                                    'Entrar no Sistema'
                                )}
                            </button>

                            <button 
                                type="button"
                                onClick={logout}
                                className="w-full h-12 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-medium rounded-xl transition-all duration-300 transform hover:scale-105"
                            >
                                Limpar Sessão
                            </button>
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="text-center">
                    <div className="flex items-center justify-center mb-4">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
                        <span className="text-slate-500 text-xs">Sistema Online</span>
                    </div>
                    <p className="text-slate-500 text-xs">
                        © {new Date().getFullYear()} SYS EXPED - Sistema de Expedição. Todos os direitos reservados.
                    </p>
                </div>
            </div>
        </div>
    );
}
