import React, { useState, useRef, useEffect } from 'react';
import PageTitle from '@/components/shared-ui/PageTitle';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Send,
    Bot,
    User,
    Loader2,
    Trash2,
    Sparkles,
    Terminal
} from 'lucide-react';
import { useChatMutation } from '@/queries/Chat';

const ChatBot = () => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            role: 'assistant',
            content: 'Hello! I am the Finetica AI Architect. I have access to the entire codebase. Ask me about features, file structures, or how specific modules are implemented.'
        }
    ]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);
    const { mutate, isPending } = useChatMutation();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!input.trim() || isPending) return;

        const userMessageText = input;
        const userMessageId = Date.now();

        setMessages(prev => [...prev, { id: userMessageId, role: 'user', content: userMessageText }]);
        setInput('');

        mutate(
            { message: userMessageText },
            {
                onSuccess: (data) => {
                    const botMessage = {
                        id: Date.now() + 1,
                        role: 'assistant',
                        content: data.answer,
                        filesUsed: data.filesUsed
                    };
                    setMessages(prev => [...prev, botMessage]);
                },
                onError: (error) => {
                    console.error("Chat error:", error);
                    const errorMessage = {
                        id: Date.now() + 1,
                        role: 'assistant',
                        content: "I'm having trouble connecting to the AI server. Please ensure the backend is running."
                    };
                    setMessages(prev => [...prev, errorMessage]);
                }
            }
        );
    };

    const handleQuickPrompt = (text) => {
        setInput(text);
    };

    const clearChat = () => {
        setMessages([{
            id: 1,
            role: 'assistant',
            content: 'Chat cleared. How can I help you now?'
        }]);
    };

    const quickPrompts = [
        "How is login implemented?",
        "Explain the folder structure",
        "What libraries are used in frontend?",
        "Where is the database config?"
    ];

    return (
        <div className="pt-20 container mx-auto px-4 max-w-5xl h-[calc(100vh-2rem)] flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <PageTitle text="AI Code Assistant" />
                <Button variant="outline" size="sm" onClick={clearChat} className="text-muted-foreground">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear History
                </Button>
            </div>

            <div className="flex-1 flex gap-6 overflow-hidden pb-6">
                {/* LEFT SIDE: Main Chat Area */}
                <Card className="flex-1 flex flex-col shadow-md border-muted">
                    <CardHeader className="py-4 border-b bg-muted/30">
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Bot className="w-5 h-5 text-spurple" />
                            <span>Finetica Architect</span>
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="flex-1 p-0 overflow-hidden bg-background">
                        <ScrollArea className="h-full p-6">
                            <div className="space-y-6">
                                {messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                                    >
                                        {/* Avatar */}
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-[var(--spurple)] text-white' : 'bg-muted text-foreground'
                                            }`}>
                                            {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                                        </div>

                                        {/* Message Bubble */}
                                        <div className={`max-w-[80%] rounded-2xl px-5 py-3 text-sm leading-relaxed shadow-sm ${msg.role === 'user'
                                            ? 'bg-[var(--spurple)] text-white rounded-tr-none'
                                            : 'bg-muted/50 border rounded-tl-none'
                                            }`}>
                                            <div className="whitespace-pre-wrap font-sans">
                                                {msg.content}
                                            </div>

                                            {/* Show used files if available */}
                                            {msg.filesUsed && msg.filesUsed.length > 0 && (
                                                <div className="mt-3 pt-3 border-t border-border/50">
                                                    <p className="text-xs font-semibold mb-1 opacity-70 flex items-center gap-1">
                                                        <Terminal className="w-3 h-3" />
                                                        Context Sources:
                                                    </p>
                                                    <div className="flex flex-wrap gap-1">
                                                        {msg.filesUsed.map((file, idx) => (
                                                            <span key={idx} className="text-[10px] bg-background border px-1.5 py-0.5 rounded text-muted-foreground font-mono">
                                                                {file}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {isPending && (
                                    <div className="flex gap-4">
                                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                                            <Bot className="w-5 h-5" />
                                        </div>
                                        <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Analyzing codebase...
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>
                        </ScrollArea>
                    </CardContent>

                    <CardFooter className="p-4 border-t bg-muted/10">
                        <form onSubmit={handleSendMessage} className="flex w-full gap-3">
                            <Input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask about the codebase, architecture, or features..."
                                className="flex-1 py-6 shadow-sm"
                                disabled={isPending}
                            />
                            <Button
                                type="submit"
                                size="lg"
                                disabled={!input.trim() || isPending}
                                className="bg-[var(--spurple)] hover:bg-[var(--spurple)]/90 px-6 text-white"
                            >
                                <Send className="w-5 h-5" />
                            </Button>
                        </form>
                    </CardFooter>
                </Card>

                {/* RIGHT SIDE: Sidebar / Quick Actions */}
                <div className="hidden lg:flex w-72 flex-col gap-4">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-yellow-500" />
                                Suggested Queries
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-2">
                            {quickPrompts.map((prompt, index) => (
                                <Button
                                    key={index}
                                    variant="ghost"
                                    className="justify-start text-left h-auto py-2 px-3 text-sm whitespace-normal border border-transparent hover:border-muted-foreground/20 hover:bg-muted"
                                    onClick={() => handleQuickPrompt(prompt)}
                                >
                                    {prompt}
                                </Button>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="flex-1 bg-gradient-to-br from-[var(--spurple)]/5 to-transparent border-none shadow-none">
                        <CardContent className="p-6 text-sm text-muted-foreground">
                            <h4 className="font-semibold text-foreground mb-2">How it works</h4>
                            <p className="mb-4">
                                This assistant uses <span className="font-mono text-xs bg-muted px-1 rounded">Gemini AI</span> and
                                <span className="font-mono text-xs bg-muted px-1 rounded mx-1">RAG</span>
                                technology to read your live repository structure.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ChatBot;