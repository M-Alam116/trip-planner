import type { TripPlanResponse } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Truck, Navigation, Clock, Calendar, ArrowRight, MapPin } from 'lucide-react'

export default function TripSummary({ data }: { data: TripPlanResponse }) {
   const stats = [
      { label: 'Total Distance', value: `${data.route.total_miles} mi`, icon: Navigation, color: 'text-blue-600', bg: 'bg-blue-50' },
      { label: 'Driving Time', value: `${data.plan.total_drive_time} hrs`, icon: Clock, color: 'text-green-600', bg: 'bg-green-50' },
      { label: 'Estimated Days', value: `${data.plan.days.length} Days`, icon: Calendar, color: 'text-orange-600', bg: 'bg-orange-50' },
      { label: 'End Cycle Used', value: `${data.plan.final_cycle_used}h`, icon: Truck, color: 'text-purple-600', bg: 'bg-purple-50' },
   ]

   return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
         <div className="flex flex-col gap-1">
            <h2 className="text-xl font-black tracking-tight uppercase">Operational <span className="text-primary">Intelligence</span></h2>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Consolidated Trip Analytics</p>
         </div>

         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat) => (
               <Card key={stat.label} className="border-none shadow-lg bg-white dark:bg-slate-900 rounded-2xl overflow-hidden group transition-all duration-300">
                  <CardContent className="py-6 px-4">
                     <div className="flex flex-col items-center text-center gap-2">
                        <div className={`p-3 rounded-xl ${stat.bg} dark:bg-slate-800 ${stat.color} transition-transform group-hover:scale-110`}>
                           <stat.icon className="w-5 h-5" />
                        </div>
                        <div>
                           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                           <p className="text-xl font-black tracking-tight">{stat.value}</p>
                        </div>
                     </div>
                  </CardContent>
               </Card>
            ))}
         </div>

         <Card className="lg:col-span-2 border-none shadow-xl bg-white dark:bg-slate-900 rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-slate-50 dark:border-slate-800 p-6">
               <CardTitle className="text-base font-black uppercase tracking-tight flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-primary" />
                  Route Timeline
               </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
               <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-100 dark:bg-slate-800 -translate-y-1/2 hidden md:block" />

                  <LocationNode
                     label="Origin"
                     location={data.route.origin}
                     icon={MapPin}
                     color="bg-slate-400"
                  />

                  <div className="flex flex-col items-center z-10 bg-white dark:bg-slate-900 px-2">
                     <ArrowRight className="text-slate-400 w-6 h-6 rotate-90 md:rotate-0" />
                     <span className="text-[9px] font-bold text-slate-400 uppercase">{data.route.miles_to_pickup} mi</span>
                  </div>

                  <LocationNode
                     label="Pickup"
                     location={data.route.pickup}
                     icon={Truck}
                     color="bg-primary"
                     active
                  />

                  <div className="flex flex-col items-center z-10 bg-white dark:bg-slate-900 px-2">
                     <ArrowRight className="text-slate-400 w-6 h-6 rotate-90 md:rotate-0" />
                     <span className="text-[9px] font-bold text-slate-400 uppercase">{data.route.miles_to_destination} mi</span>
                  </div>

                  <LocationNode
                     label="Destination"
                     location={data.route.destination}
                     icon={Target}
                     color="bg-green-600"
                  />
               </div>
            </CardContent>
         </Card>
      </div>
   )
}

function LocationNode({ label, location, icon: Icon, color, active = false }: { label: string, location: string, icon: any, color: string, active?: boolean }) {
   return (
      <div className="flex flex-col items-center gap-2 z-10 relative">
         <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center shadow-xl text-white ${active ? 'ring-4 ring-primary/20' : ''}`}>
            <Icon className="w-5 h-5" />
         </div>
         <div className="text-center">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
            <p className="text-[11px] font-black truncate max-w-[120px]">{location}</p>
         </div>
      </div>
   )
}

function Target({ className }: { className?: string }) {
   return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
         <circle cx="12" cy="12" r="10" />
         <circle cx="12" cy="12" r="6" />
         <circle cx="12" cy="12" r="2" />
      </svg>
   )
}
