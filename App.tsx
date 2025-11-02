import React, { useState, useEffect } from 'react';
import { Login } from './components/Login';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { Dashboard } from './components/Dashboard';
import { FeasibilityForm } from './components/FeasibilityForm';
import { ReportDisplay } from './components/ReportDisplay';
import { ClientsAndReports } from './components/ClientsAndReports';
import { AssessmentForm } from './components/AssessmentForm';
import { AssessmentReportDisplay } from './components/AssessmentReportDisplay';
import { RoiCalculator } from './components/RoiCalculator';
import { ProjectTracker } from './components/ProjectTracker';
import { FranchiseMgt } from './components/FranchiseMgt';
import { BioCngHybrid } from './components/BioCngHybrid';
import { Footer } from './components/Footer';
import { AiAssistant } from './components/AiAssistant';
import { User, Page, FeasibilityFormData, GeneratedReport, AssessmentFormData, GeneratedAssessmentReport } from './types';
import { generateFeasibilityReport, generateAssessmentReport } from './services/geminiService';
import { SparklesIcon } from './components/icons/SparklesIcon';

const LoadingSpinner: React.FC<{ message: string }> = ({ message }) => (
    <div className="flex flex-col items-center justify-center h-full text-center text-foreground dark:text-white p-6">
        <svg className="animate-spin-slow h-16 w-16 text-primary dark:text-solar-gold" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="mt-4 text-xl font-semibold font-display">{message}</p>
        <p className="text-sm text-muted-foreground dark:text-gray-400 max-w-md">Our AI is performing complex calculations and analyzing data to build your comprehensive report. This may take a moment.</p>
    </div>
);


const App: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [currentPage, setCurrentPage] = useState<Page>('dashboard');
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [theme, setTheme] = useState<'light' | 'dark'>('dark');

    // State for Feasibility Reports
    const [generatedReports, setGeneratedReports] = useState<GeneratedReport[]>([]);
    const [currentReport, setCurrentReport] = useState<GeneratedReport | null>(null);

    // State for Assessment Reports
    const [generatedAssessmentReports, setGeneratedAssessmentReports] = useState<GeneratedAssessmentReport[]>([]);
    const [currentAssessmentReport, setCurrentAssessmentReport] = useState<GeneratedAssessmentReport | null>(null);

    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [error, setError] = useState<string | null>(null);
    
    const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
    
    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(theme);
    }, [theme]);

    const handleLogin = (loggedInUser: User) => {
        setUser(loggedInUser);
        setCurrentPage('dashboard');
    };

    const handleLogout = () => {
        setUser(null);
    };

    const handleGenerateReport = async (formData: FeasibilityFormData) => {
        setIsLoading(true);
        setLoadingMessage('Generating Your Feasibility Report...');
        setError(null);
        setCurrentPage('reportDisplay');
        try {
            const reportData = await generateFeasibilityReport(formData);
            const newReport: GeneratedReport = { formData, reportData };
            setGeneratedReports(prev => [...prev, newReport]);
            setCurrentReport(newReport);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
            setError(`Failed to generate report: ${errorMessage}`);
            console.error(err);
            setCurrentReport(null);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGenerateAssessment = async (formData: AssessmentFormData) => {
        setIsLoading(true);
        setLoadingMessage('Generating Your Assessment Report...');
        setError(null);
        setCurrentPage('assessmentReportDisplay');
        try {
            const reportData = await generateAssessmentReport(formData);
            const newReport: GeneratedAssessmentReport = { formData, reportData };
            setGeneratedAssessmentReports(prev => [...prev, newReport]);
            setCurrentAssessmentReport(newReport);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
            setError(`Failed to generate assessment: ${errorMessage}`);
            console.error(err);
            setCurrentAssessmentReport(null);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleViewReport = (report: GeneratedReport) => {
        setCurrentReport(report);
        setCurrentPage('reportDisplay');
    };

    const renderPage = () => {
        if (isLoading) {
            return <LoadingSpinner message={loadingMessage} />;
        }
        
        if (error && (currentPage === 'reportDisplay' || currentPage === 'assessmentReportDisplay')) {
            return (
                <div className="text-center text-red-500 dark:text-red-400 bg-red-100 dark:bg-solar-gray p-8 rounded-lg">
                    <h2 className="text-2xl mb-4 font-bold font-display">Report Generation Failed</h2>
                    <p>{error}</p>
                    <button onClick={() => { 
                        const prevPage = currentPage === 'reportDisplay' ? 'generator' : 'assessment';
                        setCurrentPage(prevPage); 
                        setError(null); 
                    }} className="mt-6 bg-primary dark:bg-solar-gold text-primary-foreground dark:text-solar-black font-bold py-2 px-6 rounded-lg transition hover:bg-yellow-400">
                        Try Again
                    </button>
                </div>
            )
        }
        
        switch (currentPage) {
            case 'dashboard':
                return <Dashboard setCurrentPage={setCurrentPage} reportCount={generatedReports.length} theme={theme} />;
            case 'generator':
                return <FeasibilityForm onSubmit={handleGenerateReport} />;
            case 'assessment':
                return <AssessmentForm onSubmit={handleGenerateAssessment} />;
            case 'clients':
                return <ClientsAndReports reports={generatedReports} onViewReport={handleViewReport} />;
            case 'reportDisplay':
                if (currentReport) {
                    return <ReportDisplay reportData={currentReport.reportData} formData={currentReport.formData} onBack={() => setCurrentPage('generator')} />;
                }
                setCurrentPage('generator');
                return null;
            case 'assessmentReportDisplay':
                if (currentAssessmentReport) {
                    return <AssessmentReportDisplay report={currentAssessmentReport} onBack={() => setCurrentPage('assessment')} />;
                }
                setCurrentPage('assessment');
                return null;
            case 'roi-calculator':
                return <RoiCalculator />;
            case 'project-tracker':
                return <ProjectTracker />;
            case 'franchise':
                return <FranchiseMgt />;
            case 'bio-cng':
                return <BioCngHybrid />;
            default:
                return <Dashboard setCurrentPage={setCurrentPage} reportCount={generatedReports.length} theme={theme} />;
        }
    };

    if (!user) {
        return <Login onLogin={handleLogin} />;
    }

    return (
        <div className="flex h-screen bg-background dark:bg-solar-black text-foreground dark:text-white font-sans">
            <Sidebar
                isCollapsed={isSidebarCollapsed}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                onLogout={handleLogout}
            />
            <div className="flex flex-col flex-grow min-w-0">
                <TopBar user={user} onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} theme={theme} setTheme={setTheme} />
                <main className="flex-grow p-4 sm:p-6 lg:p-8 overflow-y-auto">
                    {renderPage()}
                </main>
                <Footer />
            </div>
            
            <div className="fixed bottom-6 right-6 z-50">
                <button 
                    onClick={() => setIsAiAssistantOpen(!isAiAssistantOpen)}
                    className="bg-accent dark:bg-deep-green text-accent-foreground dark:text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background dark:ring-offset-solar-black focus:ring-primary dark:focus:ring-solar-gold"
                    aria-label="Toggle AI Assistant"
                    title="AI Assistant"
                >
                    <SparklesIcon className="w-8 h-8"/>
                </button>
            </div>

            <AiAssistant
                isOpen={isAiAssistantOpen}
                onClose={() => setIsAiAssistantOpen(false)}
                reportContext={currentReport}
            />
        </div>
    );
};

export default App;
