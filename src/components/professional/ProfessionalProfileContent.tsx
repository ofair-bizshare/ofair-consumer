
import React from 'react';
import ProfessionalHeader from './ProfessionalHeader';
import ProfessionalSidebar from './ProfessionalSidebar';
import ProfessionalAbout from './ProfessionalAbout';
import ProfessionalTabs from './ProfessionalTabs';

interface ProfessionalProfileContentProps {
  professional: any;
}

const ProfessionalProfileContent: React.FC<ProfessionalProfileContentProps> = ({ professional }) => {
  return (
    <div className="py-6 px-4 bg-white" dir="rtl">
      <ProfessionalHeader 
        professional={{
          name: professional.name,
          profession: professional.profession,
          image: professional.image,
          verified: professional.verified,
          rating: professional.rating,
          reviewCount: professional.reviewCount,
          location: professional.location,
          yearEstablished: professional.yearEstablished,
          companyName: professional.companyName
        }} 
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <ProfessionalSidebar professional={professional} />
        </div>
        
        <div className="md:col-span-2">
          <ProfessionalAbout 
            about={professional.about} 
            experienceYears={professional.experienceYears} 
          />
          
          <ProfessionalTabs 
            projects={professional.projects} 
            reviews={professional.reviews} 
            professional={{
              id: professional.id,
              phone: professional.contactInfo?.phone,
              phoneNumber: professional.contactInfo?.phone
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfessionalProfileContent;
