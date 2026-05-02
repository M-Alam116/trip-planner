import { useEffect, useState } from 'react'
import { calculateLogs } from '@/services/api'
import type { TripPlanResponse } from '@/types'
import TripInputForm from '@/components/TripInputForm'
import RouteMap from '@/components/RouteMap'
import ELDLogsDisplay from '@/components/ELDLogsDisplay'
import TripSummary from '@/components/TripSummary'
import ComplianceReport from '@/components/ComplianceReport'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight, MapPin, ClipboardList, CheckCircle2, LayoutDashboard } from 'lucide-react'

type Step = 'input' | 'preview' | 'summary' | 'logs' | 'compliance'

export default function App() {
  const [step, setStep] = useState<Step>('input')
  const [tripData, setTripData] = useState<TripPlanResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Scroll to top on step change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [step])

  const handleTripSubmit = async (data: any) => {
    setIsLoading(true)
    try {
      const response = await calculateLogs({
        current_location: data.currentLocation,
        pickup: data.pickupLocation,
        dropoff: data.dropoffLocation,
        used_hours: data.currentCycleUsed,
      })
      setTripData(response.data)
      setStep('preview')
    } catch (error) {
      console.error(error)
      alert("Failed to calculate trip. Check backend connection.")
    } finally {
      setIsLoading(false)
    }
  }

  const steps: { key: Step; label: string; icon: any }[] = [
    { key: 'input', label: 'Trip Input', icon: MapPin },
    { key: 'preview', label: 'Route Preview', icon: MapPin },
    { key: 'summary', label: 'Trip Summary', icon: LayoutDashboard },
    { key: 'logs', label: 'Daily Logs', icon: ClipboardList },
    { key: 'compliance', label: 'Compliance', icon: CheckCircle2 },
  ]

  const currentStepIndex = steps.findIndex(s => s.key === step)

  const nextStep = () => {
    const nextIdx = currentStepIndex + 1
    if (nextIdx < steps.length) setStep(steps[nextIdx].key)
  }

  const prevStep = () => {
    const prevIdx = currentStepIndex - 1
    if (prevIdx >= 0) setStep(steps[prevIdx].key)
  }

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-500">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-linear-to-br from-primary to-blue-700 rounded-xl flex items-center justify-center shadow-2xl shadow-primary/30 transform rotate-3">
              <ClipboardList className="text-white w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-2xl font-black tracking-tight bg-linear-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                ELD
              </h1>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-2">
            {steps.map((s, idx) => (
              <button
                key={s.key}
                onClick={() => tripData && setStep(s.key)}
                disabled={!tripData && s.key !== 'input'}
                className="flex items-center group outline-none disabled:cursor-not-allowed"
              >
                <div className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-300 ${step === s.key ? 'bg-primary/5 text-primary scale-105' : 'text-slate-400 hover:text-primary hover:bg-primary/5'
                  }`}>
                  <s.icon className={`w-5 h-5 ${step === s.key ? 'text-primary' : 'text-slate-300'}`} />
                  <span className="text-[10px] font-bold uppercase tracking-wider">{s.label}</span>
                </div>
                {idx < steps.length - 1 && <div className="w-8 h-px bg-slate-100 dark:bg-slate-800 mx-1" />}
              </button>
            ))}
          </div>
          <div></div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12 pb-32">
        <div className="space-y-12">
          {step === 'input' && (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out">
              <TripInputForm onSubmit={handleTripSubmit} isLoading={isLoading} />
            </div>
          )}

          {tripData && (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out">
              {step === 'preview' && (
                <RouteMap
                  origin={tripData.route.origin}
                  pickup={tripData.route.pickup}
                  destination={tripData.route.destination}
                  totalDistance={tripData.route.total_miles}
                  geometries={tripData.route.full_geometry}
                  coordinates={tripData.route.coordinates}
                />
              )}

              {step === 'summary' && (
                <TripSummary data={tripData} />
              )}

              {step === 'logs' && (
                <ELDLogsDisplay logs={tripData.plan.days} />
              )}

              {step === 'compliance' && (
                <ComplianceReport data={tripData} />
              )}

              {/* Navigation Controls */}
              <div className="flex items-center justify-between flex-wrap gap-4 pt-12 mt-12 border-t border-slate-200 dark:border-slate-800">
                <Button variant="ghost" onClick={prevStep} size="lg" className="px-8 rounded-2xl hover:bg-slate-200/50">
                  <ArrowLeft className="mr-3 h-5 w-5" /> Previous
                </Button>
                <div className="flex gap-4">
                  {currentStepIndex < steps.length - 1 && (
                    <Button onClick={nextStep} size="lg" className="px-10 rounded-2xl shadow-2xl shadow-primary/20 font-bold bg-linear-to-r from-primary to-blue-600 hover:scale-105 transition-transform">
                      Next Step <ArrowRight className="ml-3 h-5 w-5" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
