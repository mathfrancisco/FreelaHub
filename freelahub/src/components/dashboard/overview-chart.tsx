import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'

interface ChartData {
    name: string
    value: number
    comparison?: number
}

interface OverviewChartProps {
    title: string
    description?: string
    data: ChartData[]
    type?: 'bar' | 'line'
    className?: string
}

export function OverviewChart({
                                  title,
                                  description,
                                  data,
                                  type = 'bar',
                                  className
                              }: OverviewChartProps) {
    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                {description && (
                    <CardDescription>{description}</CardDescription>
                )}
            </CardHeader>
            <CardContent className="pt-2">
                <ResponsiveContainer width="100%" height={350}>
                    {type === 'bar' ? (
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="value" fill="hsl(var(--primary))" />
                            {data[0]?.comparison !== undefined && (
                                <Bar dataKey="comparison" fill="hsl(var(--muted))" />
                            )}
                        </BarChart>
                    ) : (
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Line
                                type="monotone"
                                dataKey="value"
                                stroke="hsl(var(--primary))"
                                strokeWidth={2}
                            />
                            {data[0]?.comparison !== undefined && (
                                <Line
                                    type="monotone"
                                    dataKey="comparison"
                                    stroke="hsl(var(--muted-foreground))"
                                    strokeWidth={2}
                                    strokeDasharray="5 5"
                                />
                            )}
                        </LineChart>
                    )}
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}
