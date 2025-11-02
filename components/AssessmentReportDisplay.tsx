import React, { useRef, useState } from 'react';
import { GeneratedAssessmentReport } from '../types';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { BoltIcon } from './icons/BoltIcon';
import { DollarIcon } from './icons/DollarIcon';
import { HomeIcon } from './icons/HomeIcon';
import { LeafIcon } from './icons/LeafIcon';

// Declare global libraries loaded from script tags for TypeScript
declare const jspdf: any;
declare const html2canvas: any;

interface AssessmentReportDisplayProps {
  report: GeneratedAssessmentReport;
  onBack: () => void;
}

const InfoRow: React.FC<{ label: string; value: string | number; unit?: string; highlight?: boolean }> = ({ label, value, unit, highlight = false }) => (
    <div className="flex justify-between items-center py-2.5 border-b border-border dark:border-solar-gray/50">
        <span className="text-muted-foreground dark:text-gray-300">{label}</span>
        <span className={`font-bold text-lg ${highlight ? 'text-primary dark:text-solar-gold' : 'text-foreground dark:text-white'}`}>{value} {unit}</span>
    </div>
);

export const AssessmentReportDisplay: React.FC<AssessmentReportDisplayProps> = ({ report, onBack }) => {
    const { formData, reportData } = report;
    const { analysis, financials, enhancementPotential, summary } = reportData;
    const reportContentRef = useRef<HTMLDivElement>(null);
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

    const handleGeneratePdf = () => {
        const input = reportContentRef.current;
        if (!input) return;

        setIsGeneratingPdf(true);
        
        const { jsPDF } = jspdf;

        html2canvas(input, {
            scale: 2,
            backgroundColor: document.documentElement.classList.contains('dark') ? '#212121' : '#ffffff',
            useCORS: true,
        }).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'p',
                unit: 'mm',
                format: 'a4'
            });

            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            
            let heightLeft = pdfHeight;
            let position = 0;
            const pageHeight = pdf.internal.pageSize.getHeight();

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            heightLeft -= pageHeight;

            while (heightLeft > 0) {
                position = position - pageHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
                heightLeft -= pageHeight;
            }
            
            pdf.save(`Quotation-${formData.clientName.replace(/\s/g, '_') || 'Assessment'}.pdf`);
            setIsGeneratingPdf(false);
        }).catch(err => {
            console.error("Error generating PDF:", err);
            alert("Sorry, an error occurred while generating the PDF.");
            setIsGeneratingPdf(false);
        });
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-primary dark:text-solar-gold font-display">On-Site Assessment Report</h1>
                    <p className="text-muted-foreground dark:text-gray-300">Prepared for: <span className="font-semibold text-foreground dark:text-white">{formData.clientName}</span></p>
                </div>
                <Button onClick={onBack} variant="secondary">Back to Form</Button>
            </div>

            <div ref={reportContentRef} className="space-y-6">
                <Card title="Key Recommendations">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                        <div>
                            <BoltIcon className="w-12 h-12 mx-auto text-primary dark:text-solar-gold mb-2"/>
                            <p className="text-muted-foreground dark:text-gray-400">Recommended Capacity</p>
                            <p className="text-3xl font-bold text-foreground dark:text-white">{analysis.recommendedCapacity.toFixed(1)} <span className="text-xl">kW</span></p>
                        </div>
                         <div>
                            <DollarIcon className="w-12 h-12 mx-auto text-accent dark:text-deep-green mb-2"/>
                            <p className="text-muted-foreground dark:text-gray-400">Est. Monthly Savings</p>
                            <p className="text-3xl font-bold text-foreground dark:text-white">₹{financials.monthlySavings.toLocaleString('en-IN')}</p>
                        </div>
                         <div>
                            <HomeIcon className="w-12 h-12 mx-auto text-blue-500 dark:text-blue-400 mb-2"/>
                            <p className="text-muted-foreground dark:text-gray-400">Payback Period</p>
                            <p className="text-3xl font-bold text-foreground dark:text-white">{financials.paybackPeriod.toFixed(1)} <span className="text-xl">Years</span></p>
                        </div>
                    </div>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card title="Technical Analysis">
                        <InfoRow label="Permitted Capacity (by CMD)" value={analysis.permittedCapacityCMD.toFixed(1)} unit="kW" />
                        <InfoRow label="Permitted Capacity (by Space)" value={analysis.permittedCapacitySpace.toFixed(1)} unit="kW" />
                        <InfoRow label="Final Recommended Capacity" value={analysis.recommendedCapacity.toFixed(1)} unit="kW" highlight />
                        <InfoRow label="Estimated Annual Generation" value={analysis.annualGeneration.toLocaleString('en-IN')} unit="kWh" />
                    </Card>

                    <Card title="Financial Projection">
                        <InfoRow label="Estimated System Cost" value={`₹${financials.estimatedSystemCost.toLocaleString('en-IN')}`} />
                        <InfoRow label="Financing Option" value={financials.loanType} />
                        {financials.advancePayment > 0 && <InfoRow label="Upfront Advance" value={`₹${financials.advancePayment.toLocaleString('en-IN')}`} />}
                        <InfoRow label="Monthly EMI" value={`₹${financials.monthlyEMI.toLocaleString('en-IN')}`} />
                        <InfoRow label="Interest Rate" value={financials.interestRate} />
                    </Card>
                </div>

                {enhancementPotential.isEnhancementPossible && (
                    <Card title="Capacity Enhancement Potential">
                        <div className="flex items-center p-4 bg-green-50 dark:bg-deep-green/10 border-l-4 border-accent dark:border-deep-green rounded-lg">
                            <LeafIcon className="w-10 h-10 text-accent dark:text-deep-green mr-4"/>
                            <div>
                                <h4 className="font-bold text-lg text-foreground dark:text-white">Unlock Greater Savings!</h4>
                                <p className="text-muted-foreground dark:text-gray-300">{enhancementPotential.recommendationText}</p>
                            </div>
                        </div>
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-x-6">
                            <InfoRow label="Potential Capacity with Full Space" value={enhancementPotential.potentialCapacity.toFixed(1)} unit="kW"/>
                            <InfoRow label="Est. Cost for CMD Enhancement" value={`₹${enhancementPotential.estimatedCMDCost.toLocaleString('en-IN')}`}/>
                            {enhancementPotential.transformerUpgradeRequired && <p className="text-red-500 dark:text-red-400 mt-2 col-span-2">Warning: The current transformer may need an upgrade to support this enhanced capacity.</p>}
                        </div>
                    </Card>
                )}

                <Card title="Summary & Next Steps">
                    <p className="text-muted-foreground dark:text-gray-300 whitespace-pre-wrap">{summary.conclusion}</p>
                </Card>
            </div>

             <div className="text-center pt-4">
                <Button onClick={handleGeneratePdf} disabled={isGeneratingPdf}>
                    {isGeneratingPdf ? 'Generating...' : 'Generate Quotation'}
                </Button>
            </div>
        </div>
    );
};
