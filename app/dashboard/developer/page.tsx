// Developer Dashboard
'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { Briefcase, Upload, Clock, CheckCircle, AlertTriangle, Wallet, Activity } from 'lucide-react';
import Link from 'next/link';

export default function DeveloperDashboard() {
    const { data: session } = useSession();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/developer/dashboard');
                const result = await response.json();
                if (result.success) {
                    setData(result.data);
                }
            } catch (error) {
                console.error('Error fetching developer dashboard:', error);
            } finally {
                setLoading(false);
            }
        };

        if (session?.user) {
            fetchData();
        }
    }, [session]);

    if (loading) {
        return <div className="p-8 text-center text-[var(--text-secondary)]">Loading dashboard...</div>;
    }

    if (!data) {
        return <div className="p-8 text-center text-[var(--text-secondary)]">Failed to load dashboard data.</div>;
    }

    const { profile, projects } = data;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--primary)] to-[var(--accent)]">
                    Welcome back, {session?.user?.name}
                </h1>
                <p className="text-[var(--text-secondary)] mt-1">
                    Here's your squad performance and active tasks.
                </p>
            </div>

            {/* Metrics Grid */}
            <div className="grid md:grid-cols-4 gap-6">
                {/* Reliability Score */}
                <div className="card-soft p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                            <Activity className="w-5 h-5 text-[var(--secondary)]" />
                        </div>
                        <span className="text-sm text-[var(--text-secondary)]">Reliability Score</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <p className="text-3xl font-bold text-[var(--text-primary)]">{profile?.reliability_score || 100}%</p>
                        {profile?.reliability_score < 90 && (
                            <span className="text-xs text-[var(--danger)] flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3" /> Risk
                            </span>
                        )}
                    </div>
                </div>

                {/* Active Projects */}
                <div className="card-soft p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-purple-500/10 rounded-lg">
                            <Briefcase className="w-5 h-5 text-[var(--primary)]" />
                        </div>
                        <span className="text-sm text-[var(--text-secondary)]">Active Projects</span>
                    </div>
                    <p className="text-3xl font-bold text-[var(--text-primary)]">{projects.length}</p>
                </div>

                {/* Pending Earnings */}
                <div className="card-soft p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-yellow-500/10 rounded-lg">
                            <Clock className="w-5 h-5 text-[var(--warning)]" />
                        </div>
                        <span className="text-sm text-[var(--text-secondary)]">Pending (Escrow)</span>
                    </div>
                    <p className="text-3xl font-bold text-[var(--text-primary)]">
                        KES {Number(profile?.pending_balance || 0).toLocaleString()}
                    </p>
                </div>

                {/* Available Wallet */}
                <div className="card-soft p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-green-500/10 rounded-lg">
                            <Wallet className="w-5 h-5 text-[var(--success)]" />
                        </div>
                        <span className="text-sm text-[var(--text-secondary)]">Available Wallet</span>
                    </div>
                    <p className="text-3xl font-bold text-[var(--success)]">
                        KES {Number(profile?.available_balance || 0).toLocaleString()}
                    </p>
                </div>
            </div>

            {/* Project Workspace */}
            <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--bg-input)] overflow-hidden">
                <div className="p-6 border-b border-[var(--bg-input)] flex justify-between items-center">
                    <h2 className="text-lg font-bold text-[var(--text-primary)]">Project Workspace</h2>
                    <Link href="/dashboard/developer/earnings" className="text-sm text-[var(--primary-light)] hover:underline">
                        View Earnings History
                    </Link>
                </div>

                <div className="divide-y divide-[var(--bg-input)]">
                    {projects.length === 0 ? (
                        <div className="p-12 text-center text-[var(--text-muted)]">
                            No active projects. Waiting for squad assignment...
                        </div>
                    ) : (
                        projects.map((project: any) => (
                            <div key={project.id} className="p-6 hover:bg-[var(--bg-input)]/50 transition-colors">
                                <div className="flex flex-col md:flex-row justify-between gap-6">
                                    {/* Project Info */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-bold text-[var(--text-primary)]">{project.title}</h3>
                                            <span className={`px-2 py-0.5 rounded text-xs font-medium uppercase border ${project.role === 'lead' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                                                    project.role === 'qa' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                                                        'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                                }`}>
                                                {project.role} Squad
                                            </span>
                                        </div>
                                        <p className="text-sm text-[var(--text-secondary)] mb-4">
                                            Client: {project.client?.company_name || 'Private'} • Total Value: KES {project.total_value?.toLocaleString()}
                                        </p>

                                        {/* Burn Rate / Active Milestone */}
                                        <div className="bg-[var(--bg-app)] p-4 rounded-xl border border-[var(--bg-input)]">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-sm font-medium text-[var(--text-primary)]">
                                                    Current Phase: {project.active_milestone?.title || 'No Active Milestone'}
                                                </span>
                                                {project.active_milestone && (
                                                    <span className={`text-xs font-bold px-2 py-1 rounded ${project.days_remaining < 3 ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
                                                        }`}>
                                                        {project.days_remaining} Days Left (Burn Rate)
                                                    </span>
                                                )}
                                            </div>

                                            {project.active_milestone && (
                                                <div className="w-full bg-[var(--bg-input)] rounded-full h-2 mb-2">
                                                    <div
                                                        className="bg-[var(--primary)] h-2 rounded-full transition-all"
                                                        style={{ width: `${project.active_milestone.percent_amount}%` }}
                                                    ></div>
                                                </div>
                                            )}

                                            <div className="flex gap-3 mt-3">
                                                <button className="text-xs px-3 py-1.5 bg-[var(--bg-input)] hover:bg-[var(--bg-input)]/80 text-[var(--text-primary)] rounded-lg transition-colors flex items-center gap-2">
                                                    <Upload className="w-3 h-3" /> Log Work Update
                                                </button>
                                                {project.role === 'qa' && (
                                                    <button className="text-xs px-3 py-1.5 bg-[var(--warning)] text-black font-semibold rounded-lg hover:brightness-110 transition-colors">
                                                        Verify Code
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-col justify-center gap-2 min-w-[140px]">
                                        <Link
                                            href={`/dashboard/developer/projects/${project.id}`}
                                            className="w-full py-2 px-4 bg-[var(--primary)] text-white text-sm font-semibold rounded-xl hover:brightness-110 text-center shadow-lg shadow-indigo-500/20"
                                        >
                                            Open Workspace
                                        </Link>
                                        <button className="w-full py-2 px-4 border border-[var(--bg-input)] text-[var(--text-secondary)] text-sm font-medium rounded-xl hover:bg-[var(--bg-input)] transition-colors">
                                            View Contract
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
