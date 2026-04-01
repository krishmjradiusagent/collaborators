import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  TrendingUp,
  Phone,
  MessageCircle,
  Calendar,
  Loader2,
  Users,
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
  newLeads: z.preprocess((val) => (val === "" ? 0 : Number(val)), z.number().int().min(0).max(9999)),
  callsConversations: z.preprocess((val) => (val === "" ? 0 : Number(val)), z.number().int().min(0).max(9999)),
  uniqueConversations: z.preprocess((val) => (val === "" ? 0 : Number(val)), z.number().int().min(0).max(9999)),
  appointments: z.preprocess((val) => (val === "" ? 0 : Number(val)), z.number().int().min(0).max(9999)),
})

type GoalsFormData = z.infer<typeof schema>

interface BulkGoalSettingModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function BulkGoalSettingModal({
  open,
  onOpenChange,
}: BulkGoalSettingModalProps) {
  const { agents, saving, setBulkGoals } = useGoals({
    service: goalService,
    teamLeadId: "lead_001",
  })

  const form = useForm<GoalsFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      newLeads: "" as any,
      callsConversations: "" as any,
      uniqueConversations: "" as any,
      appointments: "" as any,
    },
  })

  const onSubmit = async (data: GoalsFormData) => {
    try {
      await setBulkGoals(data)
      toast.success(`Goals updated for all ${agents.length} agents`)
      onOpenChange(false)
      form.reset()
    } catch (error) {
      toast.error("Failed to update bulk goals")
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
        <DialogHeader className="mb-6 space-y-2">
          <div className="w-12 h-12 bg-[#EEF2FF] rounded-2xl flex items-center justify-center text-primary mb-2">
            <Users className="h-6 w-6" />
          </div>
          <DialogTitle className="text-[24px] font-bold text-[#111827] tracking-tight">Set Goals for All Agents</DialogTitle>
          <DialogDescription className="text-[14px] font-medium text-gray-500">
            Applying these targets will overwrite existing goals for all {agents.length} team members.
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
                   className="h-[45px] bg-white border-[#d0d5dd] rounded-[8px] text-[16px] font-medium text-[#111827] placeholder:text-gray-400 focus-visible:ring-primary/10 focus-visible:border-primary/50 transition-all shadow-sm"
                   {...form.register(metric.key as any, { valueAsNumber: true })}
                   disabled={saving}
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
              disabled={saving}
            >
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Apply to All
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
