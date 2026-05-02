import type { DayLog } from '@/types'

interface DailyLogSheetProps {
  log: DayLog
}

export default function DailyLogSheet({ log }: DailyLogSheetProps) {
  const categories = [
    { label: 'Driving', status: 'DRIVING', color: 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.3)]' },
    { label: 'On-Duty', status: 'ON_DUTY', color: 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.3)]' },
    { label: 'Sleeper', status: 'SLEEPER_BERTH', color: 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.3)]' },
    { label: 'Off-Duty', status: 'OFF_DUTY', color: 'bg-slate-400 shadow-[0_0_8px_rgba(148,163,184,0.3)]' },
  ]

  // Map entries to 24-hour blocks (0.5 hour precision for better visualization)
  // The image shows blocks, so we'll use 48 blocks (30 mins each)
  const getGridData = () => {
    const grid: Record<string, boolean[]> = {
      DRIVING: Array(48).fill(false),
      ON_DUTY: Array(48).fill(false),
      SLEEPER_BERTH: Array(48).fill(false),
      OFF_DUTY: Array(48).fill(false),
    }

    let currentHalfHour = 0
    log.entries.forEach(entry => {
      const halfHours = Math.round(entry.hours * 2)
      for (let i = 0; i < halfHours; i++) {
        const idx = currentHalfHour + i
        if (idx < 48) {
          grid[entry.status][idx] = true
        }
      }
      currentHalfHour += halfHours
    })

    return grid
  }

  const gridData = getGridData()

  return (
    <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-x-auto">
      {/* Hours Header */}
      <div className="flex items-center mb-8">
        <div className="w-24 text-sm font-black text-slate-400 uppercase tracking-widest">Hours</div>
        <div className="flex flex-1 justify-between px-1">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="w-full text-center text-[10px] font-black text-slate-400 group relative">
              {i}
              <div className="absolute top-6 left-1/2 -translate-x-1/2 w-px h-2 bg-slate-200 dark:bg-slate-800" />
            </div>
          ))}
        </div>
      </div>

      {/* Grid Rows */}
      <div className="space-y-4">
        {categories.map((cat) => (
          <div key={cat.label} className="flex items-center group/row">
            <div className="w-24 pr-4">
              <div className="text-xs font-black text-slate-600 dark:text-slate-300 uppercase tracking-tighter leading-none">
                {cat.label}
              </div>
            </div>
            <div className="flex flex-1 bg-slate-50 dark:bg-slate-950 rounded-lg p-1.5 gap-1 border border-slate-100 dark:border-slate-800/50 shadow-inner">
              {gridData[cat.status].map((isActive, i) => (
                <div
                  key={i}
                  className={`h-10 flex-1 rounded-[3px] transition-all duration-300 ${isActive
                      ? `${cat.color} transform scale-[1.02] z-10`
                      : 'bg-white dark:bg-slate-900/50 border border-slate-200/30 dark:border-slate-800/30'
                    }`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Legend / Summary */}
      <div className="mt-10 flex gap-6 border-t border-slate-100 dark:border-slate-800 pt-6">
        {categories.map(cat => (
          <div key={cat.label} className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${cat.color.split(' ')[0]}`} />
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
              {cat.label}: {log.summary[cat.status.toLowerCase() as keyof typeof log.summary] || 0}h
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
