import { Search, Info, Trash2 } from "lucide-react"
import { GoalSettingSection } from "../GoalSetting/GoalSettingSection"

export function TeamSettingsContent() {
  const teamMembers = [
    { name: "Laura Nguyen", email: "laura@realestate.com", role: "Agent" },
    { name: "John Smith", email: "john@realestate.com", role: "Transaction Coordinator" },
    { name: "Michael Johnson", email: "michael@realestate.com", role: "Assistant" },
    { name: "Sarah Miller", email: "sarah@realestate.com", role: "Operations" },
    { name: "David Brown", email: "david@realestate.com", role: "Admin" }
  ]

  return (
    <div className="w-full space-y-[24px]">
      {/* Alert Header - Full Width */}
      <div className="bg-[#f9fafb] border border-[#e5e7eb] px-[24px] py-[16px] rounded-[8px] flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
           <Info className="h-5 w-5 text-gray-500" />
           <span className="text-[14px] font-medium text-[#1f2937]">Share your team profile</span>
        </div>
      </div>

      {/* Team Member Section - Full Width Card */}
      <div className="bg-white border border-[#e3e3e3] p-[16px] rounded-[9px] space-y-[16px] w-full">
        <div className="flex items-center justify-between">
           <h3 className="text-[18px] font-medium text-[#111827]">Team member</h3>
           <button className="text-[15px] font-semibold text-primary underline decoration-solid decoration-skip-ink-none">Invite a member</button>
        </div>

        {/* Search Bar */}
        <div className="relative w-full">
          <Search className="absolute left-[12px] top-[14px] h-[18px] w-[18px] text-gray-400" />
          <input 
            type="text" 
            placeholder="Search team members" 
            className="w-full h-[45px] pl-[40px] pr-[12px] border border-[#d0d5dd] rounded-[8px] text-[16px] placeholder-[#898989]"
          />
        </div>

        {/* Members Table - Responsive Full Width */}
        <div className="border border-[#f1f1fe] rounded-[12px] overflow-x-auto w-full">
           <table className="w-full text-left border-collapse min-w-[800px]">
              <thead className="bg-[#f1f1fe]">
                 <tr>
                    <th className="px-[16px] py-[12px] text-[14px] font-semibold text-[#0d141c]">Name</th>
                    <th className="px-[16px] py-[12px] text-[14px] font-semibold text-[#0d141c]">Email</th>
                    <th className="px-[16px] py-[12px] text-[14px] font-semibold text-[#0d141c]">Role</th>
                    <th className="px-[16px] py-[12px] text-[14px] font-semibold text-[#0d141c] text-center">Actions</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-[#e5e8eb]">
                 {teamMembers.map((member, i) => (
                    <tr key={i} className="hover:bg-gray-50/50">
                       <td className="px-[16px] py-[24px] text-[14px] text-[#0d141c] font-medium">{member.name}</td>
                       <td className="px-[16px] py-[24px] text-[14px] text-[#4f7396]">{member.email}</td>
                       <td className="px-[16px] py-[24px] text-[14px] text-[#0d141c]">{member.role}</td>
                       <td className="px-[16px] py-[24px] text-center">
                          <button className="text-[14px] font-semibold text-primary px-3">Remove</button>
                       </td>
                    </tr>
                 ))}
              </tbody>
           </table>
        </div>
      </div>

      {/* Team Information Section - Full Width */}
      <div className="bg-white border border-[#e3e3e3] p-[16px] rounded-[9px] space-y-8 w-full">
        <div className="bg-[#f9fafb] border border-[#e5e7eb] p-[16px] rounded-[8px] space-y-6">
           <div className="flex items-center justify-between">
              <h3 className="text-[18px] font-medium text-[#111827]">Team Information</h3>
              <button className="text-[15px] font-semibold text-primary underline">Edit information</button>
           </div>
           
           <div className="space-y-4">
              <div className="space-y-2">
                 <label className="text-[14px] font-medium text-[#111827]">Team name</label>
                 <input 
                    disabled 
                    value="Rising Champions" 
                    className="w-full h-[40px] px-[12px] bg-white border border-[#e5e7eb] rounded-[8px] text-[14px] text-gray-500 shadow-sm"
                 />
              </div>

              <div className="space-y-2">
                 <label className="text-[14px] font-medium text-[#111827]">About your team</label>
                 <textarea 
                    disabled 
                    rows={4}
                    className="w-full p-[12px] bg-white border border-[#e5e7eb] rounded-[8px] text-[14px] text-gray-500 shadow-sm resize-none"
                    defaultValue="Teamwork makes the dream work. A team is defined as a group of people who perform interdependent tasks to work toward accomplishing a common mission or specific objective."
                 />
              </div>

              <div className="space-y-2">
                 <label className="text-[14px] font-medium text-[#111827]">Benefits</label>
                 <textarea 
                    disabled 
                    rows={4}
                    className="w-full p-[12px] bg-white border border-[#e5e7eb] rounded-[8px] text-[14px] text-gray-500 shadow-sm resize-none"
                    defaultValue="The organization is essential for the smooth running of a business. Without it, the workplace can become chaotic and goals are unlikely to be achieved."
                 />
              </div>
           </div>
        </div>

        {/* Image Grid Section - Full Width */}
        <div className="space-y-6 w-full">
           <div className="flex items-center justify-between">
              <h3 className="text-[18px] font-medium text-[#111827]">Add information about your team</h3>
           </div>

           <div className="w-full h-[291px] border border-[#e5e7eb] rounded-[12px] overflow-hidden bg-gray-50 relative group">
              <img 
                 src="https://images.unsplash.com/photo-1517502474097-f9b30659dadb?q=80&w=1000&auto=format&fit=crop" 
                 className="w-full h-full object-cover"
                 alt="Main Banner"
              />
              <div className="absolute top-2 right-2 p-1 bg-[#F1F1FE] rounded-full border border-white">
                 <Trash2 className="h-4 w-4 text-primary" />
              </div>
           </div>

           <div className="grid grid-cols-3 gap-4 w-full">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-[291px] border border-[#f1f1fe] rounded-[12px] overflow-hidden bg-gray-50">
                   <img 
                      src={`https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600&auto=format&fit=crop`}
                      className="w-full h-full object-cover"
                      alt={`Team ${i}`}
                   />
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* Goals Section - Full Width */}
      <div className="w-full">
        <GoalSettingSection />
      </div>
    </div>
  )
}
