import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MapPin, Clock, Loader2, Navigation, Target } from 'lucide-react'

interface TripInput {
  currentLocation: string
  pickupLocation: string
  dropoffLocation: string
  currentCycleUsed: number
}

interface TripInputFormProps {
  onSubmit: (data: TripInput) => void
  isLoading: boolean
}

export default function TripInputForm({ onSubmit, isLoading }: TripInputFormProps) {
  const [formData, setFormData] = useState<TripInput>({
    currentLocation: 'Chicago, IL',
    pickupLocation: 'Detroit, MI',
    dropoffLocation: 'New York, NY',
    currentCycleUsed: 0,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'currentCycleUsed' ? parseFloat(value) || 0 : value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.pickupLocation || !formData.dropoffLocation) return
    onSubmit(formData)
  }

  return (
    <Card className="max-w-4xl mx-auto border-none shadow-2xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl ring-1 ring-slate-200 dark:ring-slate-800 rounded-3xl overflow-hidden">
      <CardHeader className="space-y-1 p-8 pb-4 relative z-10">
        <CardTitle className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
          Start Your <span className="text-primary">Journey</span>
        </CardTitle>
        <CardDescription className="text-sm font-medium">
          Configure your route and verify compliance in real-time using our smart routing engine.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-8 pt-0 relative z-10">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-300" />
                Current Base Location
              </label>
              <Input
                name="currentLocation"
                value={formData.currentLocation}
                onChange={handleChange}
                placeholder="Where are you now?"
                className="h-12 px-5 rounded-xl bg-slate-100/50 dark:bg-slate-800/50 border-none text-sm font-bold focus-visible:ring-2 ring-primary transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-slate-300" />
                Cycle Balance (Used) Hours
              </label>
              <div className="relative">
                <Input
                  type="number"
                  name="currentCycleUsed"
                  value={formData.currentCycleUsed}
                  onChange={handleChange}
                  min="0"
                  max="70"
                  step="0.5"
                  className="h-12 px-5 rounded-xl bg-slate-100/50 dark:bg-slate-800/50 border-none text-sm font-bold"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                <Target className="w-3.5 h-3.5" />
                Pickup Destination
              </label>
              <Input
                name="pickupLocation"
                value={formData.pickupLocation}
                onChange={handleChange}
                placeholder="Pickup address"
                required
                className="h-12 px-5 rounded-xl border border-primary/20 bg-white dark:bg-slate-900 text-sm font-bold focus:border-primary transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-green-600 flex items-center gap-2">
                <Target className="w-3.5 h-3.5" />
                Final Dropoff
              </label>
              <Input
                name="dropoffLocation"
                value={formData.dropoffLocation}
                onChange={handleChange}
                placeholder="Destination address"
                required
                className="h-12 px-5 rounded-xl border border-green-600/20 bg-white dark:bg-slate-900 text-sm font-bold focus:border-green-600 transition-all"
              />
            </div>
          </div>

          <div className="pt-4">
            <Button type="submit" disabled={isLoading} className="w-full h-14 text-sm font-bold uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/20 bg-linear-to-r from-primary to-blue-700 hover:scale-[1.01] active:scale-[0.99] transition-all">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Analyzing Route Data...
                </>
              ) : (
                <>
                  <Navigation className="mr-2 w-5 h-5" />
                  Generate Smart Plan
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
