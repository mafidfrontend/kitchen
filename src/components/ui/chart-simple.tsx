import * as React from "react"
import { cn } from "@/lib/utils"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts"

const COLORS = ['hsl(var(--primary))', 'hsl(var(--accent))', 'hsl(var(--success))', 'hsl(var(--warning))']

export interface ChartData {
  name: string
  value: number
  [key: string]: any
}

interface ChartProps {
  data: ChartData[]
  className?: string
}

export function SimpleBarChart({ data, className }: ChartProps) {
  return (
    <div className={cn("w-full h-64", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="hsl(var(--primary))" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function SimplePieChart({ data, className }: ChartProps) {
  return (
    <div className={cn("w-full h-64", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={(entry) => `${entry.name}: ${entry.value}`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}