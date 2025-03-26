
import React from 'react';

const BusinessSignUpLink: React.FC = () => {
  return (
    <div className="text-center mt-6 text-gray-600 text-sm">
      <p>
        הנך בעל מקצוע?
        <a 
          href="https://biz.ofair.co.il" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-700 mr-1 hover:underline"
        >
          לחץ כאן
        </a>
        להרשמה כנותן שירות
      </p>
    </div>
  );
};

export default BusinessSignUpLink;
