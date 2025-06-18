import { ArrowRight, Sparkles, Star, Target } from 'lucide-react'
import { Button } from "@/components/ui/button"

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

export default HeroSection