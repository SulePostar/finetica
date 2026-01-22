import * as React from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateFaq } from "@/queries/faqQueries";
import { CATEGORY_CONFIG } from "@/helpers/faqConfig";
import { notify } from "@/lib/notifications";
export default function AddFaqModal({ open, onOpenChange }) {
    const [question, setQuestion] = React.useState("");
    const [answer, setAnswer] = React.useState("");
    const [category, setCategory] = React.useState("");

    const createFaqMutation = useCreateFaq();

    const handleSubmit = () => {
        createFaqMutation.mutate({
            question: question.trim(),
            answer: answer.trim(),
            categoryKey: category.trim() || null,
        },
            {
                onSuccess: () => {
                    closeDialog();
                    notify.success("FAQ created successfully");
                },
                onError: (error) => {
                    const serverMessage = error.response?.data?.message || "An error occurredd while creating the FAQ";
                    notify.error(serverMessage);
                }
            });
    };

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
                        <Select value={category} onValueChange={setCategory}>
                            <SelectTrigger className="w-full" >
                                <SelectValue placeholder="Select a category..." />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.entries(CATEGORY_CONFIG)
                                    .sort(([, a], [, b]) => a.order - b.order)
                                    .map(([key, config]) => (
                                        <SelectItem key={key} value={key}>
                                            <div className="flex items-center gap-2">
                                                {config.icon}
                                                {config.title}
                                            </div>
                                        </SelectItem>
                                    ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={closeDialog}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={!question.trim() || !answer.trim() || createFaqMutation.isPending}
                    >
                        {createFaqMutation.isPending ? "Saving..." : "Save"}

                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog >
    );
}
