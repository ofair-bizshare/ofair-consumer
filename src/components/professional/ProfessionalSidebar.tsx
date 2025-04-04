
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, MapPin, Clock, Briefcase, Award, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import PhoneRevealButton from '@/components/PhoneRevealButton';

interface ProfessionalSidebarProps {
  professional: {
    name: string;
    id: string;
    profession: string;
    workHours: string;
    specialties: string[];
    certifications: string[];
    contactInfo: {
      phone: string;
      email: string;
      address: string;
    };
    experience_years?: number;
  };
}

const ProfessionalSidebar: React.FC<ProfessionalSidebarProps> = ({ professional }) => {
  return (
    <Card className="mb-6 shadow-lg border-blue-100 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
        <CardTitle className="text-xl text-blue-800">פרטי קשר ומידע</CardTitle>
      </CardHeader>

      <CardContent className="space-y-5 py-6">
        <div className="p-2 border-b border-gray-100">
          <h3 className="text-lg font-medium mb-3 text-gray-800 flex items-center">
            <Clock className="h-5 w-5 text-blue-500 ml-2" />
            שעות פעילות
          </h3>
          <div className="text-sm text-gray-600 p-2 bg-blue-50 rounded-md">
            {professional.workHours}
          </div>
        </div>
        
        {professional.experience_years && (
          <div className="p-2 border-b border-gray-100">
            <h3 className="text-lg font-medium mb-3 text-gray-800 flex items-center">
              <Briefcase className="h-5 w-5 text-blue-500 ml-2" />
              ניסיון
            </h3>
            <div className="text-sm text-gray-600 p-2 bg-blue-50 rounded-md">
              {professional.experience_years} שנות ניסיון
            </div>
          </div>
        )}
        
        <div className="p-2 border-b border-gray-100">
          <h3 className="text-lg font-medium mb-3 text-gray-800 flex items-center">
            <Briefcase className="h-5 w-5 text-blue-500 ml-2" />
            התמחויות
          </h3>
          <div className="flex flex-wrap gap-2">
            {professional.specialties.map((specialty: string, index: number) => (
              <Badge key={index} variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                {specialty}
              </Badge>
            ))}
          </div>
        </div>
        
        <div className="p-2 border-b border-gray-100">
          <h3 className="text-lg font-medium mb-3 text-gray-800 flex items-center">
            <Award className="h-5 w-5 text-blue-500 ml-2" />
            תעודות והסמכות
          </h3>
          <div className="space-y-2">
            {professional.certifications.map((cert: string, index: number) => (
              <div key={index} className="flex items-center p-1 hover:bg-gray-50 rounded-md transition-colors">
                <Award className="h-4 w-4 text-blue-500 ml-2" />
                <span>{cert}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="p-2">
          <h3 className="text-lg font-medium mb-3 text-gray-800 flex items-center">
            <User className="h-5 w-5 text-blue-500 ml-2" />
            פרטי התקשרות
          </h3>
          <div className="space-y-3 bg-blue-50 p-3 rounded-lg">
            <div className="flex flex-col p-1">
              <PhoneRevealButton 
                phoneNumber={professional.contactInfo.phone} 
                professionalName={professional.name} 
                professionalId={professional.id} 
                profession={professional.profession} 
                autoReveal={true}
              />
            </div>
            <div className="flex items-center p-1 hover:bg-white/70 rounded-md transition-colors">
              <Mail className="h-4 w-4 text-blue-500 ml-2" />
              <a href={`mailto:${professional.contactInfo.email}`} className="hover:underline text-blue-600">
                {professional.contactInfo.email}
              </a>
            </div>
            <div className="flex items-center p-1 hover:bg-white/70 rounded-md transition-colors">
              <MapPin className="h-4 w-4 text-blue-500 ml-2" />
              <span>{professional.contactInfo.address}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfessionalSidebar;
