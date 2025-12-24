import React, { useState } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const EditPartner = () => {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = 1;

    const [data, setData] = useState({
        name: 'Cloud Services Inc.',
        shortName: 'CSI',
        countryCode: 'US',
        vatNumber: 'US123456789',
        taxId: '98-7654321',
        registrationNumber: 'C1234567',
        vatRegistered: 'false',
        address: '123 Cloud Way',
        city: 'Techville',
        postalCode: '94043',
        email: 'billing@cloudservices.com',
        phone: '+16505550100',
        iban: 'US64SVBKUS6S33161517',
        bankName: 'Silicon Valley Bank',
        swiftCode: 'SVBKUS6S',
        defaultCurrency: 'USD',
        languageCode: 'en',
        paymentTerms: '30',
        status: 'true',
    });

    const handleChange = (key, value) => {
        setData(prev => ({ ...prev, [key]: value }));
    };

    const fields = [
        ['Name', 'name'],
        ['Short Name', 'shortName'],
        ['Country Code', 'countryCode'],
        ['VAT Number', 'vatNumber'],
        ['Tax ID', 'taxId'],
        ['Registration Number', 'registrationNumber'],
        ['VAT Registered', 'vatRegistered'],
        ['Address', 'address'],
        ['City', 'city'],
        ['Postal Code', 'postalCode'],
        ['Email', 'email'],
        ['Phone', 'phone'],
        ['IBAN', 'iban'],
        ['Bank Name', 'bankName'],
        ['SWIFT Code', 'swiftCode'],
        ['Default Currency', 'defaultCurrency'],
        ['Language Code', 'languageCode'],
        ['Payment Terms', 'paymentTerms'],
        ['Status', 'status'],
    ];

    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                <Button
                    variant="outline"
                    className="gap-2"
                    onClick={() => navigate('/partners/')}
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Partners
                </Button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <span>📄</span>
                                Business Partner Information
                            </CardTitle>
                        </CardHeader>

                        <CardContent>
                            <div className="space-y-3">
                                {fields.map(([label, key]) => (
                                    <div
                                        key={key}
                                        className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-3 rounded-lg bg-secondary/50"
                                    >
                                        <Label className="font-semibold text-sm sm:min-w-[140px]">
                                            {label}:
                                        </Label>
                                        <Input value={data[key]} onChange={e => handleChange(key, e.target.value)} className="w-full sm:flex-1 bg-background" />
                                    </div>
                                ))}
                            </div>

                            <div className="flex gap-3 mt-6 pt-4 border-t">
                                <Button className="text-white bg-spurple">Save</Button>
                                <Button variant="outline" onClick={() => navigate('/partners/')}>Cancel</Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <span>📝</span>
                                Edit Document
                            </CardTitle>
                        </CardHeader>

                        <CardContent>
                            <div className="bg-muted/30 rounded-lg p-8 min-h-[600px] flex flex-col">
                                <div className="flex-1 space-y-4">
                                    <h2 className="text-3xl font-light text-foreground/80">Sample PDF</h2>
                                    <p className="italic text-foreground/60">This is a simple PDF file. Fun fun fun.</p>
                                </div>

                                <div className="flex items-center justify-center gap-2 pt-4 mt-4 border-t">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={currentPage === 1}
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    >
                                        <ChevronLeft className="w-4 h-4 mr-1" />
                                        Previous
                                    </Button>

                                    <span className="text-sm text-muted-foreground px-3">
                                        Page {currentPage} of {totalPages}
                                    </span>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={currentPage === totalPages}
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    >
                                        Next
                                        <ChevronRight className="w-4 h-4 ml-1" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default EditPartner;