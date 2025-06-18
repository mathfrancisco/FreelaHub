import { Target } from 'lucide-react'

const Footer = () => {
    return (
        <footer className="border-t border-slate-700" style={{ backgroundColor: '#0f172a' }}>
            <div className="container mx-auto py-16 px-6">
                <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
                    <div className="space-y-6">
                        <a href="/freelahub/public" className="flex items-center gap-3 group">
                            <div className="relative">
                                <Target className="h-8 w-8 text-blue-400 group-hover:rotate-12 transition-transform duration-300" />
                                <div className="absolute -inset-1 bg-blue-400 rounded-full blur-sm opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                            </div>
                            <span className="text-2xl font-black text-white">
                                FreelaHub
                            </span>
                        </a>
                        <p className="text-slate-400 leading-relaxed">
                            A plataforma completa para freelancers de tecnologia gerenciarem e escalarem seus negócios.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <h3 className="font-bold text-lg text-white">Produto</h3>
                        <ul className="space-y-3">
                            <li>
                                <a href="#features" className="text-slate-400 hover:text-blue-400 transition-colors duration-300">
                                    Funcionalidades
                                </a>
                            </li>
                            <li>
                                <a href="#pricing" className="text-slate-400 hover:text-blue-400 transition-colors duration-300">
                                    Preços
                                </a>
                            </li>
                            <li>
                                <a href="#testimonials" className="text-slate-400 hover:text-blue-400 transition-colors duration-300">
                                    Depoimentos
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div className="space-y-6">
                        <h3 className="font-bold text-lg text-white">Recursos</h3>
                        <ul className="space-y-3">
                            <li>
                                <a href="/blog" className="text-slate-400 hover:text-blue-400 transition-colors duration-300">
                                    Blog
                                </a>
                            </li>
                            <li>
                                <a href="/guides" className="text-slate-400 hover:text-blue-400 transition-colors duration-300">
                                    Guias
                                </a>
                            </li>
                            <li>
                                <a href="/help" className="text-slate-400 hover:text-blue-400 transition-colors duration-300">
                                    Central de ajuda
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div className="space-y-6">
                        <h3 className="font-bold text-lg text-white">Empresa</h3>
                        <ul className="space-y-3">
                            <li>
                                <a href="/about" className="text-slate-400 hover:text-blue-400 transition-colors duration-300">
                                    Sobre nós
                                </a>
                            </li>
                            <li>
                                <a href="/contact" className="text-slate-400 hover:text-blue-400 transition-colors duration-300">
                                    Contato
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-slate-700 flex flex-col md:flex-row items-center justify-between gap-6">
                    <p className="text-slate-400">
                        © {new Date().getFullYear()} FreelaHub. Todos os direitos reservados.
                    </p>
                    <div className="flex items-center gap-6">
                        <a href="/terms" className="text-slate-400 hover:text-blue-400 transition-colors duration-300">
                            Termos de Serviço
                        </a>
                        <a href="/privacy" className="text-slate-400 hover:text-blue-400 transition-colors duration-300">
                            Política de Privacidade
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer