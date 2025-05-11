
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/providers/AuthProvider';
import { updateRequestStatus } from '@/services/requests';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ProfessionalRatingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  professional: {
    id: string;
    name: string;
    phone: string;
    companyName?: string;
  };
  requestId: string;
  onRatingComplete?: () => void;
}

// Rating criteria with their weights
const ratingCriteria = [
  { id: 'overall', name: 'דירוג כולל', icon: '⭐️', weight: 1.5 },
  { id: 'timing', name: 'עמידה בזמנים', icon: '⏳', weight: 1 },
  { id: 'quality', name: 'איכות העבודה', icon: '🏗️', weight: 1.5 },
  { id: 'value', name: 'מחיר מול תמורה', icon: '💰', weight: 1 },
  { id: 'communication', name: 'שירות ותקשורת', icon: '📞', weight: 1 },
  { id: 'cleanliness', name: 'ניקיון וסדר', icon: '🔧', weight: 0.5 },
  { id: 'recommendation', name: 'המלצה כללית', icon: '👍', weight: 1.5 }
];

// Calculate weighted average based on ratings and weights
const calculateWeightedAverage = (ratings: Record<string, number>) => {
  let totalWeight = 0;
  let weightedSum = 0;
  
  ratingCriteria.forEach(criterion => {
    if (ratings[criterion.id]) {
      weightedSum += ratings[criterion.id] * criterion.weight;
      totalWeight += criterion.weight;
    }
  });
  
  return totalWeight > 0 ? parseFloat((weightedSum / totalWeight).toFixed(1)) : 0;
};

