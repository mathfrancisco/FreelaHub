'use client'
import { ArrowRight, BotMessageSquare, GanttChartSquare, LineChart, Rocket, Target, Sparkles, Star } from 'lucide-react'
import { Button } from "@/components/ui/button"

// Componente: Cabeçalho da Landing Page
const LandingHeader = () => {
    return (
        <header className="fixed top-0 left-0 right-0 z-50" style={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(148, 163, 184, 0.2)' }}>
            <div className="container mx-auto flex h-20 items-center justify-between px-6 md:px-8">
                <a href="/freelahub/public" className="flex items-center gap-3 transition-all duration-300 hover:scale-105 group">
                    <div className="relative">
                        <Target className="h-8 w-8 text-blue-400 group-hover:rotate-12 transition-transform duration-300" />
                        <div className="absolute -inset-1 bg-blue-400 rounded-full blur-sm opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                    </div>
                    <span className="text-2xl font-black text-white">
                        FreelaHub
                    </span>
                </a>
                <nav className="hidden md:flex items-center space-x-8">
                    <a href="#features" className="text-sm font-semibold text-slate-300 hover:text-blue-400 transition-all duration-300 relative group">
                        Funcionalidades
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 group-hover:w-full transition-all duration-300"></span>
                    </a>
                    <a href="#testimonials" className="text-sm font-semibold text-slate-300 hover:text-blue-400 transition-all duration-300 relative group">
                        Depoimentos
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 group-hover:w-full transition-all duration-300"></span>
                    </a>
                    <a href="#pricing" className="text-sm font-semibold text-slate-300 hover:text-blue-400 transition-all duration-300 relative group">
                        Preços
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 group-hover:w-full transition-all duration-300"></span>
                    </a>
                </nav>
                <div className="flex items-center gap-3">
                    <Button variant="ghost" className="hidden sm:flex font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-all duration-300">
                        <a href="/login">Login</a>
                    </Button>
                    <Button className="relative overflow-hidden group font-semibold shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500">
                        <a href="/register" className="flex items-center">
                            <span className="relative z-10 text-white">Registrar</span>
                            <ArrowRight className="relative z-10 ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 text-white" />
                        </a>
                    </Button>
                </div>
            </div>
        </header>
    )
}

// Componente: Seção de Herói
const HeroSection = () => {
    return (
        <section className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)' }}>
            {/* Background Effects */}
            <div className="absolute inset-0">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
                <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
                <div className="absolute bottom-1/3 left-1/3 w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
            </div>

            {/* Floating Elements */}
            <div className="absolute top-20 left-10 animate-bounce delay-1000">
                <Sparkles className="h-6 w-6 text-blue-400 opacity-60" />
            </div>
            <div className="absolute top-40 right-20 animate-bounce delay-2000">
                <Star className="h-4 w-4 text-purple-400 opacity-60" />
            </div>
            <div className="absolute bottom-40 left-20 animate-bounce delay-3000">
                <Sparkles className="h-5 w-5 text-indigo-400 opacity-60" />
            </div>

            <div className="container mx-auto px-6 text-center relative z-10">
                <div className="inline-flex items-center gap-2 px-6 py-2 mb-8 text-sm font-bold bg-slate-800 text-blue-400 rounded-full border border-blue-400 border-opacity-30">
                    <Sparkles className="h-4 w-4" />
                    Simplifique sua carreira freelancer
                    <Sparkles className="h-4 w-4" />
                </div>

                <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight mb-8">
                    <span className="block text-white mb-2">
                        A Plataforma
                    </span>
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-2">
                        Definitiva
                    </span>
                    <span className="block text-white">
                        para Freelancers
                    </span>
                </h1>

                <p className="mt-8 text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed text-slate-300">
                    Centralize sua carreira. Gestão de conteúdo, CRM, automação e analytics em um só lugar.
                    <br />
                    <span className="font-bold text-white">
                        Foque no que realmente importa: escalar seu negócio.
                    </span>
                </p>

                <div className="mt-12 flex flex-wrap justify-center gap-6">
                    <Button className="h-14 px-10 text-lg font-bold relative overflow-hidden group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-2xl transition-all duration-500 rounded-2xl">
                        <a href="/register" className="flex items-center">
                            <span className="relative z-10 text-white">Comece Agora Gratuitamente</span>
                            <ArrowRight className="relative z-10 ml-3 h-6 w-6 transition-transform group-hover:translate-x-2 text-white" />
                        </a>
                    </Button>
                    <Button variant="outline" className="h-14 px-10 text-lg font-bold border-2 border-slate-600 text-slate-300 hover:border-blue-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-all duration-500 rounded-2xl">
                        <a href="#features">
                            Conheça as Funcionalidades
                        </a>
                    </Button>
                </div>

                <div className="mt-20 relative group">
                    <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
                    <div className="relative h-80 md:h-96 w-full max-w-6xl mx-auto overflow-hidden rounded-2xl border border-slate-700 shadow-2xl" style={{ background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(10px)' }}>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center space-y-4">
                                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
                                    <Target className="h-10 w-10 text-white" />
                                </div>
                                <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                                    Dashboard Preview
                                </p>
                                <p className="text-slate-400">
                                    Interface moderna e intuitiva
                                </p>
                            </div>
                        </div>

                        {/* Decorative grid */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="grid grid-cols-6 grid-rows-4 h-full w-full">
                                {Array.from({ length: 24 }).map((_, i) => (
                                    <div key={i} className="border border-blue-400 border-opacity-20"></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

// Componente: Cartão de Funcionalidade
const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => {
    return (
        <div className="group relative flex flex-col items-center gap-6 p-8 rounded-3xl border border-slate-700 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2" style={{ background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(10px)' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800 text-blue-400 group-hover:scale-110 transition-transform duration-300">
                {icon}
            </div>
            <h3 className="relative text-2xl font-bold text-center text-white">
                {title}
            </h3>
            <p className="relative text-slate-400 text-center leading-relaxed">
                {description}
            </p>
        </div>
    )
}

// Componente: Seção de Funcionalidades
const FeaturesSection = () => {
    const features = [
        {
            icon: <BotMessageSquare className="h-8 w-8" />,
            title: "Gestão de Conteúdo com IA",
            description: "Crie, agende e analise seu conteúdo com o poder da nossa IA interna. Otimize sua presença digital e economize tempo precioso."
        },
        {
            icon: <GanttChartSquare className="h-8 w-8" />,
            title: "CRM e Pipeline de Vendas",
            description: "Nunca perca uma oportunidade. Gerencie seus leads, visualize seu pipeline de vendas e automatize follow-ups para fechar mais negócios."
        },
        {
            icon: <LineChart className="h-8 w-8" />,
            title: "Analytics para Decisões",
            description: "Tome decisões baseadas em dados. Acompanhe métricas de conteúdo e vendas para entender sua performance e identificar tendências de crescimento."
        },
        {
            icon: <Rocket className="h-8 w-8" />,
            title: "Automação de Tarefas",
            description: "Deixe o FreelaHub cuidar do trabalho repetitivo. Crie workflows para nutrição de leads, lembretes de projetos e muito mais."
        }
    ];

    return (
        <section id="features" className="py-32 px-6 relative" style={{ backgroundColor: '#1e293b' }}>
            <div className="absolute inset-0">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-10"></div>
            </div>

            <div className="container mx-auto relative">
                <div className="mx-auto max-w-3xl text-center mb-20">
                    <div className="inline-flex items-center gap-2 px-6 py-2 mb-8 text-sm font-bold bg-slate-800 text-blue-400 rounded-full border border-blue-400 border-opacity-30">
                        <Sparkles className="h-4 w-4" />
                        Funcionalidades
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-6">
                        Tudo que você precisa para crescer
                    </h2>
                    <p className="text-xl text-slate-300 leading-relaxed">
                        O FreelaHub foi desenhado para ser o centro de controle da sua carreira,
                        com ferramentas poderosas e inteligentes.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    {features.map((feature, index) => (
                        <FeatureCard key={index} {...feature} />
                    ))}
                </div>
            </div>
        </section>
    )
}

// Componente: CTA Final
const CtaSection = () => {
    return (
        <section className="relative py-32 overflow-hidden" style={{ background: 'linear-gradient(135deg, #334155 0%, #475569 50%, #64748b 100%)' }}>
            <div className="absolute inset-0">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
            </div>

            <div className="container mx-auto px-6 text-center relative">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-4xl md:text-6xl font-black mb-8 text-white">
                        Pronto para transformar sua carreira freelancer?
                    </h2>
                    <p className="text-xl md:text-2xl text-slate-300 mb-12 leading-relaxed">
                        Junte-se a milhares de freelancers que estão construindo negócios mais rentáveis e sustentáveis com o FreelaHub.
                    </p>
                    <div className="space-y-6">
                        <Button className="h-16 px-12 text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-2xl transition-all duration-500 rounded-2xl">
                            <a href="/register" className="flex items-center">
                                <span className="text-white">Começar agora gratuitamente</span>
                                <ArrowRight className="ml-3 h-6 w-6 text-white" />
                            </a>
                        </Button>
                        <p className="text-sm text-slate-400 font-medium">
                            ✨ Não é necessário cartão de crédito • Configuração em 2 minutos
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}

// Componente: Rodapé da Landing Page
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
                            <li>
                                <a href="/careers" className="text-slate-400 hover:text-blue-400 transition-colors duration-300">
                                    Carreiras
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

// Página Principal (Home)
export default function HomePage() {
    return (
        <div className="min-h-screen w-full" style={{ backgroundColor: '#0f172a' }}>
            <LandingHeader />
            <main>
                <HeroSection />
                <FeaturesSection />
                <CtaSection />
            </main>
            <Footer />
        </div>
    )
}