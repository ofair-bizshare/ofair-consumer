
import React from 'react';
import { FileText, Wrench, CheckCircle } from 'lucide-react';

const HowItWorksSection: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-white relative">
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full opacity-40 transform translate-x-16 -translate-y-16"></div>
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-teal-100 rounded-full opacity-50 transform -translate-x-20 translate-y-20"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-blue-700 mb-3">איך זה <span className="text-custom-green">עובד?</span></h2>
          <p className="text-gray-600 max-w-2xl mx-auto">תהליך פשוט בשלושה שלבים למציאת בעל המקצוע המושלם לעבודה שלכם</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 stagger-animation">
          <div className="text-center p-6 rounded-xl bg-blue-50/50 border border-blue-100 hover:shadow-lg transition-all duration-300">
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4 bg-[#00d09e]">1</div>
            <h3 className="text-xl font-semibold text-blue-700 mb-3">שלחו בקשה</h3>
            <p className="text-gray-600">מלאו טופס קצר עם פרטי העבודה שברצונכם לבצע</p>
            <div className="mt-4">
              <FileText size={32} className="mx-auto text-[#00d09e]" />
            </div>
          </div>
          
          <div className="text-center p-6 rounded-xl bg-blue-50/50 border border-blue-100 hover:shadow-lg transition-all duration-300">
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4 bg-[#00d09e]">2</div>
            <h3 className="text-xl font-semibold text-blue-700 mb-3">קבלו הצעות מחיר וזמינות</h3>
            <p className="text-gray-600">בעלי מקצוע מובילים ישלחו לכם הצעות מותאמות אישית </p>
            <div className="mt-4">
              <Wrench size={32} className="mx-auto text-[#00d09e]" />
            </div>
          </div>
          
          <div className="text-center p-6 rounded-xl bg-blue-50/50 border border-blue-100 hover:shadow-lg transition-all duration-300">
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4 bg-[#00d09e]">3</div>
            <h3 className="text-xl font-semibold text-blue-700 mb-3">בחרו את המתאים</h3>
            <p className="text-gray-600">השוו בין ההצעות וצרו קשר עם בעל המקצוע שהכי מתאים לצרכים שלכם</p>
            <div className="mt-4">
              <CheckCircle size={32} className="mx-auto text-[#00d09e]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
