import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';

const FaqCategoryCard = ({ title, icon, questions, expandedFaqId, onToggle }) => {
    return (
        <Card className="shadow-md">
            <CardHeader>
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-spurple/10 rounded-lg text-spurple">
                        {icon}
                    </div>
                    <CardTitle className="text-xl">{title}</CardTitle>
                    <Badge variant="secondary" className="ml-auto">
                        {questions.length} questions
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-2">
                {questions.map((faq) => (
                    <Collapsible
                        key={faq.id}
                        open={expandedFaqId === faq.id}
                        onOpenChange={(isOpen) => onToggle(isOpen ? faq.id : null)}
                    >
                        <CollapsibleTrigger asChild>
                            <Button
                                variant="ghost"
                                className="w-full justify-between p-4 h-auto text-left hover:bg-muted/50"
                            >
                                <span className="font-medium">{faq.question}</span>
                                <HelpCircle
                                    className={`w-5 h-5 text-muted-foreground transition-transform duration-200 ${expandedFaqId === faq.id ? 'rotate-180' : ''
                                        }`}
                                />
                            </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="px-4 pb-4 animate-accordion-down">
                            <p className="text-muted-foreground leading-relaxed">
                                {faq.answer}
                            </p>
                        </CollapsibleContent>
                    </Collapsible>
                ))}
            </CardContent>
        </Card>
    );
};

export default FaqCategoryCard;