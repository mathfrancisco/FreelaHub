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
        <Card className={`border-slate-200 bg-gradient-to-br from-white to-slate-50/50 shadow-lg hover:shadow-xl transition-shadow duration-300 ${className}`}>
            <CardHeader className="pb-4">
                <CardTitle className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                    <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></div>
                    {title}
                </CardTitle>
                {description && (
                    <CardDescription className="text-slate-600 text-sm">
                        {description}
                    </CardDescription>
                )}
            </CardHeader>
            <CardContent className="p-6 pt-0">
                <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        {type === 'bar' ? (
                            <BarChart data={data}>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="#e2e8f0"
                                    opacity={0.6}
                                />
                                <XAxis
                                    dataKey="name"
                                    stroke="#64748b"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke="#64748b"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#1e293b',
                                        border: 'none',
                                        borderRadius: '8px',
                                        color: '#f8fafc',
                                        boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
                                    }}
                                />
                                <Bar
                                    dataKey="value"
                                    fill="url(#barGradient)"
                                    radius={[4, 4, 0, 0]}
                                />
                                {data[0]?.comparison !== undefined && (
                                    <Bar
                                        dataKey="comparison"
                                        fill="url(#comparisonGradient)"
                                        radius={[4, 4, 0, 0]}
                                        opacity={0.6}
                                    />
                                )}
                                <defs>
                                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#8b5cf6" />
                                        <stop offset="100%" stopColor="#3b82f6" />
                                    </linearGradient>
                                    <linearGradient id="comparisonGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#64748b" />
                                        <stop offset="100%" stopColor="#94a3b8" />
                                    </linearGradient>
                                </defs>
                            </BarChart>
                        ) : (
                            <LineChart data={data}>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="#e2e8f0"
                                    opacity={0.6}
                                />
                                <XAxis
                                    dataKey="name"
                                    stroke="#64748b"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke="#64748b"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#1e293b',
                                        border: 'none',
                                        borderRadius: '8px',
                                        color: '#f8fafc',
                                        boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
                                    }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="value"
                                    stroke="url(#lineGradient)"
                                    strokeWidth={3}
                                    dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                                    activeDot={{ r: 6, stroke: '#8b5cf6', strokeWidth: 2 }}
                                />
                                {data[0]?.comparison !== undefined && (
                                    <Line
                                        type="monotone"
                                        dataKey="comparison"
                                        stroke="#64748b"
                                        strokeWidth={2}
                                        strokeDasharray="5 5"
                                        dot={{ fill: '#64748b', strokeWidth: 2, r: 3 }}
                                    />
                                )}
                                <defs>
                                    <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                                        <stop offset="0%" stopColor="#8b5cf6" />
                                        <stop offset="100%" stopColor="#3b82f6" />
                                    </linearGradient>
                                </defs>
                            </LineChart>
                        )}
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}