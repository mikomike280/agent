// Sidebar Navigation Component
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    CreditCard,
    Briefcase,
    Shield,
    Settings,
    User, // Added User icon
    Users,
    Search,
    MessageSquare,
    Target,
    Megaphone,
    BookOpen,
    LogOut,
    Bell,
    FileText
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

const menuItems = {
    admin: [
        { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard/admin' },
        { name: 'Approvals', icon: Shield, href: '/dashboard/admin/approvals' },
        { name: 'Payments', icon: CreditCard, href: '/dashboard/admin/payments' },
        { name: 'Ledger', icon: FileText, href: '/dashboard/admin/ledger' },
        { name: 'Projects', icon: Briefcase, href: '/dashboard/admin/projects' },
        { name: 'Users', icon: Users, href: '/dashboard/admin/users' },
        { name: 'Knowledge Base', icon: BookOpen, href: '/dashboard/kb' },
        { name: 'Profile', icon: User, href: '/dashboard/profile' },
    ],
    client: [
        { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard/client' },
        { name: 'Messages', icon: MessageSquare, href: '/dashboard/client/messages' },
        { name: 'Find Talent', icon: Search, href: '/dashboard/client/discovery' },
        { name: 'My Projects', icon: Briefcase, href: '/dashboard/client/projects' },
        { name: 'Knowledge Base', icon: BookOpen, href: '/dashboard/kb' },
        { name: 'Payments', icon: CreditCard, href: '/dashboard/client/payments' },
        { name: 'Profile', icon: User, href: '/dashboard/profile' },
    ],
    commissioner: [
        { name: 'Dashboard', href: '/dashboard/commissioner', icon: LayoutDashboard },
        { name: 'Leads', href: '/dashboard/commissioner/leads', icon: Target },
        { name: 'Marketing', href: '/dashboard/commissioner/marketing', icon: Megaphone },
        { name: 'Knowledge Base', href: '/dashboard/kb', icon: BookOpen },
        { name: 'Team', href: '/dashboard/commissioner/team', icon: Users },
        { name: 'Profile', href: '/dashboard/profile', icon: User },
        { name: 'Messages', href: '/dashboard/commissioner/messages', icon: MessageSquare },
        { name: 'Invoices', href: '/dashboard/commissioner/invoices', icon: CreditCard },
    ],
    developer: [
        { name: 'Work Queue', icon: LayoutDashboard, href: '/dashboard/developer' },
        { name: 'Messages', icon: MessageSquare, href: '/dashboard/developer/messages' },
        { name: 'Active Jobs', icon: Briefcase, href: '/dashboard/developer/jobs' },
        { name: 'Knowledge Base', icon: BookOpen, href: '/dashboard/kb' },
        { name: 'Earnings', icon: CreditCard, href: '/dashboard/developer/earnings' },
        { name: 'Profile', icon: User, href: '/dashboard/profile' },
    ]
};

export function Sidebar({ role }: { role: 'admin' | 'client' | 'commissioner' | 'developer' }) {
    const pathname = usePathname();
    const items = menuItems[role] || [];

    return (
        <aside className="w-64 bg-[var(--bg-sidebar)] border-r border-[var(--bg-input)] h-screen fixed left-0 top-0 flex flex-col z-20 shadow-[4px_0_24px_rgba(0,0,0,0.2)]">
            {/* Brand */}
            <div className="p-8 pb-4">
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#5347CE] to-[#16C8C7]">
                    Nexus
                </h1>
                <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider font-medium">Workspace</p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-4 space-y-1">
                <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 mt-2">
                    Menu
                </p>

                {items.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                ? 'bg-indigo-50/80 text-[#5347CE] font-semibold shadow-sm'
                                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                        >
                            <Icon className={`w-5 h-5 ${isActive ? 'text-[#5347CE]' : 'text-gray-400 group-hover:text-gray-600'}`} />
                            {item.name}
                        </Link>
                    );
                })}

                {/* Support Section */}
                <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 mt-8">
                    Support
                </p>
                <Link
                    href={`/dashboard/${role}/support`}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${pathname.includes('/support')
                        ? 'bg-indigo-50/80 text-[#5347CE] font-semibold shadow-sm'
                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                >
                    <Shield className={`w-5 h-5 ${pathname.includes('/support') ? 'text-[#5347CE]' : 'text-gray-400'}`} />
                    Support Tickets
                </Link>
                <Link
                    href="/dashboard/settings"
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${pathname.includes('/settings')
                        ? 'bg-indigo-50/80 text-[#5347CE] font-semibold shadow-sm'
                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                >
                    <Settings className={`w-5 h-5 ${pathname.includes('/settings') ? 'text-[#5347CE]' : 'text-gray-400'}`} />
                    Settings
                </Link>
            </nav>

            {/* User Footer */}
            <div className="mt-auto p-4 border-t border-[var(--bg-input)] bg-[var(--bg-card)]/50 space-y-2">
                <div className="flex items-center justify-center mb-3">
                    <ThemeToggle />
                </div>
                <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-[var(--text-secondary)] hover:bg-red-500/10 hover:text-red-600 hover:shadow-[0_2px_10px_rgba(239,68,68,0.1)] transition-all duration-300 group border border-transparent hover:border-red-200"
                >
                    <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-1 group-hover:scale-110" />
                    <span className="font-semibold">Logout</span>
                </button>
            </div>
        </aside>
    );
}
