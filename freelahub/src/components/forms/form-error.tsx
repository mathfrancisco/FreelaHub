import * as React from "react"
import { AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils/utils"

interface FormErrorProps {
    message: string
    className?: string
}

export function FormError({ message, className }: FormErrorProps) {
    return (
        <div className={cn(
            "flex items-center gap-2 p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md",
            className
        )}>
            <AlertCircle className="h-4 w-4" />
            <span>{message}</span>
        </div>
    )
}