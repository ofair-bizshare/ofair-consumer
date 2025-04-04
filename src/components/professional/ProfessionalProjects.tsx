
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  location: string;
}

interface ProfessionalProjectsProps {
  projects: Project[];
}

const ProfessionalProjects: React.FC<ProfessionalProjectsProps> = ({ projects }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {projects.map((project) => (
        <Card key={project.id} className="overflow-hidden shadow-md hover:shadow-lg transition-shadow border-blue-100">
          <div className="aspect-video overflow-hidden rounded-t-lg relative">
            <img src={project.image} alt={project.title} className="object-cover w-full h-full transition-transform hover:scale-105 duration-300" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-3 right-3 text-white">
              <h3 className="text-lg font-medium drop-shadow-md">{project.title}</h3>
              <div className="flex items-center text-sm text-blue-50">
                <MapPin className="h-3 w-3 ml-1" />
                <span>{project.location}</span>
              </div>
            </div>
          </div>
          <CardContent className="pt-4">
            <p className="text-sm text-gray-600">{project.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ProfessionalProjects;
