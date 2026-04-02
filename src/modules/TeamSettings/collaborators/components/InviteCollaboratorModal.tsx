import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  Loader2, 
  ShieldCheck, 
  Users, 
  Briefcase, 
  UserPlus, 
  CheckCircle2
} from "lucide-react";
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../../../../components/ui/form";
import {
  Field,
  FieldLabel,
  FieldDescription
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
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email format").min(1, "Email is required"),
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
    description: "Manages document flow, transaction coordination",
    icon: ShieldCheck,
    color: "text-[#5A5FF2]",
    bgColor: "bg-[#5A5FF2]/10",
  },
  {
    id: "lender" as CollaboratorType,
    label: "Lender",
    description: "Provides loan documents, funding certifications",
    icon: Users,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
  },
  {
    id: "vendor" as CollaboratorType,
    label: "Vendor",
    description: "Inspections, appraisals, title services",
    icon: Briefcase,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    id: "va" as CollaboratorType,
    label: "Virtual Assistant",
    description: "Administrative support, scheduling",
    icon: UserPlus,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
  },
];

export function InviteCollaboratorModal({
  open,
  onOpenChange,
  onInviteSent,
  existingEmails,
}: InviteCollaboratorModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: undefined,
      firstName: "",
      lastName: "",
      email: "",
    },
  });

  const selectedType = form.watch("type");

  const onSubmit = async (data: FormValues) => {
    // A. Backend Constraint Check: Skip if email exists in global team pool
    if (existingEmails.map(e => e.toLowerCase()).includes(data.email.toLowerCase())) {
      form.setError("email", { 
        message: "This email is already associated with a collaborator on your team." 
      });
      toast.error("Duplicate Entry", {
        description: `${data.email} is already in your collaborator list.`
      });
      return;
    }

    setIsSubmitting(true);
    
    // B. Execution Logic: "Send Secure Invitation"
    // In a real implementation, this would call a secure cloud function or API endpoint
    // to create the record and trigger the SendGrid/Postmark notification.
    try {
      // Simulate Backend Record Creation Sequence:
      // 1. Map: First Name, Last Name, Business Email
      // 2. Implicit: Set status to "Invited", Expiration to 7 days
      // 3. Metadata: Capture team_id and current_user_id
      await new Promise((resolve) => setTimeout(resolve, 1200));
      
      // Success Transition
      onInviteSent(data);
      
      // UI Feedback: Shadcn Sonner Notification
      toast.success("Invitation successful", {
        description: `Link sent to ${data.email}. Access expires in 7 days.`,
        icon: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
        className: "bg-white border-emerald-100",
      });
      
      // 3. UI State Transition
      setStep(1);
      form.reset();
      onOpenChange(false);
    } catch (error) {
      toast.error("Invitation failed", {
        description: "There was an error processing the request. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    if (selectedType) {
      setStep(2);
    }
  };

  const handleBack = () => {
    setStep(1);
  };

  return (
    <Dialog open={open} onOpenChange={(val) => {
      if (!val) {
        setStep(1);
        form.reset();
      }
      onOpenChange(val);
    }}>
      <DialogContent 
        className="sm:max-w-[550px] bg-white border-none text-slate-900 p-0 overflow-hidden shadow-2xl rounded-[40px] z-[9999]" 
        overlayClassName="z-[9999]"
      >
        <div className="p-12">
          <DialogHeader className="mb-10 text-left">
            <div className="mb-6 flex">
               <div className={cn(
                 "h-16 w-16 rounded-2xl flex items-center justify-center transition-colors duration-500",
                 step === 1 ? "bg-blue-50 text-blue-600" : (TYPES.find(t => t.id === selectedType)?.bgColor || "bg-blue-50 text-blue-600")
               )}>
                 {step === 1 ? (
                   <UserPlus className="h-8 w-8" />
                 ) : (
                   (() => {
                     const TIcon = TYPES.find(t => t.id === selectedType)?.icon || UserPlus;
                     return <TIcon className={cn("h-8 w-8", TYPES.find(t => t.id === selectedType)?.color)} />;
                   })()
                 )}
               </div>
            </div>
            
            <DialogTitle className="text-3xl font-bold tracking-tight text-slate-900 leading-tight">
              {step === 1 ? "Add Collaborator to Network" : `Invite ${TYPES.find(t => t.id === selectedType)?.label}`}
            </DialogTitle>
            
            <DialogDescription className="text-slate-500 font-medium text-[16px] mt-3">
              {step === 1 
                ? "Which role are you adding to your team network? You cannot change this later." 
                : "Enter their professional details to send the secure access link."
              }
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
              {step === 1 ? (
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem className="space-y-4">
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
                                "flex items-start gap-4 p-4 rounded-2xl border transition-all duration-300 relative group",
                                field.value === type.id 
                                  ? "border-blue-500 bg-white shadow-lg ring-1 ring-blue-500/20" 
                                  : "border-slate-100 bg-slate-50/30 hover:border-slate-200 hover:bg-slate-50"
                              )}
                            >
                              <RadioGroupItem value={type.id} className="sr-only" />
                              <div className={cn("p-3 rounded-xl shrink-0 transition-transform duration-300 group-hover:rotate-6", type.bgColor)}>
                                <type.icon className={cn("h-5 w-5", type.color)} />
                              </div>
                              <div className="space-y-1">
                                <p className="font-bold text-[16px] text-slate-900">{type.label}</p>
                                <p className="text-[13px] text-slate-500 font-medium leading-relaxed">
                                  {type.description}
                                </p>
                              </div>
                              {field.value === type.id && (
                                <div className="absolute right-6 top-1/2 -translate-y-1/2">
                                  <CheckCircle2 className="h-6 w-6 text-blue-600" />
                                </div>
                              )}
                            </Label>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage className="text-red-500 font-bold text-xs uppercase tracking-wider" />
                    </FormItem>
                  )}
                />
              ) : (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field: formField }) => (
                        <FormItem>
                          <Field>
                            <FieldLabel htmlFor="firstName">First Name</FieldLabel>
                            <FormControl>
                              <Input 
                                id="firstName"
                                placeholder="e.g. Jane" 
                                className="bg-white border border-slate-200 h-11 text-[14px] focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all rounded-xl shadow-sm placeholder:text-slate-300 px-4"
                                {...formField} 
                                autoFocus
                              />
                            </FormControl>
                            <FormMessage className="text-red-500 font-bold text-[10px] uppercase tracking-widest pl-1" />
                          </Field>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field: formField }) => (
                        <FormItem>
                          <Field>
                            <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
                            <FormControl>
                              <Input 
                                id="lastName"
                                placeholder="e.g. Cooper" 
                                className="bg-white border border-slate-200 h-11 text-[14px] focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all rounded-xl shadow-sm placeholder:text-slate-300 px-4"
                                {...formField} 
                              />
                            </FormControl>
                            <FormMessage className="text-red-500 font-bold text-[10px] uppercase tracking-widest pl-1" />
                          </Field>
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field: formField }) => (
                      <FormItem>
                        <Field>
                          <FieldLabel htmlFor="email">Business Email</FieldLabel>
                          <FormControl>
                            <Input 
                              id="email"
                              placeholder="jane@radiusagent.com" 
                              className="bg-white border border-slate-200 h-11 text-[14px] focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all rounded-xl shadow-sm placeholder:text-slate-300 px-4"
                              {...formField} 
                            />
                          </FormControl>
                          <FormMessage className="text-red-500 font-bold text-[10px] uppercase tracking-widest pl-1" />
                        </Field>
                      </FormItem>
                    )}
                  />

                  <div className="bg-blue-50/20 border border-blue-100/50 p-5 rounded-2xl flex items-start gap-4 mt-2">
                    <div className="p-2.5 rounded-lg bg-white border border-blue-100 shadow-sm text-primary">
                      <ShieldCheck className="h-4 w-4" />
                    </div>
                    <Field className="gap-0.5">
                      <FieldLabel className="text-[13px] text-slate-700 font-bold leading-none mb-1">Secure Access</FieldLabel>
                      <FieldDescription className="text-[12px] text-slate-500 leading-relaxed font-medium">
                        Invitations expire in <span className="text-[#5A5FF2] font-bold">7 days</span>. Reminders will be automated.
                      </FieldDescription>
                    </Field>
                  </div>
                </div>
              )}

              <div className="flex gap-4 pt-6">
                {(step === 2 || selectedType) && (
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 h-14 bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900 rounded-[30px] font-bold transition-all"
                    onClick={step === 1 ? () => onOpenChange(false) : handleBack}
                    disabled={isSubmitting}
                  >
                    {step === 1 ? "Cancel" : "Back"}
                  </Button>
                )}
                
                {step === 1 ? (
                  <Button
                    type="button"
                    className="flex-1 h-14 bg-[#5A5FF2] hover:bg-[#5A5FF2]/90 text-white font-bold rounded-[30px] shadow-xl shadow-[#5A5FF2]/20 transition-all active:scale-95"
                    onClick={handleNext}
                    disabled={!selectedType}
                  >
                    Continue
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="flex-1 h-14 bg-[#5A5FF2] hover:bg-[#5A5FF2]/90 text-white font-bold rounded-[30px] shadow-xl shadow-[#5A5FF2]/20 transition-all active:scale-95"
                    disabled={isSubmitting || !form.watch("email")}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Processing...
                      </>
                    ) : "Send Secure Invitation"}
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
