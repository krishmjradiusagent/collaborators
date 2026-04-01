export const METRICS = [
    {
        key: 'newLeads',
        label: 'New Leads',
        icon: 'TrendingUp',
        suffix: 'leads',
        placeholder: 'e.g. 25',
        helpText: 'Total new leads contacted this month',
    },
    {
        key: 'callsConversations',
        label: 'Calls & Conversations',
        icon: 'Phone',
        suffix: 'calls',
        placeholder: 'e.g. 80',
        helpText: 'Total phone calls and direct conversations',
    },
    {
        key: 'uniqueConversations',
        label: 'Unique Conversations',
        icon: 'MessageCircle',
        suffix: 'convos',
        placeholder: 'e.g. 40',
        helpText: 'Conversations with unique contacts',
    },
    {
        key: 'appointments',
        label: 'Appointments',
        icon: 'Calendar',
        suffix: 'appts',
        placeholder: 'e.g. 12',
        helpText: 'Scheduled showings and viewings',
    },
];
export const METRIC_KEY_MAP = {
    newLeads: METRICS[0],
    callsConversations: METRICS[1],
    uniqueConversations: METRICS[2],
    appointments: METRICS[3],
};
export const DEFAULT_MONTH = () => {
    const date = new Date();
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
};
//# sourceMappingURL=metrics.js.map