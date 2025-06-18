import { BotMessageSquare, GanttChartSquare, LineChart, Rocket, Sparkles } from 'lucide-react'
import {Card} from "@/components/ui/card";


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
                        <Card key={index} {...feature} />
                    ))}
                </div>
            </div>
        </section>
    )
}

export default FeaturesSection