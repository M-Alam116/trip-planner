import type { DayLog } from '@/types'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Truck, Clock, Moon } from 'lucide-react'
import DailyLogSheet from './DailyLogSheet'

export default function ELDLogsDisplay({ logs }: { logs: DayLog[] }) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white uppercase">Electronic Logs</h2>
          <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">Certified FMCSA-compliant daily sheets</p>
        </div>
        <Badge variant="outline" className="px-4 py-3 text-xs font-black border-2 border-primary/20 text-primary bg-primary/5 rounded-full">
          {logs.length} Days Plan
        </Badge>
      </div>

      <Accordion type="single" collapsible className="w-full space-y-4">
        {logs.map((log) => (
          <AccordionItem
            key={log.day}
            value={`day-${log.day}`}
            className="border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
          >
            <AccordionTrigger className="hover:no-underline py-6 px-6 group">
              <div className="flex items-center gap-8 text-left w-full">
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">Log Day</span>
                  <span className="text-2xl font-black text-primary transition-transform group-hover:scale-110 duration-300">{log.day}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">Calendar Date</span>
                  <span className="text-base font-bold">{log.date}</span>
                </div>
                <div className="hidden lg:flex gap-6 ml-auto mr-8">
                  <StatMini icon={Truck} label="Driving" value={`${log.summary.driving}h`} color="text-blue-600" bg="bg-blue-50" />
                  <StatMini icon={Clock} label="On Duty" value={`${log.summary.on_duty}h`} color="text-orange-600" bg="bg-orange-50" />
                  <StatMini icon={Moon} label="Off Duty" value={`${log.summary.off_duty}h`} color="text-green-600" bg="bg-green-50" />
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-8 pt-2 px-6 bg-slate-50/50 dark:bg-slate-950/30">
              <div className="py-2">
                <DailyLogSheet log={log} />
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}

function StatMini({ icon: Icon, label, value, color, bg }: { icon: any, label: string, value: string, color: string, bg: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-lg ${bg} dark:bg-slate-800/50 ${color} shadow-sm transition-transform group-hover:scale-110`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex flex-col">
        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-0.5">{label}</span>
        <span className="text-base font-black tracking-tight">{value}</span>
      </div>
    </div>
  )
}
