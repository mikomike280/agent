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
    Users,
    LogOut,
    Bell,
    Search,
    MessageSquare
} from 'lucide-react';
import { signOut } from 'next-auth/react';

const menuItems = {
    admin: [
        { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard/admin' },
        { name: 'Payments', icon: CreditCard, href: '/dashboard/admin/payments' },
        { name: 'Projects', icon: Briefcase, href: '/dashboard/admin/projects' },
        { name: 'Users', icon: Users, href: '/dashboard/admin/users' },
    ],
    client: [
        { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard/client' },
        { name: 'Find Talent', icon: Search, href: '/dashboard/client/discovery' },
        { name: 'My Projects', icon: Briefcase, href: '/dashboard/client/projects' },
        { name: 'Payments', icon: CreditCard, href: '/dashboard/client/payments' },
    ],
    commissioner: [
        { name: 'Pipeline', icon: LayoutDashboard, href: '/dashboard/commissioner' },
        { name: 'Leads', icon: Users, href: '/dashboard/commissioner/leads' },
        { name: 'Earnings', icon: CreditCard, href: '/dashboard/commissioner/earnings' },
    ],
    developer: [
        { name: 'Work Queue', icon: LayoutDashboard, href: '/dashboard/developer' },
        { name: 'Active Jobs', icon: Briefcase, href: '/dashboard/developer/jobs' },
        { name: 'Earnings', icon: CreditCard, href: '/dashboard/developer/earnings' },
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
                    href="/support"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all"
                >
                    <Shield className="w-5 h-5 text-gray-400" />
                    Help Center
                </Link>
                <Link
                    href="/settings"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all"
                >
                    <Settings className="w-5 h-5 text-gray-400" />
                    Settings
                </Link>
            </nav>

            {/* User Footer */}
            <div className="mt-auto p-4 border-t border-gray-100 bg-gray-50/50">
                <button
                    onClick={() => signOut({ callbackUrl: '/login' })}
                    className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-gray-500 hover:bg-red-50/80 hover:text-red-600 hover:shadow-[0_2px_10px_rgba(239,68,68,0.1)] transition-all duration-300 group border border-transparent hover:border-red-100"
                >
                    <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-1 group-hover:scale-110" />
                    <span className="font-semibold">Logout</span>
                </button>
            </div>
        </aside>
    );
}
