import React, { useState } from 'react';
import { usePendingEntries, useApproveEntry, useRejectEntry } from '@/queries/knowledgeBase';

const KnowledgeBase = () => {
    const { data: entries, isLoading, isError } = usePendingEntries();
    const approveMutation = useApproveEntry();
    const rejectMutation = useRejectEntry();
    const [editedAnswers, setEditedAnswers] = useState({});
    const handleTextChange = (id, newText) => {
        setEditedAnswers(prev => ({
            ...prev,
            [id]: newText
        }));
    };

    const handleApprove = (id, originalAnswer) => {
        const finalAnswer = editedAnswers[id] !== undefined ? editedAnswers[id] : originalAnswer;

        approveMutation.mutate({ id, answer: finalAnswer });
        setEditedAnswers(prev => {
            const newState = { ...prev };
            delete newState[id];
            return newState;
        });
    };

    const handleReject = (id) => {
        if (!confirm("Are you sure you want to delete this?")) return;
        rejectMutation.mutate(id);
    };

    if (isLoading) return <div className="p-8">Loading pending items...</div>;
    if (isError) return <div className="p-8 text-red-500">Error loading data.</div>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">AI Knowledge Base Approval</h1>

            {!entries || entries.length === 0 ? (
                <div className="text-gray-500">No pending questions. Good job!</div>
            ) : (
                <div className="space-y-6">
                    {entries.map((entry) => {
                        const currentText = editedAnswers[entry.id] !== undefined
                            ? editedAnswers[entry.id]
                            : entry.answer;

                        return (
                            <div key={entry.id} className="border rounded-lg p-4 shadow-sm bg-white">
                                <div className="mb-2">
                                    <span className="text-xs font-bold text-blue-600 uppercase">Question:</span>
                                    <p className="text-lg font-medium text-gray-800">{entry.question}</p>
                                </div>

                                <div className="mb-4">
                                    <span className="text-xs font-bold text-green-600 uppercase">AI Answer (Editable):</span>
                                    <textarea
                                        className="w-full mt-1 p-2 border rounded-md h-32 text-sm font-mono text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={currentText}
                                        onChange={(e) => handleTextChange(entry.id, e.target.value)}
                                    />
                                </div>

                                <div className="flex justify-end gap-3">
                                    <button
                                        onClick={() => handleReject(entry.id)}
                                        disabled={rejectMutation.isPending}
                                        className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded border border-red-200 disabled:opacity-50"
                                    >
                                        {rejectMutation.isPending ? 'Deleting...' : 'Reject / Delete'}
                                    </button>
                                    <button
                                        onClick={() => handleApprove(entry.id, entry.answer)}
                                        disabled={approveMutation.isPending}
                                        className="px-4 py-2 text-sm text-white bg-green-600 hover:bg-green-700 rounded shadow-sm disabled:opacity-50"
                                    >
                                        {approveMutation.isPending ? 'Approving...' : 'Approve & Train'}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default KnowledgeBase;