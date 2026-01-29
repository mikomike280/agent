'use client';

import { useSession } from 'next-auth/react';
import {
    CheckCircle,
    Clock,
    AlertCircle,
    Shield,
    ArrowRight,
    MessageSquare,
    FileText,
    Download
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

export default function ClientDashboard() {
    const { data: session } = useSession();

    return (
        <div className="space-y-8">
            {/* Greeting & Quick Status */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">Active Projects</h2>
                    <p className="text-gray-500 mt-2 text-lg">Track progress, approve milestones, and stay in control.</p>
                </div>
                <div className="bg-[#1f7a5a]/10 px-4 py-2 rounded-full flex items-center gap-2 text-[#1f7a5a] font-bold text-sm">
                    <Shield className="w-4 h-4 fill-current" />
                    <span>Escrow Protection Active</span>
                </div>
            </div>

            {/* Main Project Card - "Premium & Calm" */}
            <Card className="border-none shadow-2xl shadow-indigo-100/40 bg-white overflow-hidden rounded-3xl">
                {/* Header Strip */}
                <div className="bg-gray-900 p-8 text-white flex justify-between items-center">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-500/30">
                                In Progress
                            </span>
                            <span className="text-gray-400 text-sm font-medium">ID: #PROJ-8292</span>
                        </div>
                        <h3 className="text-2xl font-bold">Green School Portal Revamp</h3>
                    </div>
                    <div className="text-right hidden md:block">
                        <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">Timeline</p>
                        <p className="text-xl font-bold font-mono">14 Days Left</p>
                    </div>
                </div>

                <div className="p-8">
                    {/* Progress & Confidence Meter */}
                    <div className="mb-10">
                        <div className="flex justify-between items-end mb-4">
                            <div>
                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Current Phase</p>
                                <h4 className="text-xl font-bold text-indigo-600">Front-End Development</h4>
                            </div>
                            <div className="text-right">
                                <p className="text-4xl font-black text-gray-900">65%</p>
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Completion Confidence</p>
                            </div>
                        </div>

                        {/* Custom Progress Bar */}
                        <div className="h-4 bg-gray-100 rounded-full overflow-hidden flex">
                            <div className="w-[30%] bg-green-500 h-full"></div>
                            <div className="w-[35%] bg-green-500 h-full border-l border-white/20"></div>
                            <div className="w-[35%] bg-gray-100 h-full"></div>
                        </div>
                        <div className="flex justify-between mt-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                            <span>Design</span>
                            <span className="text-indigo-600">Build</span>
                            <span>Testing</span>
                            <span>Launch</span>
                        </div>
                    </div>

                    {/* Action Grid */}
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                            <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-indigo-600 mb-4">
                                <MessageSquare className="w-5 h-5" />
                            </div>
                            <h5 className="font-bold text-gray-900 mb-1">Commissioner Update</h5>
                            <p className="text-sm text-gray-500 mb-4 leading-relaxed">"The landing page designs are ready. Please review the attached PDF."</p>
                            <Link href="/dashboard/messages" className="text-xs font-black text-indigo-600 uppercase tracking-widest hover:underline">
                                Reply to Message
                            </Link>
                        </div>

                        <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                            <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-orange-500 mb-4">
                                <FileText className="w-5 h-5" />
                            </div>
                            <h5 className="font-bold text-gray-900 mb-1">Pending Approval</h5>
                            <p className="text-sm text-gray-500 mb-4 leading-relaxed">Milestone 2: Database Schema requires your sign-off to proceed.</p>
                            <button className="text-xs font-black text-orange-600 uppercase tracking-widest hover:underline">
                                Review & Approve
                            </button>
                        </div>

                        <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                            <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-green-600 mb-4">
                                <Download className="w-5 h-5" />
                            </div>
                            <h5 className="font-bold text-gray-900 mb-1">Project Documents</h5>
                            <p className="text-sm text-gray-500 mb-4 leading-relaxed">Access all contracts, invoices, and design files in one place.</p>
                            <Link href="/dashboard/client/files" className="text-xs font-black text-green-600 uppercase tracking-widest hover:underline">
                                Open File Vault
                            </Link>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Trust Footer */}
            <div className="flex justify-center gap-8 text-gray-400 text-xs font-medium uppercase tracking-widest pt-8 border-t border-gray-100">
                <span className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    110% Refund Guarantee
                </span>
                <span className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-indigo-500" />
                    Verified Talent Only
                </span>
                <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    24/7 Support Active
                </span>
            </div>
        </div>
    );
}
