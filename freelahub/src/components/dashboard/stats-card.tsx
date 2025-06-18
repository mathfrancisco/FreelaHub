import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
        <Card className={cn(
            "border-slate-200 bg-gradient-to-br from-white to-slate-50/50 shadow-lg hover:shadow-xl transition-all duration-300 group",
            className
        )}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">
                    {title}
                </CardTitle>
                <div className="p-2 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg group-hover:from-purple-200 group-hover:to-blue-200 transition-colors duration-300">
                    <Icon className="h-4 w-4 text-purple-700" />
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-slate-900 mb-2">
                    {value}
                </div>
                <div className="flex items-center justify-between">
                    {change && (
                        <Badge
                            variant="outline"
                            className={cn(
                                "text-xs font-medium",
                                change.type === 'increase'
                                    ? "border-green-200 bg-green-50 text-green-700"
                                    : "border-red-200 bg-red-50 text-red-700"
                            )}
                        >
                            <span className="mr-1">
                                {change.type === 'increase' ? '↗' : '↘'}
                            </span>
                            {Math.abs(change.value)}%
                        </Badge>
                    )}
                </div>
                {description && (
                    <p className="text-xs text-slate-500 mt-2">
                        {description}
                    </p>
                )}
            </CardContent>
        </Card>
    )
}