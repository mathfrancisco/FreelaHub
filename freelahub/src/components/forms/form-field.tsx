import * as React from "react"
import { cn } from "@/lib/utils/utils"
import { Label } from "@/components/ui/label"

interface FormFieldProps {
    label: string
    error?: string
    required?: boolean
    className?: string
    children?: React.ReactNode
}

export function FormField({
                              label,
                              error,
                              required = false,
                              className,
                              children
                          }: FormFieldProps) {
    return (
        <div className={cn("space-y-2", className)}>
            <Label className="text-sm font-medium">
                {label}
                {required && <span className="text-destructive ml-1">*</span>}
            </Label>
            {children}
            {error && (
                <p className="text-sm text-destructive">{error}</p>
            )}
        </div>
    )
}
