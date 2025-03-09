/* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

// interface OverviewProps {
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   data: any[];
// }

// export const Overview: React.FC<OverviewProps> = ({ data }) => {
//   return (
//     <ResponsiveContainer width="100%" height={350}>
//       <BarChart data={data}>
//         <XAxis
//           dataKey="name"
//           stroke="#888888"
//           fontSize={12}
//           tickLine={false}
//           axisLine={false}
//         />
//         <YAxis
//           stroke="#888888"
//           fontSize={12}
//           tickLine={false}
//           axisLine={false}
//           tickFormatter={(value) => `Ksh${value}`}
//         />
//         <Bar dataKey="total" fill="#3498db" radius={[4, 4, 0, 0]} />
//       </BarChart>
//     </ResponsiveContainer>
//   );
// };

"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import { Download, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

interface GraphData {
  name: string
  total: number
}

interface OverviewProps {
  data: GraphData[]
}

export function Overview({ data }: OverviewProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Wait for component to mount to access theme
  useEffect(() => {
    setMounted(true)
  }, [])

  // Format the data with additional properties
  const enhancedData = data.map((item) => ({
    ...item,
    formattedTotal: new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "Ksh",
    }).format(item.total),
  }))

  // Function to export data as CSV
  const exportToCSV = () => {
    // Create CSV header
    let csvContent = "Month,Revenue\n"

    // Add data rows
    enhancedData.forEach((item) => {
      csvContent += `${item.name},${item.total}\n`
    })

    // Create a blob and download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `revenue-data-${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg shadow-lg p-3">
          <p className="font-medium text-sm">{label}</p>
          <p className="text-lg font-bold text-primary">{payload[0].payload.formattedTotal}</p>
        </div>
      )
    }
    return null
  }

  // If not mounted yet, return a placeholder to avoid hydration issues
  if (!mounted) {
    return <div className="h-[350px] flex items-center justify-center">Loading chart...</div>
  }

  // Determine colors based on theme
  const isDarkTheme = theme === "dark"
  const barColor = isDarkTheme ? "#a78bfa" : "var(--primary)" // Use purple in dark mode
  const gridColor = isDarkTheme ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"
  const textColor = isDarkTheme ? "#e5e7eb" : "#888888"

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <button
          onClick={() => setTheme(isDarkTheme ? "light" : "dark")}
          className="flex items-center space-x-1 text-sm rounded-md bg-muted/50 text-foreground px-3 py-1 hover:bg-muted transition-colors"
        >
          {isDarkTheme ? (
            <>
              <Sun className="h-4 w-4" />
              <span>Light Mode</span>
            </>
          ) : (
            <>
              <Moon className="h-4 w-4" />
              <span>Dark Mode</span>
            </>
          )}
        </button>

        <button
          onClick={exportToCSV}
          className="flex items-center space-x-1 text-sm rounded-md bg-primary/10 text-primary px-3 py-1 hover:bg-primary/20 transition-colors"
        >
          <Download className="h-4 w-4" />
          <span>Export CSV</span>
        </button>
      </div>

      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={enhancedData} margin={{ top: 20, right: 20, left: 20, bottom: 10 }}>
            <defs>
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={barColor} stopOpacity={0.8} />
                <stop offset="95%" stopColor={barColor} stopOpacity={0.4} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
            <XAxis dataKey="name" stroke={textColor} fontSize={12} tickLine={false} axisLine={false} />
            <YAxis
              stroke={textColor}
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `Ksh${value}`}
              width={60}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: isDarkTheme ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)" }}
            />
            <Bar dataKey="total" fill="url(#colorTotal)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Monthly summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-4">
        {enhancedData.slice(0, 4).map((item) => (
          <div key={item.name} className={`rounded-md p-2 text-center ${isDarkTheme ? "bg-muted/40" : "bg-muted/30"}`}>
            <p className="text-xs text-muted-foreground">{item.name}</p>
            <p className="text-sm font-medium">{item.formattedTotal}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

