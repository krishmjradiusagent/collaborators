import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  TrendingUp,
  Phone,
  MessageCircle,
  Calendar,
  Loader2,
  Target,
} from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../components/ui/Dialog"
import { Button } from "../../components/ui/Button"
import { Input } from "../../components/ui/Input"
import { Label } from "../../components/ui/Label"
import { useGoals, METRICS, goalService } from "@mel-goals/shared"
import { toast } from "sonner"
import type { MetricKey } from "@mel-goals/shared"

const schema = z.object({
  newLeads: z.preprocess((val) => (val === "" ? undefined : Number(val)), z.number({ required_error: "Must be a number" }).int().min(1, "Must be at least 1")),
  callsConversations: z.preprocess((val) => (val === "" ? undefined : Number(val)), z.number({ required_error: "Must be a number" }).int().min(1, "Must be at least 1")),
  uniqueConversations: z.preprocess((val) => (val === "" ? undefined : Number(val)), z.number({ required_error: "Must be a number" }).int().min(1, "Must be at least 1")),
  appointments: z.preprocess((val) => (val === "" ? undefined : Number(val)), z.number({ required_error: "Must be a number" }).int().min(1, "Must be at least 1")),
})

type GoalsFormData = z.infer<typeof schema>

interface GoalSettingModalProps {
  agentId: string
  agentName: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function GoalSettingModal({
  agentId,
  agentName,
  open,
  onOpenChange,
}: GoalSettingModalProps) {
  const { goals, loading, saving, setGoals, setSelectedAgent, agents } = useGoals({
    service: goalService,
    teamLeadId: "lead_001",
  })

  const form = useForm<GoalsFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      newLeads: (goals?.metrics.newLeads === 0 ? undefined : goals?.metrics.newLeads) as any,
      callsConversations: (goals?.metrics.callsConversations === 0 ? undefined : goals?.metrics.callsConversations) as any,
      uniqueConversations: (goals?.metrics.uniqueConversations === 0 ? undefined : goals?.metrics.uniqueConversations) as any,
      appointments: (goals?.metrics.appointments === 0 ? undefined : goals?.metrics.appointments) as any,
    },
  })

  useEffect(() => {
    if (open && agentId) {
      const agent = agents.find((a) => a.id === agentId)
      if (agent) {
        setSelectedAgent(agent)
      }
    }
  }, [open, agentId, agents, setSelectedAgent])

  const onSubmit = async (data: GoalsFormData) => {
    try {
      await setGoals(data)
      toast.success(`Goals saved for ${agentName}`)
      onOpenChange(false)
    } catch (error) {
      toast.error(`Failed to save goals for ${agentName}`)
      console.error("Failed to save goals", error)
    }
  }

  const renderMetricIcon = (key: MetricKey) => {
    switch (key) {
      case "newLeads":
        return <TrendingUp className="h-4 w-4 text-primary" />
      case "callsConversations":
        return <Phone className="h-4 w-4 text-primary" />
      case "uniqueConversations":
        return <MessageCircle className="h-4 w-4 text-primary" />
      case "appointments":
        return <Calendar className="h-4 w-4 text-primary" />
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] rounded-3xl p-8 border-none bg-white shadow-2xl font-sans">
        {/* Direct children of DialogContent for accessibility */}
        <DialogHeader className="mb-6 space-y-2">
          <div className="w-12 h-12 bg-[#EEF2FF] rounded-2xl flex items-center justify-center text-primary mb-2">
            <Target className="h-6 w-6" />
          </div>
          {/* Note: In shadcn, DialogTitle and DialogDescription should be rendered here.
              If Radix is warning, we may need to ensure DialogHeader doesn't swallow them. 
              But here we keep them as they are and see if removing the wrapper helps or just ensuring they are present.
           */}
          <DialogTitle className="text-[24px] font-bold text-[#111827] tracking-tight">Monthly Goals for {agentName}</DialogTitle>
          <DialogDescription className="text-[14px] font-medium text-gray-500">
            Targets help your agents stay focused. You can adjust these anytime.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6">
            {METRICS.map((metric) => (
              <div key={metric.key} className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor={metric.key}
                    className="flex items-center gap-2 text-[12px] font-bold text-gray-400 uppercase tracking-widest"
                  >
                    {renderMetricIcon(metric.key as MetricKey)}
                    {metric.label}
                  </Label>
                  <span className="text-[10px] font-bold text-primary/40 uppercase tracking-tighter">
                    {metric.suffix}
                  </span>
                </div>
                <Input
                   id={metric.key}
                   type="number"
                   placeholder={metric.placeholder}
                   {...form.register(metric.key as any, { valueAsNumber: true })}
                   disabled={saving || loading}
                />
                {form.formState.errors[metric.key as keyof GoalsFormData] && (
                  <p className="text-[10px] font-bold text-destructive uppercase tracking-widest pl-1">
                    {form.formState.errors[metric.key as keyof GoalsFormData]?.message}
                  </p>
                )}
              </div>
            ))}
          </div>

          <DialogFooter className="pt-8 flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={saving}
              className="flex-1 h-12 rounded-full font-bold text-gray-400 hover:text-gray-900 border-gray-100"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 h-12 rounded-full bg-primary text-white font-bold shadow-lg shadow-primary/30 hover:bg-primary/90"
              disabled={saving || loading}
            >
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Goals
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
