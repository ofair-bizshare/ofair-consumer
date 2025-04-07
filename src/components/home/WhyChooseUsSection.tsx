
import React from 'react';
import { Shield, Star, Clock, CheckCircle } from 'lucide-react';

const WhyChooseUsSection: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-blue-700 mb-3">למה <span className="text-custom-green">oFair?</span></h2>
          <p className="text-gray-600 max-w-2xl mx-auto">הפלטפורמה שלנו מציעה יתרונות ייחודיים שהופכים את התהליך לפשוט, בטוח ויעיל</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 stagger-animation">
          <div className="text-center p-6 rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
              <Shield className="h-7 w-7 text-blue-700" />
            </div>
            <h3 className="text-lg font-semibold text-blue-700 mb-2">אמינות ובטחון</h3>
            <p className="text-gray-600 text-sm">כל בעלי המקצוע עוברים תהליך אימות ובדיקה</p>
          </div>
          
          <div className="text-center p-6 rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
              <Star className="h-7 w-7 text-blue-700" />
            </div>
            <h3 className="text-lg font-semibold text-blue-700 mb-2">איכות מוכחת</h3>
            <p className="text-gray-600 text-sm">דירוגים וביקורות אמיתיות מלקוחות קודמים</p>
          </div>
          
          <div className="text-center p-6 rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
              <Clock className="h-7 w-7 text-blue-700" />
            </div>
            <h3 className="text-lg font-semibold text-blue-700 mb-2">חיסכון בזמן</h3>
            <p className="text-gray-600 text-sm">קבלו הצעות מחיר במהירות ללא צורך בחיפושים</p>
          </div>
          
          <div className="text-center p-6 rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-7 w-7 text-blue-700" />
            </div>
            <h3 className="text-lg font-semibold text-blue-700 mb-2">שירות חינמי</h3>
            <p className="text-gray-600 text-sm">אין עלות לצרכנים, שלמו רק עבור העבודה עצמה</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;
