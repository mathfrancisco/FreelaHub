import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils/utils"

interface StatsCardProps {
    title: string
    value: string | number
    change?: {
        value: number
        type: 'increase' | 'decrease'
    }
    icon: LucideIcon
    description?: string
    className?: string
}

export function StatsCard({
                              title,
                              value,
                              change,
                              icon: Icon,
                              description,
                              className
                          }: StatsCardProps) {
    return (
        <Card className={cn("relative overflow-hidden", className)}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                    {title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                {change && (
                    <p className={cn(
                        "text-xs flex items-center gap-1 mt-1",
                        change.type === 'increase' ? "text-green-600" : "text-red-600"
                    )}>
                        <span>{change.type === 'increase' ? '↑' : '↓'}</span>
                        {Math.abs(change.value)}% em relação ao mês anterior
                    </p>
                )}
                {description && (
                    <p className="text-xs text-muted-foreground mt-1">
                        {description}
                    </p>
                )}
            </CardContent>
        </Card>
    )
}
