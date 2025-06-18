import { ArrowRight } from 'lucide-react'
import { Button } from "@/components/ui/button"

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

export default CtaSection