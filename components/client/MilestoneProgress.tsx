'use client';

import { CheckCircle2, Circle } from 'lucide-react';

type ChecklistItem = {
    id: number;
    text: string;
    completed: boolean;
};

type Milestone = {
    id: string;
    title: string;
    description: string;
    checklist: ChecklistItem[];
    progress: number;
    status: string;
    due_date?: string;
};

export default function MilestoneProgress({ milestone }: { milestone: Milestone }) {
    const checklist = milestone.checklist || [];
    const completedCount = checklist.filter(item => item.completed).length;
    const progress = milestone.progress || 0;

    return (
        <div className="bg-white rounded-lg border p-6 space-y-4">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-xl font-semibold text-gray-900">{milestone.title}</h3>
                    {milestone.description && (
                        <p className="text-sm text-gray-600 mt-1">{milestone.description}</p>
                    )}
                </div>
                <div className="flex flex-col items-end">
                    <div className="text-3xl font-bold text-blue-600">{progress}%</div>
                    <div className="text-sm text-gray-500">Complete</div>
                </div>
            </div>

            {/* Circular Progress Indicator */}
            <div className="flex items-center justify-center py-4">
                <div className="relative w-32 h-32">
                    <svg className="w-full h-full transform -rotate-90">
                        {/* Background circle */}
                        <circle
                            cx="64"
                            cy="64"
                            r="56"
                            fill="none"
                            stroke="#e5e7eb"
                            strokeWidth="8"
                        />
                        {/* Progress circle */}
                        <circle
                            cx="64"
                            cy="64"
                            r="56"
                            fill="none"
                            stroke="#2563eb"
                            strokeWidth="8"
                            strokeDasharray={`${2 * Math.PI * 56}`}
                            strokeDashoffset={`${2 * Math.PI * 56 * (1 - progress / 100)}`}
                            strokeLinecap="round"
                            className="transition-all duration-500"
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold text-gray-800">{progress}%</span>
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                    <span>{completedCount} of {checklist.length} tasks completed</span>
                    {milestone.due_date && (
                        <span>Due: {new Date(milestone.due_date).toLocaleDateString()}</span>
                    )}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-4 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                        style={{ width: `${progress}%` }}
                    >
                        {progress > 10 && (
                            <span className="text-xs text-white font-medium">{progress}%</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Checklist Items (Read-only for Client) */}
            {checklist.length > 0 && (
                <div className="space-y-2 pt-2">
                    <h4 className="text-sm font-semibold text-gray-700">Tasks:</h4>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                        {checklist.map(item => (
                            <div
                                key={item.id}
                                className="flex items-center gap-3 p-2 bg-gray-50 rounded"
                            >
                                {item.completed ? (
                                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                                ) : (
                                    <Circle className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                )}
                                <span className={`text-sm ${item.completed ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                                    {item.text}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Status Badge */}
            <div className="flex items-center gap-2 pt-2">
                <span className="text-sm text-gray-600">Status:</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${milestone.status === 'completed' ? 'bg-green-100 text-green-800' :
                        milestone.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                    }`}>
                    {milestone.status === 'completed' ? 'Completed' :
                        milestone.status === 'in_progress' ? 'In Progress' :
                            'Pending'}
                </span>
            </div>
        </div>
    );
}
