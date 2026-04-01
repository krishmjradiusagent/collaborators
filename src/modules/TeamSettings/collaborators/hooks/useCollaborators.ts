import { useState, useCallback, useMemo } from "react";
import { INITIAL_COLLABORATORS, MOCK_CLIENTS, MOCK_TRANSACTIONS } from "../mockData";
import { Collaborator, CollaboratorType, Status } from "../types";
import { toast } from "sonner";

export function useCollaborators() {
  const [collaborators, setCollaborators] = useState<Collaborator[]>(INITIAL_COLLABORATORS);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<CollaboratorType | "all">("all");
  const [filterStatus, setFilterStatus] = useState<Status | "all">("all");

  const filteredCollaborators = useMemo(() => {
    return collaborators
      .filter((c) => {
        const matchesSearch = 
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
          c.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = filterType === "all" || c.type === filterType;
        const matchesStatus = filterStatus === "all" || c.status === filterStatus;
        return matchesSearch && matchesType && matchesStatus;
      })
      .sort((a, b) => {
        // Status priority: Active > Invited > Paused > Removed
        const statusOrder: Record<Status, number> = {
          active: 0,
          invited: 1,
          paused: 2,
          removed: 3,
        };
        if (statusOrder[a.status] !== statusOrder[b.status]) {
          return statusOrder[a.status] - statusOrder[b.status];
        }
        return a.name.localeCompare(b.name);
      });
  }, [collaborators, searchQuery, filterType, filterStatus]);

  const inviteCollaborator = useCallback((data: { type: CollaboratorType; email: string }) => {
    const newCollaborator: Collaborator = {
      id: `collab-${Date.now()}`,
      name: data.email.split("@")[0].split(".").map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(" "),
      email: data.email,
      type: data.type,
      status: "invited",
      invitedDate: new Date().toISOString().split("T")[0],
      inviteExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      activatedDate: null,
      assignments: {
        clients: [],
        transactions: [],
      },
      paymentStatus: "pending",
    };

    setCollaborators((prev) => [newCollaborator, ...prev]);
  }, []);

  const removeCollaborator = useCallback((id: string, reassignToId?: string) => {
    setCollaborators((prev) => {
      const target = prev.find(c => c.id === id);
      if (!target) return prev;

      let newState = prev.map(c => {
        if (c.id === id) {
          return { ...c, status: "removed" as Status };
        }
        // Reassignment logic
        if (reassignToId && c.id === reassignToId) {
          return {
            ...c,
            assignments: {
              clients: Array.from(new Set([...c.assignments.clients, ...target.assignments.clients])),
              transactions: Array.from(new Set([...c.assignments.transactions, ...target.assignments.transactions])),
            }
          };
        }
        return c;
      });

      // If it was just an invite, we can actually delete it
      if (target.status === "invited") {
        newState = newState.filter(c => c.id !== id);
      }

      return newState;
    });

    toast.success(`Collaborator ${reassignToId ? "reassigned and " : ""}removed`);
  }, []);

  const resendInvite = useCallback((id: string) => {
    setCollaborators((prev) => prev.map(c => 
      c.id === id 
        ? { ...c, inviteExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0] } 
        : c
    ));
    toast.success("Invitation link reset for another 7 days");
  }, []);

  const togglePause = useCallback((id: string) => {
    setCollaborators((prev) => prev.map(c => {
      if (c.id === id) {
        const newStatus: Status = c.status === "active" ? "paused" : "active";
        return { ...c, status: newStatus };
      }
      return c;
    }));
  }, []);

  const existingEmails = useMemo(() => collaborators.map(c => c.email.toLowerCase()), [collaborators]);

  return {
    collaborators: filteredCollaborators,
    totalCount: collaborators.length,
    searchQuery,
    setSearchQuery,
    filterType,
    setFilterType,
    filterStatus,
    setFilterStatus,
    inviteCollaborator,
    removeCollaborator,
    resendInvite,
    togglePause,
    existingEmails,
    allClients: MOCK_CLIENTS,
    allTransactions: MOCK_TRANSACTIONS,
  };
}
