
import React, { useState, useEffect } from 'react';
import { Star, StarHalf } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  ratingDetails?: {
    overall: number;
    timing: number;
    quality: number;
    value: number;
    communication: number;
    cleanliness: number;
    recommendation: number;
  }
}

interface ProfessionalReviewsProps {
  reviews: Review[];
  professional: {
    id: string;
    phone?: string;
    phoneNumber?: string;
  };
}

const ProfessionalReviews: React.FC<ProfessionalReviewsProps> = ({ reviews: defaultReviews, professional }) => {
  const [reviews, setReviews] = useState<Review[]>(defaultReviews);
  const [loading, setLoading] = useState(false);
  const [ratingStats, setRatingStats] = useState({
    overall: 0,
    timing: 0,
    quality: 0,
    value: 0,
    communication: 0,
    cleanliness: 0,
    recommendation: 0
  });
  
  useEffect(() => {
    const fetchRatings = async () => {
      if (!professional.phoneNumber && !professional.phone) return;
      
      try {
        setLoading(true);
        const phoneNumber = professional.phoneNumber || professional.phone;
        
        const { data, error } = await supabase
          .from('professional_ratings')
          .select('*')
          .eq('professional_phone', phoneNumber);
          
        if (error) {
          console.error('Error fetching ratings:', error);
          return;
        }
        
        if (data && data.length > 0) {
          // Map database ratings to review format
          const formattedReviews = data.map(rating => ({
            id: rating.id,
            author: rating.customer_name,
            rating: rating.weighted_average,
            date: new Date(rating.created_at).toLocaleDateString('he-IL'),
            comment: rating.recommendation || '',
            ratingDetails: {
              overall: rating.rating_overall,
              timing: rating.rating_timing,
              quality: rating.rating_quality,
              value: rating.rating_value,
              communication: rating.rating_communication,
              cleanliness: rating.rating_cleanliness,
              recommendation: rating.rating_recommendation
            }
          }));
          
          // Calculate averages for each criterion
          const stats = {
            overall: 0,
            timing: 0,
            quality: 0,
            value: 0,
            communication: 0,
            cleanliness: 0,
            recommendation: 0
          };
          
          data.forEach(rating => {
            stats.overall += rating.rating_overall;
            stats.timing += rating.rating_timing;
            stats.quality += rating.rating_quality;
            stats.value += rating.rating_value;
            stats.communication += rating.rating_communication;
            stats.cleanliness += rating.rating_cleanliness;
            stats.recommendation += rating.rating_recommendation;
          });
          
          // Calculate averages
          const count = data.length;
          Object.keys(stats).forEach(key => {
            stats[key as keyof typeof stats] = parseFloat((stats[key as keyof typeof stats] / count).toFixed(1));
          });
          
          setRatingStats(stats);
          setReviews([...formattedReviews, ...defaultReviews]);
        }
      } catch (err) {
        console.error('Error fetching ratings:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRatings();
  }, [professional.id, professional.phoneNumber, professional.phone, defaultReviews]);
  
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
    }
    
    if (hasHalfStar) {
      stars.push(<StarHalf key="half" className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
    }
    
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />);
    }
    
    return stars;
  };
  
  return (
    <div>
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">טוען חוות דעת...</p>
        </div>
      ) : reviews.length > 0 ? (
        <div className="space-y-6">
          {/* Rating Stats */}
          {Object.keys(ratingStats).some(key => ratingStats[key as keyof typeof ratingStats] > 0) && (
            <div className="glass-card p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-4">דירוג לפי קריטריונים</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <RatingBar label="דירוג כולל ⭐️" value={ratingStats.overall} />
                  <RatingBar label="עמידה בזמנים ⏳" value={ratingStats.timing} />
                  <RatingBar label="איכות העבודה 🏗️" value={ratingStats.quality} />
                  <RatingBar label="מחיר מול תמורה 💰" value={ratingStats.value} />
                </div>
                <div className="space-y-2">
                  <RatingBar label="שירות ותקשורת 📞" value={ratingStats.communication} />
                  <RatingBar label="ניקיון וסדר 🔧" value={ratingStats.cleanliness} />
                  <RatingBar label="המלצה כללית 👍" value={ratingStats.recommendation} />
                </div>
              </div>
            </div>
          )}
          
          {/* Reviews List */}
          <h3 className="font-semibold text-lg">חוות דעת ({reviews.length})</h3>
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white p-4 rounded-md shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium">{review.author}</h4>
                    <p className="text-sm text-gray-500">{review.date}</p>
                  </div>
                  <div className="flex">
                    {renderStars(review.rating)}
                  </div>
                </div>
                {review.comment && (
                  <p className="text-gray-700 mt-2">{review.comment}</p>
                )}
                
                {/* Rating Details */}
                {review.ratingDetails && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <details>
                      <summary className="text-sm text-blue-600 cursor-pointer">
                        הצג דירוג מפורט
                      </summary>
                      <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center">
                          <span className="text-gray-600 ml-1">⭐️ דירוג כולל:</span>
                          <span className="font-medium">{review.ratingDetails.overall}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-gray-600 ml-1">⏳ עמידה בזמנים:</span>
                          <span className="font-medium">{review.ratingDetails.timing}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-gray-600 ml-1">🏗️ איכות העבודה:</span>
                          <span className="font-medium">{review.ratingDetails.quality}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-gray-600 ml-1">💰 מחיר מול תמורה:</span>
                          <span className="font-medium">{review.ratingDetails.value}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-gray-600 ml-1">📞 שירות ותקשורת:</span>
                          <span className="font-medium">{review.ratingDetails.communication}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-gray-600 ml-1">🔧 ניקיון וסדר:</span>
                          <span className="font-medium">{review.ratingDetails.cleanliness}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-gray-600 ml-1">👍 המלצה כללית:</span>
                          <span className="font-medium">{review.ratingDetails.recommendation}</span>
                        </div>
                      </div>
                    </details>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">
            עדיין אין חוות דעת על בעל מקצוע זה
          </p>
        </div>
      )}
    </div>
  );
};

// Helper component to render rating bars
const RatingBar: React.FC<{ label: string; value: number }> = ({ label, value }) => {
  const percentage = (value / 5) * 100;
  
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-sm">{label}</span>
        <span className="text-sm font-medium">{value}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-blue-600 h-2 rounded-full" 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProfessionalReviews;
