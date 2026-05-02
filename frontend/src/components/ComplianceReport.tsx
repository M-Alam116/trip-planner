import type { TripPlanResponse } from '@/types'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { CheckCircle2, AlertCircle, Info, ShieldCheck, ShieldAlert, FileText } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export default function ComplianceReport({ data }: { data: TripPlanResponse }) {
  const { violations, is_compliant } = data.compliance

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex flex-col gap-1">
         <h2 className="text-xl font-black tracking-tight uppercase">Regulatory <span className="text-primary">Audit</span></h2>
         <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Automated HOS Verification</p>
      </div>

      <Card className={`border-none shadow-xl rounded-2xl overflow-hidden transition-all duration-500 ${is_compliant ? 'bg-linear-to-br from-green-500 to-green-600 text-white' : 'bg-linear-to-br from-red-500 to-red-600 text-white'}`}>
        <CardHeader className="p-8 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center shadow-lg">
                  {is_compliant ? (
                    <ShieldCheck className="w-8 h-8" />
                  ) : (
                    <ShieldAlert className="w-8 h-8" />
                  )}
               </div>
               <div>
                  <CardTitle className="text-xl font-black tracking-tight mb-1">
                    {is_compliant ? 'Plan Certified' : 'Compliance Warning'}
                  </CardTitle>
                  <CardDescription className="text-white/80 text-xs font-medium">
                    {is_compliant 
                      ? 'This trip plan adheres to FMCSA Hours of Service (HOS) regulations.'
                      : 'The generated plan contains violations that must be addressed.'}
                  </CardDescription>
               </div>
            </div>
            <Badge variant="outline" className="bg-white/10 border-white/20 text-white px-4 py-1 text-[9px] font-black uppercase tracking-widest rounded-full">
              {is_compliant ? 'Authorized' : 'Action Required'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-8 pt-2">
          {!is_compliant && (
            <div className="p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 space-y-3">
              <h4 className="font-black text-sm uppercase tracking-tight flex items-center gap-2">
                 <AlertCircle className="w-4 h-4" />
                 Violations:
              </h4>
              <ul className="space-y-2">
                {violations.map((v, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm font-bold">
                    <div className="w-1.5 h-1.5 rounded-full bg-white mt-1.5 shrink-0" />
                    {v}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {is_compliant && (
            <div className="flex items-center gap-3 p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 text-sm font-bold">
              <CheckCircle2 className="w-5 h-5" />
              Verified against 11h, 14h, and 70h FMCSA rules.
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <Card className="border-none shadow-xl bg-white dark:bg-slate-900 rounded-2xl overflow-hidden p-6">
            <CardHeader className="p-0 mb-4">
               <CardTitle className="text-base font-black uppercase tracking-tight flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  FMCSA Reference
               </CardTitle>
            </CardHeader>
            <CardContent className="p-0 space-y-3">
               <RegulatoryNote 
                  title="30-Minute Break" 
                  desc="Required after 8 cumulative hours of driving."
               />
               <RegulatoryNote 
                  title="14-Hour Window" 
                  desc="Daily duty limit cannot exceed 14 consecutive hours."
               />
               <RegulatoryNote 
                  title="10-Hour Reset" 
                  desc="Must have 10 consecutive hours off duty before a new shift."
               />
            </CardContent>
         </Card>

         <Card className="border-none shadow-xl bg-white dark:bg-slate-900 rounded-2xl overflow-hidden p-6">
            <CardHeader className="p-0 mb-4">
               <CardTitle className="text-base font-black uppercase tracking-tight flex items-center gap-2">
                  <Info className="w-4 h-4 text-primary" />
                  ELD Metadata
               </CardTitle>
            </CardHeader>
            <CardContent className="p-0 space-y-3 text-[11px] font-medium text-slate-500">
               <p>• Data transmission: HTTPS Encrypted</p>
               <p>• Certification: Verified 2026</p>
               <p>• Logging precision: 1-minute</p>
               <p>• Location accuracy: 0.1 mile</p>
            </CardContent>
         </Card>
      </div>
    </div>
  )
}

function RegulatoryNote({ title, desc }: { title: string, desc: string }) {
   return (
      <div className="flex gap-4 p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
         <div className="w-1 h-12 bg-slate-100 dark:bg-slate-800 rounded-full group-hover:bg-primary transition-colors" />
         <div>
            <p className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white mb-1">{title}</p>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">{desc}</p>
         </div>
      </div>
   )
}
