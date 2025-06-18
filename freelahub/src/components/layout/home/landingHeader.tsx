import { ArrowRight, Target } from 'lucide-react'
import { Button } from "@/components/ui/button"

const LandingHeader = () => {
    return (
        <header className="fixed top-0 left-0 right-0 z-50" style={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(148, 163, 184, 0.2)' }}>
            <div className="container mx-auto flex h-20 items-center justify-between px-6 md:px-8">
                <a href="/" className="flex items-center gap-3 transition-all duration-300 hover:scale-105 group">
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

export default LandingHeader