import React from 'react';
import { Card } from './ui/Card';
import { CalendarIcon } from './icons/CalendarIcon';

type ProjectStatus = 'Planning & Design' | 'Procurement' | 'Installation' | 'Commissioning' | 'Completed';

interface Project {
  id: number;
  clientName: string;
  capacity: number;
  status: ProjectStatus;
  assignedTo: string;
  dueDate: string;
  progress: number;
}

const mockProjects: Project[] = [
  { id: 1, clientName: 'Phoenix Industries', capacity: 150, status: 'Planning & Design', assignedTo: 'Team Alpha', dueDate: '2024-08-15', progress: 15 },
  { id: 2, clientName: 'Global Exports', capacity: 200, status: 'Procurement', assignedTo: 'Team Bravo', dueDate: '2024-08-20', progress: 40 },
  { id: 3, clientName: 'Sunrise Textiles', capacity: 75, status: 'Installation', assignedTo: 'Team Alpha', dueDate: '2024-07-30', progress: 65 },
  { id: 4, clientName: 'Evergreen Logistics', capacity: 300, status: 'Commissioning', assignedTo: 'Team Charlie', dueDate: '2024-07-25', progress: 90 },
  { id: 5, clientName: 'Quantum Solutions', capacity: 120, status: 'Completed', assignedTo: 'Team Bravo', dueDate: '2024-06-10', progress: 100 },
  { id: 6, clientName: 'Meridian Foods', capacity: 90, status: 'Planning & Design', assignedTo: 'Team Charlie', dueDate: '2024-09-01', progress: 10 },
  { id: 7, clientName: 'Apex Pharmaceuticals', capacity: 250, status: 'Installation', assignedTo: 'Team Bravo', dueDate: '2024-08-05', progress: 75 },
  { id: 8, clientName: 'Starlight Hotels', capacity: 180, status: 'Completed', assignedTo: 'Team Alpha', dueDate: '2024-07-01', progress: 100 },
];

const columns: { title: ProjectStatus; color: string; darkColor: string; }[] = [
    { title: 'Planning & Design', color: 'border-blue-500', darkColor: 'dark:border-blue-400' },
    { title: 'Procurement', color: 'border-purple-500', darkColor: 'dark:border-purple-400' },
    { title: 'Installation', color: 'border-orange-500', darkColor: 'dark:border-orange-400' },
    { title: 'Commissioning', color: 'border-yellow-500', darkColor: 'dark:border-yellow-400' },
    { title: 'Completed', color: 'border-green-500', darkColor: 'dark:border-green-400' },
];

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => (
    <div className="bg-card dark:bg-solar-gray p-4 rounded-lg shadow-md mb-4 border border-border dark:border-charcoal-gray">
        <div className="flex justify-between items-start">
            <h4 className="font-bold text-foreground dark:text-white">{project.clientName}</h4>
            <span className="text-xs font-semibold bg-primary/20 dark:bg-solar-gold/20 text-primary dark:text-solar-gold px-2 py-1 rounded-full">{project.capacity} kW</span>
        </div>
        <p className="text-sm text-muted-foreground dark:text-gray-400 mt-1">Assigned to: {project.assignedTo}</p>
        <div className="flex items-center text-xs text-muted-foreground dark:text-gray-400 mt-3">
            <CalendarIcon className="w-4 h-4 mr-1.5"/>
            <span>Due: {project.dueDate}</span>
        </div>
        <div className="mt-3">
            <div className="w-full bg-secondary dark:bg-charcoal-gray rounded-full h-2">
                <div className="bg-accent dark:bg-deep-green h-2 rounded-full" style={{ width: `${project.progress}%` }}></div>
            </div>
            <p className="text-xs text-right mt-1 text-muted-foreground dark:text-gray-400">{project.progress}% Complete</p>
        </div>
    </div>
);

export const ProjectTracker: React.FC = () => {
  return (
    <div className="space-y-6">
        <h1 className="text-3xl font-bold font-display text-primary dark:text-solar-gold">Project Tracker</h1>
        <div className="flex overflow-x-auto space-x-4 pb-4">
            {columns.map(column => {
                const projectsInColumn = mockProjects.filter(p => p.status === column.title);
                return (
                    <div key={column.title} className="flex-shrink-0 w-72 bg-secondary dark:bg-solar-black/50 rounded-xl p-3">
                        <div className={`px-2 pb-2 mb-3 border-b-2 ${column.color} ${column.darkColor} flex justify-between items-center`}>
                           <h3 className="font-semibold text-foreground dark:text-white">{column.title}</h3>
                           <span className="text-sm font-bold bg-gray-200 dark:bg-charcoal-gray text-muted-foreground dark:text-gray-300 rounded-full w-6 h-6 flex items-center justify-center">{projectsInColumn.length}</span>
                        </div>
                        <div className="overflow-y-auto max-h-[calc(100vh-250px)] pr-2">
                            {projectsInColumn.map(project => (
                                <ProjectCard key={project.id} project={project} />
                            ))}
                        </div>
                    </div>
                )
            })}
        </div>
    </div>
  );
};