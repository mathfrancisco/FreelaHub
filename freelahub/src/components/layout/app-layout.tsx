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
        <div className="flex h-screen bg-background">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <main className={cn("flex-1 overflow-auto p-6", className)}>
                    {children}
                </main>
            </div>
        </div>
    )
}