import { HelpCircle, FileText, CreditCard, Users } from 'lucide-react';

export const CATEGORY_CONFIG = {
    'getting-started': {
        title: 'Getting Started',
        icon: <HelpCircle className="w-5 h-5" />,
        order: 1
    },
    'managing-documents': {
        title: 'Managing Documents',
        icon: <FileText className="w-5 h-5" />,
        order: 2
    },
    'business-docs': {
        title: 'Business Documents',
        icon: <CreditCard className="w-5 h-5" />,
        order: 3
    },
    'partners': {
        title: 'Partners',
        icon: <Users className="w-5 h-5" />,
        order: 4
    },
    'user-management': {
        title: 'User Management',
        icon: <Users className="w-5 h-5" />,
        order: 5
    },
    'other': {
        title: 'Other',
        icon: <HelpCircle className="w-5 h-5" />,
        order: 99
    },
};