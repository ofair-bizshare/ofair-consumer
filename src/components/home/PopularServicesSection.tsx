
import React from 'react';
import { Link } from 'react-router-dom';
import { Wrench, Plug, PaintBucket, Hammer, Lightbulb, Home } from 'lucide-react';

// Service interface
interface ServiceItem {
  icon: React.ReactNode;
  name: string;
  color: string;
  serviceId: string;
  displayName: string; // Added displayName for showing in the search form
}

const popularServices: ServiceItem[] = [
  { icon: <Wrench size={32} />, name: 'שיפוצים כלליים', color: 'bg-blue-500', serviceId: 'renovations', displayName: 'שיפוצים כלליים' },
  { icon: <Plug size={32} />, name: 'חשמלאי', color: 'bg-amber-500', serviceId: 'electricity', displayName: 'חשמלאי' },
  { icon: <PaintBucket size={32} />, name: 'צביעה וטיח', color: 'bg-green-500', serviceId: 'renovations', displayName: 'צביעה וטיח' },
  { icon: <Hammer size={32} />, name: 'נגרות', color: 'bg-purple-500', serviceId: 'carpentry', displayName: 'נגרות' },
  { icon: <Lightbulb size={32} />, name: 'חשמל ותאורה', color: 'bg-red-500', serviceId: 'electricity', displayName: 'חשמל ותאורה' },
  { icon: <Home size={32} />, name: 'עיצוב פנים', color: 'bg-indigo-500', serviceId: 'interior_design', displayName: 'עיצוב פנים' },
];

const PopularServicesSection: React.FC = () => {
  return (
    <section className="py-14 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-blue-700 mb-3">שירותים <span className="text-custom-green">פופולריים</span></h2>
          <p className="text-gray-600 max-w-2xl mx-auto">מצא בעלי מקצוע מובילים בתחומים המבוקשים ביותר</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 stagger-animation">
          {popularServices.map((service, idx) => (
            <Link 
              key={idx} 
              to={`/search?profession=${service.serviceId}&location=all&displayName=${encodeURIComponent(service.displayName)}`}
              className="group"
            >
              <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-white border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className={`w-16 h-16 ${service.color} text-white rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  {service.icon}
                </div>
                <h3 className="text-lg font-medium text-gray-800">{service.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularServicesSection;
