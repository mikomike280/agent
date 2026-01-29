'use client';

import { useState } from 'react';
import { DollarSign, CheckCircle, AlertTriangle, ShieldCheck, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';

// Mock Payout Requests
const MOCK_PAYOUTS = [
    {
        id: 101,
        requestor: 'Mark Ochieng',
        role: 'Direct Commissioner',
        amount: 25000,
        project: 'E-commerce Redesign (Proj-102)',
        reason: '25% Direct Commission',
        status: 'pending',
        project_status: 'completed',
        date: '2h ago'
    },
    {
        id: 102,
        requestor: 'Alice Wambui (Parent)',
        role: 'Referrer (Silver)',
        amount: 5000,
        project: 'E-commerce Redesign (Proj-102)',
        reason: '5% Multi-Level Override',
        status: 'pending',
        project_status: 'completed',
        date: '2h ago'
    },
    {
        id: 103,
        requestor: 'Sarah K.',
        role: 'Direct Commissioner',
        amount: 15000,
        project: 'Logo Design (Proj-105)',
        reason: '30% Direct Commission',
        status: 'approved',
        project_status: 'completed',
        date: '1d ago'
    }
];

export default function AdminPayoutsPage() {
    const handleApprove = (id: number) => {
        alert(`Payout #${id} Approved! Money sent via M-Pesa Integration.`);
    };

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-black text-gray-900 tracking-tight">Payout Requests</h2>
                <p className="text-gray-500 mt-2 text-lg">Review and approve commission releases.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <Card className="p-6 border-none shadow-lg bg-white">
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Pending Approval</p>
                    <h3 className="text-4xl font-black text-gray-900">KES 30,000</h3>
                    <div className="mt-4 flex items-center gap-2 text-xs font-bold text-yellow-600 bg-yellow-50 w-fit px-2 py-1 rounded-md">
                        <AlertTriangle className="w-3 h-3" />
                        <span>Action Required</span>
                    </div>
                </Card>
            </div>

            <Card className="overflow-hidden border-none shadow-xl">
                <div className="bg-gray-50 border-b border-gray-100 p-4 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-indigo-600" />
                    <span className="font-bold text-gray-700 text-sm uppercase tracking-wide">Security Check: 35% Hard Cap on Commissions enforced.</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-white text-gray-500 uppercase tracking-wider font-bold border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4">Requestor</th>
                                <th className="px-6 py-4">Amount</th>
                                <th className="px-6 py-4">Reason / Project</th>
                                <th className="px-6 py-4">Project Status</th>
                                <th className="px-6 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {MOCK_PAYOUTS.map((payout) => (
                                <tr key={payout.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <p className="font-bold text-gray-900">{payout.requestor}</p>
                                        <p className="text-xs text-gray-500">{payout.role}</p>
                                    </td>
                                    <td className="px-6 py-4 font-mono font-bold text-gray-900">
                                        KES {payout.amount.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`block text-xs font-bold uppercase tracking-widest mb-1 ${payout.reason.includes('Override') ? 'text-indigo-600' : 'text-gray-500'}`}>
                                            {payout.reason}
                                        </span>
                                        <span className="text-xs text-gray-400">{payout.project}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {payout.project_status === 'completed' ? (
                                                <CheckCircle className="w-4 h-4 text-green-500" />
                                            ) : (
                                                <AlertTriangle className="w-4 h-4 text-yellow-500" />
                                            )}
                                            <span className="capitalize text-gray-700">{payout.project_status}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {payout.status === 'pending' ? (
                                            <button
                                                onClick={() => handleApprove(payout.id)}
                                                className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold text-xs hover:bg-green-700 transition-colors shadow-md shadow-green-200"
                                            >
                                                Approve Payout
                                            </button>
                                        ) : (
                                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest px-3 py-1 bg-gray-100 rounded-lg">
                                                Paid
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
