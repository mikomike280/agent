'use client';

import { useState } from 'react';
import { CheckCircle2, Circle, Plus, Trash2 } from 'lucide-react';

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
};

export default function MilestoneChecklist({
    milestone,
    onUpdate
}: {
    milestone: Milestone;
    onUpdate: (updatedMilestone: Milestone) => void;
}) {
    const [checklist, setChecklist] = useState<ChecklistItem[]>(milestone.checklist || []);
    const [newItemText, setNewItemText] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);

    const addItem = () => {
        if (!newItemText.trim()) return;

        const newItem: ChecklistItem = {
            id: Date.now(),
            text: newItemText.trim(),
            completed: false
        };

        const updatedChecklist = [...checklist, newItem];
        setChecklist(updatedChecklist);
        setNewItemText('');
        saveChecklist(updatedChecklist);
    };

    const toggleItem = (itemId: number) => {
        const updatedChecklist = checklist.map(item =>
            item.id === itemId ? { ...item, completed: !item.completed } : item
        );
        setChecklist(updatedChecklist);
        saveChecklist(updatedChecklist);
    };

    const removeItem = (itemId: number) => {
        const updatedChecklist = checklist.filter(item => item.id !== itemId);
        setChecklist(updatedChecklist);
        saveChecklist(updatedChecklist);
    };

    const saveChecklist = async (updatedChecklist: ChecklistItem[]) => {
        setIsUpdating(true);
        try {
            const res = await fetch(`/api/milestones/${milestone.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ checklist: updatedChecklist })
            });

            if (!res.ok) throw new Error('Failed to update checklist');

            const updatedMilestone = await res.json();
            onUpdate(updatedMilestone);
        } catch (err) {
            console.error('Error saving checklist:', err);
            alert('Failed to save changes');
        } finally {
            setIsUpdating(false);
        }
    };

    const completedCount = checklist.filter(item => item.completed).length;
    const progress = checklist.length > 0 ? Math.round((completedCount / checklist.length) * 100) : 0;

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">{milestone.title}</h3>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">
                        {completedCount}/{checklist.length} complete
                    </span>
                    <span className="text-lg font-bold text-blue-600">{progress}%</span>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                    className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Checklist Items */}
            <div className="space-y-2">
                {checklist.map(item => (
                    <div
                        key={item.id}
                        className="flex items-center gap-3 p-3 bg-white rounded-lg border hover:border-blue-400 transition-colors"
                    >
                        <button
                            onClick={() => toggleItem(item.id)}
                            className="flex-shrink-0"
                            disabled={isUpdating}
                        >
                            {item.completed ? (
                                <CheckCircle2 className="w-6 h-6 text-green-600" />
                            ) : (
                                <Circle className="w-6 h-6 text-gray-400" />
                            )}
                        </button>
                        <span className={`flex-1 ${item.completed ? 'line-through text-gray-500' : ''}`}>
                            {item.text}
                        </span>
                        <button
                            onClick={() => removeItem(item.id)}
                            className="flex-shrink-0 text-red-500 hover:text-red-700"
                            disabled={isUpdating}
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                    </div>
                ))}
            </div>

            {/* Add New Item */}
            <div className="flex gap-2">
                <input
                    type="text"
                    value={newItemText}
                    onChange={(e) => setNewItemText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addItem()}
                    placeholder="Add new task..."
                    className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={isUpdating}
                />
                <button
                    onClick={addItem}
                    disabled={!newItemText.trim() || isUpdating}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    Add
                </button>
            </div>

            {isUpdating && (
                <p className="text-sm text-gray-500 text-center">Saving...</p>
            )}
        </div>
    );
}
