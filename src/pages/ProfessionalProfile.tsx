
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { User, Phone, Mail, MapPin, Calendar, Star, CheckCircle, Briefcase, Award, Clock, Building } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PhoneRevealButton from '@/components/PhoneRevealButton';
import { getProfessional } from '@/services/professionals';
import { useToast } from '@/hooks/use-toast';

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
          phone: professional.phoneNumber || '050-5555555',
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

  const isInIframe = window !== window.parent && window.parent;

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

  // Render the professional profile content based on whether we're in an iframe or not
  const renderProfileContent = () => (
    <div className="py-6 px-4 bg-white" dir="rtl">
      <div className="mb-8 p-6 bg-gradient-to-r from-blue-600 to-teal-500 rounded-xl text-white shadow-lg">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative">
            <Avatar className="h-28 w-28 border-4 border-white shadow-md">
              <AvatarImage src={professional.image} alt={professional.name} className="object-cover" />
              <AvatarFallback>{professional.name.substring(0, 2)}</AvatarFallback>
            </Avatar>
            {professional.verified && (
              <Badge className="absolute -top-2 -right-2 bg-white text-teal-500 border-2 border-teal-500">
                <CheckCircle className="h-3 w-3 mr-1" />
                מאומת
              </Badge>
            )}
          </div>
          
          <div className="text-center md:text-right flex-1">
            <h1 className="text-3xl font-bold">{professional.name}</h1>
            <p className="text-xl text-blue-50">{professional.profession}</p>
            
            {professional.companyName && (
              <p className="text-lg text-blue-100 mt-1">
                <Building className="inline-block h-4 w-4 ml-1" />
                {professional.companyName}
              </p>
            )}
            
            <div className="flex items-center justify-center md:justify-start mt-2">
              <div className="flex items-center bg-white/20 rounded-full px-3 py-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 ml-1" />
                <span className="font-medium">{professional.rating}</span>
                <span className="text-sm text-blue-50 mr-1">({professional.reviewCount} ביקורות)</span>
              </div>
              <div className="flex items-center mx-4">
                <MapPin className="h-4 w-4 ml-1 text-blue-50" />
                <span className="text-sm">{professional.location}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 ml-1 text-blue-50" />
                <span className="text-sm">פועל משנת {professional.yearEstablished}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
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
        </div>
        
        <div className="md:col-span-2">
          <Card className="mb-6 shadow-md border-blue-100">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
              <CardTitle className="text-xl text-blue-800">
                אודות
                {professional.experienceYears && (
                  <span className="mr-2 text-sm font-normal text-blue-600">
                    ({professional.experienceYears} שנות ניסיון)
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="py-6">
              <p className="whitespace-pre-line text-gray-700 leading-relaxed">{professional.about}</p>
            </CardContent>
          </Card>
          
          <Tabs defaultValue="projects" className="w-full mb-6">
            <TabsList className="w-full bg-blue-50">
              <TabsTrigger value="projects" className="flex-1 data-[state=active]:bg-white data-[state=active]:text-blue-700">עבודות אחרונות</TabsTrigger>
              <TabsTrigger value="reviews" className="flex-1 data-[state=active]:bg-white data-[state=active]:text-blue-700">ביקורות</TabsTrigger>
            </TabsList>
            
            <TabsContent value="projects" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {professional.projects.map((project) => (
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
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-4">
              <div className="space-y-4">
                {professional.reviews.map((review) => (
                  <Card key={review.id} className="shadow-md hover:shadow-lg transition-shadow border-blue-100">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center">
                          <Avatar className="h-10 w-10 ml-3 border-2 border-blue-100">
                            <AvatarFallback className="bg-blue-50 text-blue-700">{review.author.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium text-gray-800">{review.author}</h4>
                            <p className="text-sm text-gray-500">{review.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center bg-blue-50 px-2 py-1 rounded">
                          <span className="font-medium ml-1 text-blue-700">{review.rating}</span>
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        </div>
                      </div>
                      <p className="mt-3 text-gray-700 leading-relaxed">{review.comment}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );

  // If we're in an iframe, render only the profile content
  if (isInIframe) {
    return renderProfileContent();
  }

  // If we're not in an iframe, render with header and footer
  return (
    <>
      <Helmet>
        <title>{professional.name} - {professional.profession} | oFair</title>
        <meta name="description" content={`${professional.name} - ${professional.profession} באזור ${professional.location}. בעל דירוג ${professional.rating} מתוך 5 כוכבים.`} />
      </Helmet>
      
      <div dir="rtl">
        <Header />
        
        <div className="container mx-auto px-4 py-24">
          {renderProfileContent()}
        </div>
        
        <Footer />
      </div>
    </>
  );
};

export default ProfessionalProfile;
