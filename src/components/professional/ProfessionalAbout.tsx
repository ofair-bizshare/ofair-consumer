
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ProfessionalAboutProps {
  about: string;
  experienceYears?: number;
}

const ProfessionalAbout: React.FC<ProfessionalAboutProps> = ({ about, experienceYears }) => {
  return (
    <Card className="mb-6 shadow-md border-blue-100">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
        <CardTitle className="text-xl text-blue-800">
          אודות
          {experienceYears && (
            <span className="mr-2 text-sm font-normal text-blue-600">
              ({experienceYears} שנות ניסיון)
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="py-6">
        <p className="whitespace-pre-line text-gray-700 leading-relaxed">{about}</p>
      </CardContent>
    </Card>
  );
};

export default ProfessionalAbout;
