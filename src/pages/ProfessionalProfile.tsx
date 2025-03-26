
import React from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  User, Phone, Mail, MapPin, Calendar, Star, 
  CheckCircle, Briefcase, Certificate, Clock 
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

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
      phone: '050-1234567',
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
    <div className="container mx-auto px-4 py-8 max-w-6xl">
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
          <Card className="mb-6">
            <CardHeader className="flex flex-col items-center pb-2">
              <div className="relative mb-2">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={professional.image} alt={professional.name} />
                  <AvatarFallback>{professional.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                {professional.verified && (
                  <Badge className="absolute -top-2 -right-2 bg-teal-500">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    מאומת
                  </Badge>
                )}
              </div>
              
              <h1 className="text-2xl font-bold text-center">{professional.name}</h1>
              <p className="text-muted-foreground text-center">{professional.profession}</p>
              
              <div className="flex items-center mt-2 space-x-1 space-x-reverse">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{professional.rating}</span>
                <span className="text-muted-foreground">({professional.reviewCount} ביקורות)</span>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-gray-500 ml-2" />
                <span>{professional.location}</span>
              </div>
              
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-gray-500 ml-2" />
                <span>פועל משנת {professional.yearEstablished}</span>
              </div>
              
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-gray-500 ml-2" />
                <span>{professional.workHours}</span>
              </div>
              
              <div className="pt-4">
                <h3 className="text-lg font-medium mb-2">התמחויות</h3>
                <div className="flex flex-wrap gap-2">
                  {professional.specialties.map((specialty, index) => (
                    <Badge key={index} variant="secondary">{specialty}</Badge>
                  ))}
                </div>
              </div>
              
              <div className="pt-2">
                <h3 className="text-lg font-medium mb-2">תעודות והסמכות</h3>
                <div className="space-y-2">
                  {professional.certifications.map((cert, index) => (
                    <div key={index} className="flex items-center">
                      <Certificate className="h-4 w-4 text-gray-500 ml-2" />
                      <span>{cert}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="pt-4">
                <h3 className="text-lg font-medium mb-2">פרטי התקשרות</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 text-gray-500 ml-2" />
                    <a href={`tel:${professional.contactInfo.phone}`} className="hover:underline">
                      {professional.contactInfo.phone}
                    </a>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 text-gray-500 ml-2" />
                    <a href={`mailto:${professional.contactInfo.email}`} className="hover:underline">
                      {professional.contactInfo.email}
                    </a>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-gray-500 ml-2" />
                    <span>{professional.contactInfo.address}</span>
                  </div>
                </div>
              </div>
              
              <div className="pt-4">
                <Button className="w-full bg-teal-500 hover:bg-teal-600">
                  שלח הודעה
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Main Content */}
        <div className="md:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <h2 className="text-xl font-bold">אודות</h2>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line">{professional.about}</p>
            </CardContent>
          </Card>
          
          <Tabs defaultValue="projects" className="w-full mb-6">
            <TabsList className="w-full">
              <TabsTrigger value="projects" className="flex-1">עבודות אחרונות</TabsTrigger>
              <TabsTrigger value="reviews" className="flex-1">ביקורות</TabsTrigger>
            </TabsList>
            
            <TabsContent value="projects" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {professional.projects.map(project => (
                  <Card key={project.id}>
                    <div className="aspect-video overflow-hidden rounded-t-lg">
                      <img 
                        src={project.image} 
                        alt={project.title} 
                        className="object-cover w-full h-full transition-transform hover:scale-105 duration-300"
                      />
                    </div>
                    <CardContent className="pt-4">
                      <h3 className="text-lg font-medium">{project.title}</h3>
                      <div className="flex items-center text-sm text-muted-foreground mb-2">
                        <MapPin className="h-3 w-3 ml-1" />
                        <span>{project.location}</span>
                      </div>
                      <p className="text-sm">{project.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-4">
              <div className="space-y-4">
                {professional.reviews.map(review => (
                  <Card key={review.id}>
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center">
                          <Avatar className="h-10 w-10 ml-3">
                            <AvatarFallback>{review.author.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium">{review.author}</h4>
                            <p className="text-sm text-muted-foreground">{review.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium ml-1">{review.rating}</span>
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        </div>
                      </div>
                      <p className="mt-3">{review.comment}</p>
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
};

export default ProfessionalProfile;
