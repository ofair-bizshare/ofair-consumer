
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getProfessional } from '@/services/professionals';
import { useToast } from '@/hooks/use-toast';
import ProfessionalProfileContent from '@/components/professional/ProfessionalProfileContent';

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

interface ProfessionalData {
  id: string;
  name: string;
  profession: string;
  image: string;
  rating: number;
  reviewCount: number;
  verified?: boolean;
  yearEstablished?: number;
  location: string;
  about: string;
  contactInfo: {
    phone: string;
    email: string;
    address: string;
  };
  specialties: string[];
  certifications: string[];
  workHours: string;
  projects: Project[];
  reviews: Review[];
  companyName?: string;
  experienceYears?: number;
}

// Fetch professional data
const fetchProfessionalData = async (id: string): Promise<ProfessionalData | null> => {
  try {
    const professional = await getProfessional(id);
    
    if (professional) {
      // Generate some default information for fields not directly in the database
      const yearEstablished = professional.experience_years ? 
        new Date().getFullYear() - professional.experience_years : 
        new Date().getFullYear() - Math.floor(Math.random() * 10) - 5; // Fallback to random year
      
      const email = professional.email || `${professional.name.replace(/\s+/g, '').toLowerCase()}@example.com`;
      const address = `רחוב הרצל 1, ${professional.location}`;
      
      // Use the actual phone number from the database (phone_number or phoneNumber)
      const phoneNumber = professional.phone_number || professional.phoneNumber || professional.phone || '050-5555555';

      // Create some sample projects based on the professional's data
      const projects: Project[] = [{
        id: 1,
        title: `עבודה לדוגמה - ${professional.profession}`,
        description: 'דוגמה לעבודה שבוצעה לאחרונה',
        image: professional.image || '/lovable-uploads/1a2c3d92-c7dd-41ef-bc39-b244797da4b2.png',
        location: professional.location
      }, {
        id: 2,
        title: 'עבודה נוספת',
        description: 'דוגמה נוספת לעבודה שבוצעה',
        image: '/lovable-uploads/52b937d1-acd7-4831-b19e-79a55a774829.png',
        location: professional.location
      }];

      // Sample reviews
      const reviews: Review[] = [{
        id: 1,
        author: 'רחל כהן',
        rating: 5,
        date: '15/04/2023',
        comment: 'עבודה מקצועית ומהירה. מרוצה מאוד מהתוצאה!'
      }, {
        id: 2,
        author: 'דוד לוי',
        rating: 4,
        date: '02/03/2023',
        comment: 'שירות טוב, מחיר הוגן. קצת איחר בלוחות הזמנים אבל התוצאה הסופית טובה מאוד.'
      }];
      
      return {
        id: professional.id,
        name: professional.name,
        profession: professional.profession,
        rating: professional.rating || 4.5,
        reviewCount: professional.reviewCount || 0,
        location: professional.location,
        image: professional.image,
        verified: professional.verified || true,
        yearEstablished,
        about: professional.about || 'בעל ניסיון רב בתחום, מבצע את העבודה באיכות גבוהה, במחירים הוגנים ובזמנים מוסכמים.',
        contactInfo: {
          phone: phoneNumber,
          email,
          address
        },
        specialties: professional.specialties || [],
        certifications: professional.certifications || ['מוסמך מקצועי', 'בעל רישיון'],
        workHours: professional.work_hours || 'ימים א-ה: 8:00-18:00, יום ו: 8:00-13:00',
        projects,
        reviews,
        companyName: professional.company_name,
        experienceYears: professional.experience_years
      };
    }
    return null;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
};

const ProfessionalProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [professional, setProfessional] = useState<ProfessionalData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const loadProfessional = async () => {
      if (!id) {
        setLoading(false);
        return;
      }
      setLoading(true);
      const data = await fetchProfessionalData(id);
      if (!data) {
        toast({
          title: "בעל המקצוע לא נמצא",
          description: "לא הצלחנו למצוא את בעל המקצוע המבוקש",
          variant: "destructive"
        });
      }
      setProfessional(data);
      setLoading(false);
    };
    loadProfessional();
    window.scrollTo(0, 0);
  }, [id, toast]);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!professional) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">בעל המקצוע לא נמצא</h1>
          <p className="mt-2">לא הצלחנו למצוא את בעל המקצוע המבוקש</p>
        </div>
      </div>
    );
  }

  // Always render with header and footer
  return (
    <>
      <Helmet>
        <title>{professional.name} - {professional.profession} | oFair</title>
        <meta name="description" content={`${professional.name} - ${professional.profession} באזור ${professional.location}. בעל דירוג ${professional.rating} מתוך 5 כוכבים.`} />
      </Helmet>
      
      <div dir="rtl">
        <Header />
        
        <div className="container mx-auto px-4 py-24">
          <ProfessionalProfileContent professional={professional} />
        </div>
        
        <Footer />
      </div>
    </>
  );
};

export default ProfessionalProfile;
