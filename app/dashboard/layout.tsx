'use client';

import { Sidebar } from '@/components/layout/sidebar';
import { TopBar } from '@/components/layout/topbar';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { data: session, status } = useSession();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (status === 'loading') {
        return <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA]">Loading...</div>;
    }

    if (status === 'unauthenticated') {
        redirect('/login');
    }

    // Get user role, default to client if not found
    const role = (session?.user as any)?.role || 'client';

    return (
        <div className="min-h-screen bg-[var(--bg-app)] font-sans text-[var(--text-primary)]">
            {/* Sidebar - Fixed Left */}
            <Sidebar role={role} />

            {/* Main Content Area */}
            <div className="pl-64 flex flex-col min-h-screen transition-all duration-300">
                {/* Top Bar - Sticky Top */}
                <TopBar />

                {/* Page Content */}
                <main className="flex-1 p-8">
                    <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
