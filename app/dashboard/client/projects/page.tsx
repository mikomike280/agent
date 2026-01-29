'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
    Briefcase,
    CheckCircle,
    Clock,
    AlertCircle,
    MessageSquare,
    FileText,
    ArrowRight
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

export default function ClientProjectsPage() {
    const { data: session } = useSession();
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await fetch('/api/projects');
                const result = await response.json();
                if (result.success) {
                    setProjects(result.data);
                }
            } catch (error) {
                console.error('Error fetching projects:', error);
            } finally {
                setLoading(false);
            }
        };

        if (session) {
            fetchProjects();
        }
    }, [session]);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">My Projects</h1>
                <p className="text-gray-500 mt-2">Track progress and manage deliverables for all your active projects.</p>
            </div>

            <div className="space-y-6">
                {loading ? (
                    Array(3).fill(0).map((_, i) => (
                        <Card key={i} className="p-8 animate-pulse">
                            <div className="flex gap-6">
                                <div className="w-16 h-16 bg-gray-100 rounded-2xl"></div>
                                <div className="flex-1 space-y-4">
                                    <div className="h-6 bg-gray-100 rounded w-1/3"></div>
                                    <div className="h-4 bg-gray-100 rounded w-full"></div>
                                    <div className="h-4 bg-gray-100 rounded w-2/3"></div>
                                </div>
                            </div>
                        </Card>
                    ))
                ) : projects.length === 0 ? (
                    <Card className="p-12 text-center bg-white border-dashed border-2 border-gray-100">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Briefcase className="w-10 h-10 text-gray-300" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No active projects</h3>
                        <p className="text-gray-500 max-w-sm mx-auto mb-8">
                            You don't have any projects in progress. Contact your account manager to start a new project.
                        </p>
                        <button className="px-6 py-3 bg-[#1f7a5a] text-white rounded-xl font-bold hover:bg-[#176549] transition-all">
                            Start New Project
                        </button>
                    </Card>
                ) : (
                    projects.map((project) => (
                        <Card key={project.id} className="p-8 hover:shadow-xl transition-all duration-500 border-gray-100 bg-white group overflow-hidden relative">
                            {/* Decorative Background Element */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 -mr-16 -mt-16 rounded-full group-hover:scale-110 transition-transform duration-700"></div>

                            <div className="relative flex flex-col lg:flex-row gap-8">
                                <div className="lg:w-2/3 space-y-6">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${project.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                    {project.status}
                                                </span>
                                                <span className="text-sm text-gray-400 font-medium">#{project.id.split('-')[0]}</span>
                                            </div>
                                            <h2 className="text-2xl font-bold text-gray-900 group-hover:text-[#1f7a5a] transition-colors">
                                                {project.title}
                                            </h2>
                                        </div>
                                    </div>

                                    <p className="text-gray-600 leading-relaxed">
                                        {project.description}
                                    </p>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                            <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Timeline</p>
                                            <p className="font-bold text-gray-900">4-6 Weeks</p>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                            <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Status</p>
                                            <p className="font-bold text-gray-900 capitalize">{project.status}</p>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                            <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Next Milestone</p>
                                            <p className="font-bold text-gray-900">Beta Launch</p>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                            <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Current Task</p>
                                            <p className="font-bold text-gray-900">API Design</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="lg:w-1/3 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-gray-100 pt-8 lg:pt-0 lg:pl-8">
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-bold text-gray-900 uppercase tracking-wide">Project Velocity</span>
                                            <span className="text-xl font-black text-[#1f7a5a]">{project.progress || 0}%</span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                                            <div
                                                className="bg-gradient-to-r from-[#1f7a5a] to-[#2ecc71] h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(31,122,90,0.3)]"
                                                style={{ width: `${project.progress || 0}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    <div className="space-y-3 mt-8">
                                        <button className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-all hover:-translate-y-1 shadow-lg shadow-gray-200">
                                            <MessageSquare className="w-5 h-5" />
                                            Message Developer
                                        </button>
                                        <button className="w-full py-4 bg-white border-2 border-gray-100 text-gray-600 rounded-2xl font-bold flex items-center justify-center gap-2 hover:border-[#1f7a5a] hover:text-[#1f7a5a] transition-all">
                                            <FileText className="w-5 h-5" />
                                            View Artifacts
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
