import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Loader2,
  ShieldCheck,
  Users,
  Briefcase,
  UserPlus,
  CheckCircle2,
  MapPin,
  ChevronDown,
  ChevronUp,
  X,
  Lock,
  Globe
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Button } from "../../../../components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../../../components/ui/Dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/Select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../../../../components/ui/form";
import {
  FieldLabel,
} from "../../../../components/ui/field";
import { Input } from "../../../../components/ui/Input";
import { RadioGroup, RadioGroupItem } from "../../../../components/ui/radio-group";
import { Label } from "../../../../components/ui/Label";
import { CollaboratorType } from "../types";
import { cn } from "../../../../lib/utils";

const formSchema = z.object({
  type: z.enum(["tc", "lender", "vendor", "va"], {
    required_error: "Please select a collaborator type",
  }),
  vendorType: z.string().optional(),
  customVendorType: z.string().optional(),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email format").min(1, "Email is required"),
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  visibility: z.enum(["private", "shared", "public"]).default("private"),
});

type FormValues = z.infer<typeof formSchema>;

interface InviteCollaboratorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInviteSent: (data: FormValues) => void;
  existingEmails: string[];
}

const TYPES = [
  {
    id: "tc" as CollaboratorType,
    label: "Transaction Coordinator",
    description: "Manages document flow, coordination",
    icon: ShieldCheck,
    color: "text-[#5A5FF2]",
    bgColor: "bg-[#5A5FF2]/10",
  },
  {
    id: "lender" as CollaboratorType,
    label: "Lender",
    description: "Loan docs, funding certs",
    icon: Users,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
  },
  {
    id: "vendor" as CollaboratorType,
    label: "Vendor",
    description: "Inspections, title services",
    icon: Briefcase,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    id: "va" as CollaboratorType,
    label: "Virtual Assistant",
    description: "Administrative support",
    icon: UserPlus,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
  },
];

const VENDOR_TYPES = [
  "Title & Escrow",
  "Home Inspection",
  "Appraisal",
  "Photography/Media",
  "Staging",
  "Cleaning Services",
  "Insurance",
  "Notary",
  "Other"
];

