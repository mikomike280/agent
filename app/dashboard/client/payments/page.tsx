'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
    CreditCard,
    DollarSign,
    CheckCircle,
    Clock,
    Download,
    Receipt,
    ExternalLink,
    Wallet
} from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function ClientPaymentsPage() {
    const { data: session } = useSession();
    const [payments, setPayments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const response = await fetch('/api/payments');
                const result = await response.json();
                if (result.success) {
                    setPayments(result.data);
                }
            } catch (error) {
                console.error('Error fetching payments:', error);
            } finally {
                setLoading(false);
            }
        };

        if (session) {
            fetchPayments();
        }
    }, [session]);

    const totalInvested = payments
        .filter(p => p.status === 'verified' || p.status === 'released')
        .reduce((acc, p) => acc + Number(p.amount), 0);

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Billing & Payments</h1>
                    <p className="text-gray-500 mt-2">Manage your project funds, escrow deposits, and view invoices.</p>
                </div>
                <button className="px-6 py-3 bg-[#1f7a5a] text-white rounded-xl font-bold flex items-center gap-2 hover:bg-[#176549] transition-all shadow-lg shadow-[#1f7a5a]/20">
                    <Wallet className="w-5 h-5" />
                    Top Up Escrow
                </button>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="p-6 bg-white border-gray-100 shadow-sm">
                    <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center mb-4">
                        <DollarSign className="w-6 h-6 text-green-600" />
                    </div>
                    <p className="text-gray-500 text-sm font-medium">Total Invested</p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1">KES {totalInvested.toLocaleString()}</h3>
                </Card>
                <Card className="p-6 bg-white border-gray-100 shadow-sm">
                    <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4">
                        <Clock className="w-6 h-6 text-indigo-600" />
                    </div>
                    <p className="text-gray-500 text-sm font-medium">In Escrow</p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1">KES {(totalInvested * 0.4).toLocaleString()}</h3>
                </Card>
                <Card className="p-6 bg-white border-gray-100 shadow-sm">
                    <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center mb-4">
                        <Receipt className="w-6 h-6 text-purple-600" />
                    </div>
                    <p className="text-gray-500 text-sm font-medium">Active Invoices</p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1">0</h3>
                </Card>
                <Card className="p-6 bg-white border-gray-100 shadow-sm">
                    <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center mb-4">
                        <AlertCircle className="w-6 h-6 text-orange-600" />
                    </div>
                    <p className="text-gray-500 text-sm font-medium">Pending Release</p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1">KES 0</h3>
                </Card>
            </div>

            {/* Transaction History */}
            <Card className="overflow-hidden border-gray-100">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h3 className="font-bold text-gray-900">Payment History</h3>
                    <div className="flex gap-2">
                        <button className="p-2 text-gray-400 hover:text-gray-600 bg-white border border-gray-100 rounded-lg">
                            <Download className="w-5 h-5" />
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-white border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Transaction</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Project</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Amount</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 bg-white">
                            {loading ? (
                                Array(4).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={5} className="px-6 py-6"><div className="h-4 bg-gray-50 rounded"></div></td>
                                    </tr>
                                ))
                            ) : payments.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500 italic">No payments found in your history.</td>
                                </tr>
                            ) : (
                                payments.map((payment) => (
                                    <tr key={payment.id} className="hover:bg-gray-50/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center">
                                                    <CreditCard className="w-5 h-5 text-gray-400" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900">{payment.payment_reference || 'Deposit'}</p>
                                                    <p className="text-xs text-gray-400">{new Date(payment.created_at).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-medium text-gray-600">{payment.projects?.title || 'General Account'}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-gray-900">KES {Number(payment.amount).toLocaleString()}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter ${payment.status === 'verified' ? 'bg-green-100 text-green-700' :
                                                    payment.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-gray-100 text-gray-700'
                                                }`}>
                                                {payment.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-[#1f7a5a] text-sm font-bold flex items-center justify-end gap-1 ml-auto hover:underline">
                                                Invoice
                                                <ExternalLink className="w-3 h-3" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
