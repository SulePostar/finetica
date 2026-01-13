import { useState } from "react";
import PageTitle from '@/components/shared-ui/PageTitle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import AddFaqModal from "@/components/shared-ui/modals/AddFaqModal";
import { useAuth } from "@/context/AuthContext";
import {
    Plus,
    Search,
    Mail,
    Phone,
    HelpCircle,
    FileText,
    Users,
    CreditCard,
    AlertCircle,
    MessageSquare,
} from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const HelpPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedFaq, setExpandedFaq] = useState(null);
    const [addFaqOpen, setAddFaqOpen] = useState(false);

    const { user } = useAuth();
    const isAdmin = user?.roleName?.toLowerCase() === "admin";

    const faqCategories = [
        {
            category: 'Getting Started',
            icon: <HelpCircle className="w-5 h-5" />,
            questions: [
                {
                    id: 1,
                    question: 'How do I log in to the system?',
                    answer: 'Navigate to the login page and enter your credentials (email and password). If you don\'t have an account yet, contact your administrator to create one for you.',
                },
                {
                    id: 2,
                    question: 'How do I reset my password?',
                    answer: 'Click on "Forgot Password" on the login page. Enter your email address and follow the instructions sent to your email to reset your password.',
                },
                {
                    id: 3,
                    question: 'What is the Dashboard?',
                    answer: 'The Dashboard is your main overview page where you can see key metrics and quick access to important features. It provides a snapshot of your system\'s current state.',
                },
            ],
        },
        {
            category: 'Managing Documents',
            icon: <FileText className="w-5 h-5" />,
            questions: [
                {
                    id: 4,
                    question: 'How do I upload documents?',
                    answer: 'Navigate to the specific document type page (KIF, KUF, Contracts, or Bank Transactions). Look for the upload button, click it, and select your PDF files. The system will automatically process them.',
                },
                {
                    id: 5,
                    question: 'What document formats are supported?',
                    answer: 'Currently, the system supports PDF files. Make sure your documents are in PDF format before uploading.',
                },
                {
                    id: 6,
                    question: 'How do I view document details?',
                    answer: 'Click on any document in the table to view its detailed information. You can see all extracted data, processing status, and related information.',
                },
                {
                    id: 7,
                    question: 'What are Invalid PDFs?',
                    answer: 'Invalid PDFs are documents that failed processing or validation. Check the Invalid PDFs page to see which documents need attention and why they failed.',
                },
            ],
        },
        {
            category: 'Bank Transactions',
            icon: <CreditCard className="w-5 h-5" />,
            questions: [
                {
                    id: 8,
                    question: 'How do I upload bank statements?',
                    answer: 'Go to the Bank Transactions page and click the upload button. Select your bank statement PDF files and the system will extract transaction data automatically.',
                },
                {
                    id: 9,
                    question: 'Can I edit bank transaction data?',
                    answer: 'Yes, click on a transaction to view its details and use the edit function to modify information as needed.',
                },
                {
                    id: 10,
                    question: 'How do I filter transactions?',
                    answer: 'Use the filter options at the top of the Bank Transactions page to filter by date, amount, status, or other criteria.',
                },
            ],
        },
        {
            category: 'Partners',
            icon: <Users className="w-5 h-5" />,
            questions: [
                {
                    id: 11,
                    question: 'How do I add a new partner?',
                    answer: 'Navigate to the Partners page and click "Add Partner". Fill in the required information including name, contact details, and any relevant business information.',
                },
                {
                    id: 12,
                    question: 'How do I view partner details?',
                    answer: 'Click on any partner in the partners list to view their complete profile, including contact information, transaction history, and associated documents.',
                },
                {
                    id: 13,
                    question: 'Can I edit partner information?',
                    answer: 'Yes, from the partner details page, click the edit button to modify partner information. Make sure to save your changes.',
                },
            ],
        },
        {
            category: 'User Management',
            icon: <Users className="w-5 h-5" />,
            questions: [
                {
                    id: 14,
                    question: 'How do I manage users?',
                    answer: 'Navigate to the Users page where you can view all system users, add new users, edit user information, and manage user roles and statuses.',
                },
                {
                    id: 15,
                    question: 'What are user roles?',
                    answer: 'User roles define what actions a user can perform in the system. Different roles have different permissions. Visit the Roles & Statuses page to manage these.',
                },
                {
                    id: 16,
                    question: 'How do I update my profile?',
                    answer: 'Click on your profile avatar in the sidebar to access your profile page. You can update your personal information, change your password, and upload a profile picture.',
                },
            ],
        },
    ];

    const contactInfo = {
        email: 'support@finetica.com',
        phone: '+123 456 7890',
        hours: 'Monday - Friday, 9:00 AM - 5:00 PM',
    };

    const filteredFaqCategories = searchQuery
        ? faqCategories.map((category) => ({
            ...category,
            questions: category.questions.filter(
                (q) =>
                    q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    q.answer.toLowerCase().includes(searchQuery.toLowerCase())
            ),
        })).filter((category) => category.questions.length > 0)
        : faqCategories;

    return (
        <div className="container mx-auto py-8 px-4 max-w-7xl">
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


            {/* Search Bar */}
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

                {/* FAQ Tab */}
                <TabsContent value="faq" className="space-y-6">
                    {filteredFaqCategories.length === 0 ? (
                        <Card>
                            <CardContent className="pt-6">
                                <div className="text-center py-8">
                                    <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                    <p className="text-muted-foreground">
                                        No results found for "{searchQuery}". Try a different search term.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        filteredFaqCategories.map((category) => (
                            <Card key={category.category} className="shadow-md">
                                <CardHeader>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-spurple/10 rounded-lg text-spurple">
                                            {category.icon}
                                        </div>
                                        <CardTitle className="text-xl">{category.category}</CardTitle>
                                        <Badge variant="secondary" className="ml-auto">
                                            {category.questions.length} questions
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    {category.questions.map((faq) => (
                                        <Collapsible
                                            key={faq.id}
                                            open={expandedFaq === faq.id}
                                            onOpenChange={(isOpen) =>
                                                setExpandedFaq(isOpen ? faq.id : null)
                                            }
                                        >
                                            <CollapsibleTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    className="w-full justify-between p-4 h-auto text-left hover:bg-muted/50"
                                                >
                                                    <span className="font-medium">{faq.question}</span>
                                                    <HelpCircle
                                                        className={`w-5 h-5 text-muted-foreground transition-transform ${expandedFaq === faq.id ? 'rotate-180' : ''
                                                            }`}
                                                    />
                                                </Button>
                                            </CollapsibleTrigger>
                                            <CollapsibleContent className="px-4 pb-4">
                                                <p className="text-muted-foreground leading-relaxed">
                                                    {faq.answer}
                                                </p>
                                            </CollapsibleContent>
                                        </Collapsible>
                                    ))}
                                </CardContent>
                            </Card>
                        ))
                    )}
                </TabsContent>

                {/* Contact Tab */}
                <TabsContent value="contact" className="space-y-6">
                    <Card className="shadow-md">
                        <CardHeader>
                            <CardTitle className="text-2xl">Contact Support</CardTitle>
                            <CardDescription>
                                Need more help? Our support team is here to assist you
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="flex items-start gap-4 p-4 rounded-lg border bg-card">
                                    <div className="p-3 bg-spurple/10 rounded-lg text-spurple">
                                        <Mail className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-1">Email Support</h3>
                                        <p className="text-sm text-muted-foreground mb-2">
                                            Send us an email and we'll respond within 24 hours
                                        </p>
                                        <a
                                            href={`mailto:${contactInfo.email}`}
                                            className="text-spurple hover:underline text-sm font-medium"
                                        >
                                            {contactInfo.email}
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 p-4 rounded-lg border bg-card">
                                    <div className="p-3 bg-spurple/10 rounded-lg text-spurple">
                                        <Phone className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-1">Phone Support</h3>
                                        <p className="text-sm text-muted-foreground mb-2">
                                            Call us during business hours
                                        </p>
                                        <a
                                            href={`tel:${contactInfo.phone}`}
                                            className="text-spurple hover:underline text-sm font-medium"
                                        >
                                            {contactInfo.phone}
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 bg-muted rounded-lg">
                                <h3 className="font-semibold mb-2">Business Hours</h3>
                                <p className="text-sm text-muted-foreground">{contactInfo.hours}</p>
                            </div>

                            <div className="border-t pt-6">
                                <h3 className="font-semibold mb-4">Send us a message</h3>
                                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                                    <div>
                                        <Input placeholder="Your Name" />
                                    </div>
                                    <div>
                                        <Input type="email" placeholder="Your Email" />
                                    </div>
                                    <div>
                                        <Input placeholder="Subject" />
                                    </div>
                                    <div>
                                        <textarea
                                            className="w-full min-h-[120px] px-3 py-2 text-sm border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                                            placeholder="Your message..."
                                        />
                                    </div>
                                    <Button className="bg-spurple text-white hover:bg-spurple/90 w-full">
                                        Send Message
                                    </Button>
                                </form>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <AddFaqModal
                open={addFaqOpen}
                onOpenChange={setAddFaqOpen}
            />
        </div>
    );
};

export default HelpPage;
