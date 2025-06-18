'use client'

import { ReactNode } from 'react'
import { Sidebar } from './sidebar'
import { Header } from './header'
import { cn } from '@/lib/utils/utils'

interface AppLayoutProps {
    children: ReactNode
    className?: string
}

export function AppLayout({ children, className }: AppLayoutProps) {
    return (
        <div className="flex h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 overflow-hidden">
            {/* Background Pattern */}
            <div className="fixed inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 pointer-events-none"></div>
            <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-100/20 via-transparent to-transparent pointer-events-none"></div>

            {/* Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden relative">
                {/* Header */}
                <Header />

                {/* Main Content */}
                <main className={cn(
                    "flex-1 overflow-auto relative",
                    "scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-300 hover:scrollbar-thumb-slate-400",
                    className
                )}>
                    {/* Content Container with improved padding and spacing */}
                    <div className="relative z-10">
                        {children}
                    </div>

                    {/* Subtle bottom gradient */}
                    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/50 to-transparent pointer-events-none"></div>
                </main>
            </div>
        </div>
    )
}