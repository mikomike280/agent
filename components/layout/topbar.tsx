// Top Bar Component
'use client';

import { Search, Bell, ChevronDown } from 'lucide-react';
import { useSession } from 'next-auth/react';

export function TopBar() {
    const { data: session } = useSession();

    return (
        <header className="h-20 bg-[var(--bg-card)]/80 backdrop-blur-md border-b border-[var(--bg-input)] flex items-center justify-between px-8 sticky top-0 z-10">
            {/* Search */}
            <div className="flex-1 max-w-xl">
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#5347CE] transition-colors" />
                    <input
                        type="text"
                        placeholder="Search anything..."
                        className="w-full pl-11 pr-4 py-2.5 bg-[var(--bg-input)] border-none rounded-xl text-sm focus:ring-2 focus:ring-[#5347CE]/20 focus:text-white transition-all placeholder:text-gray-500 text-gray-200"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                        <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-gray-200 bg-white px-1.5 font-mono text-[10px] font-medium text-gray-500">
                            <span className="text-xs">⌘</span>F
                        </kbd>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-6">
                <button className="relative p-2 rounded-xl hover:bg-gray-50 text-gray-400 hover:text-gray-600 transition-colors">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-400 rounded-full border-2 border-white"></span>
                </button>

                <div className="h-8 w-px bg-gray-200"></div>

                {/* Profile */}
                <button className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-semibold text-gray-900 leading-none mb-1">
                            {session?.user?.name || 'User'}
                        </p>
                        <p className="text-xs text-gray-500 font-medium">
                            {(session?.user as any)?.role || 'Guest'}
                        </p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#5347CE] to-[#16C8C7] p-[2px]">
                        <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                            <span className="font-bold text-[#5347CE] text-sm">
                                {session?.user?.name ? session.user.name[0] : 'U'}
                            </span>
                        </div>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
            </div>
        </header>
    );
}
