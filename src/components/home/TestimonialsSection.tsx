
import React from 'react';
import { Star } from 'lucide-react';

interface Testimonial {
  text: string;
  name: string;
  role: string;
  image: string;
}

const testimonials: Testimonial[] = [
  {
    text: 'קיבלתי 5 הצעות מחיר תוך יום ובחרתי את בעל המקצוע המושלם לפרויקט שלי. חסכתי המון זמן וכסף!',
    name: 'שירה כהן',
    role: 'בעלת דירה ברמת גן',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80',
  },
  {
    text: 'השירות הזה פשוט מדהים! מצאתי בעל מקצוע מעולה לשיפוץ המטבח שלי. התהליך היה פשוט וקל.',
    name: 'אבי לוי',
    role: 'בעל דירה בתל אביב',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80',
  },
];

const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-teal-50 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-blue-700 mb-3">לקוחות <span className="text-custom-green">מספרים</span></h2>
          <p className="text-gray-600 max-w-2xl mx-auto">מה אומרים לקוחות שכבר השתמשו בשירות שלנו</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto stagger-animation">
          {testimonials.map((testimonial, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex flex-col h-full">
              <div className="mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={18} className="inline-block text-yellow-400 fill-yellow-400 mr-1" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 flex-grow">{testimonial.text}</p>
              <div className="flex items-center">
                <img src={testimonial.image} alt={testimonial.name} className="w-12 h-12 rounded-full object-cover mr-4" />
                <div>
                  <h4 className="font-semibold text-blue-700">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