const ProfessionalRatingDialog: React.FC<ProfessionalRatingDialogProps> = ({ 
  open, 
  onOpenChange, 
  professional,
  requestId,
  onRatingComplete 
}) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [textRecommendation, setTextRecommendation] = useState('');
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  
  console.log("ProfessionalRatingDialog rendered with props:", { open, professional, requestId });
  
  // Get user profile data if available
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        try {
          const { data, error } = await supabase
            .from('user_profiles')
            .select('name, phone')
            .eq('id', user.id)
            .single();
          
          if (data && !error) {
            setUserName(data.name || '');
            setUserPhone(data.phone || '');
          }
        } catch (err) {
          console.error('Error fetching user profile:', err);
        }
      }
    };
    
    if (open) {
      fetchUserProfile();
    }
  }, [user, open]);

  const handleRatingChange = (criterionId: string, value: number) => {
    setRatings(prev => ({
      ...prev,
      [criterionId]: value
    }));
  };
  
  const handleSubmit = async () => {
    // Validate required fields
    if (!userName) {
      toast({ title: "שגיאה", description: "יש להזין את שמך", variant: "destructive" });
      return;
    }
    
    if (!userPhone) {
      toast({ title: "שגיאה", description: "יש להזין מספר טלפון", variant: "destructive" });
      return;
    }
    
    // Validate that all criteria have been rated
    for (const criterion of ratingCriteria) {
      if (!ratings[criterion.id]) {
        toast({ 
          title: "שגיאה", 
          description: `יש לדרג את כל הקריטריונים (חסר: ${criterion.name})`, 
          variant: "destructive" 
        });
        return;
      }
    }
    
    setIsSubmitting(true);
    
    try {
      console.log("Submitting rating for professional:", professional);
      console.log("Rating data:", { ratings, textRecommendation, userName, userPhone });
      
      // Calculate weighted average
      const weightedAverage = calculateWeightedAverage(ratings);
      
      // Save rating to professional_ratings table
      const { error, data } = await supabase
        .from('professional_ratings')
        .insert({
          professional_name: professional.name,
          professional_phone: professional.phone,
          company_name: professional.companyName || null,
          customer_name: userName,
          customer_phone: userPhone,
          rating_overall: ratings.overall,
          rating_timing: ratings.timing,
          rating_quality: ratings.quality,
          rating_value: ratings.value,
          rating_communication: ratings.communication,
          rating_cleanliness: ratings.cleanliness,
          rating_recommendation: ratings.recommendation,
          weighted_average: weightedAverage,
          recommendation: textRecommendation || null
        });
      
      console.log("Rating submission result:", { error, data });
      
      if (error) {
        throw error;
      }
      
      // Update professional rating in professionals table
      await updateProfessionalRating(professional.id);
      
      // Update request status to completed
      await updateRequestStatus(requestId, 'completed');
      
      toast({
        title: "תודה על הדירוג",
        description: "הדירוג שלך התקבל בהצלחה",
        variant: "default",
      });
      
      // Close dialog and refresh data
      onOpenChange(false);
      if (onRatingComplete) {
        onRatingComplete();
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      toast({
        title: "שגיאה בשמירת הדירוג",
        description: "אירעה שגיאה בשמירת הדירוג, אנא נסה שוב",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update professional rating
  const updateProfessionalRating = async (professionalId: string) => {
    try {
      console.log("Updating professional rating for ID:", professionalId);
      
      // Get all ratings for this professional
      const { data, error } = await supabase
        .from('professional_ratings')
        .select('weighted_average')
        .eq('professional_phone', professional.phone);
      
      console.log("Found ratings:", data);
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        // Calculate average rating
        const totalRating = data.reduce((sum, item) => sum + Number(item.weighted_average), 0);
        const avgRating = parseFloat((totalRating / data.length).toFixed(1));
        
        console.log("Calculated average rating:", avgRating, "from", data.length, "ratings");
        
        // Update professional record
        const { error: updateError, data: updateData } = await supabase
          .from('professionals')
          .update({ 
            rating: avgRating,
            review_count: data.length
          })
          .eq('id', professionalId)
          .select();
          
        console.log("Professional update result:", { updateError, updateData });
      }
    } catch (err) {
      console.error('Error updating professional rating:', err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-2 sticky top-0 bg-white z-10">
          <DialogTitle className="text-center text-xl mb-2">
            דרג את {professional.name}
          </DialogTitle>
          <p className="text-center text-gray-600">
            הדירוג שלך יעזור ללקוחות אחרים לבחור את בעל המקצוע המתאים
          </p>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh] px-6">
          <div className="space-y-6 py-4">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  שם מלא*
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-md"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  טלפון*
                </label>
                <input
                  type="tel"
                  className="w-full px-3 py-2 border rounded-md"
                  value={userPhone}
                  onChange={(e) => setUserPhone(e.target.value)}
                  required
                />
              </div>
            </div>
            
            {/* Rating Criteria */}
            <div className="space-y-4">
              {ratingCriteria.map((criterion) => (
                <div key={criterion.id} className="bg-gray-50 p-4 rounded-md">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <span className="ml-2 text-lg">{criterion.icon}</span>
                      <label className="text-sm font-medium">{criterion.name}</label>
                    </div>
                    <span className="text-xs text-gray-500">
                      (משקל: {criterion.weight})
                    </span>
                  </div>
                  <div className="flex justify-center space-x-reverse space-x-1">
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <button
                        key={rating}
                        type="button"
                        className="p-1 rounded-full focus:outline-none"
                        onClick={() => handleRatingChange(criterion.id, rating)}
                      >
                        <Star
                          className={`h-8 w-8 ${
                            ratings[criterion.id] >= rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Text Recommendation */}
            <div>
              <label className="block text-sm font-medium mb-1">
                המלצה במילים שלך (אופציונלי)
              </label>
              <textarea
                className="w-full px-3 py-2 border rounded-md h-24"
                value={textRecommendation}
                onChange={(e) => setTextRecommendation(e.target.value)}
                placeholder="שתף את החוויה שלך עם בעל המקצוע..."
              />
            </div>
            
            {/* Weighted Average Display */}
            {Object.keys(ratings).length > 0 && (
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-md">
                <div className="text-center">
                  <p className="text-sm text-blue-700 mb-1">דירוג משוקלל</p>
                  <div className="flex justify-center items-center">
                    <span className="text-2xl font-bold text-blue-800">
                      {calculateWeightedAverage(ratings)}
                    </span>
                    <span className="text-blue-700 mx-1">/</span>
                    <span className="text-blue-700">5</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        
        <DialogFooter className="flex justify-between p-6 border-t border-gray-100 sticky bottom-0 bg-white z-10">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            ביטול
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-[#00D09E] hover:bg-[#00C090]"
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                שולח...
              </div>
            ) : 'שלח דירוג'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProfessionalRatingDialog;
