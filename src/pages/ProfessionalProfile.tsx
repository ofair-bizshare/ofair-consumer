
import React from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  User, Phone, Mail, MapPin, Calendar, Star, 
  CheckCircle, Briefcase, Award, Clock 
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// This would typically come from an API call using the ID
const getProfessionalData = (id: string) => {
  // Placeholder data - in a real app, you would fetch this from an API
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

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <div className="flex-grow pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <Helmet>
            <title>{`${professional.name} - ${professional.profession} | אופיר מחפשים בעלי מקצוע`}</title>
            <meta name="description" content={`${professional.name} - ${professional.profession} בעל מקצוע מומלץ. ${professional.about.substring(0, 150)}...`} />
            <meta property="og:title" content={`${professional.name} - ${professional.profession}`} />
            <meta property="og:description" content={professional.about.substring(0, 150)} />
            <meta property="og:image" content={professional.image} />
          </Helmet>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Professional Info Card */}
            <div className="md:col-span-1">
              <Card className="mb-6 shadow-lg border-blue-100 overflow-hidden">
                <CardHeader className="flex flex-col items-center pb-2 bg-gradient-to-r from-blue-50 to-blue-100">
                  <div className="relative mb-2">
                    <Avatar className="h-28 w-28 border-4 border-white shadow-md">
                      <AvatarImage src={professional.image} alt={professional.name} />
                      <AvatarFallback>{professional.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    {professional.verified && (
                      <Badge className="absolute -top-2 -right-2 bg-teal-500 text-white">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        מאומת
                      </Badge>
                    )}
                  </div>
                  
                  <h1 className="text-2xl font-bold text-center text-gray-800">{professional.name}</h1>
                  <p className="text-blue-600 font-medium text-center">{professional.profession}</p>
                  
                  <div className="flex items-center mt-2 space-x-1 space-x-reverse">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{professional.rating}</span>
                    <span className="text-muted-foreground">({professional.reviewCount} ביקורות)</span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-5 py-6">
                  <div className="flex items-center p-2 hover:bg-gray-50 rounded-md transition-colors">
                    <MapPin className="h-5 w-5 text-blue-500 ml-3 flex-shrink-0" />
                    <span>{professional.location}</span>
                  </div>
                  
                  <div className="flex items-center p-2 hover:bg-gray-50 rounded-md transition-colors">
                    <Calendar className="h-5 w-5 text-blue-500 ml-3 flex-shrink-0" />
                    <span>פועל משנת {professional.yearEstablished}</span>
                  </div>
                  
                  <div className="flex items-center p-2 hover:bg-gray-50 rounded-md transition-colors">
                    <Clock className="h-5 w-5 text-blue-500 ml-3 flex-shrink-0" />
                    <span className="text-sm">{professional.workHours}</span>
                  </div>
                  
                  <div className="p-2 border-t border-gray-100 pt-5">
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
                  
                  <div className="p-2 border-t border-gray-100 pt-5">
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
                  
                  <div className="p-2 border-t border-gray-100 pt-5">
                    <h3 className="text-lg font-medium mb-3 text-gray-800 flex items-center">
                      <User className="h-5 w-5 text-blue-500 ml-2" />
                      פרטי התקשרות
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center p-1 hover:bg-gray-50 rounded-md transition-colors">
                        <Phone className="h-4 w-4 text-blue-500 ml-2" />
                        <a href={`tel:${professional.contactInfo.phone}`} className="hover:underline text-blue-600">
                          {professional.contactInfo.phone}
                        </a>
                      </div>
                      <div className="flex items-center p-1 hover:bg-gray-50 rounded-md transition-colors">
                        <Mail className="h-4 w-4 text-blue-500 ml-2" />
                        <a href={`mailto:${professional.contactInfo.email}`} className="hover:underline text-blue-600">
                          {professional.contactInfo.email}
                        </a>
                      </div>
                      <div className="flex items-center p-1 hover:bg-gray-50 rounded-md transition-colors">
                        <MapPin className="h-4 w-4 text-blue-500 ml-2" />
                        <span>{professional.contactInfo.address}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <Button className="w-full bg-teal-500 hover:bg-teal-600 text-white py-5 text-lg shadow-md transition-all hover:shadow-lg">
                      שלח הודעה
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Main Content */}
            <div className="md:col-span-2">
              <Card className="mb-6 shadow-md border-blue-100">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
                  <h2 className="text-xl font-bold text-gray-800">אודות</h2>
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
                        <div className="aspect-video overflow-hidden rounded-t-lg">
                          <img 
                            src={project.image} 
                            alt={project.title} 
                            className="object-cover w-full h-full transition-transform hover:scale-105 duration-300"
                          />
                        </div>
                        <CardContent className="pt-4">
                          <h3 className="text-lg font-medium text-gray-800">{project.title}</h3>
                          <div className="flex items-center text-sm text-blue-600 mb-2">
                            <MapPin className="h-3 w-3 ml-1" />
                            <span>{project.location}</span>
                          </div>
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
      
      <Footer />
    </div>
  );
};

export default ProfessionalProfile;
