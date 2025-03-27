import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  User, Phone, Mail, MapPin, Calendar, Star, 
  CheckCircle, Briefcase, Award, Clock 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PhoneRevealButton from '@/components/PhoneRevealButton';

const getProfessionalData = (id: string) => {
  return {
    id,
    name: 'ישראל ישראלי',
    profession: 'שיפוצניק',
    image: '/lovable-uploads/1a2c3d92-c7dd-41ef-bc39-b244797da4b2.png',
    rating: 4.8,
    reviewCount: 127,
    verified: true,
    yearEstablished: 2015,
    location: 'תל אביב והסביבה',
    about: 'בעל ניסיון רב בתחום השיפוצים, מתמחה בשיפוצי דירות ובתים פרטיים. מבצע את העבודה באיכות גבוהה, במחירים הוגנים ובזמנים מוסכמים.',
    contactInfo: {
      phone: '0505-5524542',
      email: 'israel@example.com',
      address: 'רחוב הרצל 1, תל אביב'
    },
    specialties: ['שיפוצים כלליים', 'עבודות גבס', 'צביעה', 'ריצוף', 'אינסטלציה'],
    certifications: ['הנדסאי בניין מוסמך', 'קבלן רשום'],
    workHours: 'ימים א-ה: 8:00-18:00, יום ו: 8:00-13:00',
    projects: [
      {
        id: 1,
        title: 'שיפוץ דירת 4 חדרים',
        description: 'שיפוץ כללי הכולל החלפת ריצוף, צביעה, החלפת מטבח ושיפוץ חדרי רחצה',
        image: '/lovable-uploads/52b937d1-acd7-4831-b19e-79a55a774829.png',
        location: 'תל אביב'
      },
      {
        id: 2,
        title: 'שיפוץ מטבח',
        description: 'החלפת מטבח כולל ריצוף, ארונות, שיש וכיור',
        image: '/lovable-uploads/1a2c3d92-c7dd-41ef-bc39-b244797da4b2.png',
        location: 'רמת גן'
      }
    ],
    reviews: [
      {
        id: 1,
        author: 'רחל כהן',
        rating: 5,
        date: '15/04/2023',
        comment: 'עבודה מקצועית ומהירה. מרוצה מאוד מהתוצאה!'
      },
      {
        id: 2,
        author: 'דוד לוי',
        rating: 4,
        date: '02/03/2023',
        comment: 'שירות טוב, מחיר הוגן. קצת איחר בלוחות הזמנים אבל התוצאה הסופית טובה מאוד.'
      }
    ]
  };
};

const ProfessionalProfile = () => {
  const { id } = useParams<{ id: string }>();
  const professional = getProfessionalData(id || '');
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const isInIframe = window !== window.parent && window.parent;

  if (isInIframe) {
    return (
      <div className="py-6 px-4" dir="rtl">
        <div className="mb-8 p-6 bg-gradient-to-r from-blue-600 to-teal-500 rounded-xl text-white shadow-lg">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <Avatar className="h-28 w-28 border-4 border-white shadow-md">
                <AvatarImage src={professional.image} alt={professional.name} />
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
            
            <div>
              <Button className="bg-white text-teal-600 hover:bg-blue-50 py-5 text-lg shadow-md transition-all hover:shadow-lg">
                שלח הודעה
              </Button>
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
                    {professional.specialties.map((specialty, index) => (
                      <Badge key={index} variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100">{specialty}</Badge>
                    ))}
                  </div>
                </div>
                
                <div className="p-2 border-b border-gray-100">
                  <h3 className="text-lg font-medium mb-3 text-gray-800 flex items-center">
                    <Award className="h-5 w-5 text-blue-500 ml-2" />
                    תעודות והסמכות
                  </h3>
                  <div className="space-y-2">
                    {professional.certifications.map((cert, index) => (
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
                <CardTitle className="text-xl text-blue-800">אודות</CardTitle>
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
                  {professional.projects.map(project => (
                    <Card key={project.id} className="overflow-hidden shadow-md hover:shadow-lg transition-shadow border-blue-100">
                      <div className="aspect-video overflow-hidden rounded-t-lg relative">
                        <img 
                          src={project.image} 
                          alt={project.title} 
                          className="object-cover w-full h-full transition-transform hover:scale-105 duration-300"
                        />
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
                  {professional.reviews.map(review => (
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
    </div>
  );
};

export default ProfessionalProfile;