export function InviteCollaboratorModal({
  open,
  onOpenChange,
  onInviteSent,
  existingEmails,
}: InviteCollaboratorModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAddressExpanded, setIsAddressExpanded] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const addressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isAddressExpanded && addressRef.current) {
      setTimeout(() => {
        addressRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
    }
  }, [isAddressExpanded]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: undefined,
      firstName: "",
      lastName: "",
      email: "",
      visibility: "private",
    },
  });

  const selectedType = form.watch("type");
  const vendorTypeValue = form.watch("vendorType");

  const onSubmit = async (data: FormValues) => {
    if (existingEmails.map(e => e.toLowerCase()).includes(data.email.toLowerCase())) {
      form.setError("email", { message: "Email already exists on your team." });
      toast.error("Duplicate Entry");
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      onInviteSent(data);
      toast.success("Invitation successful");
      setStep(1);
      form.reset();
      setIsAddressExpanded(false);
      onOpenChange(false);
    } catch (error) {
      toast.error("Invitation failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    if (form.getFieldState("type").invalid) return;
    setStep(2);
  };
  const handleBack = () => setStep(1);

  return (
    <Dialog open={open} onOpenChange={(val) => {
      if (!val) {
        setStep(1);
        form.reset();
        setIsAddressExpanded(false);
      }
      onOpenChange(val);
    }}>
      <DialogContent
        className="sm:max-w-[500px] bg-white text-slate-900 p-0 shadow-[0px_20px_60px_rgba(0,0,0,0.1)] rounded-[40px] z-[9999] border-none flex flex-col max-h-[90vh] overflow-hidden"
        overlayClassName="z-[9999]"
      >
        <div className="p-8 pb-0 shrink-0 relative">
          <button 
             onClick={() => onOpenChange(false)}
             className="absolute top-5 right-5 size-8 rounded-full bg-slate-50 flex items-center justify-center hover:bg-slate-100 transition-colors text-slate-400 z-10"
          >
            <X className="size-4" />
          </button>
          
          <DialogHeader className="mb-4">
            <div className="mb-3 flex">
              <div className={cn(
                "h-12 w-12 rounded-xl flex items-center justify-center transition-colors duration-500 shadow-sm",
                step === 1 ? "bg-[#5A5FF2]/10 text-[#5A5FF2]" : (TYPES.find(t => t.id === selectedType)?.bgColor || "bg-[#5A5FF2]/10")
              )}>
                {step === 1 ? (
                  <UserPlus className="h-6 w-6" />
                ) : (
                  (() => {
                    const TIcon = TYPES.find(t => t.id === selectedType)?.icon || UserPlus;
                    return <TIcon className={cn("h-6 w-6", TYPES.find(t => t.id === selectedType)?.color)} />;
                  })()
                )}
              </div>
            </div>

            <DialogTitle className="text-2xl font-black tracking-tight text-[#171717] leading-tight">
              {step === 1 ? "Add Collaborator" : `Invite ${TYPES.find(t => t.id === selectedType)?.label}`}
            </DialogTitle>

            <DialogDescription className="text-slate-500 font-medium text-sm pt-0.5">
              {step === 1 
              ? "Choose who you'd like to invite." 
              : "Enter details for the invitation."}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div 
          ref={scrollContainerRef} 
          className="flex-1 overflow-y-auto px-8 hide-scrollbar"
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pb-6 pt-2">
              {step === 1 ? (
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="grid grid-cols-1 gap-3"
                        >
                          {TYPES.map((type) => (
                            <Label
                              key={type.id}
                              className={cn(
                                "flex items-start gap-4 p-4 rounded-3xl border-2 transition-all duration-300 relative group cursor-pointer",
                                field.value === type.id
                                  ? "border-[#5A5FF2] bg-[#5A5FF2]/5 shadow-sm"
                                  : "border-slate-50 bg-white hover:border-slate-100 hover:bg-slate-50/50"
                              )}
                            >
                              <RadioGroupItem value={type.id} className="sr-only" />
                              <div className={cn("p-2.5 rounded-xl shrink-0 transition-all group-hover:scale-110", type.bgColor)}>
                                <type.icon className={cn("h-5 w-5", type.color)} />
                              </div>
                              <div className="space-y-0.5 pt-0.5">
                                <p className="font-bold text-[15px] text-slate-900">{type.label}</p>
                                <p className="text-[13px] text-slate-500 font-medium leading-relaxed">
                                  {type.description}
                                </p>
                              </div>
                            </Label>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage className="text-red-500 font-bold text-[11px] uppercase pl-1" />
                    </FormItem>
                  )}
                />
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field: formField }) => (
                        <FormItem>
                          <FieldLabel className="text-[12px] text-slate-400 font-bold uppercase ml-1">First Name</FieldLabel>
                          <Input placeholder="e.g. Jane" className="h-12 bg-[#F8FAFC] border-none rounded-2xl px-4" {...formField} />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field: formField }) => (
                        <FormItem>
                          <FieldLabel className="text-[12px] text-slate-400 font-bold uppercase ml-1">Last Name</FieldLabel>
                          <Input placeholder="e.g. Cooper" className="h-12 bg-[#F8FAFC] border-none rounded-2xl px-4" {...formField} />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field: formField }) => (
                      <FormItem>
                        <FieldLabel className="text-[12px] text-slate-400 font-bold uppercase ml-1">Business Email</FieldLabel>
                        <Input placeholder="jane@radiusagent.com" className="h-12 bg-[#F8FAFC] border-none rounded-2xl px-4" {...formField} />
                      </FormItem>
                    )}
                  />

                  {selectedType === "vendor" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      <FormField
                        control={form.control}
                        name="vendorType"
                        render={({ field }) => (
                          <FormItem>
                            <FieldLabel className="text-[12px] text-slate-400 font-bold uppercase ml-1">Vendor Type</FieldLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-12 bg-[#F8FAFC] border-none rounded-2xl px-4 font-medium transition-all">
                                  <SelectValue placeholder="Select service category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-white border-slate-100 shadow-2xl rounded-2xl p-2 z-[10000]">
                                {VENDOR_TYPES.map((type) => (
                                  <SelectItem key={type} value={type} className="p-3 rounded-xl focus:bg-[#5A5FF2]/5 focus:text-[#5A5FF2] cursor-pointer font-bold text-[14px]">
                                    {type}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <AnimatePresence>
                        {vendorTypeValue === "Other" && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <FormField
                              control={form.control}
                              name="customVendorType"
                              render={({ field }) => (
                                <FormItem className="pt-1">
                                  <FieldLabel className="text-[12px] text-slate-400 font-bold uppercase ml-1">Custom Category Name</FieldLabel>
                                  <Input placeholder="e.g. Solar Consultant" className="h-12 bg-[#F8FAFC] border-none rounded-2xl px-4" {...field} />
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )}

                  <div className="pt-2" ref={addressRef}>
                    <button
                      type="button"
                      onClick={() => setIsAddressExpanded(!isAddressExpanded)}
                      className="flex items-center gap-1.5 text-[13px] font-black text-[#5A5FF2] hover:opacity-80 transition-opacity ml-1 bg-[#5A5FF2]/5 px-3 py-1.5 rounded-full"
                    >
                      <MapPin className="h-4 w-4" />
                      {isAddressExpanded ? "Hide Address Details" : "Add Address Details (Optional)"}
                      <ChevronDown className={cn("h-4 w-4 transition-transform", isAddressExpanded && "rotate-180")} />
                    </button>
                    
                    <AnimatePresence>
                      {isAddressExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="grid grid-cols-4 gap-3 pt-4">
                            <FormField
                              control={form.control}
                              name="street"
                              render={({ field: formField }) => (
                                <FormItem className="col-span-4">
                                  <Input placeholder="Street Address" className="h-12 bg-[#F8FAFC] border-none rounded-2xl px-4" {...formField} />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="city"
                              render={({ field: formField }) => (
                                <FormItem className="col-span-2">
                                  <Input placeholder="City" className="h-12 bg-[#F8FAFC] border-none rounded-2xl px-4" {...formField} />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="state"
                              render={({ field: formField }) => (
                                <FormItem className="col-span-1">
                                  <Input placeholder="State" className="h-12 bg-[#F8FAFC] border-none rounded-2xl px-4" {...formField} />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="zip"
                              render={({ field: formField }) => (
                                <FormItem className="col-span-1">
                                  <Input placeholder="ZIP" className="h-12 bg-[#F8FAFC] border-none rounded-2xl px-4" {...formField} />
                                </FormItem>
                              )}
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <FormField
                    control={form.control}
                    name="visibility"
                    render={({ field }) => (
                      <FormItem className="pt-2">
                        <FieldLabel className="text-[12px] text-slate-400 font-bold uppercase ml-1">Visibility Permissions</FieldLabel>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="grid grid-cols-1 sm:grid-cols-3 gap-3"
                        >
                          <Label className={cn("flex flex-col items-center gap-2 p-3 text-center rounded-2xl border-2 transition-all cursor-pointer", field.value === "private" ? "border-[#5A5FF2] bg-[#5A5FF2]/5" : "border-slate-100 hover:border-slate-200")}>
                            <RadioGroupItem value="private" className="sr-only" />
                            <Lock className={cn("h-5 w-5", field.value === "private" ? "text-[#5A5FF2]" : "text-slate-400")} />
                            <span className={cn("text-[13px] font-bold", field.value === "private" ? "text-[#5A5FF2]" : "text-slate-900")}>Private</span>
                          </Label>
                          <Label className={cn("flex flex-col items-center gap-2 p-3 text-center rounded-2xl border-2 transition-all cursor-pointer", field.value === "shared" ? "border-[#5A5FF2] bg-[#5A5FF2]/5" : "border-slate-100 hover:border-slate-200")}>
                            <RadioGroupItem value="shared" className="sr-only" />
                            <Users className={cn("h-5 w-5", field.value === "shared" ? "text-[#5A5FF2]" : "text-slate-400")} />
                            <span className={cn("text-[13px] font-bold", field.value === "shared" ? "text-[#5A5FF2]" : "text-slate-900")}>Shared</span>
                          </Label>
                          <Label className={cn("flex flex-col items-center gap-2 p-3 text-center rounded-2xl border-2 transition-all cursor-pointer", field.value === "public" ? "border-[#5A5FF2] bg-[#5A5FF2]/5" : "border-slate-100 hover:border-slate-200")}>
                            <RadioGroupItem value="public" className="sr-only" />
                            <Globe className={cn("h-5 w-5", field.value === "public" ? "text-[#5A5FF2]" : "text-slate-400")} />
                            <span className={cn("text-[13px] font-bold", field.value === "public" ? "text-[#5A5FF2]" : "text-slate-900")}>Public</span>
                          </Label>
                        </RadioGroup>
                      </FormItem>
                    )}
                  />

                </div>
              )}
            </form>
          </Form>
        </div>

        <div className="p-8 pt-6 border-t border-slate-50 shrink-0 bg-white/80 backdrop-blur-sm">
          <div className="flex gap-4">
            {(step === 2 || selectedType) && (
              <Button
                type="button"
                variant="ghost"
                className="flex-1 h-14 text-slate-400 rounded-3xl font-black hover:bg-slate-50 transition-all text-[14px]"
                onClick={step === 1 ? () => onOpenChange(false) : handleBack}
                disabled={isSubmitting}
              >
                {step === 1 ? "Cancel" : "Back"}
              </Button>
            )}

            <Button
              type={step === 1 ? "button" : "submit"}
              className="flex-[2] h-14 bg-[#5A5FF2] hover:bg-[#4B50D9] text-white font-black rounded-3xl shadow-2xl shadow-[#5A5FF2]/20 transition-all text-[14px] active:scale-95"
              onClick={step === 1 ? handleNext : () => form.handleSubmit(onSubmit)()}
              disabled={isSubmitting || (step === 2 && !form.watch("email"))}
            >
              {isSubmitting ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : step === 1 ? "Continue" : "Send Invitation"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
