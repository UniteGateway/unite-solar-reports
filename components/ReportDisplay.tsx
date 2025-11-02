import React, { useRef, useState } from 'react';
import { ReportData, FeasibilityFormData } from '../types';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { SunIcon } from './icons/SunIcon';
import { DollarIcon } from './icons/DollarIcon';
import { LeafIcon } from './icons/LeafIcon';
import { BoltIcon } from './icons/BoltIcon';

// Declare global libraries loaded from script tags for TypeScript
declare const jspdf: any;
declare const html2canvas: any;

interface ReportDisplayProps {
  reportData: ReportData;
  formData: FeasibilityFormData;
  onBack: () => void;
}

const InfoItem: React.FC<{ label: string; value: string | number; unit?: string }> = ({ label, value, unit }) => (
    <div className="flex justify-between py-2 border-b border-secondary dark:border-solar-gray/50">
        <span className="text-muted-foreground dark:text-gray-400">{label}</span>
        <span className="font-semibold text-foreground dark:text-white">{value} {unit}</span>
    </div>
);

export const ReportDisplay: React.FC<ReportDisplayProps> = ({ reportData, formData, onBack }) => {
    const {
        projectOverview,
        energyGeneration,
        spaceRequirement,
        systemComponents,
        warrantiesAndAmc,
        technicalCompliance,
        financialSummary,
        environmentalBenefits,
        executionSchedule,
        conclusion,
    } = reportData;
    
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
            
            pdf.save(`Feasibility-Report-${formData.companyName.replace(/\s/g, '_')}.pdf`);
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
                    <h1 className="text-3xl font-bold text-primary dark:text-solar-gold font-display">Solar Feasibility Report</h1>
                    <p className="text-muted-foreground dark:text-gray-300">Prepared for: <span className="font-semibold text-foreground dark:text-white">{projectOverview.client}</span></p>
                </div>
                <Button onClick={onBack} variant="secondary">Back to Form</Button>
            </div>

            <div ref={reportContentRef} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card title="Capacity" className="text-center"><p className="text-4xl font-bold text-foreground dark:text-white">{projectOverview.capacity}<span className="text-xl"> kW</span></p></Card>
                    <Card title="Annual Savings" className="text-center"><p className="text-4xl font-bold text-accent dark:text-deep-green">₹{financialSummary.annualSavings.toLocaleString('en-IN')}</p></Card>
                    <Card title="Payback Period" className="text-center"><p className="text-4xl font-bold text-foreground dark:text-white">{financialSummary.paybackPeriod.toFixed(1)}<span className="text-xl"> Yrs</span></p></Card>
                    <Card title="ROI" className="text-center"><p className="text-4xl font-bold text-accent dark:text-deep-green">{financialSummary.roi.toFixed(1)}<span className="text-xl"> %</span></p></Card>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <Card title="Project Overview">
                            <InfoItem label="Client" value={projectOverview.client} />
                            <InfoItem label="Location" value={projectOverview.location} />
                            <InfoItem label="Proposed Capacity" value={projectOverview.capacity} unit="kW" />
                            <InfoItem label="Installation Type" value={projectOverview.installationType} />
                            <InfoItem label="Operation Mode" value={formData.operationMode} />
                        </Card>
                        <Card title="Financial Summary">
                            <InfoItem label="Estimated Project Cost" value={`₹${financialSummary.estimatedCost.toLocaleString('en-IN')}`} />
                            <InfoItem label="Estimated Annual Savings" value={`₹${financialSummary.annualSavings.toLocaleString('en-IN')}`} />
                            <InfoItem label="Return on Investment (ROI)" value={financialSummary.roi.toFixed(1)} unit="%" />
                            <InfoItem label="Payback Period" value={financialSummary.paybackPeriod.toFixed(1)} unit="Years" />
                        </Card>
                    </div>

                    <div className="space-y-6">
                         <Card title="Energy Generation">
                            <div className="flex items-center space-x-4">
                                <SunIcon className="w-10 h-10 text-primary dark:text-solar-gold"/>
                                <div>
                                    <p className="text-lg font-bold text-foreground dark:text-white">{energyGeneration.annualGeneration.toLocaleString('en-IN')} kWh</p>
                                    <p className="text-sm text-muted-foreground dark:text-gray-400">Estimated Annual Generation</p>
                                </div>
                            </div>
                         </Card>
                         <Card title="Environmental Benefits">
                             <div className="flex items-center space-x-4 mb-4">
                                <LeafIcon className="w-10 h-10 text-accent dark:text-deep-green"/>
                                <div>
                                    <p className="text-lg font-bold text-foreground dark:text-white">{environmentalBenefits.co2Reduction.toFixed(2)} Tonnes/Year</p>
                                    <p className="text-sm text-muted-foreground dark:text-gray-400">CO₂ Reduction</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <span className="text-4xl">🌳</span>
                                <div>
                                    <p className="text-lg font-bold text-foreground dark:text-white">{Math.round(environmentalBenefits.treesEquivalent)} Trees</p>
                                    <p className="text-sm text-muted-foreground dark:text-gray-400">Equivalent Trees Planted</p>
                                </div>
                            </div>
                         </Card>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Card title="System Components">
                        <InfoItem label="Modules" value={systemComponents.modules} />
                        <InfoItem label="Inverter" value={systemComponents.inverter} />
                        <InfoItem label="Structure" value={systemComponents.structure} />
                        <InfoItem label="Space Required" value={spaceRequirement.area.toLocaleString('en-IN')} unit="sq. ft." />
                    </Card>
                    <Card title="Warranties & AMC">
                        <InfoItem label="Module Warranty" value={warrantiesAndAmc.moduleWarranty} />
                        <InfoItem label="Inverter Warranty" value={warrantiesAndAmc.inverterWarranty} />
                        <InfoItem label="AMC" value={warrantiesAndAmc.amc} />
                    </Card>
                    <Card title="Execution Schedule">
                         <InfoItem label="Design & Engineering" value={executionSchedule.designAndEngineering} />
                         <InfoItem label="Procurement" value={executionSchedule.procurement} />
                         <InfoItem label="Installation" value={executionSchedule.installation} />
                         <InfoItem label="Commissioning" value={executionSchedule.commissioning} />
                    </Card>
                </div>
                
                <Card title="Conclusion">
                    <p className="text-muted-foreground dark:text-gray-300 whitespace-pre-wrap">{conclusion}</p>
                </Card>

                <Card title="Technical Compliance">
                    <ul className="list-disc list-inside grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                        {technicalCompliance.map(item => <li key={item}>{item}</li>)}
                    </ul>
                </Card>
            </div>


            <div className="text-center pt-4">
                <Button onClick={handleGeneratePdf} disabled={isGeneratingPdf}>
                    {isGeneratingPdf ? 'Downloading...' : 'Download as PDF'}
                </Button>
            </div>
        </div>
    );
};
