
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Star } from 'lucide-react';

interface Review {
  id: number;
  author: string;
  rating: number;
  date: string;
  comment: string;
}

interface ProfessionalReviewsProps {
  reviews: Review[];
}

const ProfessionalReviews: React.FC<ProfessionalReviewsProps> = ({ reviews }) => {
  return (
    <div className="space-y-4">
      {reviews.map((review) => (
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
  );
};

export default ProfessionalReviews;
