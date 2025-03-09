"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDown, ArrowUp, Minus } from "lucide-react"
import { cn } from "@/lib/utils"

interface DashboardCardProps {
  title: string
  value: string
  icon: React.ReactNode
  trend?: "up" | "down" | "neutral"
  trendValue?: string
  trendPeriod?: string
  valuePrefix?: string
}

export function DashboardCard({
  title,
  value,
  icon,
  trend = "neutral",
  trendValue,
  trendPeriod,
  valuePrefix = "",
}: DashboardCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
      className="h-full"
    >
      <Card className="h-full border shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-muted/30 -mt-3">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <div className="rounded-full bg-background p-2 shadow-sm">{icon}</div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="text-2xl font-bold tracking-tight">
            {valuePrefix}
            {value}
          </div>

          {trendValue && (
            <motion.div
              className="mt-2 flex items-center text-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              key={`${trend}-${trendValue}`} // Key for animation when trend changes
            >
              <div
                className={cn(
                  "mr-1",
                  trend === "up" && "text-emerald-500",
                  trend === "down" && "text-red-500",
                  trend === "neutral" && "text-muted-foreground",
                )}
              >
                {trend === "up" && <ArrowUp className="h-4 w-4" />}
                {trend === "down" && <ArrowDown className="h-4 w-4" />}
                {trend === "neutral" && <Minus className="h-4 w-4" />}
              </div>
              <span
                className={cn(
                  "font-medium",
                  trend === "up" && "text-emerald-500",
                  trend === "down" && "text-red-500",
                  trend === "neutral" && "text-muted-foreground",
                )}
              >
                {trendValue}
              </span>
              {trendPeriod && <span className="text-muted-foreground ml-1">{trendPeriod}</span>}
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

