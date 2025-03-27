import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
const Footer = () => {
  return <footer className="bg-blue-800 text-white pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div className="mb-8">
            <h3 className="text-2xl font-bold mb-6">
              <span className="text-teal-400">o</span>Fair
            </h3>
            <p className="text-blue-100 mb-4">הפלטפורמה החדשנית למציאת בעלי מקצוע איכותיים בתחומי הבית והעסק</p>
          </div>
          
          <div className="mb-8">
            <h4 className="text-lg font-semibold mb-4 text-teal-300">ניווט מהיר</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-blue-100 hover:text-white transition-colors">דף הבית</Link>
              </li>
              <li>
                <Link to="/search" className="text-blue-100 hover:text-white transition-colors">חיפוש בעלי מקצוע</Link>
              </li>
              <li>
                <Link to="/articles" className="text-blue-100 hover:text-white transition-colors">טיפים ומאמרים</Link>
              </li>
              <li>
                <Link to="/about" className="text-blue-100 hover:text-white transition-colors">אודות</Link>
              </li>
            </ul>
          </div>
          
          <div className="mb-8">
            <h4 className="text-lg font-semibold mb-4 text-teal-300">מידע חשוב</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/terms" className="text-blue-100 hover:text-white transition-colors">תנאי שימוש</Link>
              </li>
              <li>
                <Link to="/privacy" className="text-blue-100 hover:text-white transition-colors">מדיניות פרטיות</Link>
              </li>
              <li>
                <Link to="/faq" className="text-blue-100 hover:text-white transition-colors">שאלות נפוצות</Link>
              </li>
            </ul>
          </div>
          
          <div className="mb-8">
            <h4 className="text-lg font-semibold mb-4 text-teal-300">צור קשר</h4>
            <ul className="space-y-3">
              <li className="text-blue-100">
                דוא"ל: info@ofair.co.il
              </li>
              <li className="text-blue-100">
                טלפון: 0505-5524542
              </li>
            </ul>
            <div className="mt-6">
              <a href="https://biz.ofair.co.il" target="_blank" rel="noopener noreferrer" className="inline-block bg-teal-500 hover:bg-teal-600 text-white font-medium py-2 px-4 rounded-lg transition-colors" aria-label="דף הצטרפות לבעלי מקצוע">
                בעל מקצוע? הצטרף עכשיו
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-blue-700 pt-8 text-center text-blue-200 text-sm">
          <p>© {new Date().getFullYear()} oFair. כל הזכויות שמורות.</p>
        </div>
      </div>
    </footer>;
};
export default Footer;