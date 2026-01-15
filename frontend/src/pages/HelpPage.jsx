import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/api/axios"; // <--- FIXED: Use your configured client
import { useAuth } from "@/context/AuthContext";

// --- UI Components ---
import PageTitle from '@/components/shared-ui/PageTitle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import AddFaqModal from "@/components/shared-ui/modals/AddFaqModal";
import FaqCategoryCard from "@/components/help/FaqCategoryCard";
import { CATEGORY_CONFIG } from "@/helpers/faqConfig";
import {
    Plus,
    Search,
    Mail,
    Phone,
    HelpCircle,
    AlertCircle,
    MessageSquare,
} from 'lucide-react';

const HelpPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedFaq, setExpandedFaq] = useState(null);
    const [addFaqOpen, setAddFaqOpen] = useState(false);

    const { user } = useAuth();
    const isAdmin = user?.roleName?.toLowerCase() === "admin";

    // 1. Fetch Data (Fixed to use apiClient)
    const { data: rawFaqs = [], isLoading } = useQuery({
        queryKey: ['faqs'],
        queryFn: async () => {
            // Note: If your apiClient baseURL is '/api', use '/faqs'. 
            // If it is just localhost:3000, use '/api/faqs'.
            const res = await apiClient.get('/faqs');
            return res.data;
        }
    });

    // 2. Transform & Filter Data
    const filteredCategories = useMemo(() => {
        if (!rawFaqs.length) return [];

        // Group questions by categoryKey
        const grouped = rawFaqs.reduce((acc, item) => {
            const key = item.categoryKey;
            if (!acc[key]) acc[key] = [];

            const matchesSearch = !searchQuery ||
                item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.answer.toLowerCase().includes(searchQuery.toLowerCase());

            if (matchesSearch) {
                acc[key].push(item);
            }
            return acc;
        }, {});

        // Map to Config
        return Object.keys(CATEGORY_CONFIG)
            .map(key => ({
                id: key,
                ...CATEGORY_CONFIG[key],
                questions: grouped[key] || []
            }))
            .filter(cat => cat.questions.length > 0)
            .sort((a, b) => a.order - b.order);

    }, [rawFaqs, searchQuery]);

    const contactInfo = {
        email: 'support@finetica.com',
        phone: '+123 456 7890',
        hours: 'Monday - Friday, 9:00 AM - 5:00 PM',
    };

    return (
        <div className="container mx-auto py-8 px-4 max-w-7xl">
            {/* --- Header Section --- */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <PageTitle text="Help Center" className="mb-0" />
                {isAdmin && (
                    <Button
                        size="sm"
                        onClick={() => setAddFaqOpen(true)}
                        className="bg-spurple text-white hover:bg-spurple/90 flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Add FAQ
                    </Button>
                )}
            </div>

            {/* --- Search Bar --- */}
            <Card className="mb-8 shadow-lg">
                <CardContent className="pt-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                        <Input
                            type="text"
                            placeholder="Search for help topics, FAQs, or guides..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-6 text-base"
                        />
                    </div>
                </CardContent>
            </Card>

            <Tabs defaultValue="faq" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2 lg:w-auto">
                    <TabsTrigger value="faq" className="flex items-center gap-2">
                        <HelpCircle className="w-4 h-4" />
                        <span className="hidden sm:inline">FAQ</span>
                    </TabsTrigger>
                    <TabsTrigger value="contact" className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" />
                        <span className="hidden sm:inline">Contact</span>
                    </TabsTrigger>
                </TabsList>

                {/* --- FAQ Tab Content --- */}
                <TabsContent value="faq" className="space-y-6">
                    {isLoading && (
                        <div className="text-center py-10 text-muted-foreground">Loading help content...</div>
                    )}

                    {!isLoading && filteredCategories.length === 0 && (
                        <Card>
                            <CardContent className="pt-6">
                                <div className="text-center py-8">
                                    <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                    <p className="text-muted-foreground">
                                        No results found for "{searchQuery}".
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {filteredCategories.map((category) => (
                        <FaqCategoryCard
                            key={category.id}
                            title={category.title}
                            icon={category.icon}
                            questions={category.questions}
                            expandedFaqId={expandedFaq}
                            onToggle={setExpandedFaq}
                        />
                    ))}
                </TabsContent>

                {/* --- Contact Tab Content (Restored) --- */}
                <TabsContent value="contact" className="space-y-6">
                    <Card className="shadow-md">
                        <CardHeader>
                            <CardTitle className="text-2xl">Contact Support</CardTitle>
                            <CardDescription>Need more help? Our support team is here to assist you</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="flex items-start gap-4 p-4 rounded-lg border bg-card">
                                    <div className="p-3 bg-spurple/10 rounded-lg text-spurple">
                                        <Mail className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-1">Email Support</h3>
                                        <p className="text-sm text-muted-foreground mb-2">Send us an email and we'll respond within 24 hours</p>
                                        <a href={`mailto:${contactInfo.email}`} className="text-spurple hover:underline text-sm font-medium">{contactInfo.email}</a>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 p-4 rounded-lg border bg-card">
                                    <div className="p-3 bg-spurple/10 rounded-lg text-spurple">
                                        <Phone className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-1">Phone Support</h3>
                                        <p className="text-sm text-muted-foreground mb-2">Call us during business hours</p>
                                        <a href={`tel:${contactInfo.phone}`} className="text-spurple hover:underline text-sm font-medium">{contactInfo.phone}</a>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <AddFaqModal open={addFaqOpen} onOpenChange={setAddFaqOpen} />
        </div>
    );
};

export default HelpPage;