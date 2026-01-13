import * as React from "react";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AddFaqModal({ open, onOpenChange }) {
    const [question, setQuestion] = React.useState("");
    const [answer, setAnswer] = React.useState("");
    const [category, setCategory] = React.useState("");

    const resetState = () => {
        setQuestion("");
        setAnswer("");
        setCategory("");
    };

    const handleDialogChange = (nextOpen) => {
        if (!nextOpen) {
            resetState();
        }
        onOpenChange(nextOpen);
    };

    const closeDialog = () => handleDialogChange(false);

    return (
        <Dialog open={open} onOpenChange={handleDialogChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add new FAQ</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <div className="text-sm font-medium">Question</div>
                        <Input
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            placeholder="Type the question..."
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="text-sm font-medium">Answer</div>
                        <textarea
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            placeholder="Type the answer..."
                            rows={4}
                            className="w-full rounded-md border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="text-sm font-medium">Category (optional)</div>
                        <Input
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            placeholder="e.g. Accounts, Payments..."
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={closeDialog}>
                        Cancel
                    </Button>
                    <Button
                        onClick={closeDialog}
                        disabled={!question.trim() || !answer.trim()}
                    >
                        Save
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
