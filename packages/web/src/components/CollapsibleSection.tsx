import * as React from "react"
import { ChevronDown, ChevronRight } from "lucide-react"
import { cn } from "../lib/utils"

interface CollapsibleSectionProps {
  title: string
  actionLabel?: string
  onActionClick?: () => void
  children: React.ReactNode
  defaultOpen?: boolean
  className?: string
}

export function CollapsibleSection({
  title,
  actionLabel,
  onActionClick,
  children,
  defaultOpen = true,
  className,
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen)

  return (
    <div className={cn("bg-[#f9fafb] border border-[#e5e7eb] rounded-[8px] p-[16px] w-full", className)}>
      <div className="flex items-center justify-between">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-3 text-[18px] font-medium text-[#111827] hover:opacity-80 transition-opacity"
        >
          {isOpen ? <ChevronDown className="h-5 w-5 text-gray-400 shrink-0" /> : <ChevronRight className="h-5 w-5 text-gray-400 shrink-0" />}
          {title}
        </button>
        {actionLabel && (
          <button
            onClick={onActionClick}
            className="text-[15px] font-semibold text-primary underline decoration-solid decoration-skip-ink-none"
          >
            {actionLabel}
          </button>
        )}
      </div>
      {isOpen && (
        <div className="pt-[16px] animate-in fade-in slide-in-from-top-2 duration-300 w-full">
          {children}
        </div>
      )}
    </div>
  )
}
