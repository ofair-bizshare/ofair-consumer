
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProfessionalProjects from './ProfessionalProjects';
import ProfessionalReviews from './ProfessionalReviews';

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  location: string;
}

interface Review {
  id: number;
  author: string;
  rating: number;
  date: string;
  comment: string;
}

interface ProfessionalTabsProps {
  projects: Project[];
  reviews: Review[];
}

const ProfessionalTabs: React.FC<ProfessionalTabsProps> = ({ projects, reviews }) => {
  return (
    <Tabs defaultValue="projects" className="w-full mb-6">
      <TabsList className="w-full bg-blue-50">
        <TabsTrigger value="projects" className="flex-1 data-[state=active]:bg-white data-[state=active]:text-blue-700">עבודות אחרונות</TabsTrigger>
        <TabsTrigger value="reviews" className="flex-1 data-[state=active]:bg-white data-[state=active]:text-blue-700">ביקורות</TabsTrigger>
      </TabsList>
      
      <TabsContent value="projects" className="mt-4">
        <ProfessionalProjects projects={projects} />
      </TabsContent>
      
      <TabsContent value="reviews" className="mt-4">
        <ProfessionalReviews reviews={reviews} />
      </TabsContent>
    </Tabs>
  );
};

export default ProfessionalTabs;
