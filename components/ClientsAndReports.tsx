import React, { useState, useMemo } from 'react';
import { GeneratedReport } from '../types';
import { Card } from './ui/Card';
import { Input } from './ui/Input';
import { Button } from './ui/Button';

interface ClientsAndReportsProps {
  reports: GeneratedReport[];
  onViewReport: (report: GeneratedReport) => void;
}

export const ClientsAndReports: React.FC<ClientsAndReportsProps> = ({ reports, onViewReport }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredReports = useMemo(() => {
    return reports.filter(r => 
      r.formData.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.formData.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [reports, searchTerm]);

  return (
    <Card title="Clients & Reports">
      <div className="mb-4">
        <Input 
          label="Search by Client or Location" 
          name="search"
          placeholder="Start typing to search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-muted-foreground dark:text-gray-300">
          <thead className="bg-secondary dark:bg-charcoal-gray text-xs text-primary dark:text-solar-gold uppercase">
            <tr>
              <th className="p-3">Client Name</th>
              <th className="p-3">Location</th>
              <th className="p-3 text-center">Capacity (kW)</th>
              <th className="p-3 text-center">ROI (%)</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.length > 0 ? filteredReports.map((report, index) => (
              <tr key={index} className="border-b border-border dark:border-solar-gray hover:bg-secondary dark:hover:bg-charcoal-gray/50">
                <td className="p-3 font-medium text-foreground dark:text-white">{report.formData.companyName}</td>
                <td className="p-3">{report.formData.location}</td>
                <td className="p-3 text-center">{report.formData.plantCapacity}</td>
                <td className="p-3 text-center text-accent dark:text-deep-green font-bold">{report.reportData?.financialSummary?.roi?.toFixed(1) || 'N/A'}%</td>
                <td className="p-3 text-center">
                  <Button onClick={() => onViewReport(report)} variant="secondary" className="py-1 px-3 text-xs">
                    View Report
                  </Button>
                </td>
              </tr>
            )) : (
                <tr>
                    <td colSpan={5} className="text-center p-6 text-muted-foreground dark:text-gray-500">
                        {reports.length === 0 ? "No reports generated yet." : "No reports match your search."}
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
