import { Search, Info, Trash2 } from "lucide-react"
import { AgentGoalsTable } from "../GoalSetting/AgentGoalsTable"
import { CollaboratorsSection } from "./CollaboratorsSection"

export function TeamSettingsContent() {
  const teamMembers = [
    { name: "Laura Nguyen", email: "laura@realestate.com", role: "Agent" },
    { name: "John Smith", email: "john@realestate.com", role: "Transaction Coordinator" },
    { name: "Michael Johnson", email: "michael@realestate.com", role: "Assistant" },
    { name: "Sarah Miller", email: "sarah@realestate.com", role: "Operations" },
    { name: "David Brown", email: "david@realestate.com", role: "Admin" }
  ]

  return (
    <div className="w-full space-y-[48px] py-8">
      {/* Alert Header - Full Width */}
      <div className="bg-[#f9fafb] border border-[#e5e7eb] px-[24px] py-[16px] rounded-[8px] flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
           <Info className="h-5 w-5 text-gray-500" />
           <span className="text-[14px] font-medium text-[#1f2937]">Share your team profile</span>
        </div>
      </div>

      {/* Standard Team Member Section - Traditional UI */}
      <div className="bg-white border border-[#e3e3e3] p-[24px] rounded-[16px] space-y-[24px] w-full shadow-sm">
        <div className="flex items-center justify-between">
           <div className="space-y-1">
              <h3 className="text-[20px] font-bold text-[#111827]">Team Members</h3>
              <p className="text-sm text-slate-500 font-medium">Manage your core team agents and administrative staff.</p>
           </div>
           <button className="h-10 px-6 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-all text-sm">Invite a member</button>
        </div>

        {/* Search Bar */}
        <div className="relative w-full">
          <Search className="absolute left-[12px] top-[14px] h-[18px] w-[18px] text-gray-400" />
          <input 
            type="text" 
            placeholder="Search team members" 
            className="w-full h-[45px] pl-[40px] pr-[12px] border border-[#d0d5dd] rounded-[12px] text-[16px] placeholder-[#898989] focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>

        {/* Members Table */}
        <div className="border border-[#f1f1fe] rounded-[16px] overflow-x-auto w-full">
           <table className="w-full text-left border-collapse min-w-[800px]">
              <thead className="bg-[#f1f1fe]">
                 <tr>
                    <th className="px-[24px] py-[16px] text-[12px] font-black text-slate-500 uppercase tracking-widest leading-none">Name</th>
                    <th className="px-[24px] py-[16px] text-[12px] font-black text-slate-500 uppercase tracking-widest leading-none">Email</th>
                    <th className="px-[24px] py-[16px] text-[12px] font-black text-slate-500 uppercase tracking-widest leading-none">Role</th>
                    <th className="px-[24px] py-[16px] text-[12px] font-black text-slate-500 uppercase tracking-widest leading-none text-center">Actions</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-[#e5e8eb]">
                 {teamMembers.map((member, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                       <td className="px-[24px] py-[20px] text-[15px] text-[#0d141c] font-bold">{member.name}</td>
                       <td className="px-[24px] py-[20px] text-[15px] text-[#4f7396] font-medium">{member.email}</td>
                       <td className="px-[24px] py-[20px] text-[15px] text-[#0d141c] font-medium">{member.role}</td>
                       <td className="px-[24px] py-[20px] text-center">
                          <button className="text-[14px] font-bold text-red-500 hover:text-red-600 transition-colors">Remove</button>
                       </td>
                    </tr>
                 ))}
              </tbody>
           </table>
        </div>
      </div>

      {/* Goals Section - Full Width */}
      <div className="w-full">
        <AgentGoalsTable role="teamLeadView" />
      </div>

      <hr className="border-slate-200" />

      {/* NEW: Collaborators Section - Transitioned to Light Mode */}
      <div className="bg-[#f9fafb] border-t border-b border-slate-200 -mx-8 px-8 py-16 shadow-inner">
        <CollaboratorsSection />
      </div>

      {/* Team Information Section - Full Width */}
      <div className="bg-white border border-[#e3e3e3] p-[24px] rounded-[16px] space-y-12 w-full shadow-sm">
        <div className="bg-[#f9fafb] border border-[#e5e7eb] p-[32px] rounded-[16px] space-y-10">
           <div className="flex items-center justify-between">
              <h3 className="text-[20px] font-bold text-[#111827]">Team Information</h3>
              <button className="text-[15px] font-bold text-primary hover:underline transition-all">Edit information</button>
           </div>
           
           <div className="space-y-6">
              <div className="space-y-2">
                 <label className="text-[14px] font-bold text-[#111827] uppercase tracking-wide">Team name</label>
                 <input 
                    disabled 
                    value="Rising Champions" 
                    className="w-full h-[48px] px-[16px] bg-white border border-[#e5e7eb] rounded-[12px] text-[15px] text-gray-500 shadow-sm"
                 />
              </div>

              <div className="space-y-2">
                 <label className="text-[14px] font-bold text-[#111827] uppercase tracking-wide">About your team</label>
                 <textarea 
                    disabled 
                    rows={4}
                    className="w-full p-[16px] bg-white border border-[#e5e7eb] rounded-[12px] text-[15px] text-gray-500 shadow-sm resize-none"
                    defaultValue="Teamwork makes the dream work. A team is defined as a group of people who perform interdependent tasks to work toward accomplishing a common mission or specific objective."
                 />
              </div>

              <div className="space-y-2">
                 <label className="text-[14px] font-bold text-[#111827] uppercase tracking-wide">Benefits</label>
                 <textarea 
                    disabled 
                    rows={4}
                    className="w-full p-[16px] bg-white border border-[#e5e7eb] rounded-[12px] text-[15px] text-gray-500 shadow-sm resize-none"
                    defaultValue="The organization is essential for the smooth running of a business. Without it, the workplace can become chaotic and goals are unlikely to be achieved."
                 />
              </div>
           </div>
        </div>

        {/* Image Grid Section - Full Width */}
        <div className="space-y-8 w-full px-8">
           <div className="flex items-center justify-between">
              <h3 className="text-[20px] font-bold text-[#111827]">Team Gallery</h3>
           </div>

           <div className="w-full h-[400px] border border-[#e5e7eb] rounded-[24px] overflow-hidden bg-gray-50 relative group">
              <img 
                 src="https://images.unsplash.com/photo-1517502474097-f9b30659dadb?q=80&w=1000&auto=format&fit=crop" 
                 className="w-full h-full object-cover"
                 alt="Main Banner"
              />
              <div className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur rounded-full border border-white shadow-lg cursor-pointer hover:bg-white transition-all">
                 <Trash2 className="h-5 w-5 text-red-500" />
              </div>
           </div>

           <div className="grid grid-cols-3 gap-6 w-full">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-[300px] border border-[#f1f1fe] rounded-[24px] overflow-hidden bg-gray-50 group relative">
                   <img 
                      src={`https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600&auto=format&fit=crop`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      alt={`Team ${i}`}
                   />
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  )
}
